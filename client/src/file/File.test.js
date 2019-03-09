import React from 'react';
import File from './File';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<File file={
        {id: 179, report_id: 115, branch_title: "master", title: "Contract one", timestamp: "2019-03-09T00:26:46.000Z"}
    }
                                     report={{id: 115,
                                         timestamp: "2019-03-05T05:12:22.000Z",
                                         title: "New report"}}
    />);
});