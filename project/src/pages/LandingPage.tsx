import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Code, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">TrustLens</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Authentication
            <span className="text-purple-600 block">for Modern Apps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            TrustLens provides enterprise-grade authentication and authorization services
            for both users and developers. Build secure, scalable applications with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Start Building
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Experience
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're a user or developer, we have the right tools for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">For Users</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Manage your digital identity, control app permissions, and monitor data access 
                across all connected applications.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-purple-600 mr-2" />
                  Connected Apps Management
                </li>
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-purple-600 mr-2" />
                  Privacy Controls
                </li>
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-purple-600 mr-2" />
                  Activity Monitoring
                </li>
              </ul>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Sign Up as User
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <Code className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">For Developers</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Integrate secure authentication into your applications with our comprehensive 
                API and developer tools.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                  API Analytics Dashboard
                </li>
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                  User Management Tools
                </li>
                <li className="flex items-center text-gray-700">
                  <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                  Real-time Monitoring
                </li>
              </ul>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Join as Developer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}