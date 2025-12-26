import { User, Bell, Shield, Palette, Save, Eye, EyeOff, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import userService from '../services/userService';
import authService from '../services/authService';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profileData, setProfileData] = useState({
    nickname: '',
    username: '',
    email: '',
    birthday: '',
    country: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Delete account modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      setProfileData({
        nickname: user.nickname || '',
        username: user.username || '',
        email: user.email || '',
        birthday: user.birthday || '',
        country: user.country || '',
      });
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setProfileMessage({ type: '', text: '' });
    try {
      await userService.updateUser(currentUser.id, {
        ...profileData,
        role: currentUser.role,
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      fetchCurrentUser();
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setSavingPassword(true);
    try {
      await userService.changePassword(passwordData);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.detail || err.response?.data?.current_password?.[0] || 'Failed to change password' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleting(true);
    try {
      await userService.deleteAccount();
      await authService.logout();
      window.location.href = '/';
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Failed to delete account' });
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(/(?=[A-Z])/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${activeTab === tab.id ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h2>

              {profileMessage.text && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${profileMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {profileMessage.text}
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                {currentUser?.dp ? (
                  <img src={currentUser.dp} alt={currentUser.nickname} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(currentUser?.nickname)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">{currentUser?.nickname}</p>
                  <p className="text-sm text-gray-500">@{currentUser?.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                    <input
                      type="text"
                      value={profileData.nickname}
                      onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                    <input
                      type="date"
                      value={profileData.birthday}
                      onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleProfileSave}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {['Email Notifications', 'Push Notifications', 'Order Updates', 'Marketing Emails'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-700">{item}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>

                {passwordMessage.text && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        placeholder="Enter new password (min 8 characters)"
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handlePasswordChange}
                    disabled={savingPassword || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Shield size={18} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Danger Zone - Delete Account */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
                <p className="text-gray-500 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Appearance</h2>
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button key={theme} className={`p-4 border-2 rounded-xl text-center transition-colors ${theme === 'Light' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="font-medium text-gray-700">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Account</h3>
              <p className="text-gray-500 text-center mb-4">
                This action is <span className="font-semibold text-red-600">permanent</span> and cannot be undone. All your data will be lost.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setDeleteConfirmText(''); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
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
