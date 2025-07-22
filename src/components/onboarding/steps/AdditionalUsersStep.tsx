import React, { useState } from 'react';
import { Users, Plus, ArrowRight, Trash2, Edit3 } from 'lucide-react';
import { useOnboardingStore, UserMeasurements } from '../../../store/onboardingStore';
import MeasurementInput from '../MeasurementInput';
import BodyVisualization from '../BodyVisualization';

interface AdditionalUsersStepProps {
  onClose: () => void;
}

function AdditionalUsersStep({ onClose }: AdditionalUsersStepProps) {
  const { users, addUser, updateUser, removeUser, nextStep } = useOnboardingStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<UserMeasurements>>({
    id: crypto.randomUUID(),
    name: '',
    gender: 'Female',
    height: 170,
    weight: 70,
    chest: 90,
    waist: 75,
    hips: 95,
    inseam: 75,
    sleeveLength: 60,
    shoeSize: 8,
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.gender && newUser.height && newUser.weight) {
      addUser(newUser as UserMeasurements);
      setNewUser({
        id: crypto.randomUUID(),
        name: '',
        gender: 'Female',
        height: 170,
        weight: 70,
        chest: 90,
        waist: 75,
        hips: 95,
        inseam: 75,
        sleeveLength: 60,
        shoeSize: 8,
      });
      setShowAddForm(false);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setNewUser(user);
      setEditingUser(userId);
      setShowAddForm(true);
    }
  };

  const handleUpdateUser = () => {
    if (editingUser && newUser.name && newUser.gender && newUser.height && newUser.weight) {
      updateUser(editingUser, newUser as UserMeasurements);
      setEditingUser(null);
      setNewUser({
        id: crypto.randomUUID(),
        name: '',
        gender: 'Female',
        height: 170,
        weight: 70,
        chest: 90,
        waist: 75,
        hips: 95,
        inseam: 75,
        sleeveLength: 60,
        shoeSize: 8,
      });
      setShowAddForm(false);
    }
  };

  const updateNewUserField = (field: keyof UserMeasurements, value: any) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = newUser.name && newUser.gender && newUser.height && 
                     newUser.weight && newUser.chest && newUser.waist && newUser.hips;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">
            Add Family Members or Travel Companions
          </h3>
          <p className="text-slate-600">
            Add additional users to rent clothing for your entire group
          </p>
        </div>

        {/* Existing Users */}
        {users.length > 1 && (
          <div className="mb-8">
            <h4 className="text-lg font-medium text-slate-900 mb-4">Current Users</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.slice(1).map((user) => (
                <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-slate-900">{user.name}</h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Gender: {user.gender}</p>
                    <p>Height: {user.height}cm</p>
                    <p>Weight: {user.weight}kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add User Form */}
        {showAddForm ? (
          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-slate-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  setNewUser({
                    id: crypto.randomUUID(),
                    name: '',
                    gender: 'Female',
                    height: 170,
                    weight: 70,
                    chest: 90,
                    waist: 75,
                    hips: 95,
                    inseam: 75,
                    sleeveLength: 60,
                    shoeSize: 8,
                  });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.name || ''}
                    onChange={(e) => updateNewUserField('name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter name"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Female', 'Male', 'Other'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => updateNewUserField('gender', gender as any)}
                        className={`p-3 rounded-lg border-2 transition ${
                          newUser.gender === gender
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <MeasurementInput
                    label="Height *"
                    value={newUser.height || 0}
                    onChange={(value) => updateNewUserField('height', value)}
                    unit="cm"
                    min={120}
                    max={220}
                    required
                  />
                  <MeasurementInput
                    label="Weight *"
                    value={newUser.weight || 0}
                    onChange={(value) => updateNewUserField('weight', value)}
                    unit="kg"
                    min={30}
                    max={200}
                    required
                  />
                </div>

                {/* Body Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <MeasurementInput
                    label="Chest/Bust *"
                    value={newUser.chest || 0}
                    onChange={(value) => updateNewUserField('chest', value)}
                    unit="cm"
                    min={60}
                    max={150}
                    required
                  />
                  <MeasurementInput
                    label="Waist *"
                    value={newUser.waist || 0}
                    onChange={(value) => updateNewUserField('waist', value)}
                    unit="cm"
                    min={50}
                    max={130}
                    required
                  />
                  <MeasurementInput
                    label="Hips *"
                    value={newUser.hips || 0}
                    onChange={(value) => updateNewUserField('hips', value)}
                    unit="cm"
                    min={60}
                    max={150}
                    required
                  />
                  <MeasurementInput
                    label="Inseam"
                    value={newUser.inseam || 0}
                    onChange={(value) => updateNewUserField('inseam', value)}
                    unit="cm"
                    min={50}
                    max={100}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                    disabled={!isFormValid}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingUser(null);
                    }}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-white rounded-xl p-6 h-96">
                <h5 className="text-lg font-medium text-slate-900 mb-4 text-center">
                  Body Visualization
                </h5>
                <BodyVisualization 
                  measurements={newUser as UserMeasurements}
                  gender={newUser.gender || 'Female'}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-3 mx-auto"
            >
              <Plus className="w-6 h-6" />
              Add Another Person
            </button>
            <p className="text-slate-600 mt-3">
              Add family members, children, or travel companions
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            Continue to Summary
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdditionalUsersStep;