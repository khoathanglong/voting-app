import React from 'react'
import {PanelGroup,Panel,Form, Button, Modal,FormControl,ControlLabel,Glyphicon,Col,Row,InputGroup,Checkbox } from 'react-bootstrap'

export default (props)=>{
	return(
		<PanelGroup accordion id="accordion-example">
		{props.pollList.map((poll, index)=>{
			return (
				<Panel eventKey={index+1}>
		          	<Panel.Heading>
		            	<Panel.Title style={{textAlign:'left'}} toggle>
		              		{poll.pollName}
		            	</Panel.Title>
		          	</Panel.Heading>		         
		            	<Panel.Body collapsible>
							{poll.options.map((option,position)=>{
		                		return (
		                			<InputGroup inline style={{margin:'5px'}}>
					                    <FormControl 
					                        type="text"
					                        placeHolder="Enter Option"
					                        value={option.value}
					                    /> 
					                    <InputGroup.Addon  >
					                        <input 
						                        style={{verticalAlign:'middle'}} 
						                        type="checkbox"
					                        	// onClick={(e)=>props.handleVote(e,position)}
					                        />{' '}
					                        <span style={{verticalAlign:'middle'}}>{option.vote}</span>
					                    </InputGroup.Addon>
				                    </InputGroup>  
		                		)
		                	})}
		           		</Panel.Body>
		        </Panel>
        	)
        })}
	</PanelGroup>
	)
}