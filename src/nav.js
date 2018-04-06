import React from 'react';
import {Nav,Navbar,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

export default (props)=>{
	return (
			<Navbar collapseOnSelect >
				<Navbar.Header>
					<Navbar.Brand >
						<span style={{cursor:'pointer'}} onClick={props.startVote}>
							Start Poll
						</span>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<NavItem onClick={props.openSignUp}>
							Sign up
						</NavItem>
						<NavDropdown title="Log in">
							<MenuItem evenKey={1} onClick={props.openLogIn}>
								Log in with your account
							</MenuItem>
							<MenuItem evenKey={2}>Log in with Google</MenuItem> 
						</NavDropdown>
					</Nav>
					<Nav pullRight>
						<NavItem 
							eventKey={1} 
							href="#" 
							style={{paddingRight:'10px'}}
						>
							{props.username}
						</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
}