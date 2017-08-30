package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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
	PlaySound   string
	AttackSound string
	Image       string
	GoldImage   string
}

var cardLookup = map[string]*Card{}
var allCards = []*Card{}

const mediaBase = "http://media.services.zam.com/v1/media/byName"

// scrape card metadata from hearth-head
func main() {
	page := 1
	for {
		url := fmt.Sprintf("http://hearthstone.services.zam.com/v1/card?type=MINION&page=%d&pageSize=100", page)
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
	f, err := os.Create("cards.js")
	check(err)
	f.WriteString("var cards = ")
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	check(enc.Encode(allCards))
	f.WriteString(";")
	f.Close()
}
