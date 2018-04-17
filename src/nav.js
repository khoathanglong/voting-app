import React from 'react';
import {Nav,Navbar,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

export default (props)=>{
	return (
			<Navbar collapseOnSelect  inverse>
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
						{props.user.loggedIn?<NavItem onClick={props.logOut}>Log Out</NavItem>:
							<NavDropdown title={`Log In`} id="NavDropdown">
								<MenuItem eventKey={1} onClick={props.openLogIn}>
									Log in with your account
								</MenuItem>
								<MenuItem eventKey={2}>Log in with Google</MenuItem> 
							</NavDropdown>
						}
					</Nav>
					<Nav pullRight>
						<NavItem 
							eventKey={3} 
							href="#" 
							style={{paddingRight:'10px'}}
						>
							{props.user.username}
						</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
}