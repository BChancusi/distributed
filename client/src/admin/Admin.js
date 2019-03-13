import React, {useState, useEffect, useRef} from 'react';

function Admin(props) {

    const [users, setUsers] = useState([]);
    const[newUsername, setNewUsername] = useState("");
    const[newPassword, setNewPassword] = useState("");

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        getUsers();


        return () => {
            controller.abort();
        }
    }, []);

    function getUsers () {

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
            })
    }

    function handlePostUser () {

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
            if(result.express === "user already exists"){
                //TODO throw error, ui change

            }

            //TODO insert new user into list
        })

    }

    function handleReturn(){

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
            <button onClick={handleReturn}>Return</button>
        </nav>

        <div>
            <label>New username</label>
            <input value={newUsername} onChange={handleChange} name={"newUsername"} type="text"/>
            {/*TODO generate password*/}
            <label>New Password</label>
            <input value={newPassword} onChange={handleChange} name={"newPassword"} type="password"/>

            <button onClick={handlePostUser}>Create New User</button>
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