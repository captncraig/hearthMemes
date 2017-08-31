import { h, render,Component } from 'preact';
import Router from 'preact-router';

interface HelloWorldProps {
    name: string
    path: string
}

export default class Home extends Component<HelloWorldProps, any> {
    render (props) {
        return <p>Hello {props.name}!</p>
    }
}

render(
<Router>
<Home name="World" path="/" />
<Home name="World2" path="/b" />
<Home name="World3" path="/b/:id" />
</Router>, document.querySelector('#app'));