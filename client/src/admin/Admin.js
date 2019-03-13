import React, {useState, useEffect} from 'react';

function Admin(props) {

    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

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

        fetch(`API/users?username=${newUsername}&password=${newPassword}`, {
            signal,
            method : "POST",
            }
            ).then(res => {

                if(res.status !== 200){
                    throw Error(res.status + "")
                }
                return res.json()

        }).then(result => {
            if(result.express === "username exists"){
                //TODO throw error, ui change
                console.debug("error username")
            }

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
        }
    }

    return <>
         <header>
            <h1>Admin</h1>
         </header>

        <nav>
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedIn(null)
            }}>Logout
            </button>

            <button onClick={handleReturn}>Reports</button>
        </nav>

        <div>
            <form onSubmit={handlePostUser}>
                <label>New username</label>
                <input value={newUsername} onChange={handleChange} name="newUsername" type="text"
                       autoComplete="username"/>
                {/*TODO generate password*/}
                <label>New Password</label>
                <input value={newPassword} onChange={handleChange} name="newPassword" type="password"
                       autoComplete="current-password"/>

                <button>Create New User</button>
            </form>
        </div>

        <div id="users">
            {users.length > 0 ?
                <ul>
                    {
                        users.map(value => {
                            return <li key={value.id}>{value.username}</li>
                        })
                    }
                </ul>
                : <p>No Users Created</p>
            }
            </div>

        </>
}

export default Admin;