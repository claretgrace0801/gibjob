import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'

import DateTimePicker from 'react-datetime-picker'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Button, ButtonGroup, Select, FormControl, MenuItem, InputLabel, CssBaseline, TextField, Grid } from '@material-ui/core';
import { ArrowDropDown, Delete as DeleteIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class R_CreateJob extends Component {

  state = {
    title: "",
    maxApplications: null,
    maxPositions: null,
    deadline: null,
    skills: [],
    jobType: "",
    duration: null,
    salary: null,

    skillModal: false,
    skill: "",
    menuOpen: false,
    durationMenuOpen: false
  }

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id
    }
    catch {
      this.props.history.push("/")
    }
  }

  skillToggle = () => {
    this.setState({ skillModal: !this.state.skillModal })
  }

  selectSkill = (event) => {
    if (this.state.skills.filter(item => item == event.target.innerText.toLowerCase()).length) {
      alert("Skill already exists")
      return
    }
    this.setState({
      skills: [...this.state.skills, event.target.innerText.toLowerCase()]
    })
  }

  formSubmit = async () => {

    if (!misc.required([this.state.title, this.state.maxApplications, this.state.maxPositions,
    this.state.deadline, this.state.skills, this.state.jobType, this.state.duration, this.state.salary])) {
      alert("Please sumbit all required details.")
      return
    }

    if (!misc.validate([misc.verifyNumber, misc.verifyNumber, misc.verifyNumber],
      [this.state.maxApplications, this.state.maxPositions, this.state.salary])) {
      alert("Please submit valid details")
      return
    }

    if ((new Date()) > new Date(this.state.deadline)) {
      alert("Do you expect applicants to time travel?")
      return
    }

    if ((parseInt(this.state.maxApplications) < parseInt(this.state.maxPositions))
      || parseInt(this.state.maxPositions) == 0
      || parseInt(this.state.maxApplications) == 0) {
      alert("Enter valid maximums")
      return
    }

    let job = {
      r_id: this.state._id,
      title: this.state.title,
      email: this.props.state.user.email,
      name: this.props.state.user.name,
      maxApplications: this.state.maxApplications,
      maxPositions: this.state.maxPositions,
      deadline: this.state.deadline,
      skills: this.state.skills,
      jobType: this.state.jobType,
      duration: this.state.duration,
      salary: this.state.salary
    }
    let res = await this.props.createJob(job)
    this.props.history.push("/r/dashboard")
  }

  render() {
    const { classes } = this.props
    return (
      <Container>
        <Navbar page={"Create Job"} type={"recruiter"} />
        <CssBaseline />

        <div className={classes.paper}>
          <form className={classes.form} noValidate>

            <TextField
              type="text"
              variant="outlined"
              required
              label="Title"
              onChange={(event) => { this.setState({ title: event.target.value }) }}
            />

            <br /><br />

            <TextField
              type="number"
              variant="outlined"
              required
              label="Maximum Applicants"
              onChange={(event) => { this.setState({ maxApplications: event.target.value }) }}
            />

            {" "}

            <TextField
              type="number"
              variant="outlined"
              required
              label="Maximum Positions"
              onChange={(event) => { this.setState({ maxPositions: event.target.value }) }}
            />

            <br /><br />

            <DateTimePicker
              format="dd-MM-y h:mm a"
              value={this.state.deadline}
              onChange={(value) => { this.setState({ deadline: value }) }}
            />

            <br /><br />

            <Grid container spacing={2}>
              {this.state.skills?.length ? (<Container><br /><Alert style={{ textAlign: "center" }} color="dark"><h5>Skills</h5></Alert></Container>) : (<div></div>)}

              {this.state.skills?.map((skill) => (
                <Grid item>
                  <Alert color="light" toggle={() => {
                    this.setState({
                      skills: this.state.skills.filter((item) => item != skill)
                    })
                  }}>
                    <span style={{ color: "black" }}>{skill}</span>
                  </Alert>
                </Grid>
              ))}
            </Grid>

            <Modal isOpen={this.state.skillModal} toggle={this.skillToggle}>
              <ModalHeader toggle={this.skillToggle}>Select Skill</ModalHeader>
              <ModalBody>
                <Container>
                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <Button onClick={this.selectSkill}>C++</Button>
                    <Button onClick={this.selectSkill}>C</Button>
                    <Button onClick={this.selectSkill}>python</Button>
                    <Button onClick={this.selectSkill}>javascript</Button>
                    <Button onClick={this.selectSkill}>ruby</Button>
                    <Button onClick={this.selectSkill}>HTML</Button>
                    <Button onClick={this.selectSkill}>CSS</Button>
                  </ButtonGroup>
                </Container>
              </ModalBody>
            </Modal>
            <TextField
              variant="outlined"
              label="skill"
              value={this.state.skill}
              onChange={(event) => { this.setState({ skill: event.target.value }) }}
            />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                if (this.state.skills.filter(item => item == this.state.skill).length) {
                  alert("Skill already exists")
                  return
                }
                if (this.state.skill == "") {
                  alert("Enter a skill")
                  return
                }
                this.setState({
                  skills: [...this.state.skills, this.state.skill],
                  skill: ""
                })
              }}>
              Add Skill
              </Button>
            <Button
              variant="outlined"
              onClick={() => {
                this.setState({
                  skillModal: true
                })
              }}>
              Select a skill <ArrowDropDown />
            </Button>

            <br /><br />
            <FormControl className={classes.formControl}>
              <InputLabel id="job-label">Job Type</InputLabel>
              <Select
                labelId="job-label"
                open={this.state.menuOpen}
                onClose={() => { this.setState({ menuOpen: false }) }}
                onOpen={() => { this.setState({ menuOpen: true }) }}
                value={this.state.jobType}
                onChange={(event) => { this.setState({ jobType: event.target.value }) }}
              >
                <MenuItem value="Full-Time">Full-Time</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelId="duration-label"
                open={this.state.durationMenuOpen}
                onClose={() => { this.setState({ durationMenuOpen: false }) }}
                onOpen={() => { this.setState({ durationMenuOpen: true }) }}
                value={this.state.duration}
                onChange={(event) => { this.setState({ duration: event.target.value }) }}
              >
                <MenuItem value={0}>Undefined</MenuItem>
                <MenuItem value={1}>1 Months</MenuItem>
                <MenuItem value={2}>2 Months</MenuItem>
                <MenuItem value={3}>3 Months</MenuItem>
                <MenuItem value={4}>4 Months</MenuItem>
                <MenuItem value={5}>5 Months</MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
              </Select>
            </FormControl>

            <br /><br />

            <TextField
              type="number"
              variant="outlined"
              required
              label="Salary ($)"
              onChange={(event) => { this.setState({ salary: event.target.value }) }}
            />

            <br /><br />

            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.formSubmit}>
              Post Job
            </Button>

          </form>
        </div>

      </Container>
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(R_CreateJob))