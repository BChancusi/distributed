import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
        data: ""
    };

    componentDidMount() {
        this.getReports()
            .then(res => this.setState({data: res.express[0]}))
            .catch(err => console.log(err));
    }

    getReports = async () => {

        const response = await fetch('/reports');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };


    render() {
        return (
            <div>
                <p>{this.state.data.title }</p>
                <p>{this.state.data.id }</p>
                <p>{this.state.data.statue }</p>
                <p>{this.state.data.editable }</p>
                <p>{this.state.data.hash }</p>

            </div>
        );
    }
}

export default App;