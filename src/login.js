import React from 'react'
import {Form, FormControl,ControlLabel,Col,Button,Row,Modal} from 'react-bootstrap'

export default (props)=>{
	return (
		<Modal
			show={props.openLogInModal}
			onHide={props.handleModalHide}
		>
			<Form onSubmit={props.handleLogIn} style={{margin:'10px'}}>
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
	            	<p style={{color:'red',fontSize:'0.8em'}}>{props.loginError}</p>
	            	<div style={{textAlign:'center'}}>
	            		<Button type="submit" bsStyle="primary">Log in</Button>
	            	</div>     		
	        </Form>
        </Modal>
	)
}