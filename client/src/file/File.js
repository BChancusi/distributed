import React, {useState, useEffect, useRef} from 'react';
import Conflicts from "./Conflicts";

function File(props) {

    const [fields, setFields] = useState([]);
    const [currentBranch, setCurrentBranch] = useState("master");

    const [mergeNew, setMergeNew] = useState([]);
    const [mergeOld, setMergeOld] = useState([]);
    const [mergeResolved, setMergeResolved] = useState([]);

    const [commitNew, setCommitNew] = useState([]);
    const [commitOld, setCommitOld] = useState([]);
    const [commitResolved, setCommitResolved] = useState([]);

    const [fileTitles, setFileTitles] = useState("master");

    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");
    const [newBranchTitle, setNewBranchTitle] = useState("");

    const fieldTitleInput = useRef(null);
    const branchTitleInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;


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
            controller.abort();
        }

    }, []);


    const getFields = async () => {

        let fetchUrl =
            `/fields?report_id=${props.file.report_id}&branch_title=${currentBranch}&title=${props.file.title}&file_id=${props.file.id}`;

        const response = await fetch(encodeURI(fetchUrl), {signal});
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    function handleNewField() {
        if (newFieldValue.trim() !== "") {
            postField()
                .then(res => {

                    if (res.express === "already exists") {
                        fieldTitleInput.current.style.border = "2px solid red";
                    } else {
                        fieldTitleInput.current.style.border = "";
                        setFields(fields.concat(res.express));
                        setNewFieldTitle("");
                        setNewFieldValue("");
                    }
                })
                .catch(err => console.log(err));
        } else {
            fieldTitleInput.current.style.border = "2px solid red";
        }
    }

    const postField = async () => {

        const response = await fetch('/fields', {
            signal,
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
            signal,
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
            signal,
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

        const newBranchTrimmed = newBranchTitle.trim();

        if (newBranchTrimmed !== "") {
            postBranch(newBranchTrimmed).then(res => {

                if (res.express === "already exists") {

                    branchTitleInput.current.style.border = "2px solid red";
                } else {
                    branchTitleInput.current.style.border = "";
                    setFileTitles(fileTitles.concat(res.express));
                    setNewBranchTitle("");
                    setCurrentBranch(newBranchTrimmed);
                }
            });
        } else {
            branchTitleInput.current.style.border = "2px solid red";
        }
    }

    const postBranch = async (newBranchTrimmed) => {

        let cloneFields = [...fields];
        cloneFields.push(props.file);

        const response = await fetch(`/fields/branch/${newBranchTrimmed}`, {
            signal,
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
                setMergeNew(res.conflictsSource);
                setMergeOld(res.conflictsTarget);
            }
        })
            .catch(err => console.log(err));

    }

    const postMergeBranch = async () => {

        const response = await fetch(`/fields/mergeBranch/${(document.getElementById("selectMerge").value)}`, {
            signal,
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

        let resolved = [];

        let cloneMerge = [...mergeResolved];

        for (let i = 0; i < fields.length; i++) {

            let boolean = false;

            for (let j = 0; j < cloneMerge.length; j++) {

                if (fields[i].title === cloneMerge[j].title) {

                    cloneMerge[j].branch_title = (document.getElementById("selectMerge").value);
                    delete cloneMerge[j].timestamp;
                    delete cloneMerge[j].id;
                    resolved.push(cloneMerge[j]);
                    boolean = true;
                    break;
                }
            }

            for (let k = 0; k < mergeOld.length && boolean === false; k++) {

                if (mergeOld[k].title === fields[i].title) {

                    boolean = true;
                    break;
                }
            }

            if (boolean === false) {
                let cloneFields = JSON.parse(JSON.stringify(fields));

                cloneFields[i].branch_title = (document.getElementById("selectMerge").value);
                delete cloneFields[i].timestamp;
                delete cloneFields[i].id;

                resolved.push(cloneFields[i]);
            }
        }
        postMergeResolved(resolved).then(() => {
            setMergeOld([]);
            setMergeNew([]);
            setMergeResolved([]);
        })
    }

    const postMergeResolved = async (mergeResolved) => {

        await fetch(`/fields/mergeResolved/${(document.getElementById("selectMerge").value)}`, {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(mergeResolved)
        });

        return null;
    };

    function handleCheckbox(event, item) {

        if(event.target.name === "merge"){
            if (event.target.checked === true) {

                let cloneResolved = [...mergeResolved];

                cloneResolved.push(item);
                setMergeResolved(cloneResolved)

            } else {

                setMergeResolved(mergeResolved.filter(filterItem => {

                    return filterItem !== item
                }))

            }

        }else{
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
                signal,
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(commitResolved)
            });
        }

        return null;
    };

    let total = 0;

    return <>
        <div id="options">
            <ul>
                <li>
                <label>New Branch Title</label>
                <input type="text" value={newBranchTitle} ref={branchTitleInput}
                       onChange={(event) => setNewBranchTitle(event.target.value)} placeholder="E.g - version 2"/>
                <button onClick={handleNewBranch}>New Branch</button>
                </li>
            <li>
                <label>Current Branch</label>
                <select value={currentBranch} onChange={(event) => setCurrentBranch(event.target.value)}>
                        {
                            Array.isArray(fileTitles) ?
                                fileTitles.map(value => {

                                    return <option key={value.id}
                                                   value={value.branch_title}>{value.branch_title}</option>
                                })
                                : null
                        }
                </select>
                {Array.isArray(fileTitles) && fileTitles.length > 1 && currentBranch !== "master" ?
                    <>
                        <button onClick={handleDeleteBranch}>Delete Current Branch</button>
                        <label>Merge Branch</label>
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

            </li>

                <li>

                <label>New Field Title</label>
                <input type="text" ref={fieldTitleInput} placeholder="E.g computer equipment"
                       value={newFieldTitle} onChange={(event) => setNewFieldTitle(event.target.value)}/>

                <label>New Field Amount            </label>
                <input type="number" value={newFieldValue} placeholder="E.g 1250.99" onChange={(event) => {
                    setNewFieldValue(event.target.value);
                }}/>
                <button onClick={handleNewField}>New Field</button>
                </li>

            </ul>
        </div>

        {fields.length > 0 ? (
            <div id="fields">
                <ul>
                {
                    fields.map((value, index) => {

                        if (!isNaN(parseFloat(value.value))) {
                            total += parseFloat(parseFloat(value.value).toFixed(2));
                        }

                        return <li key={value.id}>
                            <input type="text" value={value.title} name="title"
                                   onChange={(event) => handleFieldChange(event, index)}/>
                            <input type="number" value={value.value} name="value"
                                   onChange={(event) => handleFieldChange(event, index)}/>
                            <button onClick={() => handleDeleteFile(value.id, index)}>Delete</button>
                        </li>
                    })
                }
                    </ul>

                    <label>Total = {parseFloat(total).toFixed(2)}</label>
                <button onClick={handlePutFields}>Save Changes</button>
            </div>
        ) : <h2>No fields created</h2>

        }
        {mergeNew.length > 0 && mergeOld.length > 0 &&
        <div id="conflictsMerge">

            <Conflicts source={mergeNew} target={mergeOld} name="merge" event={handleCheckbox}/>
            <button onClick={handleResolveConflicts}>Confirm Merge Changes</button>

        </div>
        }
        {commitNew.length > 0 && commitOld.length > 0 &&
        <div id="conflictsCommit">
            <Conflicts source={commitNew} target={commitOld} name="commit" event={handleCheckbox}/>
            <button onClick={handleResolveConflictsCommit}>Confirm Save Changes</button>
        </div>
        }
    </>
}

export default File;

//TODO  If old values are selected replace fields with old values
//      MERGING branch doesnt save fields as well on current branch
//      Deep prevent non number