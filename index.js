// Imports
const fs = require('fs');
const express = require('express');
const request = require('request');

// Network variables
const app = express();
const port = 3000;

// API variables
const KEY = fs.readFileSync('key.txt', 'utf8');
const URL = 'https://www.alphavantage.co/';

app.get('/get', function (req, res) {
	const symbols = req.query.symbols.split(',');
	const data = [];
	symbols.forEach((symbol, index, array) => {
		request(URL + `query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${KEY}`, {json: true}, (err, r, body) => {
			console.log(`Requesting ${symbol}`);
			data.push(body);
			if (index === array.length - 1) {
				res.send(data);
			}
		});
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));