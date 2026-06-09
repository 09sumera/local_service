import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { AuthContext } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'profile'
  
  const [reviewServiceId, setReviewServiceId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 5000);
  };

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bookings/customer`);
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        console.error('API returned object instead of array:', res.data);
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async (bookingId, amount) => {
    try {
      const res = await axios.post(`${API_URL}/api/bookings/${bookingId}/pay`, { amount, method: 'upi' });
      showToast(`Payment successful! Transaction ID: ${res.data.transactionId}`);
      fetchBookings();
    } catch (err) {
      alert('Payment failed');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/services/${reviewServiceId}/reviews`, reviewData);
      showToast('Review submitted successfully!');
      setReviewServiceId(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Customer Dashboard</h1>
        
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('bookings')} 
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'bookings' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            My Bookings
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Profile Settings
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings yet</h3>
                <p className="text-gray-500 text-sm">You haven't booked any services. Explore our services to get started!</p>
              </div>
            ) : (
              (Array.isArray(bookings) ? bookings : []).map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                      
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                          {booking.service_title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight mb-1">{booking.service_title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <span className="w-4 h-4 text-gray-400">👤</span>
                              {booking.provider_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-4 h-4 text-gray-400">🕒</span>
                              {new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${booking.status === 'completed' ? 'bg-purple-100 text-purple-700' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              booking.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                              booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium text-gray-500 mb-0.5">Total Amount</p>
                          <p className="text-2xl font-bold text-indigo-600">₹{booking.price}</p>
                        </div>
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                          {(booking.status === 'accepted' || booking.status === 'completed') && (
                            <button 
                              onClick={() => handlePay(booking.id, booking.price)} 
                              className="flex-1 sm:flex-none bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                            >
                              Pay Now
                            </button>
                          )}

                          {(booking.status === 'completed' || booking.status === 'paid') && (
                            <button 
                              onClick={() => setReviewServiceId(reviewServiceId === booking.service_id ? null : booking.service_id)} 
                              className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                            >
                              {reviewServiceId === booking.service_id ? 'Cancel Review' : 'Write Review'}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                    {reviewServiceId === booking.service_id && (
                      <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-base font-bold text-gray-900 mb-4">Review your experience</h4>
                        <form onSubmit={submitReview} className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating (1-5)</label>
                            <select 
                              required 
                              className="w-full sm:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm"
                              value={reviewData.rating} 
                              onChange={(e) => setReviewData({...reviewData, rating: Number(e.target.value)})}
                            >
                              {[5,4,3,2,1].map(num => (
                                <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Feedback</label>
                            <textarea 
                              required 
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 h-28 shadow-sm resize-none" 
                              placeholder="Tell us what you liked about the service..." 
                              value={reviewData.comment} 
                              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                            ></textarea>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                              Submit Review
                            </button>
                            <button type="button" onClick={() => setReviewServiceId(null)} className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
              <div className="pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Role</label>
                <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-bounce font-medium text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-100" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
