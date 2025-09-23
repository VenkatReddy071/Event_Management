import React from 'react'
import Navbar from '../Navbar/Navbar'
import Header from './Header'
import Server from './HeadingTitle'
import Services from './Services'
import Steps from './Steps'
import Count from './Count'
import About from "./About"
import Footer from './Fottor'
function Home() {
  return (
    <div>
        <Header/>
        <Server title1={"OUR SERVICES"} title2={"Everything You Need for Your Events"}/>
        <Services/>
        <Server title1={"HOW IT WORKS"} title2={"Three Simple Steps"}/>
        <Steps/>
        <Count/>
        <About/>
    </div>
  )
}

export default Home
