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
    this.currentPoll= {id:1,user:null,pollName:'',options:[{value:'',vote:0}],isCurrent:false}
    this.state=
    {
      pollList:
        [
          {id:0,user:null,pollName:'test',options:[{value:'test',vote:0}],isCurrent:false}
        ],
      currentPoll:this.currentPoll,
      user:{authenticated:false,username:''},
      IsLoggingIn:false,
      IsSigningUp:false,
      loginError:''
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
    // this.handleVoteAll=this.handleVoteAll.bind(this);
    this.handleLogIn=this.handleLogIn.bind(this);
    this.editPoll=this.editPoll.bind(this)
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
    if (!this.state.user.authenticated){
      alert('You need to log in to create a new Poll')
    }else{
      this.setState({currentPoll:
                      {
                        ...this.state.currentPoll,
                        isCurrent:true,
                        user:this.state.user.username
                      }
                  })
    }
  }


  generatePollName(e){
    let pollName=e.target.value;
    this.setState({currentPoll:{...this.state.currentPoll,pollName}})
  }
  
  addOption(){
    let newOption={value:'',vote:0};
    this.setState({currentPoll:
      {...this.state.currentPoll,
        options:[...this.state.currentPoll.options, newOption]
      }
    })
  }

  addOptionValue(e,position){
    let options=this.state.currentPoll.options.slice();
    options[position].value=e.target.value;
    this.setState({currentPoll:
      {...this.state.currentPoll,options}
    });
  }


  submitPoll(){
    let filterBlank=this.state.currentPoll.options.filter(each=>each.value!=="");
      if(typeof(this.state.currentPoll.PollNum)==='number'){//need to be improved?
        let pollList=this.state.pollList.slice();
        pollList.splice(this.state.currentPoll.PollNum,1,{...this.state.currentPoll,isCurrent:false,PollNum:null})
        this.setState({currentPoll:this.currentPoll, pollList:pollList})
      }else{
        this.setState(preState=>{
          return {pollList:[...preState.pollList,
                          {...preState.currentPoll,options:filterBlank,isCurrent:false}],
                currentPoll:{pollName:'',options:[{value:'',vote:0}],isCurrent:false}
                }})
    }
  }

  handleVote(e,position,index){
    let pollList=this.state.pollList.slice();//this can be improved later with Immutable.js
    if(e.target.checked){
      pollList[index].options[position].vote+=1;
    }else{
      pollList[index].options[position].vote-=1;
    }
    console.log('index ',index,position,' vote:', pollList[index].options[position].vote)
    this.setState({pollList:pollList})
  }

  editPoll(index){
    this.setState({currentPoll:{...this.state.pollList[index],isCurrent:true,PollNum:index}})
    console.log(this.state.currentPoll)
  }

  handleSignUp(e){
    e.preventDefault();
    let userLogin={
        username:e.target.username.value,
        password:e.target.password.value
      }
    fetch('/signup',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},//content-type is a must
      body:JSON.stringify(userLogin)
    }).then(res=>{return res.json()})
       .then(result=>{console.log(result)})
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
    }).then(res=>{return res.json()})
       .then(result=>{
          if(!result.error){
            console.log(result.poll)
            window.sessionStorage.setItem("token",result.token);
            window.sessionStorage.setItem("username",result.username);
            window.sessionStorage.setItem("authenticated",JSON.stringify(result.authenticated))
            window.sessionStorage.setItem("poll",JSON.stringify(result.poll))
            console.log('session: ',window.sessionStorage)
            let user =
              {
                username:sessionStorage.getItem('username'),
                token:sessionStorage.getItem('token'),
                authenticated:JSON.parse(sessionStorage.getItem('authenticated')),
                poll:JSON.parse(sessionStorage.getItem('poll'))
              }
            this.setState({user:result,IsLoggingIn:false})
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
          /> 
      </Grid>
    );
  }
}

export default App;
