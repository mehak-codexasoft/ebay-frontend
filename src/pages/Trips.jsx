import { Search, Plus, Eye, Edit2, Trash2, X, Map, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const tripsData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'SC',
    landmarks: [
      { id: '1', visit_order: 1, visited: true, skipped: false, landmark: 'Eiffel Tower' },
      { id: '2', visit_order: 2, visited: true, skipped: false, landmark: 'Louvre Museum' },
      { id: '3', visit_order: 3, visited: false, skipped: false, landmark: 'Notre Dame' },
    ],
    title: 'Paris Adventure',
    city_photo: null,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T18:45:00Z',
    city: 'Paris'
  },
  {
    id: '4fb96f75-6828-5673-c4fd-3d074f77bfb7',
    status: 'IP',
    landmarks: [
      { id: '4', visit_order: 1, visited: true, skipped: false, landmark: 'Times Square' },
      { id: '5', visit_order: 2, visited: false, skipped: false, landmark: 'Central Park' },
      { id: '6', visit_order: 3, visited: false, skipped: true, landmark: 'Empire State' },
    ],
    title: 'NYC Explorer',
    city_photo: null,
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T16:30:00Z',
    city: 'New York'
  },
  {
    id: '5gc07g86-7939-6784-d5ge-4e185g88cgc8',
    status: 'PL',
    landmarks: [
      { id: '7', visit_order: 1, visited: false, skipped: false, landmark: 'Colosseum' },
      { id: '8', visit_order: 2, visited: false, skipped: false, landmark: 'Vatican City' },
    ],
    title: 'Rome History Tour',
    city_photo: null,
    created_at: '2024-01-13T14:00:00Z',
    updated_at: '2024-01-13T14:00:00Z',
    city: 'Rome'
  },
  {
    id: '6hd18h97-8040-7895-e6hf-5f296h99dhd9',
    status: 'SC',
    landmarks: [
      { id: '9', visit_order: 1, visited: true, skipped: false, landmark: 'Tower of London' },
      { id: '10', visit_order: 2, visited: true, skipped: false, landmark: 'Big Ben' },
      { id: '11', visit_order: 3, visited: true, skipped: false, landmark: 'London Eye' },
      { id: '12', visit_order: 4, visited: true, skipped: false, landmark: 'Buckingham Palace' },
    ],
    title: 'London Highlights',
    city_photo: null,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T20:00:00Z',
    city: 'London'
  },
  {
    id: '7ie29i08-9151-8906-f7ig-6g307i00eie0',
    status: 'CN',
    landmarks: [
      { id: '13', visit_order: 1, visited: false, skipped: true, landmark: 'Tokyo Tower' },
      { id: '14', visit_order: 2, visited: false, skipped: true, landmark: 'Senso-ji Temple' },
    ],
    title: 'Tokyo Trip',
    city_photo: null,
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-06T09:00:00Z',
    city: 'Tokyo'
  },
];

const statusConfig = {
  SC: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  IP: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  PL: { label: 'Planned', color: 'bg-yellow-100 text-yellow-700', icon: Calendar },
  CN: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function Trips() {
  const [trips, setTrips] = useState(tripsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (trip) => {
    setSelectedTrip(trip);
    setIsViewModalOpen(true);
  };

  const handleEdit = (trip) => {
    setEditingTrip({ ...trip, landmarks: [...trip.landmarks] });
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTrip({
      id: crypto.randomUUID(),
      status: 'PL',
      landmarks: [],
      title: '',
      city_photo: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      city: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (isAddModalOpen) {
      setTrips([...trips, { ...editingTrip, created_at: now, updated_at: now }]);
      setIsAddModalOpen(false);
    } else {
      setTrips(trips.map(t => t.id === editingTrip.id ? { ...editingTrip, updated_at: now } : t));
      setIsEditModalOpen(false);
    }
    setEditingTrip(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(t => t.id !== id));
    }
  };

  const addLandmark = () => {
    setEditingTrip({
      ...editingTrip,
      landmarks: [
        ...editingTrip.landmarks,
        {
          id: crypto.randomUUID(),
          visit_order: editingTrip.landmarks.length + 1,
          visited: false,
          skipped: false,
          landmark: ''
        }
      ]
    });
  };

  const removeLandmark = (index) => {
    const newLandmarks = editingTrip.landmarks.filter((_, i) => i !== index);
    setEditingTrip({
      ...editingTrip,
      landmarks: newLandmarks.map((l, i) => ({ ...l, visit_order: i + 1 }))
    });
  };

  const updateLandmark = (index, field, value) => {
    const newLandmarks = [...editingTrip.landmarks];
    newLandmarks[index] = { ...newLandmarks[index], [field]: value };
    setEditingTrip({ ...editingTrip, landmarks: newLandmarks });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgress = (landmarks) => {
    if (landmarks.length === 0) return 0;
    const visited = landmarks.filter(l => l.visited).length;
    return Math.round((visited / landmarks.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Trips</h1>
          <p className="text-gray-500 mt-1">Manage all trips in the system.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Trip
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm flex-1 max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-600 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Status</option>
          <option value="SC">Completed</option>
          <option value="IP">In Progress</option>
          <option value="PL">Planned</option>
          <option value="CN">Cancelled</option>
        </select>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredTrips.map((trip) => {
          const StatusIcon = statusConfig[trip.status]?.icon || Clock;
          const progress = getProgress(trip.landmarks);
          return (
            <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
                <Map size={48} className="text-white/80" />
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[trip.status]?.color}`}>
                  <StatusIcon size={12} />
                  {statusConfig[trip.status]?.label}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{trip.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin size={14} />
                  {trip.city}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{trip.landmarks.length} landmarks</span>
                    <span>{progress}% completed</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">{formatDate(trip.created_at)}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(trip)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(trip)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Map size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No trips found</p>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Trip Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedTrip.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {selectedTrip.city}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selectedTrip.status]?.color}`}>
                  {statusConfig[selectedTrip.status]?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(selectedTrip.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Updated</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(selectedTrip.updated_at)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Landmarks ({selectedTrip.landmarks.length})</h4>
                <div className="space-y-2">
                  {selectedTrip.landmarks.map((landmark, index) => (
                    <div key={landmark.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium">
                        {landmark.visit_order}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">{landmark.landmark}</span>
                      {landmark.visited && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Visited</span>
                      )}
                      {landmark.skipped && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Skipped</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Trip ID</p>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">{selectedTrip.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isEditModalOpen || isAddModalOpen) && editingTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {isAddModalOpen ? 'Add New Trip' : 'Edit Trip'}
              </h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); setEditingTrip(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingTrip.title}
                  onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                  placeholder="Trip title"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingTrip.city}
                    onChange={(e) => setEditingTrip({ ...editingTrip, city: e.target.value })}
                    placeholder="City name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTrip.status}
                    onChange={(e) => setEditingTrip({ ...editingTrip, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="PL">Planned</option>
                    <option value="IP">In Progress</option>
                    <option value="SC">Completed</option>
                    <option value="CN">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Landmarks</label>
                  <button
                    type="button"
                    onClick={addLandmark}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Landmark
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editingTrip.landmarks.map((landmark, index) => (
                    <div key={landmark.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium">
                        {landmark.visit_order}
                      </span>
                      <input
                        type="text"
                        value={landmark.landmark}
                        onChange={(e) => updateLandmark(index, 'landmark', e.target.value)}
                        placeholder="Landmark name"
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={landmark.visited}
                          onChange={(e) => updateLandmark(index, 'visited', e.target.checked)}
                          className="w-3 h-3 text-green-600 border-gray-300 rounded"
                        />
                        Visited
                      </label>
                      <button
                        type="button"
                        onClick={() => removeLandmark(index)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {editingTrip.landmarks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No landmarks added yet</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); setEditingTrip(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  {isAddModalOpen ? 'Add Trip' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
