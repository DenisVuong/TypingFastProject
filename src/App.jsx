import React from 'react'
import TypingSpace from './components/TypingSpace'
import NavBar from './components/NavBar'

const App = () => {
  return (
 <div className="min-h-screen flex flex-col items-center justify-start bg-gray-950 text-white">
      {/* Barre de navigation */}
      <NavBar/>

      <h1 className='text-6xl font-bold pt-10 '>Test your Typing Speed</h1>
      <p className='text-gray-400 text-xl pt-4'>Challenge yourself with our typing speed test and improve your WPM</p>

      <TypingSpace/>
    </div>
  )
}

export default App