import React, {useState, useEffect, Fragment} from 'react';

import useFile from './UseFile';

function useFiles(report) {

    const [files, setFiles] = useState("");
    const [fileOpen, setFileOpen] = useState("");
    const [newFile, setNewFile] = useState("");
    const [fileFields, setFileFields] = useState("");

    const fileRender = useFile(fileOpen);

    useEffect(() => {
        if (report !== "") {


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


        let fetchUrl = encodeURI(`/files/branch?report_id=${reportId}&branch_title=master`);

        const response = await fetch(fetchUrl);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }

        return body;

    };

    const postFile = async (title) => {

        await fetch('/files', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": title, "report_id": report.id})
        });
    };

    const deleteFile = async (fileId) => {

        await fetch(`/files/${fileId}`, {
            method: 'DELETE',
        });
    };


    function handleRefreshFiles() {
        getFiles(report.id)
            .then(res => setFiles(res.express))
            .catch(err => console.log(err));
    }


    function handleNewFile() {
        postFile(newFile).then(() => null);
    }

    function handleDeleteFile(fileId) {
        deleteFile(fileId).then(() => null);
    }

    const putFile = async (file) => {

        await fetch(`/files/${file.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"title": file.title})
        });

        return null;
    };

    function handlePutFile(event, key) {

        let cloneFiles = [...files];

        cloneFiles[key].title = event.target.value;

        putFile(cloneFiles[key])
            .then(() => setFiles(cloneFiles))
            .catch(err => console.log(err));
    }

    if (files === "") {
        return "";
    }

    let total = 0;

    return fileRender === "" ? (
        <>
            <header>
                <h1 align="CENTER">{report.title}</h1>
            </header>
            <nav>

                <button onClick={handleRefreshFiles}>Refresh Files</button>
                <input type="text" value={newFile} onChange={(event) => setNewFile(event.target.value)}/>
                <button onClick={handleNewFile}>New File</button>

                <button onClick={() => {
                    setFiles("");
                }}>Return
                </button>
            </nav>
            <div id={"files"}>
                {
                    Object.keys(files).map((key) => {
                        return <Fragment key={files[key].id}>
                            <input type="text" value={files[key].title}
                                   onChange={(event) => handlePutFile(event, key)}/>
                            <button onClick={() => setFileOpen(files[key])}>Open file</button>
                            <button onClick={() => handleDeleteFile(files[key].id)}>Delete</button>
                        </Fragment>
                    })
                }
                {
                    Object.keys(fileFields).map((key) => {

                        total += fileFields[key].value;

                        return <Fragment key={fileFields[key].id}>
                            <br/>
                            <label>{fileFields[key].title}</label>
                            <br/>
                            <label>{fileFields[key].value}</label>
                            <br/>

                        </Fragment>
                    })
                }
                <label>Total = {total}</label>
            </div>

        </>
    ) : (
        fileRender
    );
}

export default useFiles ;