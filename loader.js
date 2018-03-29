const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const exists = Promise.promisify(fs.stat);

const loadBundle = function(cache, item, filename) {
  setTimeout(() => {
    console.log('loading: ', filename);
    cache[item] = require(filename).default;
    console.log(cache, item);
  }, 20000);
};

const fetchBundles = (path, services, suffix = '', require = false) => {
  Object.keys(services).forEach(item => {
    const filename = `${path}/${item}${suffix}.js`;
    exists(filename)
      .then(() => {
        require ? loadBundle(services, item, filename) : null;
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          const url = `${services[item]}${suffix}.js`;
          console.log(`Fetching ${url}`);
          fetch(url)
            .then(res => {
              const dest = fs.createWriteStream(filename);
              res.body.pipe(dest);
              res.body.on('end', () => {
                require ? loadBundle(services, item, filename) : null;
              })
            })
        } else {
          console.log('WARNING: unknown error: ', err);
        }
      });
  });
};

module.exports = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server', true);

  return services;
}