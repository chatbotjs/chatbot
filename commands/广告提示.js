exports.run = async (discordClient, mongoConnect, adMode, msg, args) => {
	
	console.log(adMode)
	/*In traditional relational databases, associations (probably means relations) are used to relate data from one table to another. MongoDB and similar NoSQL databases are document-oriented (there are no tables), so relationships are drawn between document-objects instead.  SEE: ObjectID function*/
  	
	//the db name is the one created on mlab, before creation of user
	
	let r = await dpOperation(discordClient, mongoConnect, adMode, msg, args)
	console.log("out await, operation done")
	msg.author.send("operation done")
	
	mongoConnect.then(async function(client) {	
		let database = client.db("chatbotjs")
		let r = await database.collection("channelUsers").find( {_id:msg.author.id}).project( { "notify": 1, _id: 0 } ).toArray()
		console.log(r)
		if (r.length > 0) {
			msg.author.send("Currently tracking: "+r[0].notify.toString())
			console.log("currently tracking")
		}
	}).catch(console.error)	
}

function dpOperation(discordClient, mongoConnect, adMode, msg, args){
	console.log("in promise")
	return new Promise((resolve, reject)=>{
		switch(adMode){
			case "+":
				if (args.length != 0){
					mongoConnect.then(async function(client) {
						let database = client.db("chatbotjs")
						let r = await database.collection("channelUsers").updateMany({_id:msg.author.id}, {
								$set: {name: msg.author.username},
								$addToSet: { notify: { $each: args } } 
							}, {
							upsert: true
						})
						msg.author.send("done inserting")
						console.log("done inserting, actually resolved")
						resolve("done")
					}).catch(err => {
						console.log(err)
						reject(err)
					})
				} else {
					msg.channel.send("Missing argument")
					resolve("done")
				}
				break
			case "-":
				if (args.length != 0){
					mongoConnect.then(async function(client) {	
						let database = client.db("chatbotjs")
						let r = await database.collection("channelUsers").updateMany( {_id:msg.author.id}, { $pullAll: { notify: args } } )
						resolve("done")
					}).catch(err => {
						console.log(err)
						reject(err)
					})
				} else {
					msg.channel.send("Missing argument")
					resolve("done")
				}
				break
			case "~":
				mongoConnect.then(async function(client) {	
					let database = client.db("chatbotjs")
					let r = await database.collection("channelUsers").updateMany( {_id:msg.author.id}, { $set: { notify: [] } } )
					resolve("done")
				}).catch(err => {
					console.log(err)
					reject(err)
				})
				break
			default:
				console.log("default reached")
				//resolve("done")
		}
		console.log("out promise")
	})	
}