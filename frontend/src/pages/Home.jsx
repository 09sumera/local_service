import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
              <span className="block">Find the perfect</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                local service professional
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Book trusted cleaners, plumbers, electricians, and more instantly. Safe, secure, and satisfaction guaranteed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/services" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transition-all shadow-md"
              >
                Browse Services <ArrowRight size={20} />
              </Link>
              <Link 
                to="/register" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-indigo-100 text-lg font-bold rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition-all shadow-sm"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Why choose LocalServe?</h2>
            <p className="mt-4 text-lg text-gray-500 font-medium">We make finding and booking local services effortless.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                <Shield size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Verified Professionals</h3>
              <p className="mt-4 text-gray-600 leading-relaxed font-medium">All our service providers go through a strict background check and verification process.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Clock size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Instant Booking</h3>
              <p className="mt-4 text-gray-600 leading-relaxed font-medium">Choose your preferred time slot and book instantly online without any hassle.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Star size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Quality Guaranteed</h3>
              <p className="mt-4 text-gray-600 leading-relaxed font-medium">Read genuine customer reviews and ratings before making your choice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
