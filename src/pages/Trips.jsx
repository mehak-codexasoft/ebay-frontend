import { Search, Edit2, Trash2, Eye, X, MapPin, Calendar, ChevronLeft, ChevronRight, Loader2, Map, User, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { useState, useEffect } from 'react';
import tripService from '../services/tripService';

// Trip status options
const STATUS_OPTIONS = [
  { value: 'SC', label: 'Scheduled' },
  { value: 'IP', label: 'In Progress' },
  { value: 'CO', label: 'Completed' },
  { value: 'CA', label: 'Cancelled' },
];

const getStatusLabel = (status) => {
  const found = STATUS_OPTIONS.find(s => s.value === status);
  return found ? found.label : status || 'Unknown';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'SC': return 'bg-blue-100 text-blue-700';
    case 'IP': return 'bg-yellow-100 text-yellow-700';
    case 'CO': return 'bg-green-100 text-green-700';
    case 'CA': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [viewingTrip, setViewingTrip] = useState(null);
  const [tripLandmarks, setTripLandmarks] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Landmark delete modal
  const [isLandmarkDeleteModalOpen, setIsLandmarkDeleteModalOpen] = useState(false);
  const [landmarkToDelete, setLandmarkToDelete] = useState(null);
  const [deletingLandmark, setDeletingLandmark] = useState(false);

  // Form data - matching API schema
  const [formData, setFormData] = useState({
    title: '',
    status: 'SC',
    landmarks: [], // [{visit_order, visited, skipped, landmark}]
  });

  // Fetch trips
  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;

      const response = await tripService.getTrips(params);
      setTrips(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTrips();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = async (trip) => {
    if (!trip) return;

    setViewingTrip(trip);
    setTripLandmarks([]);
    setShowViewModal(true);
    setLoadingDetails(true);

    try {
      const [fullTrip, landmarks] = await Promise.all([
        tripService.getTripById(trip.id),
        tripService.getTripLandmarks(trip.id).catch(() => [])
      ]);

      if (fullTrip && fullTrip.id) {
        setViewingTrip(fullTrip);
      }
      setTripLandmarks(Array.isArray(landmarks) ? landmarks : landmarks?.results || []);
    } catch (err) {
      console.error('Error fetching trip details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingTrip(null);
    setTripLandmarks([]);
    setLoadingDetails(false);
  };

  const openModal = async (trip = null) => {
    if (trip) {
      setEditingTrip(trip);
      setLoadingDetails(true);
      try {
        const [fullTrip, landmarksData] = await Promise.all([
          tripService.getTripById(trip.id),
          tripService.getTripLandmarks(trip.id).catch(() => [])
        ]);
        const landmarks = Array.isArray(landmarksData) ? landmarksData : landmarksData?.results || fullTrip?.landmarks || [];
        setFormData({
          title: fullTrip.title || fullTrip.name || '',
          status: fullTrip.status || 'SC',
          landmarks: landmarks.map(l => ({
            id: l.id,
            visit_order: l.visit_order || 0,
            visited: l.visited || false,
            skipped: l.skipped || false,
            landmark: l.landmark || l.landmark_id,
            landmark_name: l.landmark?.name || l.name || 'Unknown'
          })),
        });
      } catch (err) {
        console.error('Error loading trip:', err);
        setFormData({
          title: trip.title || trip.name || '',
          status: trip.status || 'SC',
          landmarks: (trip.landmarks || []).map(l => ({
            id: l.id,
            visit_order: l.visit_order || 0,
            visited: l.visited || false,
            skipped: l.skipped || false,
            landmark: l.landmark || l.landmark_id,
            landmark_name: l.landmark?.name || l.name || 'Unknown'
          })),
        });
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setEditingTrip(null);
      setFormData({
        title: '',
        status: 'SC',
        landmarks: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrip(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Format landmarks for API - only send required fields
      const formattedLandmarks = formData.landmarks.map(l => ({
        id: l.id,
        visit_order: l.visit_order || 0,
        visited: l.visited || false,
        skipped: l.skipped || false,
        landmark: typeof l.landmark === 'object' ? l.landmark.id : l.landmark,
      }));

      const submitData = {
        title: formData.title,
        status: formData.status,
        landmarks: formattedLandmarks,
      };

      if (editingTrip) {
        await tripService.patchTrip(editingTrip.id, submitData);
      }
      closeModal();
      fetchTrips();
    } catch (err) {
      console.error('Save error:', err.response?.status, err.response?.data);

      if (err.response?.status === 500) {
        closeModal();
        fetchTrips();
        return;
      }

      const errorMsg = err.response?.data?.detail
        || err.response?.data?.message
        || (typeof err.response?.data === 'string' ? err.response?.data : null)
        || JSON.stringify(err.response?.data)
        || 'Failed to save trip';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    setDeleting(true);
    try {
      await tripService.deleteTrip(tripToDelete.id);
      setIsDeleteModalOpen(false);
      setTripToDelete(null);
      fetchTrips();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  // Delete Trip Landmark
  const handleLandmarkDeleteClick = (landmark) => {
    setLandmarkToDelete(landmark);
    setIsLandmarkDeleteModalOpen(true);
  };

  const handleLandmarkDeleteConfirm = async () => {
    if (!landmarkToDelete) return;
    setDeletingLandmark(true);
    try {
      await tripService.deleteTripLandmark(landmarkToDelete.id);
      setIsLandmarkDeleteModalOpen(false);
      setLandmarkToDelete(null);
      // Refresh trip landmarks
      if (viewingTrip) {
        const landmarks = await tripService.getTripLandmarks(viewingTrip.id).catch(() => []);
        setTripLandmarks(Array.isArray(landmarks) ? landmarks : landmarks?.results || []);
      }
    } catch (err) {
      console.error('Delete landmark error:', err);
      setError('Failed to delete trip landmark');
    } finally {
      setDeletingLandmark(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTrips = trips;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trips</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all trips</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-green-500 animate-spin" />
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Map size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No trips found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trip</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Landmarks</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTrips.map((trip) => (
                    <tr key={trip?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {trip?.city_photo ? (
                            <img src={trip.city_photo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <Map size={20} className="text-blue-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{trip?.title || trip?.name || 'Unnamed Trip'}</p>
                            <p className="text-xs text-gray-500">
                              {typeof trip?.user === 'object' ? trip?.user?.username : (trip?.user || 'Unknown')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(trip?.status)}`}>
                          {getStatusLabel(trip?.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {trip?.landmarks_count || trip?.landmarks?.length || 0} landmarks
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDate(trip?.created_at)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(trip)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openModal(trip)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(trip)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} trips
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Edit Trip</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            {loadingDetails ? (
              <div className="p-6 text-center py-12">
                <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                <p className="text-gray-500 mt-2">Loading trip details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Landmarks Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmarks ({formData.landmarks.length})
                  </label>
                  {formData.landmarks.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <MapPin size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No landmarks in this trip</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {formData.landmarks.map((landmark, index) => (
                        <div key={landmark.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-medium text-sm">
                            {landmark.visit_order || index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm truncate">
                              {landmark.landmark_name || 'Unknown Landmark'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Visit Order */}
                            <input
                              type="number"
                              value={landmark.visit_order}
                              onChange={(e) => {
                                const newLandmarks = [...formData.landmarks];
                                newLandmarks[index].visit_order = parseInt(e.target.value) || 0;
                                setFormData({ ...formData, landmarks: newLandmarks });
                              }}
                              className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center"
                              min="0"
                              title="Visit Order"
                            />
                            {/* Visited Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const newLandmarks = [...formData.landmarks];
                                newLandmarks[index].visited = !newLandmarks[index].visited;
                                setFormData({ ...formData, landmarks: newLandmarks });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                landmark.visited
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title={landmark.visited ? 'Visited' : 'Not Visited'}
                            >
                              <CheckCircle size={18} />
                            </button>
                            {/* Skipped Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const newLandmarks = [...formData.landmarks];
                                newLandmarks[index].skipped = !newLandmarks[index].skipped;
                                setFormData({ ...formData, landmarks: newLandmarks });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                landmark.skipped
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title={landmark.skipped ? 'Skipped' : 'Not Skipped'}
                            >
                              <SkipForward size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Visited</span>
                    <span className="flex items-center gap-1"><SkipForward size={14} className="text-orange-500" /> Skipped</span>
                  </div>
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
                    {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Update Trip'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingTrip && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Trip Details</h2>
              <button onClick={closeViewModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                  <div className="flex items-center gap-4">
                    {viewingTrip?.city_photo ? (
                      <img src={viewingTrip.city_photo} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Map size={32} className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{viewingTrip?.title || viewingTrip?.name || 'Unnamed Trip'}</h3>
                      <p className="text-gray-500 flex items-center gap-1">
                        <User size={14} />
                        {typeof viewingTrip?.user === 'object' ? viewingTrip?.user?.username : (viewingTrip?.user || 'Unknown')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(viewingTrip?.status)}`}>
                        {getStatusLabel(viewingTrip?.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Status</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={16} className="text-blue-500" />
                        <span className="font-bold text-gray-800">{formatDate(viewingTrip?.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-500">Created</p>
                    </div>
                  </div>

                  {/* Trip Landmarks */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Landmarks ({tripLandmarks.length})</h4>
                    {tripLandmarks.length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 rounded-xl">
                        <MapPin size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No landmarks added</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tripLandmarks.map((landmark) => {
                          const landmarkPhoto = landmark?.landmark?.photos?.[0] || landmark?.landmark?.photo || landmark?.photos?.[0] || landmark?.photo;
                          return (
                          <div key={landmark?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-medium text-sm overflow-hidden">
                                {landmarkPhoto ? (
                                  <img
                                    src={landmarkPhoto}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  landmark?.visit_order || '-'
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {landmark?.landmark?.name || landmark?.name || 'Unknown'}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500">Order: {landmark?.visit_order || 0}</span>
                                  {landmark?.visited && (
                                    <span className="flex items-center gap-0.5 text-xs text-green-600">
                                      <CheckCircle size={12} /> Visited
                                    </span>
                                  )}
                                  {landmark?.skipped && (
                                    <span className="flex items-center gap-0.5 text-xs text-orange-600">
                                      <SkipForward size={12} /> Skipped
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleLandmarkDeleteClick(landmark)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from trip"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ID */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Trip ID</p>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {viewingTrip?.id || 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Trip Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Trip</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete <span className="font-medium text-gray-700">{tripToDelete?.name || tripToDelete?.title || 'this trip'}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setTripToDelete(null); }}
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
                  {deleting ? <><Loader2 size={18} className="animate-spin" /> Deleting...</> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Landmark Modal */}
      {isLandmarkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Remove Landmark</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to remove <span className="font-medium text-gray-700">{landmarkToDelete?.landmark?.name || landmarkToDelete?.name || 'this landmark'}</span> from the trip?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsLandmarkDeleteModalOpen(false); setLandmarkToDelete(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={deletingLandmark}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLandmarkDeleteConfirm}
                  disabled={deletingLandmark}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingLandmark ? <><Loader2 size={18} className="animate-spin" /> Removing...</> : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
