import React from 'react';

function Conflicts(props) {

    let tableRows = [];

    for (let i = 0; i < props.source.length; i++) {
        tableRows.push(
            <tr key={props.source[i].id}>
                <td>{props.source[i].title}</td>
                <td>{props.source[i].value}<input type="checkbox" name={props.name} onChange={(event) =>
                    props.event(event, props.source[i])}/></td>
                <td>{props.target[i].value}</td>
            </tr>
        )
    }

    return <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>New quantity</th>
                    <th>Old quantity</th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
         </table>
}

export default Conflicts;
