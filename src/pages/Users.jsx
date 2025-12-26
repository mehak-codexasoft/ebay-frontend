import { Search, Plus, Eye, Edit2, Trash2, X, Users as UsersIcon, Mail, Calendar, Globe, ChevronLeft, ChevronRight, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import userService from '../services/userService';

const roleColors = {
  user: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Followers/Following modal
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  // Delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Follow/Unfollow state
  const [followingAction, setFollowingAction] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
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
      const response = await userService.getUsers(params);
      setUsers(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = async (user) => {
    setSelectedUser({ ...user });
    setIsViewModalOpen(true);
    try {
      const fullUser = await userService.getUserById(user.id);
      if (fullUser) {
        // Parse stats if it's a string
        let parsedStats = fullUser.stats;
        if (typeof fullUser.stats === 'string') {
          try {
            parsedStats = JSON.parse(fullUser.stats);
          } catch (e) {
            parsedStats = {};
          }
        }
        setSelectedUser({
          ...user,
          ...fullUser,
          stats: parsedStats,
          trips: typeof fullUser.trips === 'string' ? parseInt(fullUser.trips) || 0 : fullUser.trips
        });
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleEdit = async (user) => {
    try {
      const fullUser = await userService.getUserById(user.id);
      setEditingUser({ ...fullUser });
    } catch (err) {
      setEditingUser({ ...user });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await userService.updateUser(editingUser.id, editingUser);
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewFollowers = async (user) => {
    setLoadingFollowers(true);
    setFollowersModalOpen(true);
    try {
      const followers = await userService.getFollowers(user.id);
      setFollowersList(Array.isArray(followers) ? followers : followers.results || []);
    } catch (err) {
      console.error(err);
      setFollowersList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleViewFollowing = async (user) => {
    setLoadingFollowers(true);
    setFollowingModalOpen(true);
    try {
      const following = await userService.getFollowing(user.id);
      setFollowingList(Array.isArray(following) ? following : following.results || []);
    } catch (err) {
      console.error(err);
      setFollowingList([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollowUser = async (userId) => {
    setFollowingAction(true);
    try {
      await userService.followUser(userId);
      // Refresh user details
      if (selectedUser) {
        const fullUser = await userService.getUserById(selectedUser.id);
        setSelectedUser(prev => ({
          ...prev,
          ...fullUser,
          is_following: true,
          followers: (Number(prev?.followers) || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Error following user:', err);
    } finally {
      setFollowingAction(false);
    }
  };

  const handleUnfollowUser = async (userId) => {
    setFollowingAction(true);
    try {
      await userService.unfollowUser(userId);
      // Refresh user details
      if (selectedUser) {
        const fullUser = await userService.getUserById(selectedUser.id);
        setSelectedUser(prev => ({
          ...prev,
          ...fullUser,
          is_following: false,
          followers: Math.max((Number(prev?.followers) || 0) - 1, 0)
        }));
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
    } finally {
      setFollowingAction(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(/(?=[A-Z])/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    return matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage all users in the system. Total: {totalCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

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
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto text-green-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <>
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
                          {user.dp ? (
                            <img src={user.dp} alt={user.nickname} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                              {getInitials(user.nickname)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-700">{user.nickname || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">@{user.username || 'user'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Globe size={14} className="text-gray-400" />
                          {user.country || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm font-medium text-gray-700">{(user.followers || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm font-medium text-gray-700">{user?.trips || user?.stats?.trips || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role] || roleColors.user}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
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

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">
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
                {selectedUser?.dp ? (
                  <img src={selectedUser.dp} alt={selectedUser?.nickname || ''} className="w-20 h-20 rounded-full object-cover border-4 border-green-100" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-green-100">
                    {getInitials(selectedUser?.nickname)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedUser?.nickname || 'Unknown'}</h3>
                  <p className="text-gray-500">@{selectedUser?.username || 'user'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[selectedUser?.role] || roleColors.user}`}>
                      {selectedUser?.role || 'user'}
                    </span>
                    {selectedUser?.is_verified && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow/Unfollow Button */}
              <div className="mb-6">
                {selectedUser?.is_following ? (
                  <button
                    onClick={() => handleUnfollowUser(selectedUser.id)}
                    disabled={followingAction}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {followingAction ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <UserMinus size={18} />
                    )}
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollowUser(selectedUser.id)}
                    disabled={followingAction}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {followingAction ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <UserPlus size={18} />
                    )}
                    Follow
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => selectedUser && handleViewFollowers(selectedUser)}
                  className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-2xl font-bold text-gray-800">{Number(selectedUser?.followers) || 0}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </button>
                <button
                  onClick={() => selectedUser && handleViewFollowing(selectedUser)}
                  className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-2xl font-bold text-gray-800">{Number(selectedUser?.following) || 0}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </button>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-800">{Number(selectedUser?.trips) || 0}</p>
                  <p className="text-xs text-gray-500">Trips</p>
                </div>
              </div>

              {/* Bio Section */}
              {selectedUser?.bio && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Bio</p>
                  <p className="text-sm text-gray-600">{selectedUser.bio}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <span className="text-gray-700">{selectedUser?.email || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-xl">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Birthday</p>
                    <span className="text-gray-700">{selectedUser?.birthday || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-xl">
                  <Globe size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Country</p>
                    <span className="text-gray-700">{selectedUser?.country || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              {selectedUser?.subscription && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Subscription</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                      {selectedUser.subscription.plan || 'Premium'}
                    </span>
                    {selectedUser.subscription.expires_at && (
                      <span className="text-xs text-gray-500">
                        Expires: {new Date(selectedUser.subscription.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">User ID</p>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">{selectedUser?.id || 'N/A'}</p>
              </div>

              {/* Created/Updated timestamps */}
              {(selectedUser?.created_at || selectedUser?.date_joined) && (
                <div className="mt-4 text-xs text-gray-400 text-center">
                  Joined: {new Date(selectedUser?.date_joined || selectedUser?.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }}
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
                    value={editingUser.nickname || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, nickname: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={editingUser.birthday || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, birthday: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editingUser.country || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {followersModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Followers</h2>
              <button onClick={() => setFollowersModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {loadingFollowers ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                </div>
              ) : followersList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No followers yet</div>
              ) : (
                <div className="space-y-3">
                  {followersList.map((follower) => (
                    <div key={follower.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {follower.dp ? (
                        <img src={follower.dp} alt={follower.nickname} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                          {getInitials(follower.nickname)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{follower.nickname || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">@{follower.username || 'user'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {followingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Following</h2>
              <button onClick={() => setFollowingModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {loadingFollowers ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                </div>
              ) : followingList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Not following anyone yet</div>
              ) : (
                <div className="space-y-3">
                  {followingList.map((following) => (
                    <div key={following.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      {following.dp ? (
                        <img src={following.dp} alt={following.nickname} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                          {getInitials(following.nickname)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{following.nickname || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">@{following.username || 'user'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete User</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete <span className="font-medium text-gray-700">{userToDelete?.nickname || userToDelete?.username}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}
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
