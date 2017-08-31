import { h, render, Component } from 'preact';
import { cards as allCards, Card } from './cards';
import { Howl } from 'howler';
import linkState from 'linkstate';

interface BrowseState {
    page: number;
    filter: string;
}

interface BrowseProps {
    path: string;
}

var howlCache: Howl[] = [];

export default class Browse extends Component<BrowseProps, BrowseState> {
    private perPage = 12;
    state = {
        page: 0,
        filter: "",
    }
    cardBg(c: Card) {
        return {
            backgroundImage: `url(${c.image})`
        };
    }
    prevPage = () => {
        this.setState({ page: this.state.page - 1 });
    }
    nextPage = () => {
        this.setState({ page: this.state.page + 1 });
    }
    playSound = (c: Card, e: MouseEvent) => {
        var file = e.shiftKey ? c.attack_sound : c.play_sound;
        var howl = howlCache[file];
        if (!howl) {
            howl = new Howl({ src: [file] });
            howlCache[file] = howl;
        }
        howl.play();
    }
    render(props: BrowseProps, state: BrowseState) {
        var filteredCards = allCards;
        if (state.filter){
            filteredCards = filteredCards.filter((c)=>c.name.match(state.filter))
        }
        var start = state.page * this.perPage;
        var pageCards = filteredCards.slice(start, start + this.perPage);
        var numPages = Math.ceil(filteredCards.length / this.perPage);
        return <div className='container'>
            <div class='flex-ver'>
                <div class='flex-hor'>
                     <input value={state.filter} onInput={linkState(this,'filter')}/>
                </div>
                <div class='flex-hor'>
                    <button className='btn btn-default' onClick={this.prevPage}>prev</button>
                    {state.page + 1}/{numPages}
                    <button className='btn btn-default' onClick={this.nextPage}>next</button>
                </div>
                <div class='flex-hor'>
                    {pageCards.map(c =>
                        <div className="card-image" onClick={this.playSound.bind(this, c)} style={this.cardBg(c)}></div>
                    )}
                </div>
            </div>
        </div>
    }
}