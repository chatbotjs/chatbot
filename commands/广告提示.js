exports.run = async (discordClient, mongoConnect, adMode, msg, args) => {
	
	console.log(adMode)
	/*In traditional relational databases, associations (probably means relations) are used to relate data from one table to another. MongoDB and similar NoSQL databases are document-oriented (there are no tables), so relationships are drawn between document-objects instead.  SEE: ObjectID function*/
  	
	switch(adMode){
		case "+":
			if (args.length != 0){
				mongoConnect.then(async function(client) {
					let database = client.db("discord")
					let r = await database.collection("channelUsers").updateMany({_id:msg.author.id}, { $addToSet: { notify: { $each: args } } }, {
						upsert: true
					})
				}).catch(console.error)
			} else {
				console.log("track+ no arguments")
			}
			break
		case "-":
			if (args.length != 0){
				mongoConnect.then(async function(client) {	
					let database = client.db("discord")
					let r = await database.collection("channelUsers").updateMany( {_id:msg.author.id}, { $pullAll: { notify: args } } )
				}).catch(console.error)
			} else {
				console.log("track- no arguments")
			}
			break
		case "~":
			mongoConnect.then(async function(client) {	
				let database = client.db("discord")
				let r = await database.collection("channelUsers").updateMany( {_id:msg.author.id}, { $set: { notify: [] } } )
			}).catch(console.error)
			break
		default:		
			mongoConnect.then(async function(client) {	
				let database = client.db("discord")
				let r = await database.collection("channelUsers").find( {_id:msg.author.id}).project( { "notify": 1, _id: 0 } ).toArray()
				console.log(r)
			}).catch(console.error)
	}	
}