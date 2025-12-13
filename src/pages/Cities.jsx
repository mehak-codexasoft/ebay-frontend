import { Search, Building2, MapPin, Eye } from 'lucide-react';
import { useState } from 'react';

const citiesData = [
  { id: 1, name: 'Paris', country: 'France', landmarks: 45, status: 'Active' },
  { id: 2, name: 'New York', country: 'USA', landmarks: 67, status: 'Active' },
  { id: 3, name: 'London', country: 'UK', landmarks: 52, status: 'Active' },
  { id: 4, name: 'Rome', country: 'Italy', landmarks: 38, status: 'Active' },
  { id: 5, name: 'Tokyo', country: 'Japan', landmarks: 41, status: 'Active' },
  { id: 6, name: 'Dubai', country: 'UAE', landmarks: 29, status: 'Inactive' },
  { id: 7, name: 'Sydney', country: 'Australia', landmarks: 23, status: 'Active' },
  { id: 8, name: 'Barcelona', country: 'Spain', landmarks: 31, status: 'Active' },
];

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function Cities() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = citiesData.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Cities</h1>
        <p className="text-gray-500 mt-1">View all cities in the system (Read Only).</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredCities.map((city) => (
          <div key={city.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Building2 size={48} className="text-white/80" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {city.country}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[city.status]}`}>
                  {city.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{city.landmarks}</p>
                  <p className="text-xs text-gray-500">Landmarks</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No cities found</p>
        </div>
      )}
    </div>
  );
}
