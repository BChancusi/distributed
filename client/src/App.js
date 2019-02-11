import React, {useState, useEffect, Fragment} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState("");
    const [newReportTitle, setNewReportTitle] = useState("");
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
        postReport(newReportTitle).then(() => setNewReportTitle(""));

    }

    function handleDeleteReport(reportId) {
        deleteReport(reportId).then(() => setNewReportTitle(""));
    }

    return filesRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">Reports</h1>
            </header>
            <nav>
                <button onClick={handleRefreshReports}>Refresh reports</button>
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
                {/*<input onChange={reportTitleChange}/>*/}

            </div>
        </>
    ) : (
        filesRender
    );
}


function useFiles(reportId) {
    const [files, setFiles] = useState("");
    const [file, setFileId] = useState("");

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

    if (files === "") {
        return "";
    }


    return fileRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">{reportId} files</h1>
            </header>
            <nav>
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
                                {/*<button onClick={deleteReportBtn}>Delete</button>*/}
                                <button onClick={() => setFileId(files[key].id)}>Open file</button>
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