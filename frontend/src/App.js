import './App.css';
import Login from './components/Login'
import Signup from './components/Signup'

import A_Profile from './components/A_Profile'
import A_Dashboard from './components/A_Dashboard'
import A_MyApplications from './components/A_MyApplications'

import R_Profile from './components/R_Profile'
import R_Dashboard from './components/R_Dashboard'
import R_CreateJob from './components/R_CreateJob'
import R_AcceptedApplicants from './components/R_AcceptedApplicants'
import R_Job from './components/R_Job'


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store/store'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={Signup} />

          <Route path="/a/profile" exact component={A_Profile} />
          <Route path="/a/dashboard" exact component={A_Dashboard} />
          <Route path="/a/applications" exact component={A_MyApplications} />

          <Route path="/r/profile" exact component={R_Profile} />
          <Route path="/r/dashboard" exact component={R_Dashboard} />
          <Route path="/r/createjob" exact component={R_CreateJob} />
          <Route path="/r/accepted" exact component={R_AcceptedApplicants} />
          <Route path="/r/job/:id" exact component={R_Job} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
