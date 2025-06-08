"use client"
import { useNavigate } from "react-router-dom"
import { EyeIcon, LogOutIcon, UserSearchIcon, ClipboardIcon, CalendarIcon, BarChart3Icon } from "lucide-react"
import Logo from "../../../assets/Logo";

const ScoutDashboard = () => {
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
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
              <EyeIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">Alex Johnson</span>
          </div>
          <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <LogOutIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Scout Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <UserSearchIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Scouted</h3>
            </div>
            <p className="text-3xl font-bold">47</p>
            <p className="text-gray-400 text-sm">Players this month</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <ClipboardIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Reports</h3>
            </div>
            <p className="text-3xl font-bold">32</p>
            <p className="text-gray-400 text-sm">Submitted this month</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center mr-3">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Upcoming</h3>
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-gray-400 text-sm">Scheduled matches</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                <BarChart3Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Success Rate</h3>
            </div>
            <p className="text-3xl font-bold">78%</p>
            <p className="text-gray-400 text-sm">Recommendations signed</p>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Player</th>
                  <th className="pb-3 font-medium">Position</th>
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Carlos Mendez</td>
                  <td className="py-3">Forward</td>
                  <td className="py-3">River Plate</td>
                  <td className="py-3">9.2/10</td>
                  <td className="py-3">June 2, 2025</td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Liam Johnson</td>
                  <td className="py-3">Midfielder</td>
                  <td className="py-3">Ajax Youth</td>
                  <td className="py-3">8.7/10</td>
                  <td className="py-3">May 28, 2025</td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Sophia Williams</td>
                  <td className="py-3">Defender</td>
                  <td className="py-3">Lyon Academy</td>
                  <td className="py-3">9.0/10</td>
                  <td className="py-3">May 25, 2025</td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="py-3">Jamal Ibrahim</td>
                  <td className="py-3">Goalkeeper</td>
                  <td className="py-3">Al-Ahly Youth</td>
                  <td className="py-3">8.5/10</td>
                  <td className="py-3">May 20, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Matches to Scout */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Matches to Scout</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">River Plate vs. Boca Juniors (U21)</p>
                <p className="text-gray-400 text-sm">Buenos Aires, Argentina</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 15, 2025</p>
                <p className="text-gray-400 text-sm">16:30 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">Ajax Youth vs. PSV Youth</p>
                <p className="text-gray-400 text-sm">Amsterdam, Netherlands</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 18, 2025</p>
                <p className="text-gray-400 text-sm">14:00 PM</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">La Masia vs. Real Madrid Academy</p>
                <p className="text-gray-400 text-sm">Barcelona, Spain</p>
              </div>
              <div className="text-right">
                <p className="font-medium">June 22, 2025</p>
                <p className="text-gray-400 text-sm">17:45 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoutDashboard

