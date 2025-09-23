import React, { useEffect } from 'react'
import EventPage from './components/Explore/EventPage'
import Home from './components/Home/Home'
import MainLayout from "./layouts/MainLayout"
import Explore from "./components/Explore/Explore"
import Login from "./components/Auth/Login"
import Sign from "./components/Auth/Sign"
import Forget from "./components/Auth/Forget"
import AuthSuccess from "./components/Auth/AuthSuccess"
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import RegisterForm from './components/College/Register'
import Dashboard from './components/Dashboards/Organozer/Dashboard'
import SubeventPage from './components/Explore/SubEventPage'
import AdminDashboard from "./components/Dashboards/Admin/Dashboard"
import CollegeLogin from "./components/College/CollegeLogin"
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/Explore" element={<Explore/>}/>
            <Route path='/Explore/event/:id/:name' element={<EventPage/>}/>
            <Route path="/Explore/:eventId/subevents/:subeventId" element={<SubeventPage />} />
        </Route>
        <Route path="/oauth-success" element={<AuthSuccess/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/sign" element={<Sign/>}/>
        <Route path="/forgot" element={<Forget/>}/>
        <Route path='/college-register' element={<RegisterForm/>}/>
        <Route path='/college-login' element={<CollegeLogin/>}/>
        <Route path='/organizer-dashboard' element={<Dashboard/>}>
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}>
        </Route>
      </Routes>
    </Router>

  )
}

export default App
