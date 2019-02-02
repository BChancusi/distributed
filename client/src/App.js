import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
        data: "", users: "", name: "Test Post 23", username: "username4", password: "password2"
    };

    componentDidMount() {

        this.getReports()
            .then(res => this.setState({data: res.express}))
            .catch(err => console.log(err));

        this.getUsers()
            .then(res => this.setState({users: res.express}))
            .catch(err => console.log(err));

        this.postReport().then(() => this.setState({name: ""}));

        this.deleteReport().then(() => this.setState({name: "DELETED", password: ""}));

        this.postUser().then(() => this.setState({username: "", password: ""}));

        this.deleteUser().then(() => this.setState({username: "DELETED", password: ""}));

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

    postReport = async () => {

        await fetch('/reports', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": this.state.name})
        });
    };

    deleteReport = async () => {

        await fetch('/reports', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": this.state.name})
        });
    };

    postUser = async () => {

        await fetch('/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": this.state.username, "password": this.state.password})
        });
    };

    deleteUser = async () => {

        await fetch('/user', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": this.state.username})
        });
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