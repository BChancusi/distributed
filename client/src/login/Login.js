import React, {useRef, useState, useEffect} from 'react';

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() =>{
        return () => {
            controller.abort();
        }
    });

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch(`/API/users/signin?username=${username}&password=${password}`, {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });

        if (response.status !== 200) {
            throw Error("Fetch error")
        }

        const result = await response.json();

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
                <h1>Distributed Budgeting App</h1>
                <h2>Please Login</h2>
            </header>
            <div className="content" id="login">
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
                    <button>Login</button>
                </form>
            </div>
        </>
    )
}

export default Login;