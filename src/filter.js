import React, {Component} from 'react';
import {FormControl, ControlLabel, Form} from 'react-bootstrap'

class Filter extends Component{
	constructor(props){
		super();
		this.sortPoll=this.sortPoll.bind(this)
	}

	sortPoll(e){
		this.props.sortPoll(e.target.value)
	}
	render(){
		return (
			<Form inline>
				<ControlLabel>Sort By: </ControlLabel>{' '} 
				<FormControl componentClass="select" placeholder="select" onChange={this.sortPoll}>
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