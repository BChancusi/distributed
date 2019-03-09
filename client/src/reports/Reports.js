import React, {useState, useEffect, useRef} from 'react';

function Reports(props) {

    const [reports, setReports] = useState([]);
    const [newReport, setNewReport] = useState("");

    const reportInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        getReports()
            .then(res => setReports(res.express))
            .catch(err => console.log(err));

        return () => {
            controller.abort();
        }

    }, []);

    const getReports = async () => {

        const response = await fetch('/reports', {signal});
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    const handleNewReport = async () => {

        const trimmed = newReport.trim();
        if (trimmed !== "") {

            const response = await fetch('/reports', {
                signal,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"title": trimmed})
            });

            await response.json().then(body => {

                if (response.status !== 200) {
                    throw Error(body.message)
                }

                if (body.express === "already exists") {
                    reportInput.current.style.border = "2px solid red";

                } else {

                    reportInput.current.style.border = "";
                    setReports(reports.concat(body.express));
                    setNewReport("")
                }
            });
        }else{

            setNewReport("");
            reportInput.current.style.border = "2px solid red";
        }
    };


    const handleDeleteReport = async (reportId, key) => {

        await fetch(`/reports/${reportId}`, {
            signal,
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
            signal,
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
        <div>
            <label>New Report Title</label>
            <input type="text" value={newReport} ref={reportInput}
                   onChange={(event) => setNewReport(event.target.value)} placeholder="E.g - Report 2019"/>
            <button onClick={handleNewReport}>New report</button>
        </div>
        <div id={"reports"}>
            <ul>
            {
                reports.length > 0 ? (
                reports.map((value, index) => {
                    return <li key={value.id}>
                        <input type="text" defaultValue={value.title} id={`textInput${value.id}`}/>
                        <button onClick={() => props.setReportOpen(value)}>Open Report</button>
                        <button
                            onClick={() => handlePutReport(document.getElementById(`textInput${value.id}`).value, index)}>Update
                            report title
                        </button>
                        <button onClick={() => handleDeleteReport(value.id, index)}>Delete</button>
                    </li>
                })
                ) : <h2>No reports created</h2>
            }
            </ul>
        </div>
    </>
}

export default Reports;