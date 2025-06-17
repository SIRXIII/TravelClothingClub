import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AddItemForm from './AddItemForm';

interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  price_per_rental: number;
  images: string[];
  ai_model_image: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface LenderDashboardProps {
  onSignOut: () => void;
}

function LenderDashboard({ onSignOut }: LenderDashboardProps) {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('lender_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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

  const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({ active: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemAdded = () => {
    setShowAddForm(false);
    setEditingItem(null);
    fetchItems();
  };

  if (showAddForm || editingItem) {
    return (
      <AddItemForm
        item={editingItem}
        onSuccess={handleItemAdded}
        onCancel={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/ChatGPT Image Jun 4, 2025, 09_30_18 PM copy.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">Lender Dashboard</h1>
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
            <h2 className="text-2xl font-light text-gray-900">Your Clothing Inventory</h2>
            <p className="text-gray-600 mt-1">Manage your rental items and track performance</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
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
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {item.images.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => toggleItemStatus(item.id, item.active)}
                        className={`p-1 rounded ${
                          item.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={item.active ? 'Active - Click to hide' : 'Hidden - Click to activate'}
                      >
                        {item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {item.category} - {item.size}
                    </span>
                    <span className="font-medium text-green-600">
                      ${item.price_per_rental}/day
                    </span>
                  </div>
                  {item.ai_model_image && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">AI Model Preview:</p>
                      <img
                        src={item.ai_model_image}
                        alt="AI Model"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LenderDashboard;