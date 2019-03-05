import React from 'react';
import Files from './Files';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<Files report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }
    />);
});

test('files in document from fetch', async () => {

    fetchMock.get('/files/branch?report_id=115&branch_title=master', {
        express: [
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
            }]
    }).get('/fields/file/175+176+master', {express: []});

    const {getByDisplayValue} = render(<Files report={
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

    fetchMock.get('/files/branch?report_id=115&branch_title=master', {
        express: [
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
            }]
    }).get('/fields/file/175+176+master', {express: [{branch_title: "master", file_Id: 175, id: 910,
            timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323},
            {branch_title: "master", file_Id: 176, id: 911,
                timestamp: "2019-03-05T05:13:21.000Z", title: "Cba", value: 2}]});

    const {getByDisplayValue, getByText} = render(<Files report={
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

    fetchMock.get('/files/branch?report_id=115&branch_title=master', {
        express: [
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
            }]
    }).get('/fields/file/175+176+master', {express: [{branch_title: "master", file_Id: 175, id: 910,
            timestamp: "2019-03-05T05:13:21.000Z", title: "Abc", value: 22323},
            {branch_title: "master", file_Id: 176, id: 911,
                timestamp: "2019-03-05T05:13:21.000Z", title: "Cba", value: 2}]});

    const {getByText} = render(<Files report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("Total = £22325.00"));

    expect(getByText("Total = £22325.00")).toBeInTheDocument();
});


test('text when no reports in document', async () => {

    fetchMock.get('/files/branch?report_id=115&branch_title=master', {
        express: []
    }).get('/fields/file/+master', {express: []});

    const {getByText} = render(<Files report={
        {
            id: 115,
            timestamp: "2019-03-05T05:12:22.000Z",
            title: "New report"
        }
    }/>);

    await waitForElement(() => getByText("No files created"));
    expect(getByText("No files created")).toBeInTheDocument();
});

//
// test('trims empty string and resets field', async () => {
//
//     const {getByPlaceholderText, getByText} = render(<Reports/>);
//     await waitForElement(() => getByPlaceholderText("E.g - Report 2019"));
//
//     fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: '     '}});
//     fireEvent.click(getByText("New report"));
//
//     await waitForElement(() => getByPlaceholderText("E.g - Report 2019"));
//
//     expect(getByPlaceholderText("E.g - Report 2019").value).toBe("");
// });
//
// test('new created report in document', async () => {
//     fetchMock.get('/reports', {express: []})
//         .post('/reports', {express: [{id: 114, title: "Report 2019", timestamp: "2019-03-05T02:56:15.000Z"}]});
//
//     const {getByPlaceholderText, getByText} = render(<Reports/>);
//
//     fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: 'Report 2019'}});
//     fireEvent.click(getByText("New report"));
//
//     await waitForElement(() => getByText("Open Report"));
//
//     expect(getByText("Open Report")).toBeInTheDocument();
// });
//
// test('new report field clears with after fetch', async () => {
//     fetchMock.get('/reports', {express: []})
//         .post('/reports', {express: [{id: 114, title: "Report 2019", timestamp: "2019-03-05T02:56:15.000Z"}]});
//
//     const {getByPlaceholderText, getByText} = render(<Reports/>);
//
//     fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: 'Report 2019'}});
//     fireEvent.click(getByText("New report"));
//
//     await waitForElement(() => getByText("Open Report"));
//
//     expect(getByPlaceholderText("E.g - Report 2019").value).toBe("");
// });
//
// test('PUT field title fetch options', async () => {
//
//     fetchMock.get('/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]})
//         .put('/reports/112', 200);
//
//
//     const {getByText, getByDisplayValue} = render(<Reports/>);
//
//     await waitForElement(() => getByText("Open Report"));
//
//     fireEvent.change(getByDisplayValue("Report 2019"), {target: {value: 'Report 2017'}});
//
//     expect(getByDisplayValue("Report 2017").value).toBe("Report 2017");
//
//     fireEvent.click(getByText("Update report title"));
//
//     await waitForElement(() => getByText("Open Report"));
//
//     expect(fetchMock.lastUrl()).toBe("/reports/112")
//     expect(fetchMock.lastOptions().body).toBe("{\"title\":\"Report 2017\"}")
// });
//
// test('report deleted from document', async () => {
//
//     fetchMock.get('/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]})
//         .delete('/reports/112', 200);
//
//
//     const {getByText, getByDisplayValue, queryByText} = render(<Reports/>);
//
//     await waitForElement(() => getByText("Open Report"));
//
//     expect(getByDisplayValue("Report 2019")).toBeInTheDocument();
//
//     fireEvent.click(getByText("Delete"));
//
//     await waitForElement(() => getByText("No reports created"));
//
//     expect(queryByText("Report 2019")).not.toBeInTheDocument();
//     expect(fetchMock.lastUrl()).toBe("/reports/112")
// });
//
// test('open report event fired once with item', async () => {
//
//     fetchMock.get('/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]});
//
//     const mockSetReportOpen = jest.fn();
//     const {getByText, getByDisplayValue, queryByText} = render(<Reports setReportOpen={mockSetReportOpen}/>);
//
//     await waitForElement(() => getByText("Open Report"));
//
//     expect(getByDisplayValue("Report 2019")).toBeInTheDocument();
//
//     fireEvent.click(getByText("Open Report"));
//
//     expect(mockSetReportOpen).toHaveBeenCalledTimes(1);
//     expect(mockSetReportOpen).toHaveBeenCalledWith({
//         "id": 112,
//         "timestamp": "2019-02-28T21:25:08.000Z",
//         "title": "Report 2019"
//     });
// });