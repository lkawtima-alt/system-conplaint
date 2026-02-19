
import React from 'react';
import { Complaint, ComplaintStatus } from '../types';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate: (id: string, status: ComplaintStatus) => void;
  onViewDetails: (complaint: Complaint) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onStatusUpdate, onViewDetails }) => {
  const { id, caNumber, category, createdAt, status } = complaint;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-purple-700">{category}</p>
        <StatusBadge status={status} />
      </div>
      <p className="text-gray-800 font-bold mt-2">CA: {caNumber}</p>
      <p className="text-xs text-gray-500 mt-1">
        Received: {new Date(createdAt).toLocaleString('th-TH')}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => onViewDetails(complaint)}
          className="flex-1 text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors"
        >
          View Details
        </button>
        {status !== ComplaintStatus.Resolved && (
          <select
            onChange={(e) => onStatusUpdate(id, e.target.value as ComplaintStatus)}
            value={status}
            className="flex-1 text-sm bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value={status} disabled>Update Status</option>
            {Object.values(ComplaintStatus).map(s => (
                s !== status && <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
