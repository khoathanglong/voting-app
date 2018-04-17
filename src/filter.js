import React, {Component} from 'react';
import {FormControl, ControlLabel, Form,Col, Button} from 'react-bootstrap'

class Filter extends Component{
	render(){
		return (
			<Form inline>
				<ControlLabel>Sort By: </ControlLabel>{' '} 
				<FormControl componentClass="select" placeholder="select" onChange={this.props.handleFilter}>
					<option value="newest">Newest</option>
					<option value="oldest">Oldest</option>
	       	 		<option value="username">
	       	 			{this.props.username!==""?"My Polls":"Username (a-z)"}
	       	 		</option>
				</FormControl>
			</Form>
		)
	}
}
export default Filter