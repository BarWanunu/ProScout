import React from "react"
import { useNavigate } from "react-router-dom";
import landingVideo from "../assets/landing.mp4";
import { UserIcon, UsersIcon, EyeIcon } from "lucide-react"
import Logo from "../components/loginPages/Logo"



const LandingPage = () => {
  const navigate = useNavigate()
  const handleCardClick = (userType) => {
    navigate(`/login/${userType}`)
  }
  return (
    <div className="flex justify-start items-center flex-col min-h-screen">
      <div className="relative w-full h-full min-h-screen">
        {/*Landing page video*/}
        <video 
          src = {landingVideo}
          type = "video/mp4"
          loop
          controls= {false}
          muted
          autoPlay
          className="w-full h-full object-cover fixed top-0 left-0 z-0"
        />
        <div className="absolute flex flex-col justify-between items-center top-0 right-0 left-0 bottom-0 bg-black/50 z-10 min-h-screen">
          {/* Header */}
          <header className="w-full flex justify-center items-center py-6">
            <div className="flex items-center">
              <Logo className="h-10 w-10 mr-2" />
              <h1 className="text-white text-2xl font-bold">ProScout</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-center items-center w-full px-4 py-8">
            <h2 className="text-white text-3xl font-bold mb-8 text-center">Choose how to connect</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {/* Player Card */}
              <div
                className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer"
                onClick={() => handleCardClick("player")}
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                  <UserIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Connect as Player</h3>
                <p className="text-gray-300 text-center">
                  Showcase your skills, connect with teams, and take your career to the next level.
                </p>
              </div>

              {/* Team Card */}
              <div
                className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer"
                onClick={() => handleCardClick("team")}
              >
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-4">
                  <UsersIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Connect as Team</h3>
                <p className="text-gray-300 text-center">
                  Find the perfect talent for your roster and manage your team's recruitment process.
                </p>
              </div>

              {/* Scout Card */}
              <div
                className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer"
                onClick={() => handleCardClick("scout")}
              >
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                  <EyeIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Connect as Scout</h3>
                <p className="text-gray-300 text-center">
                  Discover emerging talent, share your insights, and help shape the future of the sport.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign up now
                </a>
              </p>
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

export default LandingPage
