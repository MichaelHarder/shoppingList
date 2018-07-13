var cors = require('cors');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db;

app.use(cors());
app.use(express.json());

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) throw err;

  db = client.db('shoppingList');

  app.listen(3000);
  console.log('Listening on port 3000');
});

app.get('/', function(req, res, next) {
  res.send('GET: ' + req.url);
  console.log('GET: ' + req.url);
});

app.post('/', function(req, res, next) {
  res.send('POST: ' + req.url);
  console.log('POST: ' + req.url);
});

app.get('/api/items', function(req, res) {
  console.log('GET: ' + req.url);

  db.collection('item').find().toArray(function (err, result) {
    if (err) throw err;

    res.send(result);
    console.log(result);
  });
});

app.post('/api/items', function(req, res) {
  console.log('POST: ' + req.url);

  var myobj = { text:req.body.text, category:req.body.category, checked:req.body.checked };
  db.collection("item").insertOne(myobj, function(err, result) {
    if (err) throw err;
    console.log("result.insertedId: " + result.insertedId);
    res.send(result.insertedId);
  });
});

app.delete('/api/items/:id', function(req, res) {
  console.log('DELETE: ' + req.url );

  var myquery = { _id: new ObjectID(req.params.id) };
  db.collection("item").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log('obj: ' + obj);
    res.send(obj);
  });
});

app.put('/api/items/:id', function(req, res) {
  console.log('PUT: ' + req.url );

  var myquery = { _id: new ObjectID(req.params.id) };
  db.collection("item").updateOne(myquery, { $set: {checked: req.body.checked} }, function(err, result) {
    if (err) throw err;
    console.log('result: ' + result);
    res.send(result);
  });
});
