import React from 'react';
import Login from './Login';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'

const fetchMock = require('fetch-mock/es5/client');

fetchMock.config.overwriteRoutes = true;

afterEach(cleanup);
afterEach(fetchMock.reset);


test('renders without crashing', () => {
    const {container} = render(<Login/>);
});

describe('username and password fields', () => {

    test('username and password empty on render', () => {
        const {getByTestId} = render(<Login/>);
        const usernameField = getByTestId("username-text");
        const passwordField = getByTestId("password-text");
        expect(usernameField.value).toBe('');
        expect(passwordField.value).toBe('');
    });

    test('username change value correct', () => {
        const {getByTestId} = render(<Login/>);
        const usernameField = getByTestId("username-text");

        fireEvent.change(usernameField, {target: {value: 'username'}});
        expect(usernameField.value).toBe('username');
    });

    test('password change value correct', () => {
        const {getByTestId} = render(<Login/>);
        const passwordField = getByTestId("password-text");

        fireEvent.change(passwordField, {target: {value: 'password'}});
        expect(passwordField.value).toBe('password');
    });

    test('username and password value can be emptied', () => {
        const {getByTestId} = render(<Login/>);
        const passwordField = getByTestId("password-text");
        const usernameField = getByTestId("username-text");

        expect(usernameField.value).toBe('');
        fireEvent.change(usernameField, {target: {value: 'username'}});
        fireEvent.change(usernameField, {target: {value: ''}});
        expect(usernameField.value).toBe('');

        expect(passwordField.value).toBe('');
        fireEvent.change(passwordField, {target: {value: 'password'}});
        fireEvent.change(passwordField, {target: {value: ''}});
        expect(passwordField.value).toBe('');

    });
});

describe('login faliure', () => {

    test('password field clears', async () => {
        fetchMock.mock('/users/signin?username=username&password=password', {express: 'details incorrect'});

        const {getByText, getByTestId} = render(<Login/>);

        const loginButton = getByText("Login");
        const usernameField = getByTestId("username-text");
        const passwordField = getByTestId("password-text");

        fireEvent.change(usernameField, {target: {value: 'username'}});
        fireEvent.change(passwordField, {target: {value: 'password'}});
        fireEvent.click(loginButton);

        await waitForElement(() => usernameField);
        await waitForElement(() => passwordField);

        expect(usernameField).toHaveStyle(`background-color: red`);
        expect(passwordField.value).toBe("");
        expect(fetchMock.done()).toBe(true);
    });


    test('style set to red', async () => {
        fetchMock.mock('/users/signin?username=username&password=password', {express: 'details incorrect'});


        const {getByText, getByTestId} = render(<Login/>);

        const loginButton = getByText("Login");
        const usernameField = getByTestId("username-text");
        const passwordField = getByTestId("password-text");

        fireEvent.change(usernameField, {target: {value: 'username'}});
        fireEvent.change(passwordField, {target: {value: 'password'}});
        fireEvent.click(loginButton);

        await waitForElement(() => usernameField);
        await waitForElement(() => passwordField);

        expect(fetchMock.done()).toBe(true);
        expect(usernameField).toHaveStyle(`background-color: red`);
        expect(passwordField.value).toBe("");

    });

    // test('invalid password length', () => {
    //     const { container, getByText, getByTestId } = render(<Login />);
    //     const loginButton = getByText("Login");
    //
    // });
    //
    // test('message displayed', () => {
    //     const { container, getByText, getByTestId } = render(<Login />);
    //     const loginButton = getByText("Login");
    //
    // });

});

test('login button calls fetch', async () => {

    const mockSetLoggedIn = jest.fn();

    fetchMock.mock('/users/signin?username=username&password=password', {express: 'details correct'});

    const {getByText, getByTestId} = render(<Login setLoggedIn={mockSetLoggedIn}/>);

    const loginButton = getByText("Login");
    const usernameField = getByTestId("username-text");
    const passwordField = getByTestId("password-text");

    fireEvent.change(usernameField, {target: {value: 'username'}});
    fireEvent.change(passwordField, {target: {value: 'password'}});
    fireEvent.click(loginButton);

    await waitForElement(() => usernameField);
    await waitForElement(() => passwordField);

    expect(usernameField).toHaveStyle(`background-color: white`);
    expect(mockSetLoggedIn).toHaveBeenCalledTimes(1);
    expect(fetchMock.done()).toBe(true)

});

test('CSS turn red then white after failure/success', async () => {

    const mockSetLoggedIn = jest.fn();

    fetchMock.mock('/users/signin?username=username111&password=password111', {express: 'details incorrect'});

    const {getByText, getByTestId} = render(<Login setLoggedIn={mockSetLoggedIn}/>);

    const loginButton = getByText("Login");
    const usernameField = getByTestId("username-text");
    const passwordField = getByTestId("password-text");

    fireEvent.change(usernameField, {target: {value: 'username111'}});
    fireEvent.change(passwordField, {target: {value: 'password111'}});
    fireEvent.click(loginButton);

    await waitForElement(() => usernameField);
    await waitForElement(() => passwordField);

    expect(usernameField).toHaveStyle(`background-color: red`);
    expect(usernameField.value).toBe("username111");
    expect(passwordField.value).toBe("");

    fetchMock.mock('/users/signin?username=username&password=password', {express: 'details correct'});

    fireEvent.change(usernameField, {target: {value: 'username'}});
    fireEvent.change(passwordField, {target: {value: 'password'}});
    fireEvent.click(loginButton);

    await waitForElement(() => usernameField);
    await waitForElement(() => passwordField);

    expect(usernameField).toHaveStyle(`background-color: white`);
    expect(usernameField.value).toBe("");
    expect(passwordField.value).toBe("");
    expect(mockSetLoggedIn).toHaveBeenCalledTimes(1);

    expect(fetchMock.done()).toBe(true);
});