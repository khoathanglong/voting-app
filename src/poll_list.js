import React from 'react'
import {OverlayTrigger ,Tooltip,PanelGroup,Panel,Form, Button, Modal,FormControl,ControlLabel,Glyphicon,Col,Row,InputGroup,Checkbox } from 'react-bootstrap'

export default (props)=>{
	const tooltip = (
			  <Tooltip id="tooltip">
			    edit
			  </Tooltip>
			);
	return(
		<PanelGroup accordion id="accordion-example">
		{props.pollList.map((poll, index)=>{
			return (
				<Panel eventKey={index+1}>
		          	<Panel.Heading style={{textAlign:'left'}} >
		          		<Panel.Title onClick={()=>props.editPoll(index)} 
		          			style={{display:'inline',cursor:'pointer'}}
		          		>
			            	 
			            	<OverlayTrigger placement="left" overlay={tooltip}>
						    	<span>&#x270E;</span>
						    </OverlayTrigger>	
		            	</Panel.Title> {' '}
		            	<Panel.Title style={{display:'inline'}} toggle>
		              		{poll.pollName}{' '}
		              		<i style={{fontSize:'0.8em'}}>created by {poll.createdBy}</i>
		            	</Panel.Title>
		            	
		            	
		          	</Panel.Heading>		         
		            	<Panel.Body collapsible>
		            		<Col xs='12' sm='6'>
								{poll.options.map((option,position)=>{
									let votedPollNum = props.userVotedOnPoll.findIndex(el=>
											{//select the index of poll_id in the list user voted on
												return el.hasOwnProperty(poll.id)
											}
										);
			                		return (
			                				
			                					<InputGroup inline style={{margin:'5px'}}>
								                    <FormControl 
								                        type="button"
								                        placeHolder="Enter Option"
								                        defaultValue={option.value}
								                    /> 
								                    <InputGroup.Addon >
								                        <input 
									                        style={{verticalAlign:'middle'}} 
									                        type="checkbox"
									                        checked={!votedPollNum?props.userVotedOnPoll[votedPollNum][poll.id].includes(position):false}
								                        	onChange={(e)=>props.handleVote(e,position,index,poll.id)}
								                        />{' '}
								                        <span style={{verticalAlign:'middle'}}>{option.vote}</span>
								                    </InputGroup.Addon>
					                    		</InputGroup>
			                				)	
			                	})}
		                	</Col>
		                	<Col xs='12' sm='6'>
		                		Chart Here
		                	</Col>
		           		</Panel.Body>
		           		
		        </Panel>
        	)
        })}
	</PanelGroup>
	)
}