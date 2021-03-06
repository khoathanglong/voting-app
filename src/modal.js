import React from 'react'
import {Form, Button, Modal,FormControl,ControlLabel,Glyphicon,InputGroup} from 'react-bootstrap'
export default (props)=>{
	const NameForm=
		<Form inline>
	        <FormControl 
	              type='text' 
	              placeholder="Poll Name" 
	              defaultValue={props.currentPoll.pollName}
	              onChange={props.generatePollName}
	         />{' '}
	        <ControlLabel style={{marginTop:'5px'}}>{props.currentPoll.pollName}</ControlLabel>
		</Form>   

	return (
		<div>
			<Modal
              	bsSize="large"
              	aria-labelledby="contained-modal-title-lg"
              	onHide={props.closeModal}
              	show={props.currentPoll.isCurrent}
            >
                <Modal.Header>
                  <Modal.Title>
                    {NameForm}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row">
                	{props.currentPoll.options.map((option,position)=>{
                		return (
                			<InputGroup inline style={{margin:'15px'}} key={position}>
		                      <InputGroup.Addon 
		                      	style={{cursor:'pointer'}}
		                      	onClick={props.addOption}
		                      >
		                        	<Glyphicon glyph="glyphicon glyphicon-plus" />
		                      </InputGroup.Addon>
			                      <FormControl 
			                        type="text"
			                        placeholder="Enter Option"
			                        defaultValue={option.value}
			                        onChange={(e)=>props.addOptionValue(e,position)}
			                      /> 
			                      <InputGroup.Addon  >
			                        <span style={{verticalAlign:'middle'}}>{option.vote}</span>
			                      </InputGroup.Addon>
		                    </InputGroup>  
                		)
                	})}

                
                  {/*continue here*/}
                  
                  
                 
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={props.submitVote}>Confirm</Button>
                  <Button onClick={props.closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>


		</div>

	)
}