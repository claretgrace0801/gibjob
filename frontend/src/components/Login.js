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

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: "",
      password: "",
      type: "applicant"
    }
  }

  formSubmit = async (event) => {
    if (!misc.required([this.state.email, this.state.password])) {
      alert("Please enter required details")
      return
    }

    let auth = { type: this.state.type, email: this.state.email, password: this.state.password }
    let res = await this.props.loginUser(auth)
    if (!res.data.success) {
      alert(res.data.message)
      return
    }
    this.props.history.push(`/${this.state.type[0]}/dashboard`)
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
            Sign in
          </Typography>

          <form className={classes.form} noValidate>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => { this.setState({ email: event.target.value }) }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => { this.setState({ password: event.target.value }) }}
            />

            <Dropdown onSelect={event => { this.setState({ type: event }) }}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Account Type: {this.state.type}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="applicant">Applicant</Dropdown.Item>
                <Dropdown.Item eventKey="recruiter">Recruiter</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.formSubmit}>
              Sign In
            </Button>

          </form>

          <Grid container>
            <Grid item>

              <RouterLink to="/signup">
                <Link variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </RouterLink>

            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(Login))
