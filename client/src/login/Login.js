import React, {useRef, useState} from 'react';

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        fetch(`/API/users/signin?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(res => {
            if (res.status !== 200) {
                throw Error("Fetch error")
            }
            return res.json()

        }).then((result) => {

            if (result.express === "details incorrect") {
                setPassword("");
                usernameInput.current.style.border = "2px solid red";
                passwordInput.current.style.border = "2px solid red";

            }else{
                usernameInput.current.style.border = "";
                passwordInput.current.style.border = "";
                setUsername("");
                setPassword("");
                props.setLoggedInUser(result.express);
                localStorage.setItem("user", JSON.stringify(result.express))
            }
        }, (error) => {
            throw Error(error)
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
        <>
            <header>
                <h1 align="CENTER">Distributed Budgeting App</h1>
                <h2>Login Page</h2>
            </header>
            <div id="login">
                <form onSubmit={handleLogin}>
                    <label>Username
                        <input value={username} onChange={handleChange} type="text" name="username" ref={usernameInput}
                               autoComplete="username" data-testid="username-text"/>
                    </label>
                    <label>Password
                        <input value={password} onChange={handleChange} type="password" name="password"
                               ref={passwordInput}
                               autoComplete="current-password" data-testid="password-text"/>
                    </label>
                    <input type="submit" value="Login"/>
                </form>
            </div>
        </>
    )
}

export default Login;