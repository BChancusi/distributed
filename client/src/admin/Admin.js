import React, {useState, useEffect} from 'react';

function Admin(props) {

    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPermission, setNewPermission] = useState("0");

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        fetch("/API/users", {signal})
            .then((res) => {

                if (res.status !== 200) {
                    throw Error(res.status + "")
                }

                return res.json()

            }).then(result => {
                setUsers(result.express)
            },
            error => {
                throw Error(error.toString())
            });

        return () => {
            controller.abort();
        }
    }, []);


    function handlePostUser (event) {
        event.preventDefault();

        fetch(
            `API/users?username=${newUsername}&password=${newPassword}&permission=${parseInt(newPermission)}`,
            {signal, method : "POST"}
            ).then(res => {

                if(res.status !== 200){
                    throw Error(res.status + "")
                }
                return res.json()

        }).then(result => {
            if(result.express === "username exists" || result.express === "permission can not be 5"){
                //TODO throw error, ui change
                console.debug("error username")
            }

            //TODO clear input

            setUsers(users.concat(result.express));
        })

    }

    function handleReturn(){
        props.setAdminOpen(false);
    }

    function handleChange(event) {

        if(event.target.name === "newUsername"){
            setNewUsername(event.target.value);
        }else if(event.target.name === "newPassword"){
            setNewPassword(event.target.value);
        }else if(event.target.name === "newPermission"){
            setNewPermission(event.target.value)
        }
    }

    return <>
         <header>
            <h1>Admin</h1>
         </header>

        <nav>
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedInUser(null)
            }}>Logout
            </button>

            <button onClick={handleReturn}>Return</button>
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

                <button>Create New User</button>
            </form>
        </div>

        <div className="content" id="users">
            {users.length > 0 ?
                <ul>
                    {
                        // TODO change to table instead of ul
                        users.map(value => {
                            return <li key={value.id}>{value.username + " - Permission: " + value.permission}</li>
                        })
                    }
                </ul>
                : <p>No Users Created</p>
            }
            </div>

        </>
}

export default Admin;