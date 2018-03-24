const express = require('express');
const app = express ();
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const url= 'mongodb://localhost:27017';
const usersData= require('./user.js').users;
const auth=require('./auth.js');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt= require('bcrypt')

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
	

	// app.get('/login',(req,res)=>{
	// 	db.collection('user').add
	// });

	app.post('/signup', (req,res)=>{
		let username=req.body.username;
		let password=bcrypt.hash(req.body.password,10,(err,hash)=>{
			if (err){
				res.status(500).json({err: err})
			}else{
				
			}
		});

		db.collection('users').findOne({name:username},(err,result)=>{//add username
			assert.equal(null,err)
			if(result){
				res.json(`username ${username} already exists`)
			}else{console.log(username)
				let password=bcrypt.hash(req.body.password,10,(err,hash)=>{
					if (err){
						res.status(500).json({err: err})
					}else{
						console.log(hash)
						db.collection('user').insertOne({
							username:username,
							password:hash
						})
					}
				});
				
			}

		})
	});

    app.post('/login',(req,res)=>{
     	console.log(req.body)
       db.collection('users').findOne({name:req.body.username},(err,result)=>{
       		if(!result){res.status(500).json({error:'Username or Password is wrong or not exists'})}
       		else if(req.body.password!==result.password){
       			res.status(500).json({error:'Username or Password is wrong or not exists'})
       		}else{
       			const payload={
       				admin:result.admin,
       				username:result.username
       			}
       			const token =jwt.sign(payload,auth.secret,{
       				 expiresIn : 60*60*24 //24 hours
       			});

       			res.json({
       				token:token,
       				authenticated:true,
       				...result
       			})
       		}
       		
       })
      
    })	
	
})




app.listen(3001,()=>{console.log('server connected on:3001')})