const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080 || process.env.port;


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var data=[];

app.get('/',function (req,res) {
  res.status(200).send();
});

app.get('/api/:id', function(req,res){
  res.send(data[req.params.id]);
})

app.post('/api/:id',function (req,res) {
  data[req.params.id] = req.body;
  res.send(data);
});

app.post('/auth', function(req,res) {
  console.log('form submitted');
  data[1]= req.body.username;
  data[2] = req.body.password;
  res.status(200);
  res.redirect("http://localhost:3000");
})

app.listen(PORT);