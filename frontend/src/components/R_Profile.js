import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'
import { Container } from 'reactstrap'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, CssBaseline, TextField, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class R_Profile extends Component {

  state = {}

  constructor(props) {
    super(props)
    try {
      this.state = {
        type: "recruiter",

        name: this.props.state.user.name,
        email: this.props.state.user.email,
      }

      try { this.state.contactNo = this.props.state.user.contactNo } catch { }
      try { this.state.bio = this.props.state.user.bio } catch { }
    }
    catch {
      this.props.history.push("/")
    }
  }

  formSubmit = async () => {
    if (!misc.required([this.state.name, this.state.email])
      || !misc.validate([misc.verifyEmail, misc.verifyNumber], [this.state.email, this.state.contactNo])) {
      alert("Enter Valid Details")
      return
    }

    if (this.state.contactNo && !misc.validate([misc.verifyNumber], [this.state.contactNo])) {
      alert("Enter Valid contact number")
      return
    }

    if (this.state.bio && (this.state.bio.toString().split(" ")).length >= 250) {
      alert("Bio should be < 250 words")
      return
    }

    let user = {
      type: "recruiter",
      name: this.state.name,
      email: this.state.email,
      contactNo: this.state.contactNo,
      bio: this.state.bio
    }

    await this.props.editRecruiter(user)
    this.props.history.push("/r/dashboard")
  }

  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <Navbar page={"Profile"} type={"recruiter"} />

        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} onSubmit={this.formSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <TextField
                  autoComplete="name"
                  name="name"
                  id="name"
                  variant="outlined"
                  required
                  fullWidth
                  label="Name"
                  autoFocus
                  value={this.state.name}
                  onChange={(event) => { this.setState({ name: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="email"
                  id="email"
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  value={this.state.email}
                  onChange={(event) => { this.setState({ email: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="number"
                  variant="outlined"
                  fullWidth
                  label="Contact Number"
                  value={this.state.contactNo}
                  onChange={(event) => { this.setState({ contactNo: event.target.value }) }}
                />
              </Grid>

              <Grid item xs={8}>
                <TextField
                  id="standard-textarea"
                  multiline
                  fullWidth
                  label="Bio"
                  value={this.state.bio}
                  onChange={(event) => { this.setState({ bio: event.target.value }) }}
                />
              </Grid>

            </Grid>

            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => { this.formSubmit() }}>
              Save Changes
            </Button>

          </form>
        </div>
      </Container>
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(R_Profile))