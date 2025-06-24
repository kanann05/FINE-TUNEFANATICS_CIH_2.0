import { useEffect, useState } from "react";
import Component from './Component'
import CryptoJS from 'crypto-js';


export default function ComponentTest() {
  const api = "7XXltVsZTnpf"
  
  function handleAuth(data) {
     const bytes = CryptoJS.AES.decrypt(data, api);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  
  // Handle invalid decryption
  if (!decryptedString) {
    throw new Error("Decryption failed. Possibly wrong password or corrupted data.");
  }
  console.log(JSON.parse(decryptedString))
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-2">Sign Up</h2>
          
        </div>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Create a password"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm your password"
              disabled
            />
          </div>
        </form>
        {/* Keep this part constant */}







        <div className="mt-8" style={{ width: 'fit-content', margin: '20px auto' }}>
          <Component apiKey={"1WtIKeuSbzOE"} onAuthSuccess={handleAuth} />
        </div>








        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span className="text-purple-600 font-semibold cursor-pointer">Sign In</span>
        </div>
      </div>
    </div>
  );
}
