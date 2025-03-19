'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Asset {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'furniture',
    quantity: 1,
  });
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const departmentId = localStorage.getItem('departmentId');
    if (!departmentId) {
      router.push('/login');
      return;
    }

    fetchAssets(departmentId);
  }, [router]);

  const fetchAssets = async (departmentId: string) => {
    try {
      const response = await fetch(`/api/assets?departmentId=${departmentId}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets);
      } else {
        setError('Failed to fetch assets');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    const departmentId = localStorage.getItem('departmentId');
    if (!departmentId) return;

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAsset,
          departmentId,
        }),
      });

      if (response.ok) {
        setIsAddingAsset(false);
        setNewAsset({ name: '', category: 'furniture', quantity: 1 });
        fetchAssets(departmentId);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add asset');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Management Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingAsset(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Asset
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        {isAddingAsset && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assetName">
                  Asset Name
                </label>
                <input
                  id="assetName"
                  type="text"
                  required
                  title="Enter the name of the asset"
                  placeholder="e.g., Office Chair"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assetCategory">
                  Category
                </label>
                <select
                  id="assetCategory"
                  title="Select the asset category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                >
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="office-supplies">Office Supplies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assetQuantity">
                  Quantity
                </label>
                <input
                  id="assetQuantity"
                  type="number"
                  required
                  min="1"
                  title="Enter the quantity of assets needed"
                  placeholder="Enter quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAsset.quantity}
                  onChange={(e) => setNewAsset({ ...newAsset, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddingAsset(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <motion.div
              key={asset._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{asset.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Category: <span className="font-medium">{asset.category}</span>
                </p>
                <p className="text-gray-600">
                  Quantity: <span className="font-medium">{asset.quantity}</span>
                </p>
                <p className="text-gray-600">
                  Status:{' '}
                  <span
                    className={`font-medium ${
                      asset.status === 'approved'
                        ? 'text-green-600'
                        : asset.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 