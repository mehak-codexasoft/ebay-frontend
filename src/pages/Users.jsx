import { Search, Plus, Eye, Edit2, Trash2, X, Users as UsersIcon, Mail, Calendar, Globe } from 'lucide-react';
import { useState } from 'react';

const usersData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nickname: 'JohnTraveler',
    email: 'john@example.com',
    username: 'johndoe',
    birthday: '1990-05-15',
    country: 'United States',
    role: 'user',
    following: 45,
    followers: 120,
    is_following: false,
    posts: 25,
    stats: { trips: 12, landmarks: 56 },
    trips: 12,
    dp: null
  },
  {
    id: '4fb96f75-6828-5673-c4fd-3d074f77bfb7',
    nickname: 'SarahExplorer',
    email: 'sarah@example.com',
    username: 'sarahwilson',
    birthday: '1995-08-22',
    country: 'United Kingdom',
    role: 'user',
    following: 78,
    followers: 234,
    is_following: true,
    posts: 42,
    stats: { trips: 8, landmarks: 34 },
    trips: 8,
    dp: null
  },
  {
    id: '5gc07g86-7939-6784-d5ge-4e185g88cgc8',
    nickname: 'MikeAdmin',
    email: 'mike@beway.com',
    username: 'mikeadmin',
    birthday: '1988-03-10',
    country: 'Germany',
    role: 'admin',
    following: 12,
    followers: 567,
    is_following: false,
    posts: 89,
    stats: { trips: 25, landmarks: 150 },
    trips: 25,
    dp: null
  },
  {
    id: '6hd18h97-8040-7895-e6hf-5f296h99dhd9',
    nickname: 'EmmaWanderer',
    email: 'emma@example.com',
    username: 'emmaj',
    birthday: '1992-11-30',
    country: 'France',
    role: 'user',
    following: 156,
    followers: 89,
    is_following: true,
    posts: 15,
    stats: { trips: 5, landmarks: 28 },
    trips: 5,
    dp: null
  },
  {
    id: '7ie29i08-9151-8906-f7ig-6g307i00eie0',
    nickname: 'DavidNomad',
    email: 'david@example.com',
    username: 'davidb',
    birthday: '1985-07-08',
    country: 'Australia',
    role: 'user',
    following: 200,
    followers: 450,
    is_following: false,
    posts: 67,
    stats: { trips: 30, landmarks: 200 },
    trips: 30,
    dp: null
  },
];

const roleColors = {
  user: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function Users() {
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser({
      id: crypto.randomUUID(),
      nickname: '',
      email: '',
      username: '',
      birthday: '',
      country: '',
      role: 'user',
      following: 0,
      followers: 0,
      is_following: false,
      posts: 0,
      stats: { trips: 0, landmarks: 0 },
      trips: 0,
      dp: null
    });
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    if (isAddModalOpen) {
      setUsers([...users, editingUser]);
      setIsAddModalOpen(false);
    } else {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setIsEditModalOpen(false);
    }
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getInitials = (name) => {
    return name.split(/(?=[A-Z])/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage all users in the system.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm flex-1 max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-600 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Roles</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Country</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Followers</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Trips</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(user.nickname)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{user.nickname}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Globe size={14} className="text-gray-400" />
                      {user.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-gray-700">{user.followers.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-gray-700">{user.trips}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(selectedUser.nickname)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedUser.nickname}</h3>
                  <p className="text-gray-500">@{selectedUser.username}</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize mt-1 ${roleColors[selectedUser.role]}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{selectedUser.followers}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{selectedUser.following}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{selectedUser.trips}</p>
                  <p className="text-xs text-gray-500">Trips</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedUser.birthday}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedUser.country}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">User ID</p>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">{selectedUser.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isEditModalOpen || isAddModalOpen) && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {isAddModalOpen ? 'Add New User' : 'Edit User'}
              </h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); setEditingUser(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={editingUser.nickname}
                    onChange={(e) => setEditingUser({ ...editingUser, nickname: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={editingUser.birthday}
                    onChange={(e) => setEditingUser({ ...editingUser, birthday: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editingUser.country}
                    onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); setEditingUser(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  {isAddModalOpen ? 'Add User' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
