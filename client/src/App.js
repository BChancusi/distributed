import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
        data: "" , users: ""
    };

    componentDidMount() {

        this.getReports()
            .then(res => this.setState({data: res.express}))
            .catch(err => console.log(err));

        this.getUsers()
            .then(res => this.setState({users: res.express}))
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

    getUsers = async () => {

        const response = await fetch('/users');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };


    render() {
        return (
            <div>
                <>
                    {/*{[this.state.data].map(report => (*/}
                        {/*<div>*/}
                            {/*<p>{report[0].title}</p>*/}
                            {/*<p>{report.id }</p>*/}
                            {/*<p>{report.status }</p>*/}
                            {/*<p>{report.editable }</p>*/}
                            {/*<p>{report.hash }</p>*/}
                        {/*</div>*/}
                    {/*))}*/}
                </>

            </div>


        );
    }
}

export default App;