import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState("");
    const [newReportTitle, setNewReportTitle] = useState("");


    useEffect(() => {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
    }, []);

    function refreshReports() {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
    }

    function newReport() {
        postReport(newReportTitle).then(() => setNewReportTitle(""));

    }

    function reportTitleChange(event) {
        setNewReportTitle(event.target.value);
    }

    return (
        <div id={"reports"}>
            {
                Object.keys(reports).map((key) => {
                    return <li key={reports[key].id}> {reports[key].title} </li>
                })
            }

            <input onChange={reportTitleChange}/>
            <button onClick={refreshReports}>Refresh reports</button>
            <button onClick={newReport}>New report</button>

        </div>
    );

}

const getUsers = async () => {

    const response = await fetch('/users');
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }

    return body;
};

const postReport = async (title) => {

    await fetch('/reports', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"title": title})
    });
};

const getReports = async () => {

    const response = await fetch('/reports');
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }

    return body;
};


//
// class App extends Component {
//     state = {
//         data: "", users: "", name: "Test Post 13", username: "usernameHash3", password: "password2"
//     };
//
//     componentDidMount() {

//
//         this.getUsers()
//             .then(res => this.setState({users: res.express}))
//             .catch(err => console.log(err));
//
//
//         //this.deleteReport().then(() => this.setState({name: "DELETED", password: ""}));
//
//        // this.postUser().then(() => this.setState({username: "", password: ""}));
//
//        // this.deleteUser().then(() => this.setState({username: "DELETED", password: ""}));
//
//     }
//

//
//     getFiles = async () => {
//
//         const response = await fetch('/files');
//         const body = await response.json();
//
//         if (response.status !== 200) {
//             throw Error(body.message)
//         }
//
//         return body;
//     };
//
//     getUsers = async () => {
//
//         const response = await fetch('/users');
//         const body = await response.json();
//
//         if (response.status !== 200) {
//             throw Error(body.message)
//         }
//
//         return body;
//     };
//

//
//     deleteReport = async () => {
//
//         await fetch('/reports', {
//             method: 'DELETE',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({"title": this.state.name})
//         });
//     };
//
//     postUser = async () => {
//
//         await fetch('/users', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({"username": this.state.username, "password": this.state.password, "permissions" : 5})
//         });
//     };
//
//     deleteUser = async () => {
//
//         await fetch('/users', {
//             method: 'DELETE',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({"username": this.state.username})
//         });
//     };
//
//
//     render() {
//         return (
//
//             <div>
//             </div>
//
//         );
//     }
// }

export default App;