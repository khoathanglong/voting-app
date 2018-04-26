const express = require('express');
const app = express ();
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const url= 'mongodb://<username>:<password>@ds247439.mlab.com:47439/kd-voting-app';
const auth=require('./auth.js');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt= require('bcrypt');
const verifyToken=require('./verify-token.js')
const bodyParser= require('body-parser');
const morgan= require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());	

MongoClient.connect(url,(err,client)=>{
	assert.equal(err,null);
	console.log('connected to server');
	const db = client.db('kd-voting-app');
	
	app.post('/signup', (req,res)=>{
		let username=req.body.username;
		db.collection('users').findOne({username:username},(err,result)=>{//add username
			assert.equal(null,err);
			if(result){
				res.json({error:`username ${username} already exists`});
			}else{
				let password=bcrypt.hash(req.body.password,10,(err,hash)=>{
					if (err){
						res.status(500).json({errror: err})
					}else{
						db.collection('users').insertOne({
							username:username,
							password:hash,
							votedOnPoll:[] //user voted on poll and options? // 1:{} is the sample 
						}).then(()=>{res.json({message:`account created successfully`})})
					}
				});
				
			}

		})
	});

    app.post('/login',(req,res)=>{
        db.collection('users').findOne({username:req.body.username},(err,result)=>{
       		if(!result){
       			return res.status(500)
       					.json({error:'Username or Password is wrong, please try again'})}
       		bcrypt.compare(req.body.password,result.password,(err,matchPassword)=>{
       			if(err){return err};
       			if (!matchPassword){
       				return res.status(500)
       						.json({error:'Username or Password is wrong, please try again'})
       			};
       			const payload={
       				votedOnPoll:result.votedOnPoll,
       				username:result.username,
       				authenticated:true
       			};
       			const token =jwt.sign(payload,auth.secret,{
       				 expiresIn : 60*60//24 hours
       			});
       			res.json({
       				token:token,
       				authenticated:true,
       				votedOnPoll:result.votedOnPoll,
       				username:result.username
       			});
       		});   		
       });
      
    });
    //handle editPoll and create new poll
	app.post('/verify',verifyToken,(req,res)=>{
		//if token is true, verify it
		db.collection('users').findOne({username:req.userData.username},(err,result)=>{
				res.json({...req.userData,votedOnPoll:result.votedOnPoll})
			}
		)
	});

	app.get('/polls',(req,res)=>{
		db.collection('polls').find({},{_id:0})
		.toArray((err,result)=>{
			assert.equal(null,err);
			res.json({pollList:result})
		})
	})

	app.put('/poll/edit',verifyToken,(req,res)=>{
		let updatedPoll=req.body.poll;
		db.collection('polls').findOne({id:updatedPoll.id},(err,result)=>{
			assert.equal(null,err);
			if(!result){
				db.collection('polls').insertOne(updatedPoll);
				res.json({message:'New poll added successfully'})
			}else{
				//handle update here
				//can be vote update or options update
				//easy but not optimized by replace the whole document with the new one
				db.collection('polls').updateOne(
					{id:updatedPoll.id},
					{$set:{options:updatedPoll.options,pollName:updatedPoll.pollName}}
				)
				.then(()=>{res.json({message:'your poll is editted successfully'})})
			}
		});
	});

	app.put('/poll/vote',(req,res)=>{
		let updatedPoll=req.body.poll;
		updatedPoll.options.forEach(each=>{each.isVoted=false})
		db.collection('polls').updateOne(
			{id:updatedPoll.id},
			{$set:{options:updatedPoll.options,pollName:updatedPoll.pollName}}
		)
	})	

	app.put('/vote/user/:username',(req,res)=>{
			let username=req.params.username;
			if(username){
				db.collection('users').updateOne(
					{username:username},
					{$set:{votedOnPoll:req.body.votedOnPoll}}
				)
			}
	})

	
})//outer
app.listen(process.env.PORT ||3001,()=>{console.log('server connected')})