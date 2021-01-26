import '../App.css'

import React, { Component } from 'react'
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Link as RouterLink } from 'react-router-dom'

function Links(props) {
  if (props.type == "applicant") {
    return (
      <Container>
        <NavItem>
          <RouterLink to="/a/dashboard"><NavLink>Dashboard</NavLink></RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink to="/a/applications"><NavLink>My Applications</NavLink></RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink to="/a/profile"><NavLink>Profile</NavLink></RouterLink>
        </NavItem>
      </Container>
    )
  }
  else {
    return (
      <Container>
        <NavItem>
          <RouterLink to="/r/dashboard"><NavLink>Dashboard</NavLink></RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink to="/r/createjob"><NavLink>Create Job</NavLink></RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink to="/r/accepted"><NavLink>Accepted Applicants</NavLink></RouterLink>
        </NavItem>
        <NavItem>
          <RouterLink to="/r/profile"><NavLink>Profile</NavLink></RouterLink>
        </NavItem>
      </Container>
    )
  }
}

class FixedNavbar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      name: ""
    }
    try {
      this.state.name = this.props.state.user.name
    } catch { }
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <div>

        <Navbar color="light" light expand="md">
          <NavbarBrand>{this.props.page}</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>

              <Links type={this.props.type} />

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Not you?
                                </DropdownToggle>

                <DropdownMenu right>
                  <RouterLink to="/">
                    <DropdownItem>
                      Logout
                                    </DropdownItem>
                  </RouterLink>
                </DropdownMenu>

              </UncontrolledDropdown>
            </Nav>
            <NavbarText>{this.state.name}</NavbarText>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default connect((state) => ({ state: state }), { ...actions })(FixedNavbar)