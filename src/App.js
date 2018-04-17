//tomorrow task: add votedOnPoll when authenticated User votes

import React, { Component } from 'react';
import './App.css';
import {Grid} from 'react-bootstrap';
import ModalPoll from './modal.js';
import PanelList from './poll_list.js';
import SignUp from './signup.js';
import LogIn from './login.js';
import MyNavbar from './nav.js';
class App extends Component {
  constructor(){
    super();
    this.currentPoll= {id:null,createdBy:'',pollName:'',options:[{value:'',vote:0,isVoted:false}],isCurrent:false}
    this.state=
    {
      pollList:
        [
          // {id:1,createdBy:'admin',pollName:'Sample',options:[{value:'test',vote:0,isVoted:false}],isCurrent:false}
        ],
      currentPoll:this.currentPoll,
      user:{username:'',votedOnPoll:[],loggedIn:false},
      IsLoggingIn:false,
      IsSigningUp:false,
      loginError:'',
      signupError:'',
    };
    this.openLogIn=this.openLogIn.bind(this);
    this.openSignUp=this.openSignUp.bind(this);
    this.closeModal=this.closeModal.bind(this);
    this.createNewPoll=this.createNewPoll.bind(this);
    this.generatePollName=this.generatePollName.bind(this);
    this.submitPoll=this.submitPoll.bind(this);
    this.addOption=this.addOption.bind(this);
    this.addOptionValue=this.addOptionValue.bind(this);
    this.handleVote=this.handleVote.bind(this);
    this.handleSignUp=this.handleSignUp.bind(this);
    this.handleLogIn=this.handleLogIn.bind(this);
    this.userVerify=this.userVerify.bind(this);
    this.openEditPanel=this.openEditPanel.bind(this);
    this.handleLogOut=this.handleLogOut.bind(this);
    this.fetchLogin=this.fetchLogin.bind(this)
  }

  componentDidMount(){
    fetch('/polls')
    .then(res=>res.json())
    .then(result=>{
      this.setState(preState=>{
        return {pollList:preState.pollList.concat(result.pollList)}
      })
    })
    .then(()=>{ //must set pollList state before verify user
       const token=sessionStorage.getItem('token');
      if(token){
        this.userVerify();
      }
    })
   
  }

  openLogIn(){
    this.setState(preState=>{
      return {IsLoggingIn:!preState.IsLoggingIn}
    })
  }
  openSignUp(){
    this.setState(preState=>{
      return {IsSigningUp:!preState.IsSigningUp}
    })
  }

  closeModal(){
    this.setState({currentPoll:this.currentPoll})
  }

  createNewPoll(){
    this.setState(preState=>{
        return {
          currentPoll:{
            id:null,createdBy:'',pollName:'',options:[{value:'',vote:0,isVoted:false}],
            isCurrent:this.state.user.username===""?false:true
          }
        }
      })
  }


  generatePollName(e){
    let pollName=e.target.value;
    this.setState({currentPoll:{...this.state.currentPoll,pollName}})
  }
  
  addOption(){
    let newOption={value:'',vote:0};
    this.setState(preState=>{
      return{
        currentPoll:
          {...preState.currentPoll,
            options:[...preState.currentPoll.options, newOption]
          }
      }
    })
  }

  addOptionValue(e,position){
    let options=this.state.currentPoll.options.slice();
    options[position].value=e.target.value;
    this.setState(preState=>{
      return {
        currentPoll:
          {...preState.currentPoll,options:options}
      }
    });
  }
  fetchUserVote(votedOnPoll){
    fetch(`/vote/user/${this.state.user.username}`,{
      method:'put',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({votedOnPoll:votedOnPoll})
    })

  }
  submitPoll(){
    let filteredBlankOptions=this.state.currentPoll.options.filter(each=>each.value!=="");
    if(typeof(this.state.currentPoll.id)==='number'){//need to be improved?//editing Poll
      let edittingPoll= {...this.state.currentPoll,isCurrent:false,options:filteredBlankOptions}
      let pollList=this.state.pollList.slice();
      pollList.splice(this.state.pollList.findIndex(el=>el.id===this.state.currentPoll.id),1,edittingPoll);
      this.updatePoll(edittingPoll)//fetch updated poll
      this.setState({currentPoll:this.currentPoll, pollList:pollList});
    }else{//create new poll
      let newPoll= {
                      ...this.state.currentPoll,
                      options:filteredBlankOptions,
                      isCurrent:false,
                      id:Math.floor(Math.random()*100+10)+Date.now(),
                      createdBy:this.state.user.username
                    };
      this.updatePoll(newPoll);
      this.setState(preState=>{
        let newUnvotedPoll;
        if (this.state.user.username!==""){
          newUnvotedPoll={};
          newUnvotedPoll[newPoll.id]=[];//create an element of unVotedPoll
        }
        let fetchVotedOnPoll=preState.user.votedOnPoll.concat([newUnvotedPoll]);
        return  {
                  pollList:
                    [...preState.pollList,
                      newPoll
                    ],
                    user:{...preState.user, votedOnPoll:fetchVotedOnPoll},
                  currentPoll:{id:null,pollName:'',options:[{value:'',vote:0,isVoted:false}],isCurrent:false}
                  //resset current poll
                };
      });
    }
  }

  updatePoll(newPoll){
    fetch('/poll/edit',{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({poll:newPoll,token:sessionStorage.getItem('token')})
      })
      .then(res=>res.json())
      .then(result=>{
        console.log(result)
      })
  }

  votePoll(newPoll){
    fetch('/poll/vote',{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({poll:newPoll,token:sessionStorage.getItem('token')})
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
    });
  }

  handleVote(e,position,index,pollId){
    let pollList=this.state.pollList.slice();//this can be improved later with Immutable.js
    let votedOnPoll= this.state.user.votedOnPoll.slice();
    let votedOption=votedOnPoll[votedOnPoll.findIndex(el=>el.hasOwnProperty(pollId))];
    console.log('votedOption:', votedOption)
    if(e.target.checked){
      pollList[index].options[position].vote+=1;
      pollList[index].options[position].isVoted=true;
      if(votedOption){console.log('zz',votedOption[pollId],position)
        votedOption[pollId].push(position);//add options that user voted    
      }else{//create the first vote
        let voteOnNewPoll= {};
        voteOnNewPoll[pollId]=[position];
        votedOnPoll.push(voteOnNewPoll);console.log('yyy:', votedOnPoll)
      };console.log('votedOnPollafterCheck:', votedOnPoll)
    }else{
      pollList[index].options[position].vote-=1;
      pollList[index].options[position].isVoted=false;
        votedOption[pollId].splice(votedOption[pollId].findIndex(el=>el===position),1);//remove options that user unchecks 
        console.log('position',position,votedOption[pollId])   
        console.log('votedOnPollfinalzz:', votedOnPoll)   
    }
    console.log('votedOnPollfinal:', votedOnPoll)
    this.votePoll({...pollList[index]}); // Put updated poll to the server
    this.fetchUserVote(votedOnPoll) ;
    this.setState((preState)=>
      (
        {
          pollList:pollList,
          user:{...preState.user,votedOnPoll:votedOnPoll}
        }
      )  
    );
  }
  openEditPanel(index){
    this.setState(preState=>{
      return {
        currentPoll:{
          ...preState.pollList[index],
          isCurrent:this.state.user.username===preState.pollList[index].createdBy
                    &&this.state.user.username!==""?true:false
        }
      }
    })
  }
  checkUserVoted(user){
     // user:{
     //          username:result.username,
     //          votedOnPoll:result.votedOnPoll,
     //          loggedIn:result.authenticated
     //        } user should look like this

    let userPollList= this.state.pollList.slice();
      userPollList.forEach((poll,index)=>{
        user.votedOnPoll.forEach((pollVote,position)=>{
          if (poll.id in pollVote){
            let newpollOptions=poll.options.map((each,i)=>{
              if(pollVote[poll.id].indexOf(i)===-1){
                return each
              }else{
                return {...each,isVoted:true}
              }
            });
            poll.options=newpollOptions;
          };
        });
      });
    this.setState({user:user,IsLoggingIn:false,pollList:userPollList})
  }
  userVerify(){
    fetch("/verify",{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({token:sessionStorage.getItem('token')})
    })
    .then(res=> res.json())
    .then(result=>{
      if(result.username){
        let user={
          username:result.username,
          votedOnPoll:result.votedOnPoll,
          loggedIn:result.authenticated
        }
        this.checkUserVoted(user); //this will set user state and check all polls that user already voted
      }
    })
  }

  fetchLogin(username,password){
    let userLogin={
        username,
        password
      };
    fetch('/login',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},//content-type is a must
      body:JSON.stringify(userLogin)
    })
    .then(res=>{return res.json()})
    .then(result=>{
          if(!result.error){
            window.sessionStorage.setItem("token",result.token);
            let user =
              {
                username:result.username,
                votedOnPoll:result.votedOnPoll,
                loggedIn:result.authenticated
              };
           //checked all the options that user already voted before
          this.checkUserVoted(user);
          }else{
            this.setState({loginError:result.error})
          }
       })
  }

  handleSignUp(e){
    e.preventDefault();
    let userSignUp={
        username:e.target.username.value,
        password:e.target.password.value
      }
    fetch('/signup',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},//content-type is a must
      body:JSON.stringify(userSignUp)
    })
    .then(res=>{return res.json()})
    .then(result=>{
          if(!result.error){
            this.setState({IsSigningUp:false})
            this.fetchLogin(userSignUp.username,userSignUp.password)
            alert(result.message)
          }else{
            this.setState({signupError:result.error})
          }
       })
  }


  handleLogIn(e){
    e.preventDefault();
    this.fetchLogin(e.target.username.value,e.target.password.value)
  }

  handleLogOut(){
    sessionStorage.removeItem('token');
    this.setState({user:{username:'',votedOnPoll:[],loggedIn:false}})
  }
  render() {       
    return (
      <Grid className="App">
          <MyNavbar
            startVote={this.createNewPoll}
            openLogIn={this.openLogIn}
            openSignUp={this.openSignUp}
            user={this.state.user}
            logOut={this.handleLogOut}
          />
          <SignUp 
            handleSignUp={this.handleSignUp}
            openSignUpModal={this.state.IsSigningUp}
            signupError={this.state.signupError}
            handleModalHide={this.openSignUp} 
          />
          <LogIn 
            handleLogIn={this.handleLogIn}
            openLogInModal={this.state.IsLoggingIn}
            loginError={this.state.loginError}
            handleModalHide={this.openLogIn}
          />
          <ModalPoll 
            closeModal={this.closeModal}
            currentPoll={this.state.currentPoll}
            generatePollName={this.generatePollName}
            addOption={this.addOption}
            addOptionValue={this.addOptionValue}
            submitVote={this.submitPoll}
          />
          <PanelList 
            closeModal={this.closeModal}
            pollList={this.state.pollList}
            generatePollName={this.generatePollName}
            setPollName={this.setPollName}
            addOption={this.addOption}
            addOptionValue={this.addOptionValue}
            handleVote={this.handleVote}
            submitVote={this.submitPoll}
            editPoll={this.openEditPanel}
            userVotedOnPoll={this.state.user.votedOnPoll}
          /> 
      </Grid>
    );
  }
}

export default App;
