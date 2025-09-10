import React from 'react'

export function Hero(props) {
  console.log("Herppppp", props)
  return (<div className=''>
    <h1>{props.data.heading}</h1>
    </div>
  )
}

 