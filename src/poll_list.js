import React from 'react';
import {OverlayTrigger ,Tooltip,PanelGroup,Panel, FormControl,Col,InputGroup } from 'react-bootstrap';
import {HorizontalBar} from 'react-chartjs-2';

export default (props)=>{
	const tooltip = (
			  <Tooltip id="tooltip">
			    edit
			  </Tooltip>
			);

	return(
		<PanelGroup accordion id="accordion-example">
		{props.pollList.map((poll, index)=>{
			let votes=poll.options.map(el =>el.vote); 
			let labels=poll.options.map(el=>el.value);
			let data={
				labels:labels,
				datasets:[{
					label:poll.pollName,
					backgroundColor: '#183BF0',
        			borderColor: '#183BF0',
        			data:votes,

				}]
			}
			let options = {
				legend:{
					display:false
				},
      			scales: {
		            xAxes: [{
		                stacked: true,
		                ticks:{
		                	min: 0,
		               		stepSize: 1
		        		}
		            }],
		            yAxes: [{
		                stacked: true,
		                barPercentage:0.9,
		            }],
		        },
		    }
			return (
				<Panel eventKey={index+1} bsStyle="primary">
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
			                		return (
			                				
			                					<InputGroup inline style={{margin:'5px'}} key={position} >
								                    <FormControl 
								                        type="button"
								                        defaultValue={option.value}
								                    /> 
								                    <InputGroup.Addon style={{backgroundColor:'#d9edd1'}}>
								                        <input 
									                        style={{verticalAlign:'middle'}} 
									                        type="checkbox"
									                        checked={option.isVoted}
								                        	onClick={(e)=>props.handleVote(e,position,index,poll.id)}
								                        />{' '}
								                        <span style={{verticalAlign:'middle'}}>{option.vote}</span>
								                    </InputGroup.Addon>
					                    		</InputGroup>
			                				)	
			                	})}
		                	</Col>
		                	<Col xs='12' sm='6'>
		                		<HorizontalBar 
		                		data={data} 
		                		options={options} 
		            
         						/>
		                	</Col>
		           		</Panel.Body>
		           		
		        </Panel>
        	)
        })}
	</PanelGroup>
	)
}