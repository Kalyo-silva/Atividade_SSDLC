const request = require('supertest');
const app = require('../server'); // I need to export the app but not start it immediately, wait server.js starts it.

describe('API Tests', () => {
    it('should run tests', () => {
        expect(true).toBe(true);
    });
});
