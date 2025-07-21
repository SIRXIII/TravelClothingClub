import React, { useState } from 'react';

interface AddItemModalProps {
  onClose: () => void;
}

function AddItemModal({ onClose }: AddItemModalProps) {
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock successful submission
    console.log('Item added:', {
      itemName,
      brand,
        category,
        size,
        condition,
      price,
        description,
      uploadedFiles
      });
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Add your form fields here */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
          </form>
      </div>
    </div>
  );
}

export default AddItemModal;