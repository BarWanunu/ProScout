"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserIcon, UsersIcon, EyeIcon, ArrowLeftIcon } from "lucide-react"
import Logo from "../components/loginPages/Logo"

const SignupPage = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Player specific
    position: "",
    age: "",
    // Team specific
    teamName: "",
    location: "",
    // Scout specific
    organization: "",
    specialization: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
    // Then redirect to the appropriate dashboard
    navigate(`/${selectedRole}-dashboard`)
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    window.scrollTo({
      top: document.getElementById("signup-form").offsetTop - 50,
      behavior: "smooth",
    })
  }

  return (
    <div className="flex justify-start items-center flex-col min-h-screen">
      <div className="relative w-full min-h-screen">
        {/* Video Background */}
        <video
          src="/landing.mp4" // This should be replaced with your actual video path
          type="video/mp4"
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover fixed top-0 left-0 z-0"
        />

        {/* Content Overlay */}
        <div className="absolute flex flex-col justify-between items-center top-0 right-0 left-0 bottom-0 bg-black/70 z-10 min-h-screen">
          {/* Header */}
          <header className="w-full flex justify-between items-center py-6 px-6">
            <button
              onClick={() => navigate("/")}
              className="text-white flex items-center hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Login
            </button>
            <div className="flex items-center">
              <Logo className="h-10 w-10 mr-2" />
              <h1 className="text-white text-2xl font-bold">ProScout</h1>
            </div>
            <div className="w-24"></div> {/* Empty div for flex spacing */}
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center w-full px-4 py-8">
            {/* Role Selection */}
            <div className="w-full max-w-6xl mb-12">
              <h2 className="text-white text-3xl font-bold mb-8 text-center">Choose your role</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Player Card */}
                <div
                  className={`bg-black/50 backdrop-blur-sm border ${
                    selectedRole === "player" ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-700"
                  } rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer h-full`}
                  onClick={() => handleRoleSelect("player")}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                    <UserIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Sign up as Player</h3>
                  <p className="text-gray-300 text-center">
                    Showcase your skills, connect with teams, and take your career to the next level.
                  </p>
                </div>

                {/* Team Card */}
                <div
                  className={`bg-black/50 backdrop-blur-sm border ${
                    selectedRole === "team" ? "border-green-500 ring-2 ring-green-500" : "border-gray-700"
                  } rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer h-full`}
                  onClick={() => handleRoleSelect("team")}
                >
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-4">
                    <UsersIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Sign up as Team</h3>
                  <p className="text-gray-300 text-center">
                    Find the perfect talent for your roster and manage your team's recruitment process.
                  </p>
                </div>

                {/* Scout Card */}
                <div
                  className={`bg-black/50 backdrop-blur-sm border ${
                    selectedRole === "scout" ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-700"
                  } rounded-xl p-6 flex flex-col items-center hover:bg-black/70 transition-all cursor-pointer h-full`}
                  onClick={() => handleRoleSelect("scout")}
                >
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                    <EyeIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Sign up as Scout</h3>
                  <p className="text-gray-300 text-center">
                    Discover emerging talent, share your insights, and help shape the future of the sport.
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div id="signup-form" className="w-full max-w-2xl">
              {selectedRole && (
                <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
                  <div className="flex flex-col items-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full ${
                        selectedRole === "player"
                          ? "bg-blue-600"
                          : selectedRole === "team"
                            ? "bg-green-600"
                            : "bg-purple-600"
                      } flex items-center justify-center mb-4`}
                    >
                      {selectedRole === "player" ? (
                        <UserIcon className="text-white h-8 w-8" />
                      ) : selectedRole === "team" ? (
                        <UsersIcon className="text-white h-8 w-8" />
                      ) : (
                        <EyeIcon className="text-white h-8 w-8" />
                      )}
                    </div>
                    <h2 className="text-white text-2xl font-bold">
                      {selectedRole === "player"
                        ? "Player Registration"
                        : selectedRole === "team"
                          ? "Team Registration"
                          : "Scout Registration"}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRole === "team" ? (
                        <div className="col-span-2">
                          <label htmlFor="teamName" className="block text-gray-300 mb-1">
                            Team Name
                          </label>
                          <input
                            type="text"
                            id="teamName"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label htmlFor="firstName" className="block text-gray-300 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                                selectedRole === "player" ? "focus:ring-blue-500" : "focus:ring-purple-500"
                              }`}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-gray-300 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                                selectedRole === "player" ? "focus:ring-blue-500" : "focus:ring-purple-500"
                              }`}
                              required
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                          selectedRole === "player"
                            ? "focus:ring-blue-500"
                            : selectedRole === "team"
                              ? "focus:ring-green-500"
                              : "focus:ring-purple-500"
                        }`}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="password" className="block text-gray-300 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                            selectedRole === "player"
                              ? "focus:ring-blue-500"
                              : selectedRole === "team"
                                ? "focus:ring-green-500"
                                : "focus:ring-purple-500"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 ${
                            selectedRole === "player"
                              ? "focus:ring-blue-500"
                              : selectedRole === "team"
                                ? "focus:ring-green-500"
                                : "focus:ring-purple-500"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Role-specific fields */}
                    {selectedRole === "player" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="position" className="block text-gray-300 mb-1">
                            Position
                          </label>
                          <select
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select position</option>
                            <option value="forward">Forward</option>
                            <option value="midfielder">Midfielder</option>
                            <option value="defender">Defender</option>
                            <option value="goalkeeper">Goalkeeper</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="age" className="block text-gray-300 mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            id="age"
                            name="age"
                            min="12"
                            max="50"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === "team" && (
                      <div>
                        <label htmlFor="location" className="block text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="City, Country"
                          required
                        />
                      </div>
                    )}

                    {selectedRole === "scout" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="organization" className="block text-gray-300 mb-1">
                            Organization
                          </label>
                          <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Team or Agency"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="specialization" className="block text-gray-300 mb-1">
                            Specialization
                          </label>
                          <select
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="">Select specialization</option>
                            <option value="youth">Youth Development</option>
                            <option value="professional">Professional</option>
                            <option value="international">International</option>
                            <option value="performance">Performance Analysis</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 bg-gray-900 border-gray-700 rounded"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-gray-300 text-sm">
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className={`w-full ${
                        selectedRole === "player"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : selectedRole === "team"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-purple-600 hover:bg-purple-700"
                      } text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4`}
                    >
                      Create Account
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-300 text-sm">
                      Already have an account?{" "}
                      <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              )}
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

export default SignupPage
