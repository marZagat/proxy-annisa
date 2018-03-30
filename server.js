require('newrelic');
const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();

require('dotenv').config();

const redis = require('redis');
const REDIS_PORT = 6379;
const REDIS_ADDRESS = process.env.REDIS_ADDRESS || 'localhost';

const port = process.env.PORT || 3000;
const request = require('request');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.js');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

let client;

const connect = async () => {
  client = await redis.createClient({
    host: REDIS_ADDRESS
  });
  client.on('error', error => console.error(error));
}

connect();

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
}

app.get('/', (req, res) => {
  res.redirect('/restaurants/5012345/');
});

app.get('/restaurants/:id', cache, function(req, res){
  let id = req.params.id;
  let components = renderComponents(services, {id: id});
  let renderedHTML = Layout(
    'marZagat Restaurant Page',
    App(...components),
    Scripts(Object.keys(services))
  );
  client.setex(id, 3600, renderedHTML);
  res.end(renderedHTML);
})

function cache(req, res, next) {
  const placeId = req.params.id;
  client.get(placeId, function (err, data) {
    if (data !== null) {
      console.log('found cached info!')
      // let parsedData= data;
      res.send(data);
    } else {
      next();
    }
  })
}

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`)
});
