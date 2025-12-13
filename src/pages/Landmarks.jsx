import { Search, Plus, Edit, Trash2, Eye, X, MapPin, Star, Heart, Check, Clock, DollarSign, Baby, Dog, Umbrella, Users } from 'lucide-react';
import { useState } from 'react';

const landmarksData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Central Park',
    city: 'New York',
    city_id: 'city-001',
    user: 'admin',
    user_id: 'user-001',
    likes: 1234,
    is_liked: false,
    user_rating: '4.5',
    avg_rating: 4.8,
    verified: true,
    created_at: '2025-01-15T10:00:00.000Z',
    updated_at: '2025-01-15T10:00:00.000Z',
    short_description: 'A beautiful urban park in Manhattan',
    recommendations: 'Visit during spring for best experience',
    category: 'PARK',
    is_rain_friendly: false,
    opening_hours: '6:00 AM - 10:00 PM',
    is_walking_distance: true,
    is_pet_friendly: true,
    is_above_18: false,
    is_child_friendly: true,
    price_range: '$',
    location: { type: 'Point', coordinates: [40.7829, -73.9654] }
  },
  {
    id: '4fb85f64-5717-4562-b3fc-2c963f66afa7',
    name: 'Eiffel Tower',
    city: 'Paris',
    city_id: 'city-002',
    user: 'admin',
    user_id: 'user-001',
    likes: 5621,
    is_liked: true,
    user_rating: '5.0',
    avg_rating: 4.9,
    verified: true,
    created_at: '2025-01-10T10:00:00.000Z',
    updated_at: '2025-01-12T10:00:00.000Z',
    short_description: 'Iconic iron lattice tower on the Champ de Mars',
    recommendations: 'Book tickets in advance to avoid long queues',
    category: 'MONUMENT',
    is_rain_friendly: false,
    opening_hours: '9:00 AM - 12:00 AM',
    is_walking_distance: false,
    is_pet_friendly: false,
    is_above_18: false,
    is_child_friendly: true,
    price_range: '$$$',
    location: { type: 'Point', coordinates: [48.8584, 2.2945] }
  },
  {
    id: '5fc85f64-5717-4562-b3fc-2c963f66afa8',
    name: 'Tokyo Skytree',
    city: 'Tokyo',
    city_id: 'city-003',
    user: 'editor',
    user_id: 'user-002',
    likes: 3421,
    is_liked: false,
    user_rating: '4.0',
    avg_rating: 4.6,
    verified: false,
    created_at: '2025-01-08T10:00:00.000Z',
    updated_at: '2025-01-08T10:00:00.000Z',
    short_description: 'Broadcasting and observation tower',
    recommendations: 'Visit at sunset for amazing views',
    category: 'ATTRACTION',
    is_rain_friendly: true,
    opening_hours: '10:00 AM - 9:00 PM',
    is_walking_distance: true,
    is_pet_friendly: false,
    is_above_18: false,
    is_child_friendly: true,
    price_range: '$$',
    location: { type: 'Point', coordinates: [35.7101, 139.8107] }
  },
  {
    id: '6fd85f64-5717-4562-b3fc-2c963f66afa9',
    name: 'Nightclub XYZ',
    city: 'London',
    city_id: 'city-004',
    user: 'admin',
    user_id: 'user-001',
    likes: 892,
    is_liked: false,
    user_rating: '3.5',
    avg_rating: 4.2,
    verified: true,
    created_at: '2025-01-05T10:00:00.000Z',
    updated_at: '2025-01-06T10:00:00.000Z',
    short_description: 'Popular nightclub with great music',
    recommendations: 'Best on weekends',
    category: 'NIGHTLIFE',
    is_rain_friendly: true,
    opening_hours: '10:00 PM - 4:00 AM',
    is_walking_distance: true,
    is_pet_friendly: false,
    is_above_18: true,
    is_child_friendly: false,
    price_range: '$$$',
    location: { type: 'Point', coordinates: [51.5074, -0.1278] }
  },
];

const categories = ['PARK', 'MONUMENT', 'ATTRACTION', 'NIGHTLIFE', 'RESTAURANT', 'MUSEUM', 'BEACH', 'SHOPPING'];
const priceRanges = ['$', '$$', '$$$', '$$$$'];

export default function Landmarks() {
  const [landmarks, setLandmarks] = useState(landmarksData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState(null);
  const [viewingLandmark, setViewingLandmark] = useState(null);
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
    verified: false,
  });

  const filteredLandmarks = landmarks.filter((landmark) =>
    landmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landmark.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landmark.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (landmark = null) => {
    if (landmark) {
      setEditingLandmark(landmark);
      setFormData({
        name: landmark.name,
        city: landmark.city,
        short_description: landmark.short_description,
        recommendations: landmark.recommendations,
        category: landmark.category,
        opening_hours: landmark.opening_hours,
        price_range: landmark.price_range,
        is_rain_friendly: landmark.is_rain_friendly,
        is_walking_distance: landmark.is_walking_distance,
        is_pet_friendly: landmark.is_pet_friendly,
        is_above_18: landmark.is_above_18,
        is_child_friendly: landmark.is_child_friendly,
        verified: landmark.verified,
      });
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
        verified: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLandmark(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLandmark) {
      setLandmarks(landmarks.map(l =>
        l.id === editingLandmark.id ? { ...l, ...formData, updated_at: new Date().toISOString() } : l
      ));
    } else {
      const newLandmark = {
        id: crypto.randomUUID(),
        ...formData,
        user: 'admin',
        user_id: 'user-001',
        city_id: crypto.randomUUID(),
        likes: 0,
        is_liked: false,
        user_rating: '0',
        avg_rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: { type: 'Point', coordinates: [0, 0] }
      };
      setLandmarks([newLandmark, ...landmarks]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this landmark?')) {
      setLandmarks(landmarks.filter(l => l.id !== id));
    }
  };

  const handleView = (landmark) => {
    setViewingLandmark(landmark);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Landmarks</h1>
          <p className="text-gray-500 mt-1">Manage all landmarks in the system.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/30"
        >
          <Plus size={20} />
          <span>Add Landmark</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none shadow-sm">
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Landmark</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Rating</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLandmarks.map((landmark) => (
                <tr key={landmark.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <MapPin size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{landmark.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} /> {landmark.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                      {landmark.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{landmark.avg_rating}</span>
                      <span className="text-xs text-gray-400">({landmark.likes})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-gray-700">{landmark.price_range}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${landmark.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {landmark.verified ? <><Check size={12} /> Verified</> : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(landmark)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal(landmark)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(landmark.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {filteredLandmarks.length} landmarks</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Previous</button>
            <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Next</button>
          </div>
        </div>
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
                  { key: 'verified', label: 'Verified', icon: Check },
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
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  {editingLandmark ? 'Update Landmark' : 'Create Landmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingLandmark && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Landmark Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <MapPin size={28} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{viewingLandmark.name}</h3>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> {viewingLandmark.city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-800">{viewingLandmark.avg_rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart size={16} className="text-red-500" />
                    <span className="font-bold text-gray-800">{viewingLandmark.likes}</span>
                  </div>
                  <p className="text-xs text-gray-500">Likes</p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-gray-800">{viewingLandmark.price_range}</span>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-800">{viewingLandmark.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-800">{viewingLandmark.short_description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recommendations</p>
                  <p className="text-gray-800">{viewingLandmark.recommendations}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Opening Hours</p>
                  <p className="text-gray-800 flex items-center gap-1"><Clock size={14} /> {viewingLandmark.opening_hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {viewingLandmark.verified && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✓ Verified</span>}
                {viewingLandmark.is_rain_friendly && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">☔ Rain Friendly</span>}
                {viewingLandmark.is_pet_friendly && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">🐕 Pet Friendly</span>}
                {viewingLandmark.is_child_friendly && <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">👶 Child Friendly</span>}
                {viewingLandmark.is_above_18 && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">🔞 18+ Only</span>}
                {viewingLandmark.is_walking_distance && <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">🚶 Walking Distance</span>}
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
