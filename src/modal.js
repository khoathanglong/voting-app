import React from 'react'
import {Form, Button, Modal,FormControl,ControlLabel,Glyphicon,Col,Row} from 'react-bootstrap'
export default (props)=>{
	const NameForm=
		<Form inline>
	        <FormControl 
	              type='text' 
	              placeHolder="Poll Name" 
	              defaultValue={props.currentPoll.pollName}
	              onChange={props.generatePollName}
	         />{' '}
	      {/*  <Button onClick={props.setPollName}>Confirm</Button>{' '}*/}
	        <ControlLabel>{props.currentPoll.pollName}</ControlLabel>
		</Form>

    const NameDisPlay=
	    <ControlLabel>{props.currentPoll.pollName}{' '} 
	        <Glyphicon 
	           onClick={props.setPollName} 
	           style={{fontSize:'0.6em',cursor:'pointer'}} 
	           glyph="glyphicon glyphicon-edit" 
	        />
	   </ControlLabel>    

	return (
		<div>
			<Modal
              	bsSize="large"
              	aria-labelledby="contained-modal-title-lg"
              	onHide={props.closeModal}
              	show={props.currentPoll.modalShow}
            >
                <Modal.Header>
                  <Modal.Title>
                    {props.currentPoll.settingName?NameForm:NameDisPlay}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row">
                	{props.currentPoll.options.map((option,position)=>{
                		return (
                			<Row style={{margin:'15px', marginLeft:'0'}}> 
			                    <Col xs='8' sm='10'>
			                      <FormControl 
			                        type="text"
			                        placeHolder="Enter Option"
			                        defaultValue={option.value}
			                        onChange={(e)=>props.addOptionValue(e,position)}
			                      /> 
			                    </Col>
			                    <Col xs= '3' sm='2'>
			                      <Button onClick={props.addOption}>
			                        <Glyphicon glyph="glyphicon glyphicon-plus" />
			                      </Button>
			                    </Col>
		                    </Row>  
                		)
                	})}

                
                  {/*continue here*/}
                  
                  
                 
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={props.closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>


		</div>

	)
}