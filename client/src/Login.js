import React, {useState, useEffect, Fragment} from 'react';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedin] = useState(localStorage.getItem("loggedIn"));

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch(`/users/signin?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {'Content-Type': ' application/x-www-form-urlencoded'},
        });

        await response.json().then(body =>{

            if (response.status !== 200) {
                throw Error(body.message)
            }
            if(body.express === "details correct"){
                setLoggedin(true);
                localStorage.setItem("loggedIn", "true")
            }
        });
    };

    function handleChange(event) {

        if (event.target.name === "username") {

            setUsername(event.target.value)
        } else {
            setPassword(event.target.value)
        }
    }

    return (
        <div id="login">
            <form onSubmit={handleLogin}>
                <label>Username
                    <input onChange={handleChange} type="text" name="username" autoComplete="username"/>
                </label>
                <label>Password
                    <input onChange={handleChange} type="password" name="password" autoComplete="current-password"/>
                </label>
                <label>Login
                    <input type="submit"/>
                </label>
            </form>
        </div>

    )
}

export default Login;