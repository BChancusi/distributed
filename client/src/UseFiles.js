import React, {useState, useEffect, Fragment} from 'react';
import useFile from './UseFile';

function useFiles(report) {

    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState("");
    const [fileFields, setFileFields] = useState([]);

    const [reportClose, setReportClose] = useState(true);
    const [fileOpen, setFileOpen] = useState("");

    const fileRender = useFile(fileOpen);

    useEffect(() => {
        if (report !== "") {

            setReportClose(false);

            getFiles(report.id)
                .then(res => {

                    setFiles(res.express);
                    return res.express
                })

                .then(files => {

                    let keyArray = [];

                    Object.keys(files).map((key) => {
                        keyArray.push(files[key].id);
                        return null;
                    });

                    return keyArray

                })
                .then(keyArray => {

                    getFields(keyArray)
                        .then(res => setFileFields(res.express))
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        }

        return ()=>{
            setFiles([]);
            setFileFields([]);
            setNewFile("");
            setFileOpen("");
        }
    }, [report.id]);

    const getFields = async (keys) => {

        let idsURL = "";

        for (let i = 0; i < keys.length; i++) {
            if (i !== keys.length - 1) {
                idsURL += keys[i] + "+"
            } else if (keys.length - 1 === i) {
                idsURL += keys[i]
            }
        }
        idsURL += "+master";

        const response = await fetch(`/fields/file/${idsURL}`);

        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const getFiles = async (reportId) => {

        const response = await fetch(encodeURI(`/files/branch?report_id=${reportId}&branch_title=master`));
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    if (reportClose) {
        return true;
    }

    const handleNewFile = async () => {

        if(newFile.trim() === ""){
            setNewFile("");
            return;
        }

        const response = await fetch('/files', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": newFile, "report_id": report.id})
        });

        await response.json().then(body =>{

            if (response.status !== 200) {
                throw Error(body.message)
            }

            setFiles(files.concat(body.express));
            setNewFile("")
        });
    };


    const handleDeleteFile = async (fileId, key) => {

        await fetch(`/files/${fileId}`, {
            method: 'DELETE',
        }).then(response => {

            if (response.status !== 200) {
                throw Error(response.status.toString())
            }

            setFiles(files.filter((value, index) => {

                return key !== index;
            }));
        });
    };

    const handlePutFile = async (value, key) => {

        let cloneFiles = [...files];

        cloneFiles[key].title = value;

        await fetch(`/files/${cloneFiles[key].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": cloneFiles[key].title})
        }).then(response => {

            if (response.status !== 200) {
                throw Error(response.status.toString())
            }

            setFiles(cloneFiles)
        }).catch(err => console.log(err));
    };

    let total = 0.00;

    return fileRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">{report.title}</h1>
            </header>

            <nav>
                <input type="text" value={newFile} onChange={(event) => setNewFile(event.target.value)}/>
                <button onClick={handleNewFile}>New File</button>
                <button onClick={() => setReportClose(true)}>Return</button>
            </nav>

            <div id={"files"}>
                {
                    files.map((value, index) => {
                        return <Fragment key={value.id}>
                            <input type="text" defaultValue={value.title} id= {`textInput${value.id}`}/>
                            <button onClick={() => setFileOpen(value)}>Open file</button>
                            <button onClick={() => handlePutFile(document
                                .getElementById(`textInput${value.id}`).value, index)}>Update title</button>
                            <button onClick={() => handleDeleteFile(value.id, index)}>Delete</button>
                        </Fragment>
                    })
                }
                {
                    fileFields.map(value => {

                            total += value.value;

                        return <Fragment key={value.id}>
                            <br/>
                            <label>{value.title}</label>
                            <br/>
                            <label>{value.value}</label>
                            <br/>

                        </Fragment>
                    })
                }
                {fileFields.length > 0 ? <label>Total = {parseFloat(total).toFixed(2)}</label> : null }
            </div>

        </>
    ) : (
        fileRender
    );
}

export default useFiles ;