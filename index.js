//heroku apps requires a Procfile file in order to run
//its content can be: "web: node index.js"

//best to creat a .gitignore file that ignores node_modules; 
//this way, local copies will not interfere with those that will be generated on herkou

//if starting from scratch: use npm init to initialize package.json

const express = require('express')
const bodyParser= require('body-parser')

//for mongodb
const MongoClient = require('mongodb').MongoClient

//for discordbot====================================================================
const Discord = require("discord.js");
const client = new Discord.Client();
const adChnl_Cn = '398750522569654272'
const adChnl_En = '398750484870987777'

//use Heroku GUI or Heroku CLI to store the discord token on Heroku under any preferred name
//e.g., discordToken
client.login(process.env.discordToken);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);  
	console.log(client.status)
});

client.on('message', msg => {
	/*
	if (msg.content === 'ping') {
		msg.reply('Pong!');	
	}
	*/
}); 
        
//end discordbot====================================================================





//for websocket=====================================================================
const WebSocket = require('ws');

const wss = new WebSocket('wss://kamadan.decltype.org/ws/notify');

wss.on('open', function open() {
	console.log("websocket connected")
})

wss.on('message', function incoming(msg) {
	msg = JSON.parse(msg); 
	let tmp = new Date()
	let csTime = new Date(tmp.getTime()+3600000*8)
	let psTime = new Date(tmp.getTime()-3600000*8)
	  
	let cnTime = csTime.toLocaleDateString('zh-CN')+" "+csTime.toString().replace(/^.+?[0-9]\s([0-9]?[0-9]\:[0-9][0-9]\:[0-9][0-9])\sGMT.+?$/gi, "$1")
		
	let enTime = psTime.toLocaleDateString('en-US')+" "+psTime.toString().replace(/^.+?[0-9]\s([0-9]?[0-9]\:[0-9][0-9]\:[0-9][0-9])\sGMT.+?$/gi, "$1")
	  		
		
	client.channels.get(adChnl_Cn).send(cnTime+" "+msg.name+": "+msg.message)
	client.channels.get(adChnl_En).send(enTime+" "+msg.name+": "+msg.message)
		
})
//end websocket======================================================================
 
//use port given by heroku
const PORT = process.env.PORT || 5000

const app = express()

//expand the functionalities of express
//to process items such as form input
app.use(bodyParser.urlencoded({extended: true}))

//Don't install mlab through heroku addon; that process requires credit cards
//Instead, visit mlab.com to create a free/sandbox database there 
//After a database is created, create a user under its "users" tab
//Record the database URI in some heroku environment variable, either by using the heroku GUI or heroku CLI:
//For CLI, the command is: 
//heroku config:set mlabURI=mongodb://<dbuser>:<dbpassword>@ds147872.mlab.com:47872/chatbotjs -a chatbotjs (or other appname)
//can use any other name besides mlabURI to store the URI
MongoClient.connect(process.env.mlabURI, (err, database) => {
	if (err) return console.log(err)
	db = database

	//only listen to web traffic after database is connected
	app.listen(PORT, function() {
		console.log(`Listening on ${ PORT }`)
	})
})

//regular page visits to specified paths, here '/' indicates "home page"
app.get('/', (req, res) => {
	//requires the actual path to where this project resides ("root directory")
	//else node won't be able to resolve the relative path to index.html
	//b/c relative paths are relative to this directory
	res.sendFile(__dirname + '/index.html')	
});

//form posts to "/quotes", 
//data sent from form elements with an "action" attribute matching "/quotes" will be handled here
//requires the bodyParser middleware to function (loaded above)
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