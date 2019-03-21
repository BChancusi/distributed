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


    function handleTitleChange(event){

        if(event.target.value.length > event.target.maxLength){
            setNewReport(event.target.value.slice(0, event.target.maxLength))
        }else{
            setNewReport(event.target.value)
        }
    }
    async function handleNewReport(event) {
        event.preventDefault();

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
    }


    async function handleDeleteReport(reportId, key) {

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
    }


    async function handlePutReport(value, key) {

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
    }

    return (
        <>
            <header>
                <h1>Distributed Budgeting App</h1>
                <h3>Reports</h3>
            </header>
            <nav>
                {props.user.permission === 5 && <button onClick={() => props.setAdminOpen(true)}>Admin</button>}
                <button  onClick={() => {
                    localStorage.clear();
                    props.setLoggedInUser(null)
                }}>Logout
                </button>
            </nav>
            <div>
                <form onSubmit={handleNewReport}>
                    <label>New Report Title</label>
                    <input className="input-options" maxLength="50" type="text" value={newReport} ref={reportInput}
                           onChange={handleTitleChange} placeholder="E.g - Report 2019"/>
                    <button disabled={isLoading}>New report</button>
                </form>
            </div>
            <div className="content" id="reports">
                <div className="content-wrap">

                    {isLoading && reports.length === 0 ? <h2>Loading...</h2> :
                        reports.length > 0 ? (
                            <ul>
                                {
                                    reports.map((value, index) => {
                                        return <li key={value.id}>
                                            <input maxLength="50" type="text" defaultValue={value.title} id={`textInput${value.id}`}/>
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
    )
}

export default Reports;