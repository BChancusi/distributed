import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import {render, fireEvent, cleanup, wait, waitForElement} from 'react-testing-library'

afterEach(cleanup);

test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Login />, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('username and password empty on render', () => {
    const { container, getByText, getByTestId } = render(<Login />);
    const usernameField = getByTestId("username-text");
    const passwordField = getByTestId("password-text");
    expect(usernameField.value).toBe('');
    expect(passwordField.value).toBe('');
});

test('username change value correct', () => {
    const { container, getByTestId } = render(<Login />);
    const usernameField = getByTestId("username-text");

    fireEvent.change(usernameField, {target: {value: 'username'}});
    expect(usernameField.value).toBe('username');
});

test('password change value correct', () => {
    const { container, getByText,getByTestId } = render(<Login />);
    const passwordField = getByTestId("password-text");

    fireEvent.change(passwordField, {target: {value: 'password'}});
    expect(passwordField.value).toBe('password');
});

test('username and password value can be emptied', () => {
    const { container, getByText, getByTestId } = render(<Login />);
    const passwordField = getByTestId("password-text");
    const usernameField = getByTestId("username-text");

    fireEvent.change(usernameField, {target: {value: 'username'}});
    fireEvent.change(usernameField, {target: {value: ''}});
    expect(usernameField.value).toBe('');

    fireEvent.change(passwordField, {target: {value: 'password'}});
    fireEvent.change(passwordField, {target: {value: ''}});
    expect(passwordField.value).toBe('');
});

test('login button can be clicked', () => {
    const { container, getByText, getByTestId } = render(<Login />);
    const loginButton = getByText("Login");

    fireEvent.click(loginButton)

});

test('login butto clicked', async ()  => {
    const { container, getByText, getByTestId } = render(<Login />);

    const loginButton = getByText("Login");
    const passwordField = getByTestId("password-text");
    const usernameField = getByTestId("username-text");

    fireEvent.change(usernameField, {target: {value: 'username'}});
    fireEvent.change(passwordField, {target: {value: 'password'}});

    fireEvent.click(loginButton);

    await wait()
});