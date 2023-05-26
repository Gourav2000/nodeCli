const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const fg= require("cpuprofile-to-flamegraph");
const fs= require('fs')
const {parse, stringify} = require('flatted');


// const profile = JSON.parse(fs.readFileSync('node.cpuprofile', "utf-8"));
// const flameGraph = fg.convertToMergedFlameGraph(profile);
// console.log(stringify(flameGraph))


// console.log(flameGraph)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const performHeavyTask = () => {
  var heavyTaskCount = 1;
  for (var x = 0; x < 1000000; ++x) {
    heavyTaskCount += Math.sqrt(heavyTaskCount * 3)
  }
  return heavyTaskCount;
}
// to support JSON=encoded bodies
// to support URL=encoded bodies

app.get('/heavy', (req, res) => {
//   console.profile();
  const heavyTaskCount = performHeavyTask();
//   console.profileEnd();
  res.send(JSON.stringify({ status: "ok", heavyTaskCount }));
});

app.listen(port, () => {
})
console.log(`Example app listening on port ${port}`)