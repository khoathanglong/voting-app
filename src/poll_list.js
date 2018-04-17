import React from 'react';
import {OverlayTrigger ,Tooltip,PanelGroup,Panel, FormControl,Col,InputGroup } from 'react-bootstrap';
import {HorizontalBar} from 'react-chartjs-2';

export default (props)=>{
	const tooltip = (
			  <Tooltip id="tooltip">
			    edit
			  </Tooltip>
			);
	const filterPoll=(criteria)=>{
		let PollOfUser=props.pollList;
	    if (criteria==="username"){
	    	if(props.username!==""){
		       	PollOfUser=props.pollList.filter(poll=>{
		        	return poll.createdBy===props.username
		      	})
		      	.concat(
		      		props.pollList.filter(pollx=>{
		      		return pollx.createdBy!==props.username
		      		})
		      	)
		      }else{
		      	PollOfUser.sort((a,b)=>{
		      		return a.createdBy.localeCompare(b.createdBy)
		      	})
		      }
	    }else if(criteria==="oldest"){
	      PollOfUser.sort((a,b)=>{
	        return a.id-b.id
	      	})
	    }else if(criteria==="newest"){
	      PollOfUser.sort((a,b)=>{
	        return -a.id+b.id
	      });
   		}else{
   			PollOfUser=props.pollList
   		}
   		return PollOfUser
   	}
	return(
		<PanelGroup accordion id="accordion-example">
		{filterPoll(props.filterBy).map((poll, index)=>{
			let votes=poll.options.map(el =>el.vote); 
			let labels=poll.options.map(el=>el.value);
			let data={
				labels:labels,
				datasets:[{
					
					backgroundColor: '#66B032',
        			borderColor: '#66B032',
        			data:votes
				}]
			}
			let options = {
      			scales: {
		            xAxes: [{
		                stacked: true,
		            }],
		            yAxes: [{
		                stacked: true,
		            }]
		        },
		        tooltips: {
    	callbacks: {
      	label: function(tooltipItem) {
     
        	
        }
      }
    }
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
		                		maintainAspectRatio={false} 
		                		height={1000}
         						width={3000}/>
		                	</Col>
		           		</Panel.Body>
		           		
		        </Panel>
        	)
        })}
	</PanelGroup>
	)
}