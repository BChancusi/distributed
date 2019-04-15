import './App.css';
import React, {useState, useEffect} from 'react';

import Reports from "./reports/Reports";
import Login from "./login/Login";
import Files from "./files/Files";
import File from './file/File';
import Admin from './admin/Admin';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [adminOpen, setAdminOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState("");
    const [fileOpen, setFileOpen] = useState("");

    useEffect(() => {
        setReportOpen("");
        setFileOpen("");
        setAdminOpen(false);

    }, [user]);

    if (user == null) {

        return <Login setLoggedInUser={setUser}/>

    } else if (adminOpen) {
        return <Admin setLoggedInUser={setUser} setAdminOpen={setAdminOpen} user={user}/>

    } else if (reportOpen === "") {
        return  <Reports setLoggedInUser={setUser} setReportOpen={setReportOpen}
                         user={user} setAdminOpen={setAdminOpen}/>

    } else if (reportOpen !== "" && fileOpen === "") {
        return <Files setLoggedInUser={setUser} setFileOpen={setFileOpen}
                   report={reportOpen} setReportOpen={setReportOpen} setAdminOpen={setAdminOpen}
                      user={user}/>

    } else if (fileOpen !== "") {
        return <File setLoggedInUser={setUser} report={reportOpen} file={fileOpen} setFileOpen={setFileOpen}
                     user={user} setAdminOpen={setAdminOpen}/>
    }
}

export default App;

//TODO  CSS load first to prevent jaring white screen
//      Set isloading to false on error and display error
//      Report/file/fields when massive amount need search or another way to navigate
//      Stop is loading showing if on submit, or make it so only shows a snippet