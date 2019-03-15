import React, {useState, useEffect, useRef} from 'react';

function Files(props) {

    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState("");
    const [fileFields, setFileFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fileInput = useRef(null);

    const controller = new AbortController();
    const signal = controller.signal;

    useEffect(() => {
        getFiles(props.report.id)
            .then(res => {

                setFiles(res.express);
                return res.express
            })
            .then((resFiles) => {

                getFields(resFiles)
                    .then(res => setFileFields(res.express))
                    .then(()=> setIsLoading(false))
                    .catch(err => console.log(err));
                //TODO catch and ignore aborted error
            })
            .catch(err => console.log(err));

        return () => {
            controller.abort();
        }
    }, []);

    const getFields = async (resFiles) => {
//TODO change +master to query

        let idsURL = "";

        resFiles.forEach(value => {
            idsURL += value.id + "+"
        });

        if (idsURL === "") {
            idsURL += "+master";
        } else {
            idsURL += "master";
        }

        const response = await fetch(`/API/fields/file/${idsURL}`, {signal});

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const getFiles = async (reportId) => {

        const response = await fetch(encodeURI(`/API/files/branch?report_id=${reportId}&branch_title=master`), {signal});
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;
    };

    const handleNewFile = async () => {

        const fileTrimmed = newFile.trim();

        if (fileTrimmed === "") {
            setNewFile("");
            fileInput.current.style.border = "2px solid red";
            return
        }

        setIsLoading(true);

        const response = await fetch('/API/files', {
            signal,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": fileTrimmed, "report_id": props.report.id})
        });

        const result = await response.json();

        if (response.status !== 200) {
            throw Error(result.message)
        }

        if (result.express === "already exists") {
            setIsLoading(false);
            fileInput.current.style.border = "2px solid red";

        } else {

            fileInput.current.style.border = "";
            setFiles(files.concat(result.express));
            setNewFile("");
            setIsLoading(false);
        }
    };


    const handleDeleteFile = async (fileId, key) => {

        const response = await fetch(`/API/files/${fileId}`, {
            signal,
            method: 'DELETE',
        });

        if (response.status !== 200) {
            throw Error(response.status.toString())
        }

        setFiles(files.filter((value, index) => {

            return key !== index;
        }));


        setFileFields(fileFields.filter(value => {

            return value.file_Id !== fileId;
        }))
    };

    const handlePutFile = async (value, key) => {

        let cloneFiles = [...files];

        cloneFiles[key].title = value;

        const response = await fetch(`/API/files/${cloneFiles[key].id}`, {
            signal,
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": cloneFiles[key].title})
        });

        if (response.status !== 200) {
            throw Error(response.status.toString())
        }

        setFiles(cloneFiles)
    };

    let total = 0.00;

    return <>
        <header>
            <h1>{props.report.title}</h1>
        </header>
        <nav>
            {props.user.permission === 5 && <button onClick={() => props.setAdminOpen(true)}>Admin</button>}
            <button onClick={() => props.setReportOpen("")}>Return</button>
            <button onClick={() => {
                localStorage.clear();
                props.setLoggedInUser(null)
            }}>Logout
            </button>
        </nav>

        <div>
            <label>New File Title</label>
            <input type="text" value={newFile} ref={fileInput} placeholder="E.g - Contract one"
                   onChange={(event) => setNewFile(event.target.value)}/>
            <button disabled={isLoading} onClick={handleNewFile}>New File</button>
        </div>
        <div  className="content">
            <div className="content-wrap">
                {isLoading ? <h2>Loading Content...</h2> :

                        files.length > 0 ? (
                            <div className="content" id="files">
                                <ul>

                                    {
                                        files.map((value, index) => {
                                            return <li key={value.id}>
                                                <input type="text" defaultValue={value.title}
                                                       id={`textInput${value.id}`}/>
                                                <button onClick={() => props.setFileOpen(value)}>Open File</button>
                                                <button onClick={() => handlePutFile(document
                                                    .getElementById(`textInput${value.id}`).value, index)}>Update Title
                                                </button>
                                                <button onClick={() => handleDeleteFile(value.id, index)}>Delete
                                                </button>
                                            </li>
                                        })
                                    }
                                </ul>

                            </div>
                        ) : <h2>No files created</h2>

                }
            </div>

                {isLoading ? null :
                        fileFields.length > 0 &&
                        <div id="fields">
                            <ul>
                                {
                                    fileFields.map(value => {

                                        total += value.value;

                                        return <ul key={value.id}>
                                            <li>{value.title}</li>
                                            <li>{value.value}</li>
                                        </ul>
                                    })
                                }
                            </ul>
                            <label>Total = £{parseFloat(total).toFixed(2)}</label>
                        </div>
                }
        </div>
    </>
}

export default Files;