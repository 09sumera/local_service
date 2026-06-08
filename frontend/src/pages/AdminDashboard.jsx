import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'services') fetchServices();
    if (activeTab === 'payments') fetchPayments();
    if (activeTab === 'reviews') fetchReviews();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/bookings');
      setBookings(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/services');
      setServices(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/payments');
      setPayments(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/reviews');
      setReviews(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      alert(`Booking status updated to ${status}`);
      fetchBookings();
      fetchStats();
    } catch (err) { alert('Update failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
      fetchStats();
      alert('User deleted');
    } catch (err) { alert('Delete failed'); }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchServices();
      fetchStats();
      alert('Service deleted');
    } catch (err) { alert('Delete failed'); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      fetchReviews();
      alert('Review deleted');
    } catch (err) { alert('Delete failed'); }
  };

  if (!user || user.role !== 'admin') return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-xl text-gray-900">Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
           <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 shadow-sm flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
             System Online
           </div>
        </div>

        <div className="flex gap-8 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {['overview', 'users', 'bookings', 'services', 'payments', 'reviews'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`pb-4 text-sm font-semibold transition-colors relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab === 'overview' ? tab : `Manage ${tab}`}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">👥</div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">{stats.totalUsers}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">🛠️</div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Providers</h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">{stats.totalProviders}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">📅</div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Bookings</h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">{stats.totalBookings}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">💰</div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-600 tracking-tight">₹{stats.totalRevenue}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : u.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.role !== 'admin' && (
                        <button onClick={() => deleteUser(u.id)} className="bg-white border border-gray-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors shadow-sm">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-medium text-gray-500">Loading bookings...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-medium text-gray-500">No bookings found.</td>
                  </tr>
                ) : (
                  bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{b.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{b.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{b.service_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${b.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                          b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          b.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          b.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, 'accepted')} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Accept</button>
                            <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Reject</button>
                          </>
                        )}
                        {b.status === 'accepted' && (
                          <button onClick={() => updateBookingStatus(b.id, 'completed')} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors">Complete</button>
                        )}
                        {b.status === 'completed' && (
                          <button onClick={() => updateBookingStatus(b.id, 'paid')} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">Mark Paid</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-gray-500">Loading services...</td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-gray-500">No services found</td>
                  </tr>
                ) : (
                  services.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{s.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{s.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">₹{s.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => deleteService(s.id)} className="bg-white border border-gray-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors shadow-sm">Delete</button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-gray-500">Loading payments...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-gray-500">No payments found</td>
                  </tr>
                ) : (
                  payments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{p.booking_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">₹{p.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-medium text-gray-500">Loading reviews...</td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm font-medium text-gray-500">No reviews found</td>
                  </tr>
                ) : (
                  reviews.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{r.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{r.service_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{r.customer_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-500 tracking-widest">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{r.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => deleteReview(r.id)} className="bg-white border border-gray-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors shadow-sm">Delete</button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
