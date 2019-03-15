import React, {useState, useEffect, useRef} from 'react';

function Reports(props) {

    const [reports, setReports] = useState([]);
    const [newReport, setNewReport] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const reportInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {

        async function fetchReports() {

            const response = await fetch('/API/reports', {signal});

            const result = await response.json();

            if (response.status !== 200) {
                throw Error(result.message)
            }

            setReports(result.express);
            setIsLoading(false)

        }

        fetchReports().catch(error => console.debug(error));

        return () => {
            controller.abort();
        }

    }, []);


    const handleNewReport = async () => {

        const trimmed = newReport.trim();

        if (trimmed === "") {
            setNewReport("");
            reportInput.current.style.border = "2px solid red";
            return;
        }

        setIsLoading(true);

        const response = await fetch('/API/reports', {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": trimmed})
        });

        if (response.status !== 200) {
            throw Error(response.status + "")
        }

        const result = await response.json();

        if (result.express === "already exists") {
            setIsLoading(false);
            reportInput.current.style.border = "2px solid red";
            return;
        }

        reportInput.current.style.border = "";
        setReports(reports.concat(result.express));
        setNewReport("");
        setIsLoading(false);
    };


    const handleDeleteReport = async (reportId, key) => {

        const response = await fetch(`/API/reports/${reportId}`, {
            signal,
            method: 'DELETE',
        });

        if (response.status !== 200) {
            throw Error(response.status.toString())
        }

        setReports(reports.filter((value, index) => {

            return key !== index;
        }));
    };


    const handlePutReport = async (value, key) => {

        let cloneReports = [...reports];

        cloneReports[key].title = value;

        const response = await fetch(`/API/reports/${cloneReports[key].id}`, {
            signal,
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": cloneReports[key].title})
        });

        if (response.status !== 200) {
            throw Error(response.status.toString())
        }

        setReports(cloneReports)
    };

    return <>
        <header>
            <h1>Reports</h1>
        </header>
        <nav>
            {props.user.permission === 5 && <button onClick={() => props.setAdminOpen(true)}>Admin</button>}
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedInUser(null)
            }}>Logout
            </button>
        </nav>
        <div>
            <label>New Report Title</label>
            <input type="text" value={newReport} ref={reportInput}
                   onChange={(event) => setNewReport(event.target.value)} placeholder="E.g - Report 2019"/>
            <button disabled={isLoading} onClick={handleNewReport}>New report</button>
        </div>
        <div className="content" id="reports">
            <div className="content-wrap">

                {isLoading ? <h2>Content loading....</h2> :
                    reports.length > 0 ? (
                        <ul>
                            {
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
                            }
                        </ul>
                    ) : <h2>No reports created</h2>
                }
            </div>
        </div>
    </>
}

export default Reports;