import React, { Component } from 'react';
import './App.css';
import {Button,Grid,Form, FormControl, Alert} from 'react-bootstrap'
import ModalPoll from './modal.js'
import PanelList from './poll_list.js'
import SignUp from './signup.js'
import LogIn from './login.js'
import MyNavbar from './nav.js'
class App extends Component {
  constructor(){
    super();
    this.currentPoll= {id:null,createdBy:'',pollName:'',options:[{value:'',vote:0}],isCurrent:false}
    this.state=
    {
      pollList:
        [
          {id:1,createdBy:'admin',pollName:'Sample',options:[{value:'test',vote:0}],isCurrent:false}
        ],
      currentPoll:this.currentPoll,
      user:{username:'',votedOnPoll:[{1:[]}]},
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
    this.editPoll=this.editPoll.bind(this);
  }

  componentDidMount(){
    fetch('/polls')
    .then(res=>res.json())
    .then(result=>{
      console.log(result.pollList)
      this.setState(preState=>{
        return {pollList:preState.pollList.concat(result.pollList)}
      })
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
    fetch('/verifyToken',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({token:sessionStorage.getItem('token')})
    })
    .then(res=>res.json())
    .then(result=>{
      if(result.authenticated){
        this.setState({currentPoll:
          {
            ...this.state.currentPoll,
            isCurrent:true,
          }
        })
      }else{
        alert(result.message)//server response if token is not correct
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
        let votedOnPoll=preState.user.votedOnPoll.slice();
        let newUnvotedPoll={};
        newUnvotedPoll[newPoll.id]=[];//create an element of unVotedPoll
        return  {
                  pollList:
                    [...preState.pollList,
                      newPoll
                    ],
                    user:{...preState.user, votedOnPoll:preState.user.votedOnPoll.concat([newUnvotedPoll])},
                  currentPoll:{id:null,pollName:'',options:[{value:'',vote:0}],isCurrent:false}
                  //resset current poll
                }
            });
    }
  }

  updatePoll(newPoll){
    fetch('/poll',{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({poll:newPoll,token:sessionStorage.getItem('token')})
      })
      .then(res=>res.json())
      .then(result=>{
        console.log(result)
      })
  }

  handleVote(e,position,index,pollId){
    let pollList=this.state.pollList.slice();//this can be improved later with Immutable.js
    let votedOnPoll= this.state.user.votedOnPoll;
    if(e.target.checked){
      pollList[index].options[position].vote+=1;
      if(this.state.user.username!==""){
        votedOnPoll[votedOnPoll.findIndex(el=>el.hasOwnProperty(pollId))][pollId].concat(position);//add options that user voted        
      }
    }else{
      pollList[index].options[position].vote-=1;
      if(this.state.user.username!==""){
        votedOnPoll[votedOnPoll.findIndex(el=>el.hasOwnProperty(pollId))][pollId].splice(position,1);//add options that user voted        
      }
      //remove options that user unvoted
    }

    this.updatePoll(pollList[index]); // Put updated poll to the server

    this.setState((preState)=>
      (
        {
          pollList:pollList,
          user:{...preState.user,votedOnPoll:votedOnPoll}
        }
      )  
    );
  }

  editPoll(index){
    fetch('/verifyToken',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({token:sessionStorage.getItem('token')})
    })
    .then(res=>res.json())
    .then(result=>{
      if(result.authenticated){
        this.setState(
          {
            currentPoll:
            {...this.state.pollList[index],
              isCurrent:true,
            }
          }
        )
      }else{
        alert(result.message)//message from server when verify token 
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
            alert(result.message)
          }else{
            this.setState({signupError:result.error})
          }
       })
       .catch(err=>{console.log(err)})
  }

  handleLogIn(e){
    e.preventDefault();
    let userLogin={
        username:e.target.username.value,
        password:e.target.password.value
      }
    fetch('/login',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},//content-type is a must
      body:JSON.stringify(userLogin)
    })
    .then(res=>{return res.json()})
    .then(result=>{
          if(!result.error){
            window.sessionStorage.setItem("token",result.token);
            window.sessionStorage.setItem("username",result.username);
            window.sessionStorage.setItem("votedOnPoll",JSON.stringify(result.votedOnPoll))
            let user =
              {
                username:sessionStorage.getItem('username'),
                votedOnPoll:JSON.parse(sessionStorage.getItem('votedOnPoll'))
              };console.log('aaaa',user.votedOnPoll)
            this.setState({user:{...user,votedOnPoll:[{1:[]}]},IsLoggingIn:false})
          }else{
            this.setState({loginError:result.error})
          }
       })
       .catch(err=>{console.log(err)})
  }

  render() {       
    return (
      <Grid className="App">
          <MyNavbar
            startVote={this.createNewPoll}
            openLogIn={this.openLogIn}
            openSignUp={this.openSignUp}
            username={this.state.user.username}
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
            editPoll={this.editPoll}
            userVotedOnPoll={this.state.user.votedOnPoll}
          /> 
      </Grid>
    );
  }
}

export default App;
