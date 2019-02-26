import React, {useState, useEffect, Fragment} from 'react';

function File(props) {

    const [fields, setFields] = useState([]);
    const [currentBranch, setCurrentBranch] = useState("master");

    const [mergeBranchConflictsSource, setMergeBranchConflictsSource] = useState([]);
    const [mergeBranchConflictsTarget, setMergeBranchConflictsTarget] = useState([]);
    const [mergeBranchResolved, setMergeBranchResolved] = useState([]);

    const [commitNew, setCommitNew] = useState([]);
    const [commitOld, setCommitOld] = useState([]);
    const [commitResolved, setCommitResolved] = useState([]);

    const [fileTitles, setFileTitles] = useState("master");

    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("0");
    const [newBranchTitle, setNewBranchTitle] = useState("");


    useEffect(() => {
        getFields()
            .then(res => {
                setFields(res.fields);
                setFileTitles(res.fileTitles);
            })
            .catch(err => console.log(err));

    }, [props.file.id, currentBranch]);

    useEffect(() => {
        return () => {
            setFields(null);
            setCurrentBranch(null);
            setMergeBranchConflictsSource(null);
            setMergeBranchConflictsTarget(null);
            setMergeBranchResolved(null);
            setCommitNew(null);
            setCommitOld(null);
            setCommitResolved(null);
            setFileTitles(null);
            setNewFieldTitle(null);
            setNewFieldValue(null);
            setNewBranchTitle(null);
        }

    }, []);


    const getFields = async () => {

        let fetchUrl =
            `/fields?report_id=${props.file.report_id}&branch_title=${currentBranch}&title=${props.file.title}&file_id=${props.file.id}`;

        const response = await fetch(encodeURI(fetchUrl));
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    function handleNewField() {
        postField()
            .then(res => {
                setFields(fields.concat(res.express));
                setNewFieldTitle("");
                setNewFieldValue("0");
            })
            .catch(err => console.log(err));
    }

    const postField = async () => {

        const response = await fetch('/fields', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "title": newFieldTitle.trim(),
                "value": newFieldValue.trim(),
                "file_id": props.file.id,
                "branch_title": currentBranch
            })
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };


    function handleFieldChange(event, key) {

        if (event.target.name === "title") {

            let cloneFields = [...fields];

            cloneFields[key].title = event.target.value;

            setFields(cloneFields);


        } else if (event.target.name === "value") {


            let cloneFields = [...fields];

            cloneFields[key].value = event.target.value;

            setFields(cloneFields);

        }

    }

    function handlePutFields() {

        putFields(fields)
            .then(res => {
                if (res.express !== "no conflicts") {
                    setCommitNew(res.conflictsNew);
                    setCommitOld(res.conflictsOld);
                }
            })
            .catch(err => console.log(err));

    }

    const putFields = async () => {

        const response = await fetch(`/fields`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        });

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    const handleDeleteFile = async (fieldId, key) => {

        await fetch(`/fields/${fieldId}`, {
            method: 'DELETE',
        }).then(response => {

            if (response.status !== 200) {
                throw Error(response.status.toString())
            }

            setFields(fields.filter((value, index) => {

                return key !== index;
            }));
        });
    };

    const handleDeleteBranch = async () => {

        await fetch(`/fields/deleteBranch/query?branch_title=${currentBranch}&file_id=${props.file.id}&title=${props.file.title}`, {
            method: 'DELETE',
        }).then(response => {

            if (response.status !== 200) {
                throw Error(response.status.toString())
            }

            setFileTitles(fileTitles.filter(value => {
                return value.branch_title !== currentBranch;
            }));

            setCurrentBranch("master");
        });
    };

    function handleNewBranch() {

        if (newBranchTitle.trim() === "") {
            return;
        }
        postBranch(fields).then(res => {
            setFileTitles(fileTitles.concat(res.express));
            setNewBranchTitle("");
        });
    }

    const postBranch = async () => {

        let cloneFields = [...fields];
        cloneFields.push(props.file);

        const response = await fetch(`/fields/branch/${newBranchTitle}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cloneFields)
        });

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    function handleMergeBranch() {

        postMergeBranch().then(res => {

            if (res.express !== "no conflicts") {
                setMergeBranchConflictsSource(res.conflictsSource);
                setMergeBranchConflictsTarget(res.conflictsTarget);
            }
        })
            .catch(err => console.log(err));

    }

    const postMergeBranch = async () => {

        const response = await fetch(`/fields/mergeBranch/${(document.getElementById("selectMerge").value)}`, {
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

                    cloneMerge[j].branch_title = (document.getElementById("selectMerge").value);
                    delete cloneMerge[j].timestamp;
                    delete cloneMerge[j].id;
                    mergeResolved.push(cloneMerge[j]);
                    boolean = true;
                    break;
                }
            }

            for (let k = 0; k < mergeBranchConflictsTarget.length && boolean === false; k++) {

                if (mergeBranchConflictsTarget[k].title === fields[i].title) {

                    boolean = true;
                    break;
                }
            }

            if (boolean === false) {
                let cloneFields = JSON.parse(JSON.stringify(fields));

                cloneFields[i].branch_title = (document.getElementById("selectMerge").value);
                delete cloneFields[i].timestamp;
                delete cloneFields[i].id;

                mergeResolved.push(cloneFields[i]);
            }
        }
        postMergeResolved(mergeResolved).then(() => {
            setMergeBranchConflictsTarget([]);
            setMergeBranchConflictsSource([]);
            setMergeBranchResolved([]);
        })
    }

    const postMergeResolved = async (mergeResolved) => {

        await fetch(`/fields/mergeResolved/${(document.getElementById("selectMerge").value)}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(mergeResolved)
        });

        return null;
    };

    function handleCheckboxMerge(event, item) {

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

    function handleCheckboxCommit(event, item) {

        if (event.target.checked === true) {

            let cloneResolved = [...commitResolved];

            cloneResolved.push(item);
            setCommitResolved(cloneResolved)

        } else {

            setCommitResolved(commitResolved.filter(filterItem => {
                return filterItem !== item

            }))
        }
    }

    function handleResolveConflictsCommit() {

        postCommit().then(() => {
            setCommitOld([]);
            setCommitNew([]);
            setCommitResolved([]);
        })
    }

    const postCommit = async () => {

        if (commitResolved.length > 0) {
            await fetch(`/fields/commitResolved`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(commitResolved)
            });
        }

        return null;
    };

    let total = 0;

    return <>
        <header>
            <h1 align="CENTER">{props.file.title}</h1>
        </header>
        <nav>
            <button onClick={() => props.setFileOpen("")}>Return</button>
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedIn(null)

            }}>Logout
            </button>
        </nav>

        <div id={"options"}>
            <input type="text" value={newBranchTitle} onChange={(event) => setNewBranchTitle(event.target.value)}/>
            <button onClick={handleNewBranch}>New Branch</button>

            <select value={currentBranch} onChange={(event) => setCurrentBranch(event.target.value)}>
                <>
                    {
                        Array.isArray(fileTitles) ?
                            fileTitles.map(value => {

                                return <option key={value.id}
                                               value={value.branch_title}>{value.branch_title}</option>
                            })
                            : null
                    }
                </>
            </select>


            {Array.isArray(fileTitles) && fileTitles.length > 1 && currentBranch !== "master" ?
                <>
                    <button onClick={handleDeleteBranch}>Delete Current Branch</button>
                    <select id="selectMerge">
                        {
                            fileTitles.map(value => {

                                if (value.branch_title === currentBranch) {
                                    return null;
                                }
                                return <option key={value.id}
                                               value={value.branch_title}>{value.branch_title}</option>
                            })
                        }
                    </select>
                    <button onClick={handleMergeBranch}>Merge Branch target</button>
                </>
                : null}

            <button onClick={handlePutFields}>Save Changes</button>

            <br/>

            <input type="text" value={newFieldTitle} onChange={(event) => setNewFieldTitle(event.target.value)}/>
            <input type="text" value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)}/>
            <button onClick={handleNewField}>New Field</button>


        </div>
        <div id={"fields"}>
            {
                fields.map((value, index) => {

                    if (!isNaN(parseFloat(value.value))) {
                        total += parseFloat(parseFloat(value.value).toFixed(2));
                    }

                    return <Fragment key={value.id}>

                        <input type="text" value={value.title} name="title"
                               onChange={(event) => handleFieldChange(event, index)}/>
                        <input type="text" value={value.value} name="value"
                               onChange={(event) => handleFieldChange(event, index)}/>
                        <button onClick={() => handleDeleteFile(value.id, index)}>Delete</button>

                    </Fragment>
                })
            }
            {fields.length === 0 ? null : <label>Total = {parseFloat(total).toFixed(2)}</label>}
        </div>
        {mergeBranchConflictsSource.length > 0 && mergeBranchConflictsTarget.length > 0 ?
            <div id="conflicts">
                <>
                    {
                        mergeBranchConflictsSource.map(value => {
                            return <Fragment key={value.id}>
                                <label>
                                    {" New value - " + value.title}
                                </label>
                                <label>
                                    {" : " + value.value}
                                </label>
                                <input type="checkbox" onChange={(event) =>
                                    handleCheckboxMerge(event, value)}/>
                            </Fragment>
                        })
                    }
                    <br/>

                    {
                        mergeBranchConflictsTarget.map(value => {
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
                    <br/>
                    <button onClick={handleResolveConflicts}>Resolve Merge Conflicts</button>
                </>
            </div> : null
        }
        {commitNew.length > 0 && commitOld.length > 0 ?
            <div id="conflictsCommit">
                <>
                    {
                        commitNew.map(value => {
                            return <Fragment key={value.id}>
                                <label>
                                    {" New value - " + value.title}
                                </label>
                                <label>
                                    {" : " + value.value}
                                </label>
                                <input type="checkbox" onChange={(event) =>
                                    handleCheckboxCommit(event, value)}/>
                            </Fragment>
                        })
                    }
                    <br/>

                    {
                        commitOld.map(value => {
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
                    <br/>
                    <button onClick={handleResolveConflictsCommit}>Resolve Commit Conflicts</button>
                </>
            </div> : null
        }
    </>
}

export default File;

//TODO  If old values are selected replace fields with old values
//      MERGING branch doesnt save fields as well on current branch