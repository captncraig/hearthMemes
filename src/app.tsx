import { h, render,Component } from 'preact';
import Browse from './browse';
import Router from 'preact-router';

interface HelloWorldProps {
    name: string
    path: string
    id?: string;
}

export default class Home extends Component<HelloWorldProps, any> {
    render (props) {
        return <p>Hello {props.name} {props.id}!</p>
    }
}

render(
<Router>
<Home name="World" path="/" />
<Browse path="/browse" />
</Router>, document.querySelector('#app'));