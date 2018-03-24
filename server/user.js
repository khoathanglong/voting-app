const MongoClient =require('mongodb').Client,
		assert =require('assert')

 function users(db){
	this.db = db.collection('users');

	this.addNewUser = (newUser)=>{
		this.db.insertOne(newUser)
	}

	this.isExisted =(name,callback)=>{
		this.db.findOne({name:name}, (err, result)=>{
			if (err) {assert(null,err)}
			if (result) {
				return true
			}else{
				callback
				return false
			}
			
		})
	}
	this.getUser=(name)=>{
		this.db.find({name:name}).toArray((err,result)=>{
			console.log(result[0])
			return result[0]
		})
	}
}

module.exports.users=users