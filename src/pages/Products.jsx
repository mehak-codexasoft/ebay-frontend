import { Search, Plus, Edit, Trash2, Eye, X, Package, Percent, Tag } from 'lucide-react';
import { useState } from 'react';

const productsData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Startpass',
    description: 'Full access to all premium features with monthly billing',
    unit_amount: 0,
    total_amount: 0,
    currency: 'EUR',
    discount_percentage: 100,
    interval: 'week',
    marketing_features: ['Unlimited landmarks', 'No ads', 'Priority support', 'Offline access']
  },
  {
    id: '4fb85f64-5717-4562-b3fc-2c963f66afa7',
    name: 'Real Explorer',
    description: 'Full access to all premium features with yearly billing - Save 20%',
    unit_amount: 79,
    total_amount: 79,
    currency: 'EUR',
    discount_percentage: 21,
    interval: 'month',
    marketing_features: ['Unlimited landmarks', 'No ads', 'Priority support', 'Offline access', 'Early access to new features']
  },
  {
    id: '5fc85f64-5717-4562-b3fc-2c963f66afa8',
    name: 'Borderless Travel',
    description: 'Limited access with weekly billing',
    unit_amount: 69,
    total_amount: 69,
    currency: 'EUR',
    discount_percentage: 31,
    interval: 'year',
    marketing_features: ['50 landmarks/month', 'Basic support']
  },
  // {
  //   id: '6fd85f64-5717-4562-b3fc-2c963f66afa9',
  //   name: 'Lifetime Access',
  //   description: 'One-time payment for lifetime access to all features',
  //   unit_amount: 29999,
  //   total_amount: 19999,
  //   currency: 'USD',
  //   discount_percentage: 33,
  //   interval: 'lifetime',
  //   marketing_features: ['Unlimited landmarks', 'No ads', 'Priority support', 'Offline access', 'All future updates', 'Lifetime access']
  // },
];

const intervals = ['week', 'month', 'year'];
const currencies = ['EUR'];

export default function Products() {
  const [products, setProducts] = useState(productsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit_amount: 0,
    total_amount: 0,
    currency: 'EUR',
    discount_percentage: 0,
    interval: 'month',
    marketing_features: []
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (amount, currency) => {
    const price = amount / 100;
    const symbols = { EUR: '€' };
    return `${symbols[currency] || currency}${price.toFixed(2)}`;
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        unit_amount: product.unit_amount,
        total_amount: product.total_amount,
        currency: product.currency,
        discount_percentage: product.discount_percentage,
        interval: product.interval,
        marketing_features: [...product.marketing_features]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        unit_amount: 0,
        total_amount: 0,
        currency: 'EUR',
        discount_percentage: 0,
        interval: 'month',
        marketing_features: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewFeature('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      setProducts([{ id: crypto.randomUUID(), ...formData }, ...products]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, marketing_features: [...formData.marketing_features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      marketing_features: formData.marketing_features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage payment products and subscription plans.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/30"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Package size={24} className="text-green-600" />
                </div>
                {product.discount_percentage > 0 && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <Percent size={12} /> {product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* Name & Description */}
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

              {/* Price */}
              <div className="mt-4">
                {product.discount_percentage > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {formatPrice(product.total_amount, product.currency)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.unit_amount, product.currency)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {formatPrice(product.unit_amount, product.currency)}
                  </span>
                )}
                <span className="text-sm text-gray-500">/ {product.interval}</span>
              </div>

              {/* Features Preview */}
              {product.marketing_features.length > 0 && (
                <div className="mt-4 space-y-1">
                  {product.marketing_features.slice(0, 3).map((feature, i) => (
                    <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-green-500">✓</span> {feature}
                    </p>
                  ))}
                  {product.marketing_features.length > 3 && (
                    <p className="text-xs text-gray-400">+{product.marketing_features.length - 3} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-4 border-t border-gray-100">
              <button
                onClick={() => handleView(product)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye size={16} /> View
              </button>
              <button
                onClick={() => openModal(product)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Amount (cents) *</label>
                  <input
                    type="number"
                    value={formData.unit_amount}
                    onChange={(e) => setFormData({ ...formData, unit_amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (cents)</label>
                  <input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interval</label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                  >
                    {intervals.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                  <input
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Marketing Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.marketing_features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Package size={28} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{viewingProduct.name}</h3>
                  <p className="text-gray-500 capitalize">{viewingProduct.interval} subscription</p>
                </div>
              </div>

              <div className="py-4 border-y border-gray-100">
                <div className="flex items-baseline gap-2">
                  {viewingProduct.discount_percentage > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-gray-800">
                        {formatPrice(viewingProduct.total_amount, viewingProduct.currency)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(viewingProduct.unit_amount, viewingProduct.currency)}
                      </span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                        {viewingProduct.discount_percentage}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-800">
                      {formatPrice(viewingProduct.unit_amount, viewingProduct.currency)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">per {viewingProduct.interval}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-gray-800">{viewingProduct.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Features</p>
                <div className="space-y-2">
                  {viewingProduct.marketing_features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="font-semibold text-gray-800">{viewingProduct.currency}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Interval</p>
                  <p className="font-semibold text-gray-800 capitalize">{viewingProduct.interval}</p>
                </div>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
