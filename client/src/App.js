import React, {useState, useEffect, Fragment} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState(null);
    const [newReport, setNewReport] = useState("");
    const [reportOpen, setReportOpen] = useState("");
    const filesRender = useFiles(reportOpen);

    useEffect(() => {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));

        return () => console.debug("unmounting REPORT")
    }, []);

    const getReports = async () => {

        const response = await fetch('/reports');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    const postReport = async (title) => {

        await fetch('/reports', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": title})
        });
    };

    const deleteReport = async (reportId) => {

        await fetch(`/reports/${reportId}`, {
            method: 'DELETE',
        });
    };


    function handleRefreshReports() {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
    }

    function handleNewReport() {
        postReport(newReport).then(() => setNewReport(""));

    }

    function handleDeleteReport(reportId) {
        deleteReport(reportId).then(() => setNewReport(""));
    }

    const putReport = async (report) => {

        await fetch(`/reports/${report.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": report.title})
        });

        return null;
    };

    function handlePutReport(event, key) {

        let cloneReports = [...reports];

        cloneReports[key].title = event.target.value;

        putReport(cloneReports[key])
            .then(res => setReports(cloneReports))
            .catch(err => console.log(err));
    }

    return filesRender === "" && reports != null ? (
        <>
            <header>
                <h1 align="CENTER">Reports</h1>
            </header>
            <nav>
                <button onClick={handleRefreshReports}>Refresh reports</button>
                <input type="text" value={newReport} onChange={(event) => setNewReport(event.target.value)}/>
                <button onClick={handleNewReport}>New report</button>
            </nav>


            <div id={"reports"}>
                {
                    Object.keys(reports).map((key) => {
                        return <Fragment key={reports[key].id}>
                            <input type="text" value={reports[key].title}
                                   onChange={(event) => handlePutReport(event, key)}/>
                            {/*<button onClick={() => handleDeleteReport(reports[key].id)}>Delete</button>*/}
                            <button onClick={() => setReportOpen(reports[key])}>Open Report</button>
                        </Fragment>
                    })
                }

            </div>
        </>
    ) : (
        filesRender
    );
}


function useFiles(report) {

    const [files, setFiles] = useState("");
    const [fileOpen, setFileOpen] = useState("");
    const [newFile, setNewFile] = useState("");
    const [fileFields, setFileFields] = useState("");

    const fileRender = useFile(fileOpen);

    useEffect(() => {
        if (report !== "") {


            getFiles(report.id)
                .then(res => {

                    setFiles(res.express);
                    return res.express
                })

                .then(files => {

                    let keyArray = [];

                    Object.keys(files).map((key) => {
                        keyArray.push(files[key].id);
                        return null;
                    });

                    return keyArray

                })
                .then(keyArray => {

                    getFields(keyArray)
                        .then(res => setFileFields(res.express))
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        }
        return () => console.debug("unmounting F I L E S")


    }, [report.id]);

    const getFields = async (keys) => {

        let idsURL = "";

        for (let i = 0; i < keys.length; i++) {
            if (i !== keys.length - 1) {
                idsURL += keys[i] + "+"
            } else if (keys.length - 1 === i) {
                idsURL += keys[i]
            }
        }
        idsURL += "+master";

        const response = await fetch(`/fields/file/${idsURL}`);

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const getFiles = async (reportId) => {


        let fetchUrl = encodeURI(`/files/branch?report_id=${reportId}&branch_title=master`);

        const response = await fetch(fetchUrl);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const postFile = async (title) => {

        await fetch('/files', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": title, "report_id": report.id})
        });
    };

    const deleteFile = async (fileId) => {

        await fetch(`/files/${fileId}`, {
            method: 'DELETE',
        });
    };


    function handleRefreshFiles() {
        getFiles(report.id)
            .then(res => setFiles(res.express))
            .catch(err => console.log(err));
    }


    function handleNewFile() {
        postFile(newFile).then(() => null);
    }

    function handleDeleteFile(fileId) {
        deleteFile(fileId).then(() => null);
    }

    const putFile = async (file) => {

        await fetch(`/files/${file.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": file.title})
        });

        return null;
    };

    function handlePutFile(event, key) {

        let cloneFiles = [...files];

        cloneFiles[key].title = event.target.value;

        putFile(cloneFiles[key])
            .then(res => setFiles(cloneFiles))
            .catch(err => console.log(err));
    }

    if (files === "") {
        return "";
    }

    let total = 0;

    return fileRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">{report.title}</h1>
            </header>
            <nav>

                <button onClick={handleRefreshFiles}>Refresh Files</button>
                <input type="text" value={newFile} onChange={(event) => setNewFile(event.target.value)}/>
                <button onClick={handleNewFile}>New File</button>

                <button onClick={() => {
                    setFiles("");
                }}>Return
                </button>
            </nav>
            <div id={"files"}>
                {
                    Object.keys(files).map((key) => {
                        return <Fragment key={files[key].id}>
                            <input type="text" value={files[key].title}
                                   onChange={(event) => handlePutFile(event, key)}/>
                            <button onClick={() => setFileOpen(files[key])}>Open file</button>
                            <button onClick={() => handleDeleteFile(files[key].id)}>Delete</button>
                        </Fragment>
                    })
                }
                {
                    Object.keys(fileFields).map((key) => {

                        total += fileFields[key].value;

                        return <Fragment key={fileFields[key].id}>
                            <label>{fileFields[key].title}</label>
                            <br></br>
                            <label>{fileFields[key].value}</label>
                            <br></br>

                        </Fragment>
                    })
                }
                <label>Total = {total}</label>
            </div>

        </>
    ) : (
        fileRender
    );
}

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

        return () => console.debug("unmounting FILE")

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
                .then(res => setFields(cloneFields))
                .catch(err => console.log(err));

        } else if (event.target.name === "value") {


            let cloneFields = [...fields];

            cloneFields[key].value = event.target.value;

            putField(cloneFields[key])
                .then(res => setFields(cloneFields))
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
            setMergeBranchConflictsSource(res.conflictsSource);
            setMergeBranchConflictsTarget(res.conflictsTarget);
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

            if(boolean === false) {
                fields[i].branch_title = mergeBranch;
                delete fields[i].timestamp;
                delete fields[i].id;


                mergeResolved.push(fields[i]);
            }
        }

        postMergeResolved(mergeResolved)

    }

    const postMergeResolved = async (mergeResolved) => {

        const response = await fetch(`/fields/mergeResolved/${mergeBranch}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(mergeResolved)
        });

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;

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
                                        return;
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
                    Object.keys(fields).map((key) => {
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
            {mergeBranchConflictsSource.length > 0 ?
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
                        <br></br>

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

export default App;

//TODO Cant select same file twice after return
//      Merge branch initial being sent instead of target
//      Prevent counter part check box being ticked