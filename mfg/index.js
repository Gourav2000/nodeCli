const express = require('express');
const generateFlamegraph = require('./index');

const app = express();

function createLeak() {
    const arr = [];
    setInterval(() => {
      arr.push(new Array(10000));
    }, 1000);
  }
  
  app.get('/', (req, res) => {
    createLeak();
    res.send('Memory leak created!');
  });
  
  app.listen(3000, () => {
    console.log('App listening on port 3000');
  });




// ...
