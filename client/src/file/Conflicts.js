import React, {Fragment} from 'react';

function Conflicts(props) {

    return <>
        {
            props.source.map(value => {
                return <Fragment key={value.id}>
                    <label>
                        {" New value - " + value.title}
                    </label>
                    <label>
                        {" : " + value.value}
                    </label>
                    <input type="checkbox" name={props.name} onChange={(event) =>
                        props.event(event, value)}/>
                </Fragment>
            })
        }
        <br/>
        {
            props.target.map(value => {
                return <Fragment key={value.id}>
                    <label>
                        {" Value on file - " + value.title}
                    </label>
                    <label>
                        {" : " + value.value}
                    </label>
                </Fragment>
            })

        }
    </>
}

export default Conflicts;
