import React, {useState, useEffect, Fragment} from 'react';
import useFiles from "./UseFiles";

function useReports() {

    const [reports, setReports] = useState([]);
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

    function handleDeleteReport(reportId, key) {
        deleteReport(reportId).then(() => setReports(reports.splice(key, 1)));
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
            .then(() => setReports(cloneReports))
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
                            <button onClick={() => handleDeleteReport(reports[key].id, key)}>Delete</button>
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

export default useReports ;