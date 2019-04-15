import React from 'react'

export default function (props) {

    async function handleLogout(event) {
        event.preventDefault();

        const response = await fetch("/API/users/logout");

        if (response.status !== 200) {
            return console.error(response.statusText);
        }

        localStorage.clear();
        props.setLoggedInUser(null);
    }

    return (
        <button className="nav-button" onClick={handleLogout}>Logout</button>
    )
};