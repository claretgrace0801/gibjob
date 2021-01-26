import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'

import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

import DateTimePicker from 'react-datetime-picker'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Link as RouterLink, Router } from 'react-router-dom'

import { Card, CardContent, CardActions, Container, Button, TextField, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class R_Dashboard extends Component {

  state = {}

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id

      this.state.editModal = false
      this.state.editId = ""

      this.state.maxApplications = 0
      this.state.maxPositions = 0

      this.state.initialDeadline = null
      this.state.deadline = null

      this.deleteJob = this.deleteJob.bind(this)

      this.state.componentLoaded = false
    }
    catch {
      this.props.history.push("/")
    }
  }

  async componentDidMount() {
    await this.props.getJobs()

    this.setState({ componentLoaded: true })
  }

  deleteJob = async (job_id) => {
    let res = await this.props.deleteJob(job_id)
    if (res.data.success) {
      await this.props.getJobs()
    }
  }

  editJob = async () => {

    if (!misc.required([this.state.maxApplications, this.state.maxPositions])) {
      alert("Please enter all required details.")
      return
    }

    if (!misc.validate([misc.verifyNumber, misc.verifyNumber],
      [this.state.maxApplications, this.state.maxPositions])) {
      alert("Please enter valid details.")
      return
    }

    if ((parseInt(this.state.maxApplications) < parseInt(this.state.maxPositions))
      || parseInt(this.state.maxPositions) == 0
      || parseInt(this.state.maxApplications) == 0) {
      alert("Enter valid maximums")
      return
    }

    if (this.state.deadline == null) {
      await this.setState({ deadline: this.state.initialDeadline })
    }

    let newValues = {
      deadline: this.state.deadline,
      maxApplications: this.state.maxApplications,
      maxPositions: this.state.maxPositions
    }

    await this.props.editJob(newValues, this.state.editId)
    await this.props.getJobs()
    this.setState({ editModal: false })
  }

  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    const { classes } = this.props
    let jobs

    try {
      jobs = this.props.state.jobs

      jobs = jobs?.filter(job => job.r_id == this.state._id)
    }
    catch {
      this.props.history.push("/")
    }
    return (
      <div>
        <Navbar page={"Dashboard"} type={"recruiter"} />

        <Modal isOpen={this.state.editModal} toggle={() => { this.setState({ editModal: false }) }}>
          <ModalHeader toggle={() => { this.setState({ editModal: false }) }}
          >Edit Job</ModalHeader>

          <ModalBody>
            <Container>

              <TextField
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Max Applicants"
                value={this.state.maxApplications}
                onChange={(event) => { this.setState({ maxApplications: event.target.value }) }}
              />

              <TextField
                type="number"
                variant="outlined"
                margin="normal"
                fullWidth
                label="Max Positions"
                value={this.state.maxPositions}
                onChange={(event) => { this.setState({ maxPositions: event.target.value }) }}
              />

              <Typography gutterBottom>
                Current Deadline: {misc.displayDate(this.state.initialDeadline)}
              </Typography>

              <DateTimePicker
                format="dd-MM-y h:mm a"
                value={this.state.deadline}
                onChange={(value) => { this.setState({ deadline: value }) }}
              />

            </Container>

            <br /><br />

            <Button
              variant="contained"
              onClick={this.editJob}
            >
              Save
            </Button>

          </ModalBody>

        </Modal>

        <Grid container className={classes.root} spacing={4}>

          {jobs?.map((job) => (
            <Grid key={job._id} item>
              <Card className={classes.root}>
                <CardContent>

                  <RouterLink to={`/r/job/${job._id}`}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                      {job.title}
                    </Typography>
                  </RouterLink>

                  <Typography gutterBottom>
                    Recruiter: {job.name}
                  </Typography>

                  <Typography gutterBottom>
                    Applicants: {job.applicants?.filter(item => item.status != 4).length}
                  </Typography>

                  <Typography gutterBottom>
                    Remaining positions: {job.maxPositions - job.applicants.filter(user => user.status == 3)?.length}
                  </Typography>

                  <Typography gutterBottom>
                    Post Date: {(new Date(job.createdAt)).toDateString()}
                  </Typography>

                  <Rating value={
                    job.ratings.length ?
                      job.ratings.map(job => job.rating)
                        .reduce((accumulator, currentValue) => accumulator + currentValue) / job.ratings.length
                      : 0}
                    readOnly />

                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => { this.deleteJob(job._id) }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      this.setState({
                        maxPositions: job.maxPositions,
                        deadline: null,
                        initialDeadline: job.deadline,
                        maxApplications: job.maxApplications,
                        editId: job._id,
                        editModal: true
                      })
                    }}
                  >
                    Edit
                  </Button>
                </CardActions>

              </Card>
            </Grid>
          ))}

        </Grid>
      </div >
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(R_Dashboard))