import React, {useState, useEffect, Fragment} from 'react';

function Reports(props) {

    const [reports, setReports] = useState([]);
    const [newReport, setNewReport] = useState("");

    useEffect(() => {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));

        return () => {
            setReports(null);
            setNewReport(null);
        }

    }, []);

    const getReports = async () => {

        const response = await fetch('/reports');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    const handleNewReport = async () => {

        if (newReport.trim() === "") {
            setNewReport("");
            return;
        }

        const response = await fetch('/reports', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": newReport})
        });

        await response.json().then(body => {

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
                throw Error(response.status.toString())
            }

            setReports(reports.filter((value, index) => {

                return key !== index;
            }));
        });
    };


    const handlePutReport = async (value, key) => {

        let cloneReports = [...reports];

        cloneReports[key].title = value;

        await fetch(`/reports/${cloneReports[key].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": cloneReports[key].title})
        }).then(response => {

            if (response.status !== 200) {
                throw Error(response.status.toString())
            }

            setReports(cloneReports)
        });
    };

    return <>
        <header>
            <h1 align="CENTER">Reports</h1>
        </header>

        <nav>
            <input type="text" value={newReport} onChange={(event) => setNewReport(event.target.value)}/>
            <button onClick={handleNewReport}>New report</button>
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedIn(null)

            }}>Logout
            </button>
        </nav>

        <div id={"reports"}>
            {
                reports.map((value, index) => {
                    return <Fragment key={value.id}>
                        <input type="text" defaultValue={value.title} id={`textInput${value.id}`}/>
                        <button
                            onClick={() => handlePutReport(document.getElementById(`textInput${value.id}`).value, index)}>Update
                            report title
                        </button>
                        <button onClick={() => handleDeleteReport(value.id, index)}>Delete</button>
                        <button onClick={() => props.setReportOpen(value)}>Open Report</button>
                    </Fragment>
                })
            }

        </div>
    </>
}

export default Reports;