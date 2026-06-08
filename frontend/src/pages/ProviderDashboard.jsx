import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getDefaultImage, isValidImageUrl } from '../utils/imageUtils';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Cleaning', price: '', image_url: '' });
  
  // Edit State
  const [editServiceId, setEditServiceId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', category: '', price: '', image_url: '' });

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services/provider');
      setServices(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/provider');
      setBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (formData.image_url && !isValidImageUrl(formData.image_url)) {
      alert('Please enter a valid direct image URL (.jpg, .png, etc.) or an Unsplash image URL.');
      return;
    }
    try {
      await axios.post('/api/services', formData);
      setFormData({ title: '', description: '', category: 'Cleaning', price: '', image_url: '' });
      fetchServices();
      alert('Service added!');
      setActiveTab('services');
    } catch (err) { alert('Failed to add service'); }
  };

  const handleEditClick = (service) => {
    setEditServiceId(service.id);
    setEditFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      image_url: service.image_url || ''
    });
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (editFormData.image_url && !isValidImageUrl(editFormData.image_url)) {
      alert('Please enter a valid direct image URL (.jpg, .png, etc.) or an Unsplash image URL.');
      return;
    }
    try {
      await axios.put(`/api/services/${editServiceId}`, editFormData);
      setEditServiceId(null);
      fetchServices();
      alert('Service updated successfully!');
    } catch (err) { alert('Failed to update service'); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchServices();
      alert('Service deleted!');
    } catch (err) { alert('Failed to delete service'); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      fetchBookings();
      alert(`Booking status updated to ${status}`);
    } catch (err) { alert('Update failed'); }
  };

  console.log('API response from /api/bookings/provider:', bookings);

  const totalEarnings = bookings.reduce(
    (sum, booking) => {
      console.log('Inspecting booking:', booking.id, 'status:', booking.status, 'price:', booking.price);
      if (booking.status?.trim().toLowerCase() === 'paid') {
        return sum + Number(booking.price || 0);
      }
      return sum;
    },
    0
  );

  console.log('Provider Bookings:', bookings);
  console.log('Calculated Earnings:', totalEarnings);

  if (!user || user.role !== 'provider') return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-xl">Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Gradient Earnings Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-400 opacity-10 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-xl font-medium text-indigo-100 mb-2 uppercase tracking-wider">Total Earnings</h1>
              <p className="text-5xl md:text-7xl font-bold tracking-tight">₹{totalEarnings.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-700/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-indigo-500/30 text-sm font-medium">
              Provider Dashboard
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-8 mb-8 border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <button 
            onClick={() => setActiveTab('bookings')} 
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'bookings' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Manage Bookings
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('services')} 
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'services' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            My Services
            {activeTab === 'services' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'add' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Add Service
            {activeTab === 'add' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings yet</h3>
                <p className="text-gray-500 text-sm">You haven't received any bookings for your services.</p>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                        {booking.service_title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight mb-2">{booking.service_title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <span className="text-gray-400">👤</span>
                            {booking.customer_name} ({booking.customer_email})
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-gray-400">🕒</span>
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

                    <div className="flex flex-wrap gap-3 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => updateBookingStatus(booking.id, 'accepted')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">Accept Booking</button>
                          <button onClick={() => updateBookingStatus(booking.id, 'rejected')} className="bg-white border border-gray-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap">Reject</button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <button onClick={() => updateBookingStatus(booking.id, 'completed')} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap">Mark Completed</button>
                      )}
                      {booking.status === 'completed' && (
                         <span className="text-sm font-medium text-gray-500 italic px-2 py-2">Waiting for payment...</span>
                      )}
                      {booking.status === 'paid' && (
                         <span className="text-sm font-medium text-emerald-600 font-bold px-2 py-2 flex items-center gap-1">✓ Payment Received</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500">No services found. Add one to get started!</p>
              </div>
            )}
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col relative">
                {editServiceId === service.id ? (
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Service</h3>
                    <form onSubmit={handleUpdateService} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-gray-900" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-gray-900" value={editFormData.category} onChange={e => setEditFormData({...editFormData, category: e.target.value})}>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Carpentry">Carpentry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                        <input type="number" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-gray-900" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                        <input type="url" placeholder="Optional" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-gray-900" value={editFormData.image_url} onChange={e => setEditFormData({...editFormData, image_url: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                        <textarea required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm text-gray-900 h-24 resize-none" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})}></textarea>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">Save</button>
                        <button type="button" onClick={() => setEditServiceId(null)} className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="relative p-3 pb-0">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={service.title} 
                          className="w-full h-48 object-cover rounded-xl shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getDefaultImage(service.category);
                          }}
                        />
                      ) : (
                        <img src={getDefaultImage(service.category)} alt="Default Service" className="w-full h-48 object-cover rounded-xl shadow-sm" />
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-sm text-violet-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {service.category}
                        </span>
                      </div>
                      
                      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEditClick(service)} className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors" title="Edit">
                           ✏️
                         </button>
                         <button onClick={() => handleDeleteService(service.id)} className="bg-white text-red-600 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors" title="Delete">
                           🗑️
                         </button>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight pr-4">{service.title}</h3>
                        <span className="text-lg font-bold text-indigo-600 whitespace-nowrap">₹{service.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3 mb-4 flex-grow leading-relaxed">{service.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Service Tab */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Service</h2>
              <form onSubmit={handleAddService} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Title</label>
                  <input type="text" required placeholder="e.g. Deep Home Cleaning" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm transition-shadow" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm transition-shadow" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Carpentry">Carpentry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                    <input type="number" required placeholder="e.g. 1499" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm transition-shadow" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL (Optional)</label>
                  <input type="url" placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm transition-shadow" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea required placeholder="Describe your service in detail..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm text-gray-900 shadow-sm transition-shadow h-32 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors">
                    Publish Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
