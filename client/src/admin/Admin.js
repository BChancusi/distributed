import React, {useState, useEffect} from 'react';
import Logout from "../Logout";

function Admin(props) {

    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPermission, setNewPermission] = useState("0");
    const [isLoading, setIsLoading] = useState(true);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {

        async function fetchUsers() {

            const response = await fetch("/API/users", {signal});

            const result = await response.json();

            if (response.status === 403) {
                props.setLoggedInUser(null);
                localStorage.clear();
                return;
            }

            if (response.status !== 200) {
                return console.debug(result)
            }

            setUsers(result.express);
            setIsLoading(false);
        }

        fetchUsers().catch(error => console.debug(error));

        return () => {
            controller.abort();
        }
    }, []);


    async function handlePostUser(event) {
        event.preventDefault();

        if (newPassword.trim() === "" || newUsername.trim() === "") {
            return console.debug("error username");
        }

        setIsLoading(true);

        const response = await fetch(
            `/API/users?username=${newUsername}&password=${newPassword}&permission=${parseInt(newPermission)}`,
            {signal, method: "POST"}
        );

        const result = await response.json();

        if (response.status !== 200) {
            return console.debug(result)
        }

        if (result.express === "username exists" || result.express === "permission can not be 5") {
            return;
        }

        setNewUsername("");
        setNewPassword("");
        setNewPermission("0");

        setUsers(users.concat(result.express));

        setIsLoading(false);
    }

    function handleReturn() {
        props.setAdminOpen(false);
    }

    function handleChange(event) {

        if (event.target.name === "newUsername") {
            setNewUsername(event.target.value);
        } else if (event.target.name === "newPassword") {
            setNewPassword(event.target.value);
        } else if (event.target.name === "newPermission") {
            setNewPermission(event.target.value)
        }
    }

    async function handleDeleteUser(id) {

        const response = await fetch(`/API/users/${id}`, {
            signal,
            method: "DELETE"
        });

        if (response.status !== 200) {
            console.debug(response.statusText)
        }

        setUsers(users.filter(value => {

            return value.id !== id;
        }))

    }

    return (
        <>
            <header>
                <h1>Admin</h1>
            </header>

            <nav>
                <button onClick={handleReturn}>Return</button>
                <Logout setLoggedInUser={props.setLoggedInUser}/>
            </nav>

            <div className="options">
                <form onSubmit={handlePostUser}>
                    <label>New username</label>
                    <input className="input-options" value={newUsername} onChange={handleChange} name="newUsername"
                           type="text"
                           autoComplete="username"/>

                    <label>New Password</label>
                    <input className="input-options" value={newPassword} onChange={handleChange} name="newPassword"
                           type="password"
                           autoComplete="current-password"/>

                    <label>Permission Level</label>
                    <select value={newPermission} onChange={handleChange} name="newPermission">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>

                    <button disabled={isLoading}>Create New User</button>
                </form>
            </div>

            <div className="content" id="users">
                <div className="content-wrap">
                    {isLoading && users.length === 0? <h2>Loading...</h2> :
                        users.length > 0 ?

                            <table>
                                <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Permissions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    users.map((value, index) => {
                                        return <tr key={value.id}>
                                            <td>{value.username}</td>
                                            <td>{value.permission}</td>
                                            {value.username !== "admin" ?
                                                <td>
                                                    <button className={index % 2 === 0 ? "button-admin-table" : null}
                                                            onClick={() => handleDeleteUser(value.id)}>Delete User
                                                    </button>
                                                </td>
                                                : null}
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                            : <h2>No Users Created</h2>
                    }
                </div>
            </div>
        </>
    )
}

export default Admin;