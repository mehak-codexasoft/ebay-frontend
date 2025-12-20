import { Search, Plus, Edit2, Trash2, Eye, X, MapPin, Star, Heart, Check, Clock, Umbrella, Baby, Dog, Users, ChevronLeft, ChevronRight, Loader2, Image, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import landmarkService from '../services/landmarkService';
import cityService from '../services/cityService';

const categories = ['PARK', 'MONUMENT', 'ATTRACTION', 'NIGHTLIFE', 'RESTAURANT', 'MUSEUM', 'BEACH', 'SHOPPING', 'CAFE', 'BAR', 'HOTEL', 'OTHER'];
const priceRanges = ['$', '$$', '$$$', '$$$$'];

export default function Landmarks() {
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Cities for dropdown
  const [cities, setCities] = useState([]);
  const [cityFilter, setCityFilter] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState(null);
  const [viewingLandmark, setViewingLandmark] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [landmarkToDelete, setLandmarkToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    short_description: '',
    recommendations: '',
    category: 'PARK',
    opening_hours: '',
    price_range: '$',
    is_rain_friendly: false,
    is_walking_distance: false,
    is_pet_friendly: false,
    is_above_18: false,
    is_child_friendly: true,
  });

  // Fetch landmarks
  const fetchLandmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;
      if (cityFilter) params.city = cityFilter;

      const response = await landmarkService.getLandmarks(params);
      setLandmarks(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to load landmarks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities for filter
  const fetchCities = async () => {
    try {
      const response = await cityService.getCities({ page_size: 100 });
      setCities(response.results || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  useEffect(() => {
    fetchLandmarks();
  }, [currentPage, cityFilter]);

  useEffect(() => {
    fetchCities();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchLandmarks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = async (landmark) => {
    setViewingLandmark(landmark);
    setShowViewModal(true);
    setLoadingDetails(true);
    try {
      const fullLandmark = await landmarkService.getLandmarkById(landmark.id);
      setViewingLandmark(fullLandmark);
    } catch (err) {
      console.error('Error fetching landmark details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openModal = async (landmark = null) => {
    if (landmark) {
      setEditingLandmark(landmark);
      try {
        const fullLandmark = await landmarkService.getLandmarkById(landmark.id);
        setFormData({
          name: fullLandmark.name || '',
          city: fullLandmark.city || '',
          short_description: fullLandmark.short_description || '',
          recommendations: fullLandmark.recommendations || '',
          category: fullLandmark.category || 'PARK',
          opening_hours: fullLandmark.opening_hours || '',
          price_range: fullLandmark.price_range || '$',
          is_rain_friendly: fullLandmark.is_rain_friendly || false,
          is_walking_distance: fullLandmark.is_walking_distance || false,
          is_pet_friendly: fullLandmark.is_pet_friendly || false,
          is_above_18: fullLandmark.is_above_18 || false,
          is_child_friendly: fullLandmark.is_child_friendly || true,
        });
      } catch (err) {
        setFormData({
          name: landmark.name || '',
          city: landmark.city || '',
          short_description: landmark.short_description || '',
          recommendations: landmark.recommendations || '',
          category: landmark.category || 'PARK',
          opening_hours: landmark.opening_hours || '',
          price_range: landmark.price_range || '$',
          is_rain_friendly: landmark.is_rain_friendly || false,
          is_walking_distance: landmark.is_walking_distance || false,
          is_pet_friendly: landmark.is_pet_friendly || false,
          is_above_18: landmark.is_above_18 || false,
          is_child_friendly: landmark.is_child_friendly || true,
        });
      }
    } else {
      setEditingLandmark(null);
      setFormData({
        name: '',
        city: '',
        short_description: '',
        recommendations: '',
        category: 'PARK',
        opening_hours: '',
        price_range: '$',
        is_rain_friendly: false,
        is_walking_distance: false,
        is_pet_friendly: false,
        is_above_18: false,
        is_child_friendly: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLandmark(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingLandmark) {
        await landmarkService.updateLandmark(editingLandmark.id, formData);
      } else {
        await landmarkService.createLandmark(formData);
      }
      closeModal();
      fetchLandmarks();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save landmark');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (landmark) => {
    setLandmarkToDelete(landmark);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!landmarkToDelete) return;
    setDeleting(true);
    try {
      await landmarkService.deleteLandmark(landmarkToDelete.id);
      setIsDeleteModalOpen(false);
      setLandmarkToDelete(null);
      fetchLandmarks();
    } catch (err) {
      setError('Failed to delete landmark');
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async (landmark) => {
    try {
      if (landmark.is_liked) {
        await landmarkService.unlikeLandmark(landmark.id);
      } else {
        await landmarkService.likeLandmark(landmark.id);
      }
      fetchLandmarks();
    } catch (err) {
      console.error('Error liking/unliking landmark:', err);
    }
  };

  // Filter landmarks by category (client-side)
  const filteredLandmarks = categoryFilter
    ? landmarks.filter(l => l.category === categoryFilter)
    : landmarks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Landmarks</h1>
          <p className="text-gray-500 mt-1">Manage all landmarks in the system. Total: {totalCount}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/30"
        >
          <Plus size={20} />
          <span>Add Landmark</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search landmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none shadow-sm"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto text-green-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading landmarks...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Landmark</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Rating</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Likes</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLandmarks.map((landmark) => (
                    <tr key={landmark.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {landmark.photos && landmark.photos.length > 0 ? (
                            <img
                              src={landmark.photos[0]}
                              alt={landmark.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                              <MapPin size={20} className="text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{landmark.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={10} /> {landmark.city || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {landmark.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{landmark.avg_rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Heart size={14} className={landmark.is_liked ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                          <span className="text-sm text-gray-700">{landmark.likes || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${landmark.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {landmark.verified ? <><Check size={12} /> Verified</> : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleLike(landmark)}
                            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${landmark.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            title={landmark.is_liked ? 'Unlike' : 'Like'}
                          >
                            <Heart size={16} className={landmark.is_liked ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={() => handleView(landmark)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openModal(landmark)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(landmark)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLandmarks.length === 0 && (
              <div className="p-12 text-center">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No landmarks found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingLandmark ? 'Edit Landmark' : 'Add New Landmark'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                  >
                    {priceRanges.map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    placeholder="9:00 AM - 6:00 PM"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { key: 'is_rain_friendly', label: 'Rain Friendly', icon: Umbrella },
                  { key: 'is_walking_distance', label: 'Walking Distance', icon: MapPin },
                  { key: 'is_pet_friendly', label: 'Pet Friendly', icon: Dog },
                  { key: 'is_child_friendly', label: 'Child Friendly', icon: Baby },
                  { key: 'is_above_18', label: '18+ Only', icon: Users },
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <Icon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingLandmark ? 'Update Landmark' : 'Create Landmark'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingLandmark && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Landmark Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {loadingDetails ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Image */}
                  {viewingLandmark.photos && viewingLandmark.photos.length > 0 ? (
                    <img
                      src={viewingLandmark.photos[0]}
                      alt={viewingLandmark.name}
                      className="w-full h-48 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <MapPin size={48} className="text-green-600" />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{viewingLandmark.name}</h3>
                      <p className="text-gray-500 flex items-center gap-1">
                        <MapPin size={14} /> {viewingLandmark.city || 'Unknown'}
                      </p>
                    </div>
                    {viewingLandmark.verified && (
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{viewingLandmark.avg_rating || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart size={16} className="text-red-500" />
                        <span className="font-bold text-gray-800">{viewingLandmark.likes || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-gray-800">{viewingLandmark.price_range || 'N/A'}</span>
                      <p className="text-xs text-gray-500">Price</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {viewingLandmark.category && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="text-gray-800 font-medium">{viewingLandmark.category}</p>
                      </div>
                    )}
                    {viewingLandmark.short_description && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Description</p>
                        <p className="text-gray-800">{viewingLandmark.short_description}</p>
                      </div>
                    )}
                    {viewingLandmark.recommendations && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Recommendations</p>
                        <p className="text-gray-800">{viewingLandmark.recommendations}</p>
                      </div>
                    )}
                    {viewingLandmark.opening_hours && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Opening Hours</p>
                        <p className="text-gray-800 flex items-center gap-1">
                          <Clock size={14} /> {viewingLandmark.opening_hours}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {viewingLandmark.is_rain_friendly && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Rain Friendly</span>}
                    {viewingLandmark.is_pet_friendly && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Pet Friendly</span>}
                    {viewingLandmark.is_child_friendly && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">Child Friendly</span>}
                    {viewingLandmark.is_above_18 && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">18+ Only</span>}
                    {viewingLandmark.is_walking_distance && <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">Walking Distance</span>}
                  </div>

                  {/* ID */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Landmark ID</p>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {viewingLandmark.id}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && landmarkToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Landmark</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete <span className="font-medium text-gray-700">{landmarkToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setLandmarkToDelete(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
