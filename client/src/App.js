import './App.css';
import React, {useState} from 'react';

import Reports from "./reports/Reports";
import Login from "./login/Login";
import Files from "./files/Files";
import File from './file/File';

function App() {

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
    const [reportOpen, setReportOpen] = useState("");
    const [fileOpen, setFileOpen] = useState("");

    if (loggedIn !== "true") {
        return <>
            <header>
                <h1 align="CENTER">Distributed Budgeting App</h1>
                <h2>Login</h2>
            </header>
            <Login setLoggedIn={setLoggedIn}/>
        </>
    } else if (reportOpen === "") {
        return <>
            <header>
                <h1 align="CENTER">Reports</h1>
            </header>
            <nav>
                <button onClick={() => {
                    localStorage.clear();
                    setLoggedIn(null)
                }}>Logout
                </button>
            </nav>
            <Reports setReportOpen={setReportOpen}/>
        </>
    } else if (reportOpen !== "" && fileOpen === "") {
        return <>
            <header>
                <h1 align="CENTER">{reportOpen.title}</h1>
            </header>
            <nav>
                <button onClick={() => {
                    localStorage.clear();
                    setLoggedIn(null)
                }}>Logout
                </button>
                <button onClick={() => setReportOpen("")}>Return</button>
            </nav>
            <Files setFileOpen={setFileOpen}
                   report={reportOpen}/>
        </>
    } else if (fileOpen !== "") {
        return <>
            <header>
                <h1 align="CENTER">{reportOpen.title + "\\" + fileOpen.title}</h1>
            </header>
            <nav>
                <button onClick={() => {
                    localStorage.clear();
                    setLoggedIn(null)
                }}>Logout
                </button>
                <button onClick={() => setFileOpen("")}>Return</button>
            </nav>
            <File file={fileOpen}/>
        </>
    }
}

export default App;