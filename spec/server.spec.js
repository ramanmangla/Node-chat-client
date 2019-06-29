
var request = require('request');

describe('get messages', () => {
	it('should return 200 OK', (done) => {
		request.get('http://localhost:3000/messages', (err, res) => {
			expect(res.statusCode).toEqual(200);
			done();
		});
	});

	it('should return non empty list', (done) => {
		request.get('http://localhost:3000/messages', (err, res) => {
			expect(JSON.parse(res.body).length).toBeGreaterThan(0);
			done();
		});
	});
});