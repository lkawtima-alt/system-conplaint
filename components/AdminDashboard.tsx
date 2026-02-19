
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { complaintService } from '../services/complaintService';
import ComplaintCard from './ComplaintCard';
import ComplaintDetailModal from './ComplaintDetailModal';

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusUpdate = async (id: string, status: ComplaintStatus) => {
    const originalComplaints = [...complaints];
    // Optimistic update
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    
    const updatedComplaint = await complaintService.updateComplaintStatus(id, status);
    if (!updatedComplaint) {
      // Revert if update fails
      setComplaints(originalComplaints);
      alert('Failed to update status.');
    }
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  }

  const renderColumn = (title: string, status: ComplaintStatus) => {
    const filteredComplaints = complaints.filter(c => c.status === status);
    return (
      <div className="bg-gray-100 rounded-lg p-4 w-full">
        <h3 className="font-bold text-lg text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">{title} ({filteredComplaints.length})</h3>
        <div className="space-y-4 h-[60vh] overflow-y-auto pr-2">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onStatusUpdate={handleStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-8">ไม่มีเรื่องร้องเรียน</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Admin Dashboard</h2>
            <button 
                onClick={fetchComplaints} 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10.899 7.482A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.899 9.482z" clipRule="evenodd" />
                </svg>
                <span>Refresh</span>
            </button>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderColumn('รับเรื่องแล้ว (Pending)', ComplaintStatus.Pending)}
        {renderColumn('กำลังดำเนินการ (In Progress)', ComplaintStatus.InProgress)}
        {renderColumn('แก้ไขเรียบร้อยแล้ว (Resolved)', ComplaintStatus.Resolved)}
      </div>
      {selectedComplaint && <ComplaintDetailModal isOpen={isModalOpen} onClose={closeModal} complaint={selectedComplaint} />}
    </div>
  );
};

export default AdminDashboard;
