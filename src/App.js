import React, { Component } from 'react';
import './App.css';
import {Button} from 'react-bootstrap'
import ModalPoll from './modal.js'
class App extends Component {
  constructor(){
    super();
    this.state={pollList:[{pollName:'',options:[{value:'',vote:0}],modalShow:true,settingName:true,isCurrent:false}],
                currentPoll:{pollName:'',options:[{value:'',vote:0}],modalShow:true,settingName:true,isCurrent:true}};
    this.closeModal=this.closeModal.bind(this);
    this.createNewPoll=this.createNewPoll.bind(this);
    this.generatePollName=this.generatePollName.bind(this);
    this.setPollName=this.setPollName.bind(this);
    this.addOption=this.addOption.bind(this);
    this.addOptionValue=this.addOptionValue.bind(this)
  }

  closeModal(){
    this.setState({currentPoll:{...this.state.currentPoll,modalShow:false}})
  }

  createNewPoll(){
    this.setState({currentPoll:{...this.state.currentPoll,modalShow:true}})
  }

  generatePollName(e){
    let pollName=e.target.value;
    this.setState({currentPoll:{...this.state.currentPoll,pollName}})
  }

  setPollName(e){
    let pollName=e.target.value;
    this.setState({currentPoll:{...this.state.currentPoll,settingName:!this.state.currentPoll.settingName}})
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
    console.log(e.target.value)
    this.setState({currentPoll:
      {...this.state.currentPoll,options}
    })
  }

  render() {       
    return (
      <div className="App">
          <Button onClick={this.createNewPoll} >New Poll</Button>
          <ModalPoll 
            closeModal={this.closeModal}
            currentPoll={this.state.currentPoll}
            generatePollName={this.generatePollName}
            setPollName={this.setPollName}
            addOption={this.addOption}
            addOptionValue={this.addOptionValue}
          />

            
      </div>
    );
  }
}

export default App;
