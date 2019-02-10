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

    const deleteReport = async (reportTitle) => {

        await fetch(`/reports/${reportTitle}`, {
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

    function handleDeleteReport() {
        deleteReport(newReportTitle).then(() => setNewReportTitle(""));
    }

    return filesRender === "" ? (
        <div id={"reports"}>
            {
                Object.keys(reports).map((key) => {
                    return <Fragment key={reports[key].id}>
                        <li> {reports[key].title}</li>
                        <button onClick={handleDeleteReport}>Delete</button>
                        <button onClick={() => setReportId(10)}>Open Report</button>
                    </Fragment>
                })
            }

            {/*<input onChange={reportTitleChange}/>*/}
            <button onClick={handleRefreshReports}>Refresh reports</button>
            <button onClick={handleNewReport}>New report</button>

        </div>
    ) : (
        filesRender
    );
}


function useFiles(reportId) {
    const [files, setFiles] = useState("");
    const [file, setFileId] = useState("");

    const fileRender = useFile(file);

    useEffect(() => {
        if(reportId !== "") {

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

    if(reportId === ""){
        return "";
    }

    return  fileRender === "" ? (
        <div id={"files"}>
            {
                Object.keys(files).map((key) => {
                    return <Fragment key={files[key].id}>
                        <li> {files[key].title}</li>
                        {/*<button onClick={deleteReportBtn}>Delete</button>*/}
                        <button onClick={() => setFileId(23)}>Open file</button>
                    </Fragment>
                })
            }

            {/*<input onChange={reportTitleChange}/>*/}
            {/*<button onClick={newFiles}>New report</button>*/}

        </div>

    ) : (
        fileRender
    );
}

function useFile(fileId) {

    const [fields, setFields] = useState("");

    useEffect(() => {
        if(fileId !== ""){

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

    if(fileId === ""){
        return "";
    }

    return (
        <div id={"fields"}>
            <table>
                <tbody>
                {
                    Object.keys(fields).map((key) => {
                        return <Fragment key={fields[key].id}>
                            <tr>
                                <td>{fields[key].title}</td>
                                <td>{fields[key].value}</td>
                            </tr>
                            {/*<button onClick={deleteReportBtn}>Delete</button>*/}
                            {/*<button onClick={openReportBtn(reports[key].id)}>Open Report</button>*/}
                        </Fragment>
                    })
                }
                </tbody>
            </table>
            {/*<input onChange={reportTitleChange}/>*/}
            {/*<button onClick={newFiles}>New report</button>*/}
        </div>
    );
}

export default App;