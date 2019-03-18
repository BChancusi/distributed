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

    const [isLoading, setIsLoading] = useState(true);

    const fieldTitleInput = useRef(null);
    const branchTitleInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {

        async function fetchFields() {
            setIsLoading(true);

            const response = await fetch(encodeURI(`API/fields?report_id=${props.file.report_id}
            &branch_title=${currentBranch}&title=${props.file.title}&file_id=${props.file.id}`), {signal});

            const result = await response.json();

            if (response.status !== 200) {
                throw Error(result.message)
            }

            setFields(result.fields);
            setFileTitles(result.fileTitles);

            setIsLoading(false)
        }

        fetchFields().catch(error => console.debug(error));

        return () => {
            controller.abort();
        }

    }, [props.file.id, currentBranch]);

    useEffect(() => {
        return () => {
            controller.abort();
        }

    }, []);

    async function handleNewField() {
        if (newFieldTitle.trim() === "") {
            fieldTitleInput.current.style.border = "2px solid red";
            return;
        }

        setIsLoading(true);

        const response = await fetch('/API/fields', {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "title": newFieldTitle.trim(),
                "value": newFieldValue !== "" ? newFieldValue : 0,
                "file_id": props.file.id,
                "branch_title": currentBranch
            })
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.body)
        }

        if (result.express === "already exists") {
            setIsLoading(false);
            fieldTitleInput.current.style.border = "2px solid red";
            return;
        }

        fieldTitleInput.current.style.border = "";
        setFields(fields.concat(result.express));
        setNewFieldTitle("");
        setNewFieldValue("");
        setIsLoading(false);
    }


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

    async function handlePutFields() {

        const response = await fetch(`/API/fields`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.message)
        }

        if (result.express !== "no conflicts") {
            setCommitNew(result.conflictsNew);
            setCommitOld(result.conflictsOld);
        }

    }

    async function handleDeleteFile(fieldId, key) {

        const response = await fetch(`/API/fields/${fieldId}`, {
            signal,
            method: 'DELETE',
        });

        if (response.status !== 200) {
            throw Error(response.status.toString())
        }

        setFields(fields.filter((value, index) => {

            return key !== index;
        }));
    }

    async function handleDeleteBranch() {

        const response = await fetch(`/API/fields/deleteBranch/query?branch_title=${currentBranch}&file_id=${props.file.id}&title=${props.file.title}`, {
            signal,
            method: 'DELETE',
        });

        if (response.status !== 200) {
            throw Error(response.status + "")
        }

        setFileTitles(fileTitles.filter(value => {
            return value.branch_title !== currentBranch;
        }));

        setCurrentBranch("master");

    }

    async function handleNewBranch() {

        const newBranchTrimmed = newBranchTitle.trim();

        if (newBranchTrimmed === "") {
            branchTitleInput.current.style.border = "2px solid red";
        }

        setIsLoading(true);

        let cloneFields = [...fields];
        cloneFields.push(props.file);

        const response = await fetch(`/API/fields/branch/${newBranchTrimmed}`, {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cloneFields)
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.message)
        }

        if (result.express === "already exists") {
            setIsLoading(false);
            branchTitleInput.current.style.border = "2px solid red";
        } else {
            branchTitleInput.current.style.border = "";
            setFileTitles(fileTitles.concat(result.express));
            setNewBranchTitle("");
            setCurrentBranch(newBranchTrimmed);
            setIsLoading(false);
        }
    }

    async function handleMergeBranch() {

        setIsLoading(true);

        const response = await fetch(`/API/fields/mergeBranch/${(document.getElementById("selectMerge").value)}`, {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.message)
        }

        if (result.express !== "no conflicts") {
            setMergeNew(result.conflictsSource);
            setMergeOld(result.conflictsTarget);
        }

        setIsLoading(false);

    }

    async function handleResolveConflicts() {

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

        const response = await fetch(`/API/fields/mergeResolved/${(document.getElementById("selectMerge").value)}`, {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(resolved)
        });

        if (response.status !== 200) {
            throw Error(response.status + "")
        }

        setMergeOld([]);
        setMergeNew([]);
        setMergeResolved([]);
    }


    function handleCheckbox(event, item) {

        if (event.target.name === "merge") {
            if (event.target.checked === true) {

                let cloneResolved = [...mergeResolved];

                cloneResolved.push(item);
                setMergeResolved(cloneResolved)

            } else {

                setMergeResolved(mergeResolved.filter(filterItem => {

                    return filterItem !== item
                }))

            }

        } else {
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

    async function handleResolveConflictsCommit() {

        if (commitResolved.length > 0) {
            const response = await fetch(`/API/fields/commitResolved`, {
                signal,
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(commitResolved)
            });


            if (response.status !== 200) {
                throw Error(response.status + "")
            }

            setCommitOld([]);
            setCommitNew([]);
            setCommitResolved([]);
        }
    }

    let total = 0;

    return (
        <>

            <header>
                <h1>{props.report.title + "\\" + props.file.title + "\\" + currentBranch}</h1>
            </header>
            <nav>
                {props.user.permission === 5 && <button onClick={() => props.setAdminOpen(true)}>Admin</button>}
                <button onClick={() => props.setFileOpen("")}>Return</button>
                <button onClick={() => {
                    localStorage.clear();
                    props.setLoggedInUser(null)
                }}>Logout
                </button>
            </nav>

            <div id="options">
                <ul>
                    <li>
                        <label>New Branch Title</label>
                        <input type="text" value={newBranchTitle} ref={branchTitleInput}
                               onChange={(event) => setNewBranchTitle(event.target.value)}
                               placeholder="E.g - version 2"/>
                        <button disabled={isLoading} onClick={handleNewBranch}>New Branch</button>
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
                                <button disabled={isLoading} onClick={handleDeleteBranch}>Delete Current Branch</button>
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
                                <button disabled={isLoading} onClick={handleMergeBranch}>Merge Branch target</button>
                            </>
                            : null}

                    </li>

                    <li>

                        <label>New Field Title</label>
                        <input type="text" ref={fieldTitleInput} placeholder="E.g computer equipment"
                               value={newFieldTitle} onChange={(event) => setNewFieldTitle(event.target.value)}/>

                        <label>New Field Amount </label>
                        <input type="number" value={newFieldValue} placeholder="E.g 1250.99" onChange={(event) => {
                            setNewFieldValue(event.target.value);
                        }}/>
                        <button disabled={isLoading} onClick={handleNewField}>New Field</button>
                    </li>

                </ul>
            </div>
            <div className="content">
                <div className="content-wrap">
                    {isLoading ? <h2>Loading...</h2> :
                        fields.length > 0 ? (
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
                                                <button onClick={() => handleDeleteFile(value.id, index)}>Delete
                                                </button>
                                            </li>
                                        })
                                    }
                                </ul>

                                <label>Total = {parseFloat(total).toFixed(2)}</label>
                                <button onClick={handlePutFields}>Save Changes</button>
                            </div>
                        ) : <h2>No fields created</h2>

                    }
                </div>
            </div>

            {mergeNew.length > 0 && mergeOld.length > 0 &&
            <div id="conflictsMerge">
                <div className="content-wrap">
                    <Conflicts source={mergeNew} target={mergeOld} name="merge" event={handleCheckbox}/>
                    <button onClick={handleResolveConflicts}>Confirm Field Replacement</button>
                </div>
            </div>
            }
            {commitNew.length > 0 && commitOld.length > 0 &&
            <div id="conflictsCommit">
                <div className="content-wrap">
                    <Conflicts source={commitNew} target={commitOld} name="commit" event={handleCheckbox}/>
                    <button onClick={handleResolveConflictsCommit}>Confirm Save Changes</button>
                </div>
            </div>
            }
        </>
    );
}

export default File;

//TODO  If old values are selected replace fields with old values
//      MERGING branch doesnt save fields as well on current branch
//      Deep prevent non number
//      Prevent merge button being spammed
//      Clear save conflicts when attempting to merge without confirming
//      Merge Warning: Each child in a list should have a unique "key" prop.
//      Confirm conflicts button not working if no values selected