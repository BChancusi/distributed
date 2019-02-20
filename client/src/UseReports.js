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

    const handleNewReport = async () => {

        if(newReport.trim() === ""){
            setNewReport("");
            return;
        }

        const response = await fetch('/reports', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": newReport})
        });

        await response.json().then(body =>{

            if (response.status !== 200) {
                throw Error(body.message)
            }

            setReports(reports.concat(body.express));
            setNewReport("")
        });
    };


    const handleDeleteReport = async (reportId, key) => {

        await fetch(`/reports/${reportId}`, {
            method: 'DELETE',
        }).then(response => {

            if (response.status !== 200) {
                throw Error("Server error")
            }

            setReports(reports.filter((value, index) => {

                return key !== index;
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

    return filesRender === true ? (
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
                    reports.map((value, index) => {
                        return <Fragment key={value.id}>
                            <input type="text" value={value.title}
                                   onChange={(event) => handlePutReport(event, index)}/>
                            <button onClick={() => handleDeleteReport(value.id, index)}>Delete</button>
                            <button onClick={() => setReportOpen(value)}>Open Report</button>
                        </Fragment>
                    })
                }

            </div>
        </>
    ) : (
        filesRender
    );
}

export default useReports;