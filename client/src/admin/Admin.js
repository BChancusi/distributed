import React, {useState, useEffect} from 'react';

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

            if (response.status !== 200) {
                throw Error(result.body)
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

        const response = await fetch(
            `API/users?username=${newUsername}&password=${newPassword}&permission=${parseInt(newPermission)}`,
            {signal, method: "POST"}
        );

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.body)
        }

        if (result.express === "username exists" || result.express === "permission can not be 5") {
            //TODO throw error, ui change
            console.debug("error username");
            return;
        }
        //TODO clear input

        setUsers(users.concat(result.express));


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

    return <>
        <header>
            <h1>Admin</h1>
        </header>

        <nav>
            <button onClick={handleReturn}>Return</button>
            <button style={{float: "right"}} onClick={() => {
                localStorage.clear();
                props.setLoggedInUser(null)
            }}>Logout
            </button>
        </nav>

        <div className="options">
            <form onSubmit={handlePostUser}>
                <label>New username</label>
                <input value={newUsername} onChange={handleChange} name="newUsername" type="text"
                       autoComplete="username"/>
                {/*TODO generate password*/}

                <label>New Password</label>
                <input value={newPassword} onChange={handleChange} name="newPassword" type="password"
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
            {isLoading ? <h2>Loading Content...</h2> :
                    users.length > 0 ?
                    <ul>
                        {
                            // TODO change to table instead of ul
                            users.map(value => {
                                return <li key={value.id}>{value.username + " - Permission: " + value.permission}</li>
                            })
                        }
                    </ul>
                    : <h2>No Users Created</h2>
            }
        </div>

    </>
}

export default Admin;