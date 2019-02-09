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

    function deleteReportBtn() {
        deleteReport(newReportTitle).then(() => setNewReportTitle(""));
    }

    return (
        <div id={"reports"}>
            {
                Object.keys(reports).map((key) => {
                    return <li key={reports[key].id}> {reports[key].title}</li>
                })
            }

            <input onChange={reportTitleChange}/>
            <button onClick={refreshReports}>Refresh reports</button>
            <button onClick={newReport}>New report</button>
            <button onClick={deleteReportBtn}>Delete report</button>

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

const deleteReport = async (reportTitle) => {

        await fetch(`/reports/${reportTitle}`, {
            method: 'DELETE',
        });
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