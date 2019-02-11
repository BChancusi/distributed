import React, {useState, useEffect, Fragment} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState("");
    const [newReport, setNewReport] = useState("");
    const [reportId, setReportId] = useState("");

    const filesRender = useFiles(reportId);


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
                <input onChange={(event) => setNewReport(event.target.value)}/>
                <button onClick={handleNewReport}>New report</button>
            </nav>


            <div id={"reports"}>
                {
                    Object.keys(reports).map((key) => {
                        return <Fragment key={reports[key].id}>
                            <li> {reports[key].title}</li>
                            <button onClick={() => handleDeleteReport(reports[key].id)}>Delete</button>
                            <button onClick={() => setReportId(reports[key].id)}>Open Report</button>
                        </Fragment>
                    })
                }

            </div>
        </>
    ) : (
        filesRender
    );
}


function useFiles(reportId) {

    const [files, setFiles] = useState("");
    const [file, setFileId] = useState("");
    const [newFile, setNewFile] = useState("");

    const fileRender = useFile(file);

    useEffect(() => {
        if (reportId !== "") {

            getFiles(reportId)
                .then(res => setFiles(res.express))
                .catch(err => console.log(err));
        }
    }, [reportId]);

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
            body: JSON.stringify({"title": title, "report_id": reportId})
        });
    };

    const deleteFile = async (fileId) => {

        await fetch(`/files/${fileId}`, {
            method: 'DELETE',
        });
    };


    function handleRefreshFiles() {
        getFiles(reportId)
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
                <h1 align="CENTER">{reportId} files</h1>
            </header>
            <nav>

                <button onClick={handleRefreshFiles}>Refresh Files</button>
                <input onChange={(event) => setNewFile(event.target.value)}/>
                <button onClick={handleNewFile}>New File</button>

                <button onClick={() => {
                    setFiles("");
                    setFileId("");
                }}>Return
                </button>
            </nav>
            <div id={"files"}>
                <ul>
                    {
                        Object.keys(files).map((key) => {
                            return <Fragment key={files[key].id}>
                                <li> {files[key].title}</li>
                                <button onClick={() => setFileId(files[key].id)}>Open file</button>
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

function useFile(fileId) {

    const [fields, setFields] = useState("");
    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");

    useEffect(() => {
        if (fileId !== "") {

            getFields(fileId)
                .then(res => setFields(res.express))
                .catch(err => console.log(err));
        }
    }, [fileId]);

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
            body: JSON.stringify({"title": newFieldTitle, "value": newFieldValue, "file_id": fileId})
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


    function handleRefreshFields() {
        getFields(fileId)
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
                <h1 align="CENTER">{fileId} fields</h1>
            </header>
            <nav>
                <button onClick={handleRefreshFields}>Refresh Fields</button>
                <input onChange={(event) => setNewFieldTitle(event.target.value)}/>
                <input onChange={(event) => setNewFieldValue(event.target.value)}/>
                <button onClick={handleNewField}>New Field</button>

                <button onClick={() => setFields("")}>Return</button>
            </nav>
            <div id={"fields"}>
                <table>
                    <tbody>
                    {
                        Object.keys(fields).map((key) => {
                            total += fields[key].value;
                            return <Fragment key={fields[key].id}>
                                <tr>
                                    <td>{fields[key].title}</td>
                                    <td>{fields[key].value}</td>
                                    <td>
                                        <button onClick={() => handleDeleteFile(fields[key].id)}>Delete</button>
                                    </td>
                                </tr>
                            </Fragment>
                        })
                    }
                    </tbody>
                </table>
                {fields.length === 0 ? null : <label>Total = {total}</label>}
            </div>
        </>
    );
}

export default App;

//TODO Cant select same file twice after return