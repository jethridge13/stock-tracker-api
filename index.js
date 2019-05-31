// Imports
const fs = require('fs');
const express = require('express');
const request = require('request');
const cors = require('cors');
const _ = require('lodash');

// Network variables
const app = express();
const port = 3000;

// API variables
const KEY = fs.readFileSync('key.txt', 'utf8');
const URL = 'https://www.alphavantage.co/';

app.use(cors());

app.get('/get', function (req, res) {
  const symbols = req.query.symbols.split(',');
  const data = [];
  symbols.forEach((ticker, index, array) => {
    request(URL + `query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${KEY}`, {json: true}, (err, r, body) => {
      console.log(`Requesting ${ticker}`);
      const symbol = _.get(body, ['Meta Data', '2. Symbol'], '');
      const dates = _.get(body, 'Time Series (Daily)', []);
      const response = {
        symbol,
        dates,
      }
      data.push(response);
      if (index === array.length - 1) {
        res.send(data);
      }
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));