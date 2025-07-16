import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserItems, deleteItem } from '../lib/supabase';
import AddItemModal from './AddItemModal';

interface Item {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  description?: string;
  image_url: string;
  ai_preview_url?: string;
  created_at: string;
}

interface LenderDashboardProps {
  onSignOut: () => void;
}

function LenderDashboard({ onSignOut }: LenderDashboardProps) {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    if (!user) return;
    
    try {
      const data = await getUserItems(user.id);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteItem(itemId);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemSuccess = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">Partner Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Your Item Inventory</h2>
            <p className="text-gray-600 mt-1">Manage your clothing items and AI try-on previews</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6">Start building your inventory by adding your first clothing item</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {item.category} • {item.size} • {item.condition}
                    </span>
                    <span className="font-medium text-green-600">
                      ${item.price}/day
                    </span>
                  </div>
                  {item.ai_preview_url && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <p className="text-xs text-gray-500">AI Try-On Preview:</p>
                      </div>
                      <img
                        src={item.ai_preview_url}
                        alt="AI Try-On Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleItemSuccess}
      />
    </div>
  );
}

export default LenderDashboard;