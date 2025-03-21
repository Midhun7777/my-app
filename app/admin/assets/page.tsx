'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface OfficeAsset {
  _id: string;
  type: 'system' | 'table' | 'chair' | 'employee';
  assetNumber: string;
  model: string;
  quantity: number;
  certificateUrl: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  department: string;
  lastMaintenance?: Date;
  notes?: string;
}

export default function AdminAssets() {
  const router = useRouter();
  const [assets, setAssets] = useState<OfficeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'system',
    assetNumber: '',
    model: '',
    quantity: 1,
    certificateUrl: '',
    status: 'available',
    location: '',
    department: '',
    notes: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/admin/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        setError('Failed to fetch assets');
      }
    } catch (err) {
      setError('Error fetching assets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          type: 'system',
          assetNumber: '',
          model: '',
          quantity: 1,
          certificateUrl: '',
          status: 'available',
          location: '',
          department: '',
          notes: ''
        });
        fetchAssets();
      } else {
        setError('Failed to add asset');
      }
    } catch (err) {
      setError('Error adding asset');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, certificateUrl: data.url }));
      } else {
        setError('Failed to upload file');
      }
    } catch (err) {
      setError('Error uploading file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Office Asset Management
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Add Asset Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Asset</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as OfficeAsset['type'] }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select the type of asset"
                >
                  <option value="system">System</option>
                  <option value="table">Table</option>
                  <option value="chair">Chair</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asset Number</label>
                <input
                  type="text"
                  value={formData.assetNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Enter the unique asset number"
                  placeholder="e.g., ASSET-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Enter the model number or name"
                  placeholder="e.g., Dell XPS 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                  title="Enter the quantity of assets"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Enter the location of the asset"
                  placeholder="e.g., Room 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Enter the department name"
                  placeholder="e.g., IT Department"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Certificate</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  title="Upload the asset certificate"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  title="Enter any additional notes about the asset"
                  placeholder="Enter any additional information..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Asset
            </button>
          </form>
        </motion.div>

        {/* Assets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 overflow-x-auto"
        >
          <h2 className="text-xl font-semibold mb-4">Asset Inventory</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Asset Number</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id} className="border-b border-gray-700">
                    <td className="py-3">{asset.type}</td>
                    <td className="py-3">{asset.assetNumber}</td>
                    <td className="py-3">{asset.model}</td>
                    <td className="py-3">{asset.quantity}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        asset.status === 'available' ? 'bg-green-900/50 text-green-300' :
                        asset.status === 'in-use' ? 'bg-blue-900/50 text-blue-300' :
                        asset.status === 'maintenance' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-3">{asset.location}</td>
                    <td className="py-3">{asset.department}</td>
                    <td className="py-3">
                      <button
                        onClick={() => window.open(asset.certificateUrl, '_blank')}
                        className="text-blue-400 hover:text-blue-300 mr-2"
                      >
                        View Certificate
                      </button>
                      <button
                        onClick={() => router.push(`/admin/assets/${asset._id}`)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 