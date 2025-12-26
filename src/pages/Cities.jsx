import { Search, Building2, MapPin, Eye, X, Globe, Calendar, ChevronLeft, ChevronRight, Loader2, Image } from 'lucide-react';
import { useState, useEffect } from 'react';
import cityService from '../services/cityService';

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  // View Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingCity, setLoadingCity] = useState(false);

  // Fetch cities
  const fetchCities = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await cityService.getCities(params);
      setCities(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to load cities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [currentPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchCities();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleViewCity = async (city) => {
    setSelectedCity(city);
    setIsViewModalOpen(true);
    setLoadingCity(true);
    try {
      const fullCity = await cityService.getCityById(city.id);
      setSelectedCity(fullCity);
    } catch (err) {
      console.error('Error fetching city details:', err);
    } finally {
      setLoadingCity(false);
    }
  };

  const getContinentColor = (continent) => {
    const colors = {
      'Europe': 'bg-blue-100 text-blue-700',
      'Asia': 'bg-purple-100 text-purple-700',
      'Africa': 'bg-orange-100 text-orange-700',
      'North America': 'bg-green-100 text-green-700',
      'South America': 'bg-yellow-100 text-yellow-700',
      'Oceania': 'bg-pink-100 text-pink-700',
      'Antarctica': 'bg-cyan-100 text-cyan-700',
    };
    return colors[continent] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Cities</h1>
          <p className="text-gray-500 mt-1">View all cities in the system. Total: {totalCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

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
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 size={48} className="mx-auto text-green-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading cities...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {cities.map((city) => (
              <div key={city.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* City Image */}
                <div className="h-36 bg-gradient-to-br from-green-400 to-green-600 relative">
                  {city.photo ? (
                    <img
                      src={city.photo}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={48} className="text-white/80" />
                    </div>
                  )}
                  {city.continent && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${getContinentColor(city.continent)}`}>
                      {city.continent}
                    </span>
                  )}
                </div>

                {/* City Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin size={14} />
                    {city.country || 'Unknown'}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                      {city.landmarks_count !== undefined && (
                        <span>{city.landmarks_count} landmarks</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewCity(city)}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                    >
                      <Eye size={16} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cities.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No cities found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} cities
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View City Modal */}
      {isViewModalOpen && selectedCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">City Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {loadingCity ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* City Image */}
                  <div className="h-48 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-green-400 to-green-600">
                    {selectedCity?.photo ? (
                      <img
                        src={selectedCity.photo}
                        alt={selectedCity.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={64} className="text-white/80" />
                      </div>
                    )}
                  </div>

                  {/* City Name */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCity?.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {selectedCity?.continent && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContinentColor(selectedCity.continent)}`}>
                          {selectedCity.continent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* City Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Country</p>
                        <p className="text-sm font-medium text-gray-700">{selectedCity?.country || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Globe size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Continent</p>
                        <p className="text-sm font-medium text-gray-700">{selectedCity?.continent || 'N/A'}</p>
                      </div>
                    </div>

                    {selectedCity?.landmarks_count !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Building2 size={18} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Landmarks</p>
                          <p className="text-sm font-medium text-gray-700">{selectedCity.landmarks_count}</p>
                        </div>
                      </div>
                    )}

                    {selectedCity?.created_at && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Calendar size={18} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Created At</p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(selectedCity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* City ID */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">City ID</p>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {selectedCity?.id || 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
