"use client"
import { useNavigate } from "react-router-dom"
import { UsersIcon, LogOutIcon, UserSearchIcon, ClipboardIcon, CalendarIcon, BarChart3Icon } from "lucide-react"
import Logo from "../../../assets/Logo";

const TeamDashboard = () => {
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
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">FC Barcelona</span>
          </div>
          <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <LogOutIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Team Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                <UserSearchIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Scouting</h3>
            </div>
            <p className="text-3xl font-bold">28</p>
            <p className="text-gray-400 text-sm">Active prospects</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <ClipboardIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Matches</h3>
            </div>
            <p className="text-3xl font-bold">42</p>
            <p className="text-gray-400 text-sm">This season</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center mr-3">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Upcoming</h3>
            </div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-gray-400 text-sm">Scheduled matches</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <BarChart3Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Recruitment</h3>
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-gray-400 text-sm">Open positions</p>
          </div>
        </div>

        {/* Top Prospects */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Top Prospects</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Position</th>
                  <th className="pb-3 font-medium">Age</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr className="hover:bg-gray-700">
                  <td className="py-3">James Rodriguez</td>
                  <td className="py-3">Forward</td>
                  <td className="py-3">19</td>
                  <td className="py-3">92%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded-full text-xs">Watching</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Maria Silva</td>
                  <td className="py-3">Midfielder</td>
                  <td className="py-3">20</td>
                  <td className="py-3">88%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">Contact Made</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Ahmed Hassan</td>
                  <td className="py-3">Defender</td>
                  <td className="py-3">21</td>
                  <td className="py-3">85%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded-full text-xs">Negotiating</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Sophie Chen</td>
                  <td className="py-3">Goalkeeper</td>
                  <td className="py-3">22</td>
                  <td className="py-3">90%</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded-full text-xs">
                      Trial Scheduled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Real Madrid</p>
                <p className="text-gray-400 text-sm">Home Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 15, 2025</p>
                <p className="text-gray-400 text-sm">20:30 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Ajax</p>
                <p className="text-gray-400 text-sm">Away Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 22, 2025</p>
                <p className="text-gray-400 text-sm">18:00 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">vs. Bayern Munich</p>
                <p className="text-gray-400 text-sm">Home Game</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 29, 2025</p>
                <p className="text-gray-400 text-sm">19:45 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDashboard

