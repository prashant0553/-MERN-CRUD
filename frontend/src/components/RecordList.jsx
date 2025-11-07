import React, { useEffect, useState } from 'react';
import { getJSON, delJSON, postJSON } from '../lib/api';
import RecordForm from './RecordForm';
import RecordView from './RecordView';

export default function RecordList() {
  const token = JSON.parse(localStorage.getItem('auth') || 'null')?.token;
  const [records, setRecords] = useState([]);
  const [edit, setEdit] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterActive, setFilterActive] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchList();
  }, [filterActive, search]);

  async function fetchList() {
    const q = new URLSearchParams();
    if (filterActive === 'true' || filterActive === 'false') q.set('active', filterActive);
    if (search) q.set('search', search);
    const res = await getJSON('/records?' + q.toString(), token);
    setRecords(res || []);
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    await delJSON('/records/' + id, token);
    fetchList();
  }

  async function bulkDelete() {
    if (!selectedIds.length) return alert('Please select at least one record.');
    if (!confirm(`Delete ${selectedIds.length} selected record(s)?`)) return;
    await postJSON('/records/bulk-delete', { ids: selectedIds }, token);
    setSelectedIds([]);
    fetchList();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Records List */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
        {/* Header Controls */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          <input
            className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            onClick={fetchList}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            Refresh
          </button>

          {/* Bulk Delete Button */}
          <button
            onClick={bulkDelete}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
             Delete
          </button>
        </div>

        {/* Record Items */}
        <div className="divide-y divide-gray-200">
          {records.length > 0 ? (
            records.map((r) => (
              <div
                key={r._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-md transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r._id)}
                    onChange={(e) =>
                      setSelectedIds((prev) =>
                        e.target.checked
                          ? [...prev, r._id]
                          : prev.filter((x) => x !== r._id)
                      )
                    }
                    className="mt-1 sm:mt-0 w-4 h-4 accent-indigo-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{r.name}</div>
                    <div className="text-sm text-gray-600">
                      {r.category?.name || 'No category'} •{' '}
                      <span
                        className={`${
                          r.active ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {r.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={async () => {
                      const rec = await getJSON('/records/' + r._id, token);
                      setSelected(rec);
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEdit(r)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded-md text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 italic">
              No records found.
            </div>
          )}
        </div>
      </div>

      {/* Record Form (Right Panel) */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
        <RecordForm onSaved={fetchList} editRecord={edit} />
      </div>

      {/* Record View Modal */}
      {selected && (
        <RecordView
          record={selected}
          onClose={() => setSelected(null)}
          onDeleted={() => {
            setSelected(null);
            fetchList();
          }}
          onEdit={(r) => {
            setEdit(r);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
