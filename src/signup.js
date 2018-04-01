import React from 'react'
import {Modal,Form, FormControl,ControlLabel,Col,Button,Row} from 'react-bootstrap'

export default (props)=>{
	return (
		<Modal
			show={props.openSignUpModal}
			onHide={props.handleModalHide}
		>
			<Form onSubmit={props.handleSignUp} style={{margin:'10px'}}>
					<ControlLabel>Email:</ControlLabel>
					<FormControl  
	              		type="email"
		             	 placeHolder="email"
		             	 name="username"
		             	 required
		            />
				<br/>
					<ControlLabel>Password:</ControlLabel>
					<FormControl
		              type="password"
		              placeHolder="password"
		              name="password"
		              required
	            	/><br/>
	            	<div style={{textAlign:'center'}}>
	            		<Button type="submit" bsStyle="primary">Sign Up</Button>
	            	</div>     		
	        </Form>
        </Modal>
	)
}