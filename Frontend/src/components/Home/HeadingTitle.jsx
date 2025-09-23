import React from 'react'

export default function Server({title1,title2}) {
  return (
    <div className="bg-white m-10">
        <div className="text-center">
            <h1 className="text-blue-600 font-bold text-xl sm:text-2xl md:text-2xl xl:text-2xl">{title1}</h1>
            <h1 className="text-black text-3xl sm:text-4xl md:text-3xl xl:text-4xl font-bold py-3">{title2}</h1>
        </div>
    </div>
  )
}
