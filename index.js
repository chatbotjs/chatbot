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
	res.sendFile(__dirname + '/index.html')
	//res.send('hello world')
});

app.post('/quotes', (req, res) => {
  console.log(req.body)
})

/*
//Original tutorial 

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

*/