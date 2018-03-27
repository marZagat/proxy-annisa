const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;
const request = require('request');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

const renderComponents = (components, props = {}) => {
  console.log(components);
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    console.log(component);
    return ReactDom.renderToString(component);
  });
}

app.get('/', (req, res) => {
  res.redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s/');
});

app.get('/restaurants/:id', function(req, res){
  let components = renderComponents(services, {id: req.params.id});
  res.end(Layout(
    'marZagat Restaurant Page',
    App(...components),
    Scripts(Object.keys(services))
  ));
})

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`)
});
