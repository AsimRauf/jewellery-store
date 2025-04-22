'use client';

import { useState } from 'react';
import { RingEnums } from '@/constants/ringEnums';

export default function AddEngagementRing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    style: [] as string[],
    type: [] as string[],
    SKU: '',
    price: '',
    size: '',
    metal: {
      karat: '',
      color: '',
      description: '',
      finish_type: '',
      width_mm: '',
      total_carat_weight: ''
    },
    main_stone: {
      type: '',
      gemstone_type: '',
      number_of_stones: '',
      carat_weight: '',
      shape: '',
      color: '',
      clarity: '',
      hardness: ''
    },
    side_stone: {
      type: '',
      number_of_stones: '',
      total_carat: '',
      shape: '',
      color: '',
      clarity: ''
    },
    media: {
      images: [] as Array<{ url: string, publicId: string }>,
      video: ''
    },
    description: '',
    isActive: true,
    isFeatured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/rings/engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create ring');
      }

      setSuccess('Ring created successfully!');
      // Reset form or redirect
    } catch (err) {
      console.error(err);
      setError('Failed to create ring. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Engagement Ring</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input
                type="text"
                required
                value={formData.SKU}
                onChange={(e) => setFormData({...formData, SKU: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ring Size *</label>
              <input
                type="number"
                required
                step="0.25"
                min="3"
                max="13"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </section>

        {/* Style & Type */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Style & Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Styles</label>
              <select
                multiple
                value={formData.style}
                onChange={(e) => setFormData({
                  ...formData,
                  style: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full p-2 border rounded h-32"
              >
                {RingEnums.STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Types</label>
              <select
                multiple
                value={formData.type}
                onChange={(e) => setFormData({
                  ...formData,
                  type: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full p-2 border rounded h-32"
              >
                {RingEnums.TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Continue with Metal, Stone, and Media sections... */}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({...formData, isActive: !formData.isActive})}
            className={`px-4 py-2 rounded ${formData.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {formData.isActive ? 'Active' : 'Inactive'}
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
            className={`px-4 py-2 rounded ${formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}
          >
            {formData.isFeatured ? 'Featured' : 'Not Featured'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Ring'}
          </button>
        </div>
      </form>
    </div>
  );
}