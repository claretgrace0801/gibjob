import '../App.css'
import Navbar from './Navbar'
import * as misc from '../misc'
import FuzzySearch from 'fuzzy-search'

import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup } from 'reactstrap'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, CardContent, CardActions, Container, Input, Button, Select, FormControl, MenuItem, InputLabel, TextField, FormControlLabel, Checkbox, Grid, Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class A_Dashboard extends Component {

  state = {}

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id

      this.state.applyModal = false
      this.state.sop = ""
      this.state.job_id = ""

      this.state.titleSearch = ""

      this.state.sort = 0
      this.state.asc = 1

      this.state.jobFilterOpen = false
      this.state.jobFilter = 0

      this.state.isSalaryFilter = false
      this.state.salaryMinValue = 0
      this.state.salaryMaxValue = 0

      this.state.durationFilterOpen = false
      this.state.durationFilter = 0

      this.state.sortOpen = false
      this.state.orderOpen = false

      this.applyClick = this.applyClick.bind(this)
      this.ApplyComponent = this.ApplyComponent.bind(this)

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

  applyClick = async (job_id, totalApplications, isAccepted) => {

    if (totalApplications >= 10) {
      alert("Cannot apply to more than 10 jobs at a time.")
      return
    }

    if (isAccepted) {
      alert("Already accepted into a job.")
      return
    }

    if (this.state.applyModal) {

      if ((this.state.sop.toString().split(" ")).length >= 250) {
        alert("Statement of Purpose should be < 250 words")
      }

      let application = {
        _id: this.state._id,
        status: 1,
        sop: this.state.sop,
        applicationDate: new Date
      }

      let res = await this.props.applyForJob(application, job_id)
      if (!res.data.success) {
        alert(res.data.message)
        return
      }
      await this.props.getJobs()
      this.setState({ applyModal: !this.state.applyModal })
    }
    else {
      this.setState({ applyModal: !this.state.applyModal, job_id: job_id })
    }
  }

  ApplyComponent = ({ job, totalApplications, isAccepted }) => {

    if (job.applicants?.length) {
      let applicant = job.applicants.find((user) => user._id == this.state._id);
      let applied = job.applicants?.filter(item => item.status != 4)?.length
      let accepted = job.applicants?.filter(item => item.status == 3)?.length

      if (applicant || (!applicant && applied >= job.maxApplications) || (!applicant && accepted >= job.maxPositions)) {
        return (
          <CardActions>
            <Typography gutterBottom>
              {applicant ? misc.getApplyStatus(applicant.status) : misc.getApplyStatus(5)}
            </Typography>
          </CardActions>
        );
      }
    }
    return (
      <CardActions>
        <Button variant="contained" onClick={() => { this.applyClick(job._id, totalApplications, isAccepted) }}>Apply</Button>
      </CardActions>
    );
  }

  toggle = () => {
    this.setState({ applyModal: !this.state.applyModal })
  }



  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    const { classes } = this.props

    let searcher
    let jobs, totalApplications, isAccepted

    try {
      jobs = this.props.state?.jobs

      jobs = jobs?.filter(job => (new Date(job.deadline)) >= (new Date()))

      jobs = jobs?.filter(job => {
        if (job.applicants?.filter(item => item._id == this.state._id && item.status == 4).length) {
          return false
        }
        else {
          return true
        }
      })

      totalApplications = 0
      isAccepted = false

      for (let i = 0; i < jobs.length; i++) {
        for (let j = 0; j < jobs[i].applicants.length; j++) {
          if (jobs[i].applicants[j]._id == this.state._id) {
            totalApplications = totalApplications + 1
            if (jobs[i].applicants[j].status == 3) {
              isAccepted = true
            }
          }
        }
      }

      // sorting

      let asc = this.state.asc

      if (this.state.sort == 1) { // salary
        jobs?.sort((job1, job2) => { return asc * (job1.salary - job2.salary) })
      }
      else if (this.state.sort == 2) { // duration
        jobs?.sort((job1, job2) => { return asc * (job1.duration - job2.duration) })
      }
      else if (this.state.sort == 3) { //rating
        jobs?.sort((job1, job2) => {
          let rating1 = job1.ratings.length ?
            job1.ratings.map(job => job.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0
          let rating2 = job2.ratings.length ?
            job2.ratings.map(job => job.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0

          return asc * (rating1 - rating2)
        })
      }

      // filtering

      let jobFilters = ["Full-Time", "Part-Time", "Work From Home"]

      if (this.state.jobFilter) { // Job filter
        jobs = jobs?.filter(job => job.jobType == jobFilters[this.state.jobFilter - 1])
      }

      if (this.state.isSalaryFilter) {
        jobs = jobs?.filter(job => job.salary >= this.state.salaryMinValue && job.salary <= this.state.salaryMaxValue)
      }

      if (this.state.durationFilter) {
        jobs = jobs?.filter(job => job.duration < this.state.durationFilter)
      }

      // search 
      searcher = new FuzzySearch(jobs, ['title', 'name'], {
        caseSensitive: false,
      })

      if (this.state.titleSearch) {
        jobs = searcher.search(this.state.titleSearch)
      }
    }
    catch {
      this.props.history.push("/")
    }
    return (
      <div>
        <Navbar page={"Dashboard"} type={"applicant"} />
        <Modal isOpen={this.state.applyModal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Application</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>

                <Box m="1rem">
                  <Input
                    fullWidth
                    type="text"
                    id="standard-textarea"
                    multiline
                    placeholder="Statement of Purpose < 250 words"
                    onChange={(event) => { this.setState({ sop: event.target.value }) }}
                  />
                </Box>

                <Button
                  onClick={() => { this.applyClick(this.state.job_id) }}
                >Submit Application
                </Button>

              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>

        <Card raised>
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Search"
              onChange={(event) => { this.setState({ titleSearch: event.target.value }) }}
            />
          </FormControl>
          <FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId="sort-label"
                open={this.state.sortOpen}
                onClose={() => { this.setState({ sortOpen: false }) }}
                onOpen={() => { this.setState({ sortOpen: true }) }}
                value={this.state.sort}
                onChange={(event) => { this.setState({ sort: event.target.value }) }}
              >
                <MenuItem value={1}>Salary</MenuItem>
                <MenuItem value={2}>Duration</MenuItem>
                <MenuItem value={3}>Rating</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="order-label">Order</InputLabel>
              <Select
                labelId="order-label"
                open={this.state.orderOpen}
                onClose={() => { this.setState({ orderOpen: false }) }}
                onOpen={() => { this.setState({ orderOpen: true }) }}
                value={this.state.asc}
                onChange={(event) => { this.setState({ asc: event.target.value }) }}
              >
                <MenuItem value={1}>Ascending</MenuItem>
                <MenuItem value={-1}>Descending</MenuItem>
              </Select>
            </FormControl>
          </FormControl>

          <FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="job-filter">Filter by Type</InputLabel>
              <Select
                labelId="job-filter"
                open={this.state.jobFilterOpen}
                onClose={() => { this.setState({ jobFilterOpen: false }) }}
                onOpen={() => { this.setState({ jobFilterOpen: true }) }}
                value={this.state.jobFilter}
                onChange={(event) => { this.setState({ jobFilter: event.target.value }) }}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Full-Time</MenuItem>
                <MenuItem value={2}>Part-Time</MenuItem>
                <MenuItem value={3}>Work From Home</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="duration-filter">Duration filter</InputLabel>
              <Select
                labelId="duration-filter"
                open={this.state.durationFilterOpen}
                onClose={() => { this.setState({ durationFilterOpen: false }) }}
                onOpen={() => { this.setState({ durationFilterOpen: true }) }}
                value={this.state.durationFilter}
                onChange={(event) => { this.setState({ durationFilter: event.target.value }) }}
              >
                <MenuItem value={0}>None</MenuItem>
                <MenuItem value={1}>{"< 1"} Months</MenuItem>
                <MenuItem value={2}>{"< 2"} Months</MenuItem>
                <MenuItem value={3}>{"< 3"} Months</MenuItem>
                <MenuItem value={4}>{"< 4"} Months</MenuItem>
                <MenuItem value={5}>{"< 5"} Months</MenuItem>
                <MenuItem value={6}>{"< 6"} Months</MenuItem>
                <MenuItem value={7}>{"< 7"} Months</MenuItem>
              </Select>
            </FormControl>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.isSalaryFilter}
                onChange={() => { this.setState({ isSalaryFilter: !this.state.isSalaryFilter }) }}
                name="checkedB"
                color="primary"
              />
            }
            label="Filter by Salary"
          />
          <FormControl>
            <TextField
              type="number"
              variant="outlined"
              margin="normal"
              fullWidth
              label="Min Salary"
              value={this.state.salaryMinValue}
              onChange={(event) => { this.setState({ salaryMinValue: event.target.value }) }}
            />
          </FormControl>
          {" "}
          <FormControl>
            <TextField
              type="number"
              variant="outlined"
              margin="normal"
              fullWidth
              label="Max Salary"
              value={this.state.salaryMaxValue}
              onChange={(event) => { this.setState({ salaryMaxValue: event.target.value }) }}
            />
          </FormControl>
        </Card>

        <br /><br />

        <Grid container className={classes.root} spacing={4}>

          {jobs?.map((job) => (
            <Grid key={job._id} item>
              <Card className={classes.root}>
                <CardContent>

                  <Typography variant="h6" color="textPrimary" gutterBottom>
                    {job.title}
                  </Typography>

                  <Typography gutterBottom>
                    Recruiter: {job.name}
                  </Typography>

                  <Typography gutterBottom>
                    Salary: {job.salary}
                  </Typography>

                  <Typography gutterBottom>
                    Duration: {!job.duration ? "Undefined" : job.duration + " months"}
                  </Typography>

                  <Typography gutterBottom>
                    Maximum positions available: {job.maxPositions}
                  </Typography>

                  <Typography gutterBottom>
                    Deadline: {(new Date(job.deadline)).toDateString()}
                  </Typography>

                  <Typography gutterBottom>
                    {job.jobType}
                  </Typography>

                  <Typography gutterBottom>
                    Skills required: {job.skills.join(", ")}
                  </Typography>

                  <Rating value={
                    job.ratings.length ?
                      job.ratings.map(job => job.rating)
                        .reduce((accumulator, currentValue) => accumulator + currentValue) / job.ratings.length
                      : 0}
                    readOnly />

                  <this.ApplyComponent job={job} totalApplications={totalApplications} isAccepted={isAccepted} />

                </CardContent>
              </Card>
            </Grid>

          ))}

        </Grid>
      </div >
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(A_Dashboard))