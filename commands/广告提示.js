exports.run = async (client, mongoConnect, adMode, msg, args) => {
	//B/c the connection URL links directly to a database, no need to select it with: const db = client.db(dbName);
	console.log(adMode)
	/*In traditional relational databases, associations are used to relate data from one table to another. MongoDB and similar NoSQL databases are document-oriented (there are no tables), so relationships are drawn between document-objects instead.  SEE: ObjectID function*/
  	if (args.length != 0){
		switch(adMode){
			case "+":
				mongoConnect.then(function(database) {								
					database.collection("channelUsers").updateMany({_id:message.author.id}, { $addToSet: { notify: { $each: args } } }, {
						upsert: true
					})
				}).catch(console.error)
				break
			case "-":
				mongoConnect.then(function(database) {		
					database.collection("channelUsers").updateMany( {_id:message.author.id}, { $pullAll: { notify: args } } )
				}).catch(console.error)
				break
			case "~":
				mongoConnect.then(function(database) {		
					database.collection("channelUsers").updateMany( {_id:message.author.id}, { $set: { notify: [] } } )
				}).catch(console.error)
				break
			default:		
				mongoConnect.then(function(database) {		
					database.collection("channelUsers").find( {_id:message.author.id}).project( { "notify": 1, _id: 0 } ).toArray(function(err, r) {
						console.log(r)
					})					
				}).catch(console.error)
		}
	} else {
		console.log("no args provided")
	}
}