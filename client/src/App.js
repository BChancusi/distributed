import './App.css';
import React, {useState} from 'react';

import Reports from "./Reports";
import Login from "./Login";
import Files from "./Files";
import File from './File';

function App() {

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
    const [reportOpen, setReportOpen] = useState("");
    const [fileOpen, setFileOpen] = useState("");

    if (loggedIn !== "true") {
        return <>
            <header>
                <h1 align="CENTER">Login</h1>
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
                <h1 align="CENTER">{fileOpen.title}</h1>
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