"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UsersIcon, ArrowLeftIcon } from "lucide-react"
import Logo from "./Logo"

const TeamLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Team login with:", email, password)
    // Redirect to team dashboard after successful login
    navigate("/team-dashboard")
  }

  return (
    <div className="flex justify-start items-center flex-col min-h-screen">
      <div className="relative w-full h-full min-h-screen">
        <video
          src="/landing.mp4"
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover fixed top-0 left-0 z-0"
        />
        <div className="absolute flex flex-col justify-between items-center top-0 right-0 left-0 bottom-0 bg-black/70 z-10 min-h-screen">
          {/* Header */}
          <header className="w-full flex justify-between items-center py-6 px-6">
            <button
              onClick={() => navigate("/")}
              className="text-white flex items-center hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center">
              <Logo className="h-10 w-10 mr-2" />
              <h1 className="text-white text-2xl font-bold">ProScout</h1>
            </div>
            <div className="w-24"></div> {/* Empty div for flex spacing */}
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-center items-center w-full px-4 py-8">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-4">
                  <UsersIcon className="text-white h-8 w-8" />
                </div>
                <h2 className="text-white text-2xl font-bold">Team Login</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="h-4 w-4 bg-gray-900 border-gray-700 rounded" />
                    <label htmlFor="remember" className="ml-2 text-gray-300 text-sm">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Sign up now
                  </a>
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="w-full py-4 text-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} ProScout. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default TeamLogin
