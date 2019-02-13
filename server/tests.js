const request = require('supertest');
const app = require('./app');

const jest = require('./../client/node_modules/jest');

jest.describe('Test the root path', () => {
    jest.test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            jest.expect(response.statusCode).toBe(200);
            done();
        });
    });
});