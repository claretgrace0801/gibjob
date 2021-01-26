import '../App.css'
import Navbar from './Navbar'

import React, { Component } from 'react'

import * as actions from '../store/actions'
import { connect } from 'react-redux'

import { Rating } from '@material-ui/lab';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Card, CardContent, CardActions, Button, Select, FormControl, MenuItem, InputLabel, TextField, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { useGlobalStyles } from './styles'

const useStyles = useGlobalStyles

class R_AcceptedApplicants extends Component {

  state = {}

  constructor(props) {
    super(props)

    try {
      this.state._id = this.props.state.user._id

      this.state.sortOpen = false
      this.state.orderOpen = false
      this.state.sort = 0
      this.state.asc = 1

      this.state.rating = -1

      this.state.componentLoaded = false
    }
    catch {
      this.props.history.push("/")
    }
  }

  async componentDidMount() {
    await this.props.getJobs()
    await this.props.getApplicants()

    this.setState({ componentLoaded: true })
  }

  submitRating = async (app) => {
    if (this.state.rating >= 0 && this.state.rating <= 5) {
      let rating = {
        _id: this.state._id,
        rating: this.state.rating
      }
      let res = await this.props.rateApplicant(rating, app.user._id)
      if (res.data.success) {
        this.props.getApplicants()
      }
    }
    else {
      alert("Enter a rating between 0 and 5")
    }
  }

  RateApp = ({ app }) => {
    let recruiterRating = app.user.ratings?.find(item => item._id == app.job.r_id)

    if (recruiterRating) {
      return (
        <Typography gutterBottom>
          You rated: {recruiterRating.rating}
        </Typography>
      )
    }

    else {
      return (
        < CardActions >
          <TextField
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Rate Employee (0-5)"
            onChange={(event) => {
              if (event.target.value == "") { this.setState({ rating: -1 }) }
              else { this.setState({ rating: event.target.value }) }
            }}
          />
          <Button
            variant="contained"
            onClick={() => { this.submitRating(app) }}
          >
            Rate
          </Button>
        </CardActions >
      )
    }
  }

  render() {
    if (!this.state.componentLoaded) { return <div></div> }

    const { classes } = this.props
    let jobs, applicants, job_applicants

    try {
      jobs = this.props.state.jobs?.filter(item => item.r_id == this.state._id)

      applicants = this.props.state.applicants

      job_applicants = []

      for (let i = 0; i < jobs.length; i++) {
        for (let j = 0; j < jobs[i].applicants.length; j++) {
          if (jobs[i].applicants[j].status == 3) {
            let obj = {
              user: applicants.find(item => item._id == jobs[i].applicants[j]._id),
              application: jobs[i].applicants[j],
              job: jobs[i]
            }
            job_applicants.push(obj)
          }
        }
      }


      if (this.state.sort == 1) { // Name
        job_applicants?.sort((app1, app2) => this.state.asc * (app1.user.name.toLowerCase().localeCompare(app2.user.name.toLowerCase())))
      }

      else if (this.state.sort == 2) { // Date
        job_applicants?.sort((app1, app2) => this.state.asc * ((new Date(app1.application.joiningDate)) - (new Date(app2.application.joiningDate))))
      }

      else if (this.state.sort == 3) { // Rating
        job_applicants?.sort((app1, app2) => {
          let rating1 = app1.user.ratings.length ?
            app1.user.ratings.map(user => user.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0
          let rating2 = app2.user.ratings.length ?
            app2.user.ratings.map(user => user.rating)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
            : 0

          return this.state.asc * (rating1 - rating2)
        })
      }

      if (this.state.sort == 4) { // Name
        job_applicants?.sort((app1, app2) => this.state.asc * (app1.job.title.toLowerCase().localeCompare(app2.job.title.toLowerCase())))
      }
    }
    catch {
      this.props.history.push("/")
    }
    return (
      <div>
        <Navbar page={"Accepted Applicants"} type={"recruiter"} />

        <Card raised>
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
              <MenuItem value={1}>Name</MenuItem>
              <MenuItem value={2}>Joining date</MenuItem>
              <MenuItem value={3}>Rating</MenuItem>
              <MenuItem value={4}>Title</MenuItem>
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
        </Card>

        <br /><br />

        <Grid container className={classes.root} spacing={4}>

          {job_applicants?.map((app) => {
            if (app) {
              return (
                <Grid key={`${app.user._id}${app.job._id}`} item>
                  <Card className={classes.root}>
                    <CardContent>

                      <Typography variant="h6" color="textPrimary" gutterBottom>
                        {app.user.name}
                      </Typography>

                      <Typography gutterBottom>
                        Job: {app.job.title}
                      </Typography>

                      <Typography gutterBottom>
                        Type: {app.job.jobType}
                      </Typography>

                      <Typography gutterBottom>
                        Joining date: {(new Date(app.application.joiningDate)).toDateString()}
                      </Typography>

                      <Rating value={
                        app.user.ratings.length ?
                          app.user.ratings.map(item => item.rating)
                            .reduce((accumulator, currentValue) => accumulator + currentValue) / app.user.ratings.length
                          : 0}
                        readOnly />

                    </CardContent>

                    <CardActions>
                      <this.RateApp app={app} />
                    </CardActions>

                  </Card>
                </Grid>
              )
            }
          }
          )}

        </Grid>
      </div >
    )
  }
}

export default connect((state) => ({ state: state }), { ...actions })(withStyles(useStyles)(R_AcceptedApplicants))