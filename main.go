package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

type Card struct {
	ID          string `json:"card_id"`
	Set         string `json:"set"`
	Name        string `json:"name"`
	Collectible bool   `json:"collectible"`
	Flavor      string `json:"flavor_text"`
	Media       []struct {
		Type string `json:"type"`
		URL  string `json:"url"`
	} `json:"media,omitempty"`
	PlaySound   string `json:"play_sound"`
	AttackSound string `json:"attack_sound"`
	Image       string `json:"image"`
	GoldImage   string `json:"gold_image"`
}

var cardLookup = map[string]*Card{}
var allCards = []*Card{}

const mediaBase = "http://media.services.zam.com/v1/media/byName"

// scrape card metadata from hearth-head
func main() {
	fmt.Println("!!!!!")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello"))
	})
	http.ListenAndServe(":8080", nil)
	page := 1
	for {
		url := fmt.Sprintf("http://hearthstone.services.zam.com/v1/card?type=MINION,HERO&page=%d&pageSize=100", page)
		resp, err := http.Get(url)
		check(err)
		dec := json.NewDecoder(resp.Body)
		cards := []*Card{}
		check(dec.Decode(&cards))
		resp.Body.Close()
		page++
		for _, c := range cards {
			for _, m := range c.Media {
				switch m.Type {
				case "CARD_IMAGE":
					c.Image = mediaBase + m.URL
				case "PLAY_SOUND":
					c.PlaySound = mediaBase + m.URL
				case "ATTACK_SOUND":
					c.AttackSound = mediaBase + m.URL
				case "GOLDEN_CARD_IMAGE":
					c.GoldImage = mediaBase + m.URL
				}
			}
			if c.Image == "" {
				continue
			}
			if c.AttackSound == "" && c.PlaySound == "" {
				continue
			}
			if c.AttackSound == "" {
				c.AttackSound = c.PlaySound
			}
			if c.PlaySound == "" {
				c.PlaySound = c.AttackSound
			}
			if c.GoldImage == "" {
				c.GoldImage = c.Image
			}
			c.Media = nil
			proposedName := c.Name
			i := 2
			for cardLookup[proposedName] != nil {
				proposedName = fmt.Sprintf("%s%d", c.Name, i)
				i++
			}
			c.Name = proposedName
			cardLookup[proposedName] = c
			allCards = append(allCards, c)
		}
		if len(cards) < 100 {
			break
		}
	}
	for i, c := range allCards {
		c.AttackSound = getFile(i, c.AttackSound)
		c.PlaySound = getFile(i, c.PlaySound)
		c.Image = getFile(i, c.Image)
	}
	f, err := os.Create("src/cards.ts")
	check(err)
	f.WriteString(tsHeader)
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	check(enc.Encode(allCards))
	f.WriteString(";")
	f.Close()
}

func getFile(i int, name string) string {
	split := strings.Split(name, "/")
	last := split[len(split)-1]
	fname := filepath.Join("files", last)
	if _, err := os.Stat(fname); os.IsNotExist(err) {
		fmt.Println(i, fname)
		resp, err := http.Get(name)
		check(err)
		f, err := os.Create(fname)
		check(err)
		_, err = io.Copy(f, resp.Body)
		check(err)
		f.Close()
		resp.Body.Close()
	}
	return path.Join("files", last)
}

const tsHeader = `export interface Card {
	card_id: string;
	set: string;
	name: string;
	collectible: boolean;
	flavor_text: string;
	play_sound: string;
	attack_sound: string;
	image: string;
	gold_image: string;
  }
  export function getCard(name: string): Card {
	for (var card of cards) {
	  if (card.name == name) {
		return card;
	  }
	}
	return null;
  }
  export var cards: Card[] =`
