import React, {useRef, useState} from 'react';

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch(`/users/signin?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });

        await response.json().then(body => {

            if (response.status !== 200) {
                throw Error(body.message)
            }
            if (body.express === "details correct") {
                usernameInput.current.style.backgroundColor = "white";
                passwordInput.current.style.backgroundColor = "white";
                setUsername("");
                setPassword("");
                props.setLoggedIn("true");
                localStorage.setItem("loggedIn", "true")
            }else{
                usernameInput.current.style.backgroundColor = "red";
                passwordInput.current.style.backgroundColor = "red";
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
                    <input onChange={handleChange} type="text" name="username" ref={usernameInput}
                           autoComplete="username" data-testid="username-text"/>
                </label>
                <label>Password
                    <input onChange={handleChange} type="password" name="password" ref={passwordInput}
                           autoComplete="current-password" data-testid="password-text"/>
                </label>
                <input type="submit" value="Login"/>
            </form>
        </div>
    )
}

export default Login;