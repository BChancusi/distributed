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

        async function fetchFilesAndFields (){

            const response = await fetch(`/API/files/branch?report_id=${props.report.id}`, {signal});
            const result = await response.json();

            if (response.status !== 200) {
                throw Error(result.message)
            }

            if(result.data.files.length === 0){
                setIsLoading(false);
                return;
            }

            setFiles(result.data.files);

            if(result.data.fields.length === 0){
                setIsLoading(false);
                return
            }
            setFileFields(result.data.fields);

            setIsLoading(false);
        }

        fetchFilesAndFields().catch(error => console.log(error));

        return () => {
            controller.abort();
        }
    }, []);


    async function handleNewFile() {

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
    }


    async function handleDeleteFile(fileId, key) {

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
    }

    async function handlePutFile(value, key) {

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
    }

    let total = 0.00;

    return (
        <>
            <header>
                <h1>Path: {props.report.title}</h1>
            </header>
            <nav>
                {props.user.permission === 5 && <button onClick={() => props.setAdminOpen(true)}>Admin</button>}
                <button onClick={() => props.setReportOpen("")}>Return</button>
                <button  className="nav-button" onClick={() => {
                    localStorage.clear();
                    props.setLoggedInUser(null)
                }}>Logout
                </button>
            </nav>

            <div>
                <label>New File Title</label>
                <input className="input-options" type="text" value={newFile} ref={fileInput} placeholder="E.g - Contract one"
                       onChange={(event) => setNewFile(event.target.value)}/>
                <button disabled={isLoading} onClick={handleNewFile}>New File</button>
            </div>
            <div className="content">
                <div className="content-wrap">
                    {isLoading ? <h2>Loading...</h2> :

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
                        <label className="total-available-label" >Total Available = £{parseFloat(total).toFixed(2)}</label>
                    </div>
                }
            </div>
        </>
    )
}

export default Files;