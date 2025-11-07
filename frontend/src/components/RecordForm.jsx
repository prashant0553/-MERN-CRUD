import React, { useEffect, useState } from 'react';
import { getJSON, postJSON, putJSON } from '../lib/api';

export default function RecordForm({ onSaved, editRecord }) {
  const token = JSON.parse(localStorage.getItem('auth') || 'null')?.token;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: '', active: true });
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (editRecord)
      setForm({
        name: editRecord.name,
        description: editRecord.description || '',
        category: editRecord.category?._id || '',
        active: !!editRecord.active,
      });
  }, [editRecord]);

  async function fetchCategories() {
    const res = await getJSON('/categories');
    setCategories(res || []);
    if (!form.category && res && res[0]) setForm((f) => ({ ...f, category: res[0]._id }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (!form.name) return setErr('Name is required.');
    if (!form.category) return setErr('Please select a category.');

    const res = editRecord
      ? await putJSON('/records/' + editRecord._id, form, token)
      : await postJSON('/records', form, token);

    if (res._id) {
      onSaved && onSaved();
      if (!editRecord) setForm({ name: '', description: '', category: categories[0]?._id || '', active: true });
    } else {
      setErr(res.message || JSON.stringify(res));
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {editRecord ? '✏️ Edit Record' : '➕ Create Record'}
      </h3>

      <form onSubmit={submit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 transition-all"
            placeholder="Enter record name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 transition-all resize-none"
            rows="3"
            placeholder="Enter record description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 transition-all"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            id="active"
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="active" className="text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Error Message */}
        {err && (
          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-2">
            {err}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 transform hover:scale-105 shadow-md"
        >
          {editRecord ? 'Update Record' : 'Create Record'}
        </button>
      </form>
    </div>
  );
}
