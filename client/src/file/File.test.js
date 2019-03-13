import React from 'react';
import File from './File';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<File user={{permission: 0}} file={
        {id: 179, report_id: 115, branch_title: "master", title: "Contract one", timestamp: "2019-03-09T00:26:46.000Z"}
    }
                                     report={{id: 115,
                                         timestamp: "2019-03-05T05:12:22.000Z",
                                         title: "New report"}}
    />);
});

test('header path correct', async () => {

    fetchMock.get('/API/files/branch?report_id=115&branch_title=master', {
        express: [{branch_title: "master", id: 179, report_id: 115,
            timestamp: "2019-03-09T00:26:46.000Z", title: "Contract one"}]
    }).get('/API/fields/file/179+master', {express: []});

    //TODO correct fetch mock

    const {container, getByText} = render(<File user={{permission: 0}} file={
        {id: 179, report_id: 115, branch_title: "master", title: "Contract one", timestamp: "2019-03-09T00:26:46.000Z"}
    }
                                     report={{id: 115,
                                         timestamp: "2019-03-05T05:12:22.000Z",
                                         title: "New report"}}
    />);

    expect(getByText("New report\\Contract one\\master")).toBeInTheDocument();

});

//TODO test branch header changes