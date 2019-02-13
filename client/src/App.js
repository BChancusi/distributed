import React, {useState, useEffect, Fragment} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState("");
    const [newReport, setNewReport] = useState("");
    const [reportOpen, setReportOpen] = useState("");
    const filesRender = useFiles(reportOpen);


    useEffect(() => {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
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

    return filesRender === "" ? (
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
                            <li> {reports[key].title}</li>
                            <button onClick={() => handleDeleteReport(reports[key].id)}>Delete</button>
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

    const fileRender = useFile(fileOpen);

    useEffect(() => {
        if (report !== "") {

            getFiles(report.id)
                .then(res => setFiles(res.express))
                .catch(err => console.log(err));
        }
    }, [report.id]);

    const getFiles = async (reportId) => {

        const response = await fetch(`/files/${reportId}`);
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

    if (files === "") {
        return "";
    }


    return fileRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">{report.title} files</h1>
            </header>
            <nav>

                <button onClick={handleRefreshFiles}>Refresh Files</button>
                <input type="text" value={newFile} onChange={(event) => setNewFile(event.target.value)}/>
                <button onClick={handleNewFile}>New File</button>

                <button onClick={() => {
                    setFiles("")
                }}>Return
                </button>
            </nav>
            <div id={"files"}>
                <ul>
                    {
                        Object.keys(files).map((key) => {
                            return <Fragment key={files[key].id}>
                                <li> {files[key].title}</li>
                                <button onClick={() => setFileOpen(files[key])}>Open file</button>
                                <button onClick={() => handleDeleteFile(files[key].id)}>Delete</button>
                            </Fragment>
                        })
                    }
                </ul>
            </div>
        </>
    ) : (
        fileRender
    );
}

function useFile(file) {

    const [fields, setFields] = useState("");
    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [newFieldValue, setNewFieldValue] = useState(0);

    useEffect(() => {
        if (file !== "") {
            getFields(file.id)
                .then(res => setFields(res.express))
                .catch(err => console.log(err));
        }
    }, [file.id]);

    const getFields = async (fileId) => {

        const response = await fetch(`/fields/${fileId}`);
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
            body: JSON.stringify({"title": newFieldTitle, "value": newFieldValue, "file_id": file.id})
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

    function handlePutField(event, key){

        if(event.target.name === "title"){

            let cloneFields = [...fields];

            cloneFields[key].title = event.target.value;

            putField(cloneFields[key])
                .then(res => setFields(cloneFields))
                .catch(err => console.log(err));

        }else if(event.target.name === "value"){


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

    if (fields === "") {
        return "";
    }

    let total = 0;

    return (
        <>
            <header>
                <h1 align="CENTER">{file.title} fields</h1>
            </header>
            <nav>
                <button onClick={handleRefreshFields}>Refresh Fields</button>
                <input type="text" value={newFieldTitle} onChange={(event) => setNewFieldTitle(event.target.value)}/>
                <input type="text" value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)}/>
                <button onClick={handleNewField}>New Field</button>

                <button onClick={() => setFields("")}>Return</button>
            </nav>
            <div id={"fields"}>

                    {
                        Object.keys(fields).map((key) => {
                            total += fields[key].value;
                            return <Fragment key={fields[key].id}>

                                <input type="text" value={fields[key].title} name="title" onChange={(event) =>  {

                                    handlePutField(event, key)

                                }}/>
                                <input type="text" value={fields[key].value} name="value" onChange={(event) => {

                                    let cloneFields = [...fields];

                                    cloneFields[key].value = event.target.value;

                                    setFields(cloneFields);

                                }}/>


                                        <button onClick={() => handleDeleteFile(fields[key].id)}>Delete</button>


                            </Fragment>
                        })
                    }
                {fields.length === 0 ? null : <label>Total = {total}</label>}
            </div>
        </>
    );
}

export default App;

//TODO Cant select same file twice after return