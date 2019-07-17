import React from 'react';
import Files from './Files';
import {render, fireEvent, cleanup, wait, waitForElement} from '@testing-library/react'
import '@testing-library/jest-dom'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }
    />);
});

test('files in document from fetch', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {
            files: [
                {
                    branch_title: "master",
                    id: 175,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:01.000Z",
                    title: "Contract one"
                },
                {
                    branch_title: "master",
                    id: 176,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:05.000Z",
                    title: "Contract two"
                }], fields: []
        }
    });

    const {getByDisplayValue, getByText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByDisplayValue("Contract one"));
    await waitForElement(() => getByDisplayValue("Contract two"));

    expect(getByDisplayValue("Contract one")).toBeInTheDocument();
    expect(getByDisplayValue("Contract two")).toBeInTheDocument();
});

test('field from files in document from fetch', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {
            files: [
                {
                    branch_title: "master",
                    id: 175,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:01.000Z",
                    title: "Contract one"
                },
                {
                    branch_title: "master",
                    id: 176,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:05.000Z",
                    title: "Contract two"
                }], fields: [
                {
                    branch_title: "master", file_Id: 175, id: 910,
                    timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323
                },
                {
                    branch_title: "master", file_Id: 176, id: 911,
                    timestamp: "2019-03-05T05:13:21.000Z", title: "Cba", value: 2
                }]}
        });

    const {getByDisplayValue, getByText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByDisplayValue("Contract one"));
    await waitForElement(() => getByDisplayValue("Contract two"));
    await waitForElement(() => getByText("Abc"));

    expect(getByDisplayValue("Contract one")).toBeInTheDocument();
    expect(getByDisplayValue("Contract two")).toBeInTheDocument();
    expect(getByText("Abc")).toBeInTheDocument();
    expect(getByText("Cba")).toBeInTheDocument();
    expect(getByText("22323")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();

});

test('Total amount in document with 2 decimal point', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files : [
            {
                branch_title: "master",
                id: 175,
                report_id: 115,
                timestamp: "2019-03-05T05:13:01.000Z",
                title: "Contract one"
            },
            {
                branch_title: "master",
                id: 176,
                report_id: 115,
                timestamp: "2019-03-05T05:13:05.000Z",
                title: "Contract two"
            }], fields : [{
                branch_title: "master", file_Id: 175, id: 910,
                timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323
            },
                {
                    branch_title: "master", file_Id: 176, id: 911,
                    timestamp: "2019-03-05T05:13:21.000Z", title: "Cba", value: 2
                }]}
    });

    const {getByText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("Total Available = £22325.00"));

    expect(getByText("Total Available = £22325.00")).toBeInTheDocument();
});


test('text when no reports in document', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files : [], fields: []}
    });

    const {getByText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("No files created"));
    expect(getByText("No files created")).toBeInTheDocument();
});

test('new file inserted into document', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files: [], fields: []}
    })
        .post("/API/files", {
            express: {
                branch_title: "master", id: 179, report_id: 115,
                timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"
            }
        });

    const {getByText, getByPlaceholderText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("No files created"));


    fireEvent.change(getByPlaceholderText("E.g - Contract one"), {target: {value: 'Contract two 2017'}});
    fireEvent.click(getByText("New File"));

    await waitForElement(() => getByText("Open File"));

    expect(getByText("Open File")).toBeInTheDocument();

});

test('duplicate file error', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files: [{
            branch_title: "master", id: 179, report_id: 115,
            timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"
        }], fields:[] }
    }).post("/API/files", {express: "already exists"});

    const {getByText, getByPlaceholderText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("Open File"));

    fireEvent.change(getByPlaceholderText("E.g - Contract one"), {target: {value: 'Contract one'}});
    fireEvent.click(getByText("New File"));

    await wait();

    expect(getByPlaceholderText("E.g - Contract one")).toHaveStyle(`border : 2px solid red`);

});

test('put file event click', async () => {

    fetchMock
        .get('/API/files/branch?report_id=115', {
            data: {
                files: [{
                    branch_title: "master", id: 179, report_id: 115,
                    timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"
                }], fields: []
            }
        })
        .put("/API/files/179", 200);

    const {getByText, getByPlaceholderText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("New File Title"));

    fireEvent.click(getByText("Update Title"));

    expect(fetchMock.done()).toBe(true);

});

test('header matches opened file', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files: [{
            branch_title: "master", id: 179, report_id: 115,
            timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"
        }], fields: []}
    });

    const {getByText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    expect(getByText("File Path: New report")).toBeInTheDocument();

});

test('open file event fired once with item', async () => {

    fetchMock.get('/API/files/branch?report_id=115', {
        data: {files: [{
            branch_title: "master", id: 179, report_id: 115,
            timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"
        }], fields : []}
    });

    const mockSetFileOpen = jest.fn();

    const {getByText} = render(<Files user={{permission: 0}} setFileOpen={mockSetFileOpen}
                                                            report={
                                                                {
                                                                    id: 115,
                                                                    timestamp: "2019-03-05T05:12:22.000Z",
                                                                    title: "New report"
                                                                }
                                                            }/>);

    await waitForElement(() => getByText("Open File"));

    fireEvent.click(getByText("Open File"));

    expect(mockSetFileOpen).toHaveBeenCalledTimes(1);
    expect(mockSetFileOpen).toHaveBeenCalledWith(
        {id: 179, report_id: 115, branch_title: "master", title: "Contract one", timestamp: "2019-03-09T00:26:46.000Z"}
    );
});

test('file deleted from document', async () => {

    fetchMock
        .get('/API/files/branch?report_id=115', {
            data: {files: [
                {
                    branch_title: "master",
                    id: 175,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:01.000Z",
                    title: "Contract one"
                }], fields: [{
                    branch_title: "master", file_Id: 175, id: 910,
                    timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323
                }]}
        })
        .delete('/API/files/175', 200);

    const {getByText, getByDisplayValue, queryByText, queryByLabelText, queryByDisplayValue} = render(<Files
        user={{permission: 0}}
        report={
            {
                id: 115,
                timestamp: "2019-03-05T05:12:22.000Z",
                title: "New report"
            }
        }/>);

    await waitForElement(() => getByDisplayValue("Contract one"));

    fireEvent.click(getByText("Delete"));

    await wait();

    expect(queryByText("Open File")).not.toBeInTheDocument();
    expect(queryByDisplayValue("Contract one")).not.toBeInTheDocument();
    expect(queryByLabelText("Abc")).not.toBeInTheDocument();
    expect(queryByLabelText("22323")).not.toBeInTheDocument();
    expect(queryByLabelText("Total = £22323")).not.toBeInTheDocument();

});

test('trims empty string and resets new file field', async () => {

    fetchMock
        .get('/API/files/branch?report_id=115', {
            data: {files: [
                {
                    branch_title: "master",
                    id: 175,
                    report_id: 115,
                    timestamp: "2019-03-05T05:13:01.000Z",
                    title: "Contract one"
                }], fields: [{
                    branch_title: "master", file_Id: 175, id: 910,
                    timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323
                }]}
        });

    const {getByText, getByPlaceholderText} = render(<Files user={{permission: 0}} report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);


    await waitForElement(() => getByText("Open File"));

    fireEvent.change(getByPlaceholderText("E.g - Contract one"), {target: {value: '     '}});
    fireEvent.click(getByText("New File"));

    await waitForElement(() => getByPlaceholderText("E.g - Contract one"));

    expect(getByPlaceholderText("E.g - Contract one").value).toBe("");
});