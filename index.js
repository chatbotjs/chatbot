const express = require('express')
const bodyParser= require('body-parser')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient

/*
MongoClient.connect('link-to-mongodb', (err, database) => {
  // ... start the server
})
*/

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.listen(PORT, function() {
  console.log("Listening on: "+PORT)
})

app.get('/', (req, res) => {
	res.sendFile('/index.html')
	//res.send('hello world')
});

app.post('/quotes', (req, res) => {
  console.log(req.body)
})