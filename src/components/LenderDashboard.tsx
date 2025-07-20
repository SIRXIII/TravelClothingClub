import React, { useState } from 'react';
import AddItemModal from './AddItemModal';

function LenderDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light mb-8">Lender Dashboard</h1>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Item
        </button>

        {showAddModal && (
          <AddItemModal onClose={() => setShowAddModal(false)} />
        )}
      </div>
    </div>
  );
}

export default LenderDashboard;