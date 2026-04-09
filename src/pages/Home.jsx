import React from 'react'
import Header from '../component/Header'
import Steps from '../component/Steps'
import Description from '../component/Description'
import Testimonial from '../component/Testimonial'
import GenerateBtn from '../component/GenerateBtn'

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimonial/>
      <GenerateBtn/>
    </div>
  )
}

export default Home