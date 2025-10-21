import React, {useState, useEffect} from 'react'
import {Button, Title, Header, Sidebar} from '../../components'

const HomeRequester = () => {

  const hello = () => {
    console.log("Hakdog")
  }
  
  return (
    <div className='bg-main-dark h-screen'>
      <Header name='Lannour' onClick={hello}/>
      <Sidebar />
    </div>
  )
}

export default HomeRequester
 