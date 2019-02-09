import React, {useState, useEffect, Fragment} from 'react';
import './App.css';

function App() {

    const [reports, setReports] = useState("");
    const [newReportTitle, setNewReportTitle] = useState("");

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


    function refreshReports() {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
    }

    function newReport() {
        postReport(newReportTitle).then(() => setNewReportTitle(""));

    }

    function reportTitleChange(event) {
        setNewReportTitle(event.target.value);
    }

    function deleteReportBtn() {
        deleteReport(newReportTitle).then(() => setNewReportTitle(""));
    }

    function openReportBtn(reportId) {
        console.debug("clicked");
        console.debug(reportId)


    }

    return (
        <div id={"reports"}>
            {
                Object.keys(reports).map((key) => {
                    return <Fragment key={reports[key].id}>
                        <li> {reports[key].title}</li>
                        <button onClick={deleteReportBtn}>Delete</button>
                        <button onClick={openReportBtn(reports[key].id)}>Open Report</button>
                    </Fragment>
                })
            }

            {/*<input onChange={reportTitleChange}/>*/}
            <button onClick={refreshReports}>Refresh reports</button>
            <button onClick={newReport}>New report</button>

        </div>
    );

}

function Files (reportId) {

    const [files, setFiles] = useState("");


    const getFiles = async (reportId) => {

        const response = await fetch(`/files/${reportId}`);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    useEffect(() => {
        // getFiles(reportId)
        //     .then(res => setReports(res.express))
        //     .catch(err => console.log(err));
    }, []);



    return (
        <div id={"files"}>
            {
                Object.keys(files).map((key) => {
                    return <Fragment key={files[key].id}>
                        <li> {files[key].title}</li>
                        {/*<button onClick={deleteReportBtn}>Delete</button>*/}
                        {/*<button onClick={openReportBtn(reports[key].id)}>Open Report</button>*/}
                    </Fragment>
                })
            }

            {/*<input onChange={reportTitleChange}/>*/}
            {/*<button onClick={newFiles}>New report</button>*/}

        </div>
    );
}

export default App;