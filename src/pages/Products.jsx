import { Search, Plus, Edit, Trash2, Eye, X, Package, Percent, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import productService from '../services/productService';

const intervals = ['week', 'month', 'year', 'lifetime'];
const currencies = ['USD', 'EUR', 'GBP', 'PKR'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit_amount: 0,
    total_amount: 0,
    currency: 'USD',
    discount_percentage: 0,
    interval: 'month',
    marketing_features: []
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (searchTerm) params.search = searchTerm;

      const response = await productService.getProducts(params);
      console.log('Products API response:', response);
      const data = response?.results || (Array.isArray(response) ? response : []);
      setProducts(data);
      setTotalCount(response?.count || data.length || 0);
      setTotalPages(Math.ceil((response?.count || data.length || 1) / pageSize));
    } catch (err) {
      console.error('Fetch products error:', err);
      const errorMessage = err?.response?.data?.detail
        || err?.response?.data?.message
        || err?.message
        || 'Failed to fetch products';
      setError(errorMessage);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchProducts();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatPrice = (amount, currency) => {
    const price = (amount || 0) / 100;
    const symbols = { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs.' };
    return `${symbols[currency] || currency}${price.toFixed(2)}`;
  };

  // Helper to get feature name (handles both string and object formats)
  const getFeatureName = (feature) => {
    if (typeof feature === 'string') return feature;
    if (feature && typeof feature === 'object') return feature.name || '';
    return '';
  };

  const handleView = async (product) => {
    if (!product) return;
    setViewingProduct(product);
    setShowViewModal(true);
    setLoadingDetails(true);

    try {
      const fullProduct = await productService.getProductById(product.id);
      if (fullProduct && fullProduct.id) {
        setViewingProduct(fullProduct);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openModal = async (product = null) => {
    if (product) {
      setEditingProduct(product);
      try {
        const fullProduct = await productService.getProductById(product.id);
        setFormData({
          name: fullProduct.name || '',
          description: fullProduct.description || '',
          unit_amount: fullProduct.unit_amount || 0,
          total_amount: fullProduct.total_amount || 0,
          currency: fullProduct.currency || 'USD',
          discount_percentage: fullProduct.discount_percentage || 0,
          interval: fullProduct.interval || 'month',
          marketing_features: fullProduct.marketing_features || []
        });
      } catch (err) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          unit_amount: product.unit_amount || 0,
          total_amount: product.total_amount || 0,
          currency: product.currency || 'USD',
          discount_percentage: product.discount_percentage || 0,
          interval: product.interval || 'month',
          marketing_features: product.marketing_features || []
        });
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        unit_amount: 0,
        total_amount: 0,
        currency: 'USD',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Convert marketing_features to API format [{name: "..."}]
      const formattedFeatures = formData.marketing_features.map(f =>
        typeof f === 'string' ? { name: f } : f
      );

      const submitData = {
        name: formData.name,
        description: formData.description || '',
        unit_amount: formData.unit_amount,
        total_amount: formData.total_amount || formData.unit_amount,
        currency: formData.currency,
        discount_percentage: formData.discount_percentage || 0,
        interval: formData.interval,
        marketing_features: formattedFeatures
      };

      if (editingProduct) {
        await productService.patchProduct(editingProduct.id, submitData);
      } else {
        await productService.createProduct(submitData);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error('Save error:', err.response?.status, err.response?.data);

      if (err.response?.status === 500) {
        closeModal();
        fetchProducts();
        return;
      }

      const errorMsg = err.response?.data?.detail
        || err.response?.data?.message
        || (typeof err.response?.data === 'string' ? err.response?.data : null)
        || JSON.stringify(err.response?.data)
        || 'Failed to save product';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete product');
    } finally {
      setDeleting(false);
    }
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

  const filteredProducts = products;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage payment products and subscription plans</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-green-500 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Package size={24} className="text-green-600" />
                    </div>
                    {(product.discount_percentage || 0) > 0 && (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <Percent size={12} /> {product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-lg font-semibold text-gray-800">{product.name || 'Unnamed'}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description || 'No description'}</p>

                  {/* Price */}
                  <div className="mt-4">
                    {(product.discount_percentage || 0) > 0 ? (
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
                    <span className="text-sm text-gray-500">/ {product.interval || 'month'}</span>
                  </div>

                  {/* Features Preview */}
                  {product.marketing_features && product.marketing_features.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {product.marketing_features.slice(0, 3).map((feature, i) => (
                        <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="text-green-500">✓</span> {getFeatureName(feature)}
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
                    onClick={() => handleDeleteClick(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
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
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

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
                      {getFeatureName(feature)}
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
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : (editingProduct ? 'Update Product' : 'Create Product')}
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
              {loadingDetails ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto text-green-500 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Package size={28} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{viewingProduct.name || 'Unnamed'}</h3>
                      <p className="text-gray-500 capitalize">{viewingProduct.interval || 'month'} subscription</p>
                    </div>
                  </div>

                  <div className="py-4 border-y border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {(viewingProduct.discount_percentage || 0) > 0 ? (
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
                    <p className="text-sm text-gray-500 mt-1">per {viewingProduct.interval || 'month'}</p>
                  </div>

                  {viewingProduct.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                      <p className="text-gray-800">{viewingProduct.description}</p>
                    </div>
                  )}

                  {viewingProduct.marketing_features && viewingProduct.marketing_features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Features</p>
                      <div className="space-y-2">
                        {viewingProduct.marketing_features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                            {getFeatureName(feature)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Currency</p>
                      <p className="font-semibold text-gray-800">{viewingProduct.currency || 'USD'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500">Interval</p>
                      <p className="font-semibold text-gray-800 capitalize">{viewingProduct.interval || 'month'}</p>
                    </div>
                  </div>

                  {/* ID */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">Product ID</p>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {viewingProduct.id || 'N/A'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Product</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete <span className="font-medium text-gray-700">{productToDelete?.name || 'this product'}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIsDeleteModalOpen(false); setProductToDelete(null); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <><Loader2 size={18} className="animate-spin" /> Deleting...</> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
