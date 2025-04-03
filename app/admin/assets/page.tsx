'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Asset {
  assetId: string;
  assetName: string;
  assetType: string;
  assignedTo: string | null;
  status: string;
  location: string | null;
  purchaseDate: string | null;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  condition: string | null;
  notes: string | null;
  employeeName?: string;
  employeeId?: string;
  section?: string;
  employeeLevel?: string;
  idDocument?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminAssets() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    assetType: 'system',
    assignedTo: '',
    status: 'available',
    location: '',
    purchaseDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    condition: '',
    notes: '',
    employeeName: '',
    employeeId: '',
    section: '',
    employeeLevel: '',
    idDocument: ''
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
      console.log('Submitting asset data:', formData);
      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Server response:', { status: response.status, data });

      if (response.ok) {
        setFormData({
          assetId: '',
          assetName: '',
          assetType: 'system',
          assignedTo: '',
          status: 'available',
          location: '',
          purchaseDate: '',
          lastMaintenance: '',
          nextMaintenance: '',
          condition: '',
          notes: '',
          employeeName: '',
          employeeId: '',
          section: '',
          employeeLevel: '',
          idDocument: ''
        });
        fetchAssets();
      } else {
        setError(data.message || 'Failed to add asset');
      }
    } catch (err) {
      console.error('Error adding asset:', err);
      setError('Error adding asset: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', { status: response.status, data });

      if (response.ok) {
        setFormData(prev => ({ ...prev, idDocument: data.url }));
      } else {
        setError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
          Asset Management
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
                  value={formData.assetType}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetType: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Select asset type"
                  aria-label="Select asset type"
                >
                  <option value="system">System</option>
                  <option value="table">Table</option>
                  <option value="chair">Chair</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asset ID</label>
                <input
                  type="text"
                  value={formData.assetId}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetId: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="e.g., ASSET-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  value={formData.assetName}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetName: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Enter asset name"
                />
              </div>

              {formData.assetType === 'employee' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employee Name</label>
                    <input
                      type="text"
                      value={formData.employeeName}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.assetType === 'employee'}
                      placeholder="Enter employee name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.assetType === 'employee'}
                      placeholder="Enter employee ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.assetType === 'employee'}
                      placeholder="Enter section"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Employee Level</label>
                    <select
                      value={formData.employeeLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeLevel: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.assetType === 'employee'}
                      title="Select employee level"
                      aria-label="Select employee level"
                    >
                      <option value="">Select level</option>
                      <option value="SC">SC</option>
                      <option value="OS">OS</option>
                      <option value="Head">Head</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Select asset status"
                  aria-label="Select asset status"
                >
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {formData.assetType === 'employee' ? 'ID Document' : 'Certificate'}
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  title={formData.assetType === 'employee' ? 'Upload ID document' : 'Upload asset certificate'}
                  aria-label={formData.assetType === 'employee' ? 'Upload ID document' : 'Upload asset certificate'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter any additional notes"
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
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Name</th>
                  {formData.assetType === 'employee' ? (
                    <>
                      <th className="pb-3">Employee ID</th>
                      <th className="pb-3">Section</th>
                      <th className="pb-3">Level</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Purchase Date</th>
                    </>
                  )}
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.assetId} className="border-b border-gray-700">
                    <td className="py-3">{asset.assetType}</td>
                    <td className="py-3">{asset.assetId}</td>
                    <td className="py-3">{asset.assetName}</td>
                    {asset.assetType === 'employee' ? (
                      <>
                        <td className="py-3">{asset.employeeId}</td>
                        <td className="py-3">{asset.section}</td>
                        <td className="py-3">{asset.employeeLevel}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3">{asset.location}</td>
                        <td className="py-3">{asset.purchaseDate}</td>
                      </>
                    )}
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
                    <td className="py-3">
                      <button
                        onClick={() => window.open(asset.idDocument, '_blank')}
                        className="text-blue-400 hover:text-blue-300 mr-2"
                      >
                        View Document
                      </button>
                      <button
                        onClick={() => router.push(`/admin/assets/${asset.assetId}`)}
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