const express = require('express');
const app = express ();
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const url= 'mongodb://localhost:27017';
const usersData= require('./user.js').users;
const auth=require('./auth.js');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt= require('bcrypt');
const verifyToken=require('./verify-token.js')

bodyParser= require('body-parser');
morgan= require('morgan')
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());	


MongoClient.connect(url,(err,client)=>{
	assert.equal(err,null);
	console.log('connected to server');
	const db = client.db('votingApp');
	const user = new usersData(db);
	
	app.post('/signup', (req,res)=>{
		let username=req.body.username;
		db.collection('users').findOne({username:username},(err,result)=>{//add username
			assert.equal(null,err)
			console.log(result)
			if(result){
				res.json(`username ${username} already exists`)
			}else{
				let password=bcrypt.hash(req.body.password,10,(err,hash)=>{
					if (err){
						res.status(500).json({err: err})
					}else{
						console.log(hash)
						db.collection('users').insertOne({
							username:username,
							password:hash,
							poll:[] //list of user's poll
						}).then(()=>{res.json(`account created successfully`)})
					}
				});
				
			}

		})
	});

    app.post('/login',(req,res)=>{
     	console.log(req.body.username)
       db.collection('users').findOne({username:req.body.username},(err,result)=>{
       		if(!result){
       			return res.status(500)
       					.json({error:'Username or Password is wrong, please try again'})}
       		bcrypt.compare(req.body.password,result.password,(err,matchPassword)=>{
       			console.log(matchPassword)
       			if(err){return err}
       			if (!matchPassword){
       				return res.status(500)
       						.json({error:'Username or Password is wrong, please try again'})
       			}
       			const payload={
       				authenticated:result.authenticated,
       				username:result.username
       			}
       			const token =jwt.sign(payload,auth.secret,{
       				 expiresIn : 60*60//24 hours
       			});

       			res.json({
       				token:token,
       				authenticated:true,
       				poll:result.poll,
       				username:result.username
       			})
       		})   		
       })
      
    })	
	
})//outer




app.listen(3001,()=>{console.log('server connected on:3001')})