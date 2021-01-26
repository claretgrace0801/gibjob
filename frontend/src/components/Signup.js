import '../App.css'
import * as misc from '../misc'

import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Typography, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class Signup extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: "",
      email: "",
      password: "",
      type: "applicant"
    }
  }

  formSubmit = async () => {

    if (!misc.required([this.state.name, this.state.email, this.state.password])) {
      alert("Please enter all required details")
      return
    }

    if (!misc.verifyEmail(this.state.email)) {
      alert("Invalid email")
      return
    }

    let user = {
      type: this.state.type,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }

    let res = await this.props.createUser(user)
    if (!res.data.success) {
      alert(res.data.message)
      return
    }

    if (user.type == 'applicant') {
      this.props.history.push("/a/profile")
    }
    else {
      this.props.history.push("/r/profile")
    }
  }

  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign up
                    </Typography>

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  id="name"
                  variant="outlined"
                  required
                  fullWidth
                  label="Name"
                  autoFocus
                  onChange={(event) => { this.setState({ name: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="email"
                  id="email"
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  onChange={(event) => { this.setState({ email: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(event) => { this.setState({ password: event.target.value }) }}
                />
              </Grid>



              <Grid item xs={12}>
                <Dropdown
                  onSelect={event => { this.setState({ type: event }) }}
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Account Type: {this.state.type}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="applicant">Applicant</Dropdown.Item>
                    <Dropdown.Item eventKey="recruiter">Recruiter</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => { this.formSubmit() }}>
              Sign Up
            </Button>

            <Grid container justify="flex-end">
              <Grid item>
                <RouterLink to="/">
                  <Link variant="body2">
                    Already have an account? Sign in
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>


          </form>
        </div>
      </Container >
    );
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(Signup))
