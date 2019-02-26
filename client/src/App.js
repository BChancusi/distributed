import './App.css';

import UseReports from "./UseReports";

import Login from "./Login";

import React, {useState, useEffect, Fragment} from 'react';


function App() {

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));

    if(loggedIn!== "true"){
        return <Login setLoggedIn={setLoggedIn}/>
    }else{
        return <UseReports></UseReports>
    }

}

export default App;

//TODO Cant select same file twice after return
