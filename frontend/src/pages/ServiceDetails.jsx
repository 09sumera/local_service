import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import { AuthContext } from '../context/AuthContext';
import { getDefaultImage } from '../utils/imageUtils';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchService();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bookingDate) {
      alert('Please select a date');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/bookings`, { service_id: id, date: bookingDate });
      alert('Booking created successfully!');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!service) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-xl text-gray-900">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          ← Back to Services
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {service.image_url ? (
            <img 
              src={service.image_url} 
              alt={service.title} 
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDefaultImage(service.category);
              }}
            />
          ) : (
            <img src={getDefaultImage(service.category)} alt="Default Service" className="w-full h-80 object-cover" />
          )}
          
          <div className="p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{service.title}</h1>
                <div className="flex items-center gap-2 mt-3 text-gray-500 font-medium">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">P</div>
                  <span>Provided by <strong className="text-gray-900">{service.provider_name}</strong></span>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{service.price}</span>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this service</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{service.description}</p>
            </div>

            <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select a Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-sm"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <button 
                onClick={handleBook}
                className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all whitespace-nowrap"
              >
                Book Now
              </button>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Customer Reviews
                <span className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full">{service.reviews ? service.reviews.length : 0}</span>
              </h3>
              
              {service.reviews && service.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Array.isArray(service.reviews) ? service.reviews : []).map(review => (
                    <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                             {review.customer_name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                             <span className="block font-bold text-gray-900">{review.customer_name}</span>
                           </div>
                        </div>
                        <span className="text-amber-400 tracking-widest text-lg">{'★'.repeat(review.rating)}<span className="text-gray-200">{'★'.repeat(5-review.rating)}</span></span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this service!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
