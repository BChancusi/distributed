import React, {useState, useEffect, Fragment} from 'react';

function useFile(file) {

    const [fields, setFields] = useState("");
    const [currentBranch, setCurrentBranch] = useState("master");
    const [mergeBranch, setMergeBranch] = useState("master");

    const [mergeBranchConflictsSource, setMergeBranchConflictsSource] = useState([]);
    const [mergeBranchConflictsTarget, setMergeBranchConflictsTarget] = useState([]);
    const [mergeBranchResolved, setMergeBranchResolved] = useState([]);


    const [fileTitles, setFileTitles] = useState("master");

    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [newFieldValue, setNewFieldValue] = useState(0);
    const [newBranchTitle, setNewBranchTitle] = useState("");


    useEffect(() => {
        if (file !== "") {
            getFields(file.id)
                .then(res => {
                    setFields(res.fields);
                    setFileTitles(res.fileTitles);
                })
                .catch(err => console.log(err));

        }

        return setFields("")

    }, [file.id, currentBranch]);

    const getFields = async (fileId) => {

        let fetchUrl = `/fields?file_id=${fileId}&branch_title=${currentBranch}&title=${file.title}`;

        fetchUrl = encodeURI(fetchUrl);


        const response = await fetch(fetchUrl);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const postField = async () => {

        const response = await fetch('/fields', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "title": newFieldTitle,
                "value": newFieldValue,
                "file_id": file.id,
                "branch_title": currentBranch
            })
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    const deleteField = async (fieldId) => {

        await fetch(`/fields/${fieldId}`, {
            method: 'DELETE',
        });

        return null;
    };


    const putField = async (field) => {

        await fetch(`/fields/${field.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": field.title, "value": field.value})
        });

        return null;
    };

    function handlePutField(event, key) {

        if (event.target.name === "title") {

            let cloneFields = [...fields];

            cloneFields[key].title = event.target.value;

            putField(cloneFields[key])
                .then(() => setFields(cloneFields))
                .catch(err => console.log(err));

        } else if (event.target.name === "value") {


            let cloneFields = [...fields];

            cloneFields[key].value = event.target.value;

            putField(cloneFields[key])
                .then(() => setFields(cloneFields))
                .catch(err => console.log(err));
        }
    }


    function handleRefreshFields() {
        getFields(file.id)
            .then(res => setFields(res.express))
            .catch(err => console.log(err));
    }


    function handleNewField() {
        postField().then(res => setFields(fields.concat(res.express)))
            .catch(err => console.log(err));
    }

    function handleDeleteFile(fieldId) {
        deleteField(fieldId).then(() => null);
    }

    function handleNewBranch() {
        postBranch(fields).then(() => null);
    }

    const postBranch = async () => {

        let cloneFields = [...fields];
        cloneFields.push(file);

        await fetch(`/fields/branch/${newBranchTitle}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cloneFields)
        });

        return null;
    };

    function handleMergeBranch() {
        postMergeBranch(fields).then(res => {

            if(res.express !== "no conflicts"){
                setMergeBranchConflictsSource(res.conflictsSource);
                setMergeBranchConflictsTarget(res.conflictsTarget);
            }
        })
            .catch(err => console.log(err));

    }

    const postMergeBranch = async () => {

        const response = await fetch(`/fields/mergeBranch/${mergeBranch}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        });

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;

    };

    function handleResolveConflicts() {

        let mergeResolved = [];

        let cloneMerge = [...mergeBranchResolved];

        for (let i = 0; i < fields.length; i++) {

            let boolean = false;

            for (let j = 0; j < cloneMerge.length; j++) {

                if (fields[i].title === cloneMerge[j].title) {

                    cloneMerge[j].branch_title = mergeBranch;
                    delete cloneMerge[j].timestamp;
                    delete cloneMerge[j].id;
                    mergeResolved.push(cloneMerge[j]);
                    boolean = true;
                    break;
                }
            }

            for(let k = 0; k < mergeBranchConflictsTarget.length && boolean === false; k++){

                if(mergeBranchConflictsTarget[k].title === fields[i].title){

                    boolean = true;
                    break;
                }
            }

            if(boolean === false) {
                let cloneFields = JSON.parse(JSON.stringify(fields));

                cloneFields[i].branch_title = mergeBranch;
                delete cloneFields[i].timestamp;
                delete cloneFields[i].id;

                mergeResolved.push(cloneFields[i]);
            }
        }
        postMergeResolved(mergeResolved).then(()=> {
            setMergeBranchConflictsTarget([]);
            setMergeBranchConflictsSource([]);
            setMergeBranchResolved([]);
        })
    }

    const postMergeResolved = async (mergeResolved) => {

        await fetch(`/fields/mergeResolved/${mergeBranch}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(mergeResolved)
        });

        return null;
    };

    function handleCheckbox(event, item) {

        if (event.target.checked === true) {

            let cloneResolved = [...mergeBranchResolved];

            cloneResolved.push(item);
            setMergeBranchResolved(cloneResolved)

        } else {

            setMergeBranchResolved(mergeBranchResolved.filter(filterItem => {
                return filterItem !== item

            }))
        }
    }

    if (fields === "") {
        return "";
    }

    let total = 0;

    return (
        <>
            <header>
                <h1 align="CENTER">{file.title}</h1>
            </header>
            <nav>
                <button onClick={() => setFields("")}>Return</button>
            </nav>

            <div id={"options"}>
                <button onClick={handleRefreshFields}>Refresh Fields</button>
                <input type="text" value={newFieldTitle} onChange={(event) => setNewFieldTitle(event.target.value)}/>
                <input type="text" value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)}/>
                <button onClick={handleNewField}>New Field</button>
                <input type="text" value={newBranchTitle} onChange={(event) => setNewBranchTitle(event.target.value)}/>
                <button onClick={handleNewBranch}>New Branch</button>

                <select value={currentBranch} onChange={(event) => setCurrentBranch(event.target.value)}>
                    <>
                        {
                            Array.isArray(fileTitles) ?
                                Object.keys(fileTitles).map(key => {

                                    return <option key={fileTitles[key].id}
                                                   value={fileTitles[key].branch_title}>{fileTitles[key].branch_title}</option>
                                })
                                : null
                        }
                    </>
                </select>
                {Array.isArray(fileTitles) && fileTitles.length > 1 ?
                    <>
                        <select value={mergeBranch} onChange={(event) => setMergeBranch(event.target.value)}>
                            {
                                Object.keys(fileTitles).map((key) => {

                                    if (fileTitles[key].branch_title === currentBranch) {
                                        return null;
                                    }
                                    return <option key={fileTitles[key].id}
                                                   value={fileTitles[key].branch_title}>{fileTitles[key].branch_title}</option>
                                })
                            }
                        </select>
                        <button onClick={handleMergeBranch}>Merge Branch target</button>
                    </>
                    : null}
            </div>
            <div id={"fields"}>
                {
                    Object.keys(fields).map(key => {
                        total += fields[key].value;
                        return <Fragment key={fields[key].id}>

                            <input type="text" value={fields[key].title} name="title"
                                   onChange={(event) => handlePutField(event, key)}/>
                            <input type="text" value={fields[key].value} name="value"
                                   onChange={(event) => handlePutField(event, key)}/>
                            <button onClick={() => handleDeleteFile(fields[key].id)}>Delete</button>

                        </Fragment>
                    })
                }
                {fields.length === 0 ? null : <label>Total = {total}</label>}
            </div>
            {mergeBranchConflictsSource.length > 0 && mergeBranchConflictsTarget.length > 0 ?
                <div id="conflicts">
                    <>
                        {
                            Object.keys(mergeBranchConflictsSource).map(key => {
                                return <Fragment key={mergeBranchConflictsSource[key].id}>
                                    <label>
                                        {mergeBranchConflictsSource[key].title}
                                    </label>
                                    <label>
                                        {mergeBranchConflictsSource[key].value}
                                    </label>
                                    <input type="checkbox" onChange={(event) =>
                                        handleCheckbox(event, mergeBranchConflictsSource[key])}/>
                                </Fragment>
                            })
                        }
                        <br/>

                        {
                            Object.keys(mergeBranchConflictsTarget).map(key => {
                                return <Fragment key={mergeBranchConflictsTarget[key].id}>
                                    <label>
                                        {mergeBranchConflictsTarget[key].title}
                                    </label>
                                    <label>
                                        {mergeBranchConflictsTarget[key].value}
                                    </label>
                                    {/*<input onChange={(event) =>*/}
                                    {/*handleCheckbox(event, mergeBranchConflictsTarget[key])} type="checkbox"/>*/}
                                </Fragment>
                            })

                        }
                        <button onClick={handleResolveConflicts}>Resolve Conflicts</button>
                    </>
                </div> : null
            }
        </>
    );
}

export default useFile;