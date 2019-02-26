import React, {useState, useEffect, Fragment} from 'react';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //
    // const handlePutReport = async (value, key) => {
    //
    //
    //     await fetch(`/reports/${cloneReports[key].id}`, {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({"title": cloneReports[key].title})
    //     }).then(response => {
    //
    //         if (response.status !== 200) {
    //             throw Error(response.status.toString())
    //         }
    //
    //         setReports(cloneReports)
    //     });
    // };

    const handleLogin = async (event) => {
        event.preventDefault();

        await fetch(`/users.signin?username=${username}&password=${password}`, {
                    method: 'POST',
                    headers: {'Content-Type': ' application/x-www-form-urlencoded'},
                }).then(response => {

                    if (response.status !== 200) {
                        throw Error(response.status.toString())
                    }

                    console.debug("posted")
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