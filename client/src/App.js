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
        return <Login setLoggedIn={setLoggedIn}/>
    } else if (reportOpen === "") {
        return  <Reports setLoggedIn={setLoggedIn} setReportOpen={setReportOpen}/>

    } else if (reportOpen !== "" && fileOpen === "") {
        return <Files setLoggedIn={setLoggedIn} setFileOpen={setFileOpen}
                   report={reportOpen} setReportOpen={setReportOpen}/>

    } else if (fileOpen !== "") {
        return <File setLoggedIn={setLoggedIn} report={reportOpen} file={fileOpen} setFileOpen={setFileOpen}/>
    }
}

export default App;

//TODO add branch to current path
//      Fix no X created displayed loading, can make a loading text
//      Nav bar
//      CSS load first to prevent jaring white screen
//      Delete not functioning correctly, pos because of foreign keys