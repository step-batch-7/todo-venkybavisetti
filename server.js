const fs = require('fs');
const defaultPort = 4000;
const { app } = require('./lib/route');

const setUpDataBase = function() {
  const data = `${__dirname}/data`;
  if (!fs.existsSync(`${data}`)) {
    fs.mkdirSync(data);
  }
};

const main = function() {
  setUpDataBase();
  app.listen(defaultPort, () =>
    console.log(`Server is listening on ${defaultPort}`)
  );
};

main();
