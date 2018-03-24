import React, { Component } from 'react';
import './App.css';
import {Button,Grid,Form, FormControl} from 'react-bootstrap'
import ModalPoll from './modal.js'
import PanelList from './poll_list.js'
class App extends Component {
  constructor(){
    super();
    this.state={pollList:[{user:null,pollName:'test',options:[{value:'test',vote:0}],isCurrent:false}],
                currentPoll:{user:null,pollName:'',options:[{value:'',vote:0}],isCurrent:false}};
    this.closeModal=this.closeModal.bind(this);
    this.createNewPoll=this.createNewPoll.bind(this);
    this.generatePollName=this.generatePollName.bind(this);
    this.submitVote=this.submitVote.bind(this);
    this.addOption=this.addOption.bind(this);
    this.addOptionValue=this.addOptionValue.bind(this);
    this.handleVote=this.handleVote.bind(this);
  }

  closeModal(){
    this.setState({currentPoll:{...this.state.currentPoll,isCurrent:false}})
  }

  createNewPoll(){
    this.setState({currentPoll:{...this.state.currentPoll,isCurrent:true}})
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
    })
  }

  handleVote(e,position){
    let options=this.state.currentPoll.options.slice();
    options[position].vote
    if(e.target.checked){
      options[position].vote++
    }else{
      options[position].vote--
    }
    this.setState({currentPoll:
      {...this.state.currentPoll,options}
    })
  }

  submitVote(){
    let filterBlank=this.state.currentPoll.options.filter(each=>each.value!=="");
    this.setState(preState=>{
      return {pollList:[...preState.pollList,
                        {...preState.currentPoll,options:filterBlank,isCurrent:false}],
              currentPoll:{pollName:'',options:[{value:'',vote:0}],isCurrent:false}
              }})
  }
  submitLogin(e){
    e.preventDefault();
    let userLogin={
        username:e.target.username.value,
        password:e.target.password.value
      }
    console.log(e.target.password.value)
    fetch('/login',{
      method:"POST",
      headers:{'Content-Type': 'application/json'},//content-type is a must
      body:JSON.stringify(userLogin)
    }).then(res=>{console.log(res);return res.json()})
       .then(result=>{console.log(result)})
       .catch(err=>{console.log(err)})
    
  }

  render() {       
    return (
      <Grid className="App">
          <Form onSubmit={this.submitLogin}>
            <FormControl  
              type="text"
              placeHolder="User Name"
              name="username"
              required
            />
            <FormControl
              type="password"
              placeHolder="password"
              name="password"
              required
            />
            <Button type="submit">submit</Button>
          </Form>
          <Button onClick={this.createNewPoll} >New Poll</Button>
          <ModalPoll 
            closeModal={this.closeModal}
            currentPoll={this.state.currentPoll}
            generatePollName={this.generatePollName}
            addOption={this.addOption}
            addOptionValue={this.addOptionValue}
            handleVote={this.handleVote}
            submitVote={this.submitVote}
          />
          <PanelList 
            closeModal={this.closeModal}
            pollList={this.state.pollList}
            generatePollName={this.generatePollName}
            setPollName={this.setPollName}
            addOption={this.addOption}
            addOptionValue={this.addOptionValue}
            handleVote={this.handleVote}
            submitVote={this.submitVote}
          /> 
      </Grid>
    );
  }
}

export default App;
