import React from 'react';
import { delJSON } from '../lib/api';

export default function RecordView({ record, onClose, onDeleted, onEdit }) {
  const token = JSON.parse(localStorage.getItem('auth') || 'null')?.token;

  async function remove() {
    if (!confirm('Delete record?')) return;
    await delJSON('/records/' + record._id, token);
    onDeleted && onDeleted();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{record.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl transition"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-gray-700">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Category:</span> {record.category?.name || 'N/A'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Active:</span>{' '}
            <span className={record.active ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
              {record.active ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="mt-2 text-gray-700">{record.description || 'No description provided.'}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => onEdit(record)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-white font-medium transition"
          >
            Edit
          </button>
          <button
            onClick={remove}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
