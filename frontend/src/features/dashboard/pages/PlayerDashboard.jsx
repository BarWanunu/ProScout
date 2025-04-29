"use client"
import { useNavigate } from "react-router-dom"
import { UserIcon, LogOutIcon, TrophyIcon, ClipboardIcon, CalendarIcon, BarChart3Icon } from "lucide-react"
import Logo from "../../../assets/Logo";

const PlayerDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-black px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">ProScout</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
          <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <LogOutIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Player Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <TrophyIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Performance</h3>
            </div>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-gray-400 text-sm">Overall rating</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                <ClipboardIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Matches</h3>
            </div>
            <p className="text-3xl font-bold">24</p>
            <p className="text-gray-400 text-sm">This season</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center mr-3">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Upcoming</h3>
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-gray-400 text-sm">Scheduled matches</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <BarChart3Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Scout Views</h3>
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-gray-400 text-sm">Profile views this month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
              <div>
                <p className="font-medium">Your profile was viewed by FC Barcelona scout</p>
                <p className="text-gray-400 text-sm">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
              <div>
                <p className="font-medium">You were added to Manchester United watchlist</p>
                <p className="text-gray-400 text-sm">5 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
              <div>
                <p className="font-medium">Your performance rating was updated</p>
                <p className="text-gray-400 text-sm">1 week ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Real Madrid Youth</p>
                <p className="text-gray-400 text-sm">Home Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 15, 2025</p>
                <p className="text-gray-400 text-sm">15:30 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Ajax Academy</p>
                <p className="text-gray-400 text-sm">Away Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 22, 2025</p>
                <p className="text-gray-400 text-sm">18:00 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Bayern Munich U21</p>
                <p className="text-gray-400 text-sm">Home Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 29, 2025</p>
                <p className="text-gray-400 text-sm">14:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboard

