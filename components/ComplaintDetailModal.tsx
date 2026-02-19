
import React, { useState } from 'react';
import { Complaint } from '../types';
import { geminiService } from '../services/geminiService';

interface ComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ isOpen, onClose, complaint }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoadingAi(true);
    setAiSummary(null);
    const summary = await geminiService.generateSummary(complaint);
    setAiSummary(summary);
    setIsLoadingAi(false);
  };
  
  const formatSummary = (text: string) => {
    // A simple markdown to HTML converter for bold and unordered lists
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/^\s*-\s(.*)/gm, '<li>$1</li>') // List items
      .replace(/(\<li\>.*\<\/li\>)/gs, '<ul>$1</ul>') // Wrap lists in <ul>
      .replace(/\n/g, '<br />') // Newlines
      .replace(/<br \/><ul>/g, '<ul>') // Fix extra space before lists
      .replace(/<\/ul><br \/>/g, '</ul>');
    return { __html: html };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-purple-800">Complaint Details: {complaint.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Complaint Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Customer Information</h3>
              <p className="text-gray-600"><strong>Name:</strong> {complaint.fullName}</p>
              <p className="text-gray-600"><strong>CA Number:</strong> {complaint.caNumber}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {complaint.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Issue Details</h3>
              <p className="text-gray-600"><strong>Category:</strong> {complaint.category}</p>
              <p className="text-gray-600"><strong>Location:</strong> {complaint.location}</p>
              <p className="text-gray-600"><strong>Description:</strong> <span className="whitespace-pre-wrap">{complaint.description}</span></p>
            </div>
             {complaint.photo && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Attached Photo</h3>
                <img src={complaint.photo} alt="Complaint evidence" className="rounded-lg max-w-full h-auto border" />
              </div>
            )}
          </div>

          {/* Right Column: AI Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">AI Assistant</h3>
            <button onClick={handleGenerateSummary} disabled={isLoadingAi} className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400">
              {isLoadingAi ? 'Generating...' : 'Generate Summary & Actions'}
            </button>
            <div className="mt-4 text-sm text-gray-800 space-y-2 prose max-w-none prose-sm">
              {isLoadingAi && <p className="animate-pulse">Analyzing complaint...</p>}
              {aiSummary && <div dangerouslySetInnerHTML={formatSummary(aiSummary)} />}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
