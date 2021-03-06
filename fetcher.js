const request = require('request');

const endpointURL = 'http://api.wordpress.org/plugins/info/1.1/';

let plugins = [];

const pluginsQtd = 1000;

let requestPromises = [];

for(let i=0; i<(pluginsQtd/250); i++) {

  let requestPromise = new Promise((resolve) => {
    request.post({
      url: endpointURL,
      form: {
        action: 'query_plugins',
        request: {
          browse: 'popular',
          per_page: parseInt(pluginsQtd / 250) === i ? pluginsQtd - (250 * i): 250,
          page: i + 1,
        }
      }
    }, (err, response, body) => {
      let obj = JSON.parse(body);

      let temp_plugins = Object.entries(obj.plugins);

      for (let plugin of temp_plugins) {
        let {name, version, author, requires, rating, num_ratings, downloaded, last_updated, homepage, download_link} = plugin[1];
        plugins.push({name, version, author, requires, rating, num_ratings, downloaded, last_updated, homepage, download_link});
      }

      resolve();
    });
  });

  requestPromises.push(requestPromise);
}

Promise.all(requestPromises).then(() => {

  plugins = plugins.sort((plugin1, plugin2) => {
    if(parseInt(plugin1.downloaded) >= parseInt(plugin2.downloaded)){
      return -1;
    } else {
      return 1;
    }
  });

  console.log(JSON.stringify(plugins));
});
















