import React from 'react'

import DropZone from './dropzone'

type Props = {}

function Hero({}: Props) {
  return (
    <>
        <div className="max-w-4xl">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">
      Securing Your Images, Memories & Moments. Discover <span className="underline text-orange-600">Piclock.</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-xl font-medium">
      Piclock encrypt Images, Empowering Privacy <br /> for Enhanced Digital Safety.
      </h3>
      </div>
      <div className='w-full'>
      <div className='mx-auto max-w-5xl'>
        <DropZone />
      </div>
      </div>
    </>
  )
}

export default Hero