import './App.css';
import React, {useState, useEffect, Fragment} from 'react';

import Reports from "./Reports";
import Login from "./Login";
import Files from "./Files";
import File from './File';

function App() {

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
    const [reportOpen, setReportOpen] = useState("");
    const [fileOpen, setFileOpen] = useState("");

    if(loggedIn!== "true"){
        return <Login setLoggedIn={setLoggedIn}/>
    }else if(reportOpen === ""){
        return <Reports setReportOpen={setReportOpen}/>
    }else if(reportOpen !== "" && fileOpen === ""){
        return <Files setFileOpen={setFileOpen} report={reportOpen} setReportOpen={setReportOpen}/>
    }else if(fileOpen !== ""){
        return <File file={fileOpen} setFileOpen={setFileOpen}/>
    }
}

export default App;
