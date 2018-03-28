require('newrelic');
const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const request = require('request');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/restaurants/5012345/');
});

app.use('/restaurants/:id', express.static(path.join(__dirname, 'public')));

app.get('/api/restaurants/:id/recommendations', (req, res) => {
  res.redirect(`http://localhost:3004/api/restaurants/${req.params.id}/recommendations`)
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`)
});
