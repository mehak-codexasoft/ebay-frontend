import { Search, MessageSquare, Mail, User, Calendar, Eye, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const contactData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'App Issue', message: 'I am having trouble with the login feature. It keeps showing an error message.', date: '2024-01-15', status: 'New' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Feature Request', message: 'Would love to see a dark mode option in the app.', date: '2024-01-14', status: 'Read' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subject: 'Payment Problem', message: 'My payment was declined but money was deducted from my account.', date: '2024-01-14', status: 'New' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', subject: 'General Inquiry', message: 'How can I upgrade my subscription plan?', date: '2024-01-13', status: 'Replied' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', subject: 'Bug Report', message: 'The map is not loading properly on Android devices.', date: '2024-01-12', status: 'Read' },
];

const statusColors = {
  New: 'bg-blue-100 text-blue-700',
  Read: 'bg-gray-100 text-gray-700',
  Replied: 'bg-green-100 text-green-700',
};

export default function Contact() {
  const [submissions, setSubmissions] = useState(contactData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const filteredSubmissions = submissions.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setSubmissions(submissions.map(s =>
      s.id === submission.id && s.status === 'New' ? { ...s, status: 'Read' } : s
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      setSubmissions(submissions.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const newCount = submissions.filter(s => s.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Contact Submissions</h1>
        <p className="text-gray-500 mt-1">
          View and manage contact form submissions.
          {newCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Subject</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${submission.status === 'New' ? 'bg-blue-50/30' : ''}`}
                    onClick={() => handleView(submission)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm">
                          {submission.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`text-sm ${submission.status === 'New' ? 'font-semibold' : 'font-medium'} text-gray-700`}>
                            {submission.name}
                          </p>
                          <p className="text-xs text-gray-500">{submission.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className={`text-sm ${submission.status === 'New' ? 'font-semibold' : ''} text-gray-700 truncate max-w-[200px]`}>
                        {submission.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleView(submission); }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(submission.id); }}
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

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No submissions found</p>
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-fit">
          {selectedSubmission ? (
            <div>
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Message Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium">
                    {selectedSubmission.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedSubmission.name}</p>
                    <p className="text-sm text-gray-500">{selectedSubmission.email}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">{selectedSubmission.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">{selectedSubmission.date}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Subject</p>
                  <p className="text-gray-800">{selectedSubmission.subject}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedSubmission.message}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm">
                    Reply
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
