const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080 || process.env.port;

app.use(bodyParser.json());

var data;

app.get('/',function (req,res) {
  res.status(200).send();
});

app.get('/api/:id', function(req,res){
  res.send(data);
})

app.post('/api/:id',function (req,res) {
  console.log(req.params);
  console.log('post request successful');
  data = req.body;
  console.log(data);
  res.send(data);
});

app.listen(PORT);