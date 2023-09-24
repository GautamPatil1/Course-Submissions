import React from 'react'

const Total = ({ course }) => {
  const sum = course.parts.reduce((previousValue, { exercises }) => {
    return (exercises + previousValue)
  }, 0
  )
  return (<p>Number of exercises <b>{sum}</b></p>)
}

export default Total