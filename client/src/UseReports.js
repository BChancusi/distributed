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

    function handleRefreshReports() {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));
    }

    function handleNewReport() {
        postReport(newReport).then(res =>{

            setReports(reports.concat(res.express));
            setNewReport("")
        });
    }

    const postReport = async (title) => {

        const response = await fetch('/reports', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": title})
        });

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };


    const handleDeleteReport = async (reportId, key) => {

        await fetch(`/reports/${reportId}`, {
            method: 'DELETE',
        }).then(response => {

            if (response.status !== 200) {
                throw Error("Server error")
            }

            setReports(reports.filter((value, index) =>{

                return key !== index.toString();
            }));
        });
    };


   const handlePutReport = async (event, key) => {

        let cloneReports = [...reports];

        cloneReports[key].title = event.target.value;

        await fetch(`/reports/${cloneReports[key].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": cloneReports[key].title})
        }).then(response => {

            if (response.status !== 200) {
                throw Error("Server error")
            }

            setReports(cloneReports)
        });
    };


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