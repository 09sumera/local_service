import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getDefaultImage } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL;

const Services = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchServices();
  }, [search, category]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/services?search=${search}&category=${category}`
      );

      console.log('API Response:', res.data);

      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        console.error('Expected array but received:', res.data);
        setServices([]);
      }
    } catch (err) {
      console.error('Services Error:', err);
      setServices([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Our Services
          </h1>

          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search services..."
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl w-full md:w-72 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm transition-all text-sm text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none shadow-sm transition-all text-sm text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Painting">Painting</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(services) &&
            (Array.isArray(services) ? services : []).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDefaultImage(service.category);
                      }}
                    />
                  ) : (
                    <img
                      src={getDefaultImage(service.category)}
                      alt="Default Service"
                      className="w-full h-52 object-cover"
                    />
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-violet-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>

                    <span className="text-lg font-bold text-indigo-600 whitespace-nowrap ml-4">
                      ₹{service.price}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {service.provider_name
                          ? service.provider_name.charAt(0).toUpperCase()
                          : '?'}
                      </div>

                      <span className="text-sm font-medium text-gray-700">
                        {service.provider_name || 'Provider'}
                      </span>
                    </div>

                    <Link
                      to={`/services/${service.id}`}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          {(!services || services.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 text-2xl">🔍</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No services found
              </h3>

              <p className="text-gray-500 text-sm">
                Try adjusting your search or category filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;