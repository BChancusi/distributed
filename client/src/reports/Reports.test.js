import React from 'react';
import Reports from './Reports';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<Reports user={{permission: 0}}/>);
});

test('reports in document from fetch', async () => {

    fetchMock.get('/API/reports', {express: [{id: 112, title: "Report 1", timestamp: "2019-02-28T21:25:08.000Z"},
                                        {id: 113, title: "Report 2", timestamp: "2019-03-05T02:23:58.000Z"} ]});

    const {getByDisplayValue} = render(<Reports user={{permission: 0}}/>);
    await waitForElement(() => getByDisplayValue("Report 1"));
    await waitForElement(() => getByDisplayValue("Report 2"));

    expect(getByDisplayValue("Report 1")).toBeInTheDocument();
    expect(getByDisplayValue("Report 2")).toBeInTheDocument();
});


test('text when no reports in document', async () => {

    fetchMock.get('/API/reports', {express: []});

    const {getByText} = render(<Reports user={{permission: 0}}/>);
    await waitForElement(() => getByText("No reports created"));

    expect(getByText("No reports created")).toBeInTheDocument();
});


test('trims empty string and resets field', async () => {

    const {getByPlaceholderText, getByText} = render(<Reports user={{permission: 0}}/>);
    await waitForElement(() => getByPlaceholderText("E.g - Report 2019"));

    fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: '     '}});
    fireEvent.click(getByText("New report"));

    await waitForElement(() => getByPlaceholderText("E.g - Report 2019"));

    expect(getByPlaceholderText("E.g - Report 2019").value).toBe("");
});

test('new created report in document', async () => {
    fetchMock.get('/API/reports', {express: []})
        .post('/API/reports',{express : [{id: 114, title: "Report 2019", timestamp: "2019-03-05T02:56:15.000Z"}]});

    const {getByPlaceholderText, getByText} = render(<Reports user={{permission: 0}}/>);

    fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: 'Report 2019'}});
    fireEvent.click(getByText("New report"));

    await waitForElement(() => getByText("Open Report"));

    expect(getByText("Open Report")).toBeInTheDocument();
});

test('new report field clears with after fetch', async () => {
    //TODO see why fetch does not match
    fetchMock.get('/API/reports', {express: []})
        .post('/API/reports',{express : [{id: 114, title: "Report 2019", timestamp: "2019-03-05T02:56:15.000Z"}]});

    const {getByPlaceholderText, getByText} = render(<Reports user={{permission: 0}}/>);

    fireEvent.change(getByPlaceholderText("E.g - Report 2019"), {target: {value: 'Report 2019'}});
    fireEvent.click(getByText("New report"));

    await waitForElement(() => getByText("Open Report"));

    //TODO fetch test not functioning ocrrectly still displaying content loading

    expect(getByPlaceholderText("E.g - Report 2019").value).toBe("");
});

test('PUT field title fetch options', async () => {

    fetchMock.get('/API/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]})
        .put('/API/reports/112', 200);


    const {getByText, getByDisplayValue} = render(<Reports user={{permission: 0}}/>);

    await waitForElement(() => getByText("Open Report"));

    fireEvent.change(getByDisplayValue("Report 2019"), {target: {value: 'Report 2017'}});

    expect(getByDisplayValue("Report 2017").value).toBe("Report 2017");

    fireEvent.click(getByText("Update report title"));

    await waitForElement(() => getByText("Open Report"));

    expect(fetchMock.lastUrl()).toBe("/API/reports/112");
    expect(fetchMock.lastOptions().body).toBe("{\"title\":\"Report 2017\"}")
});

test('report deleted from document', async () => {

    fetchMock.get('/API/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]})
        .delete('/API/reports/112', 200);


    const {getByText, getByDisplayValue, queryByText} = render(<Reports user={{permission: 0}}/>);

    await waitForElement(() => getByText("Open Report"));

    expect(getByDisplayValue("Report 2019")).toBeInTheDocument();

    fireEvent.click(getByText("Delete"));

    await waitForElement(() => getByText("No reports created"));

    expect(queryByText("Report 2019")).not.toBeInTheDocument();
    expect(fetchMock.lastUrl()).toBe("/API/reports/112")
});

test('open report event fired once with item', async () => {

    fetchMock.get('/API/reports', {express: [{id: 112, title: "Report 2019", timestamp: "2019-02-28T21:25:08.000Z"}]});

    const mockSetReportOpen = jest.fn();
    const {getByText, getByDisplayValue, queryByText} = render(<Reports user={{permission: 0}} setReportOpen={mockSetReportOpen}/>);

    await waitForElement(() => getByText("Open Report"));

    expect(getByDisplayValue("Report 2019")).toBeInTheDocument();

    fireEvent.click(getByText("Open Report"));

    expect(mockSetReportOpen).toHaveBeenCalledTimes(1);
    expect(mockSetReportOpen).toHaveBeenCalledWith({"id": 112, "timestamp": "2019-02-28T21:25:08.000Z", "title": "Report 2019"});
});