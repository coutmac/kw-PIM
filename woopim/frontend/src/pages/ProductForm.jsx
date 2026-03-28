import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AttributeBuilder from '../components/AttributeBuilder';
import SyncBadge from '../components/SyncBadge';
import EnrichButton from '../components/EnrichButton';
import { useToast } from '../components/Toast';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    price: '',
    stock: 0,
    rawDescription: '',
    attributes: [],
    category: '',
    imageUrl: '',
    syncStatus: 'PENDING'
  });

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => toast('Failed to load product', 'error'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/products/${id}`, product);
        toast('Product updated', 'success');
      } else {
        await api.post('/products', product);
        toast('Product created', 'success');
      }
      navigate('/products');
    } catch (error) {
      toast(error.response?.data?.error || 'Save failed', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} required className="w-full border p-2" />
        </div>
        <div>
          <label className="block">SKU</label>
          <input value={product.sku} onChange={e => setProduct({ ...product, sku: e.target.value })} required className="w-full border p-2" />
        </div>
        <div>
          <label className="block">Price ($)</label>
          <input type="number" step="0.01" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} required className="w-full border p-2" />
        </div>
        <div>
          <label className="block">Stock</label>
          <input type="number" min="0" value={product.stock} onChange={e => setProduct({ ...product, stock: parseInt(e.target.value) })} className="w-full border p-2" />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea value={product.rawDescription} onChange={e => setProduct({ ...product, rawDescription: e.target.value })} className="w-full border p-2" />
        </div>
        <AttributeBuilder attributes={product.attributes} setAttributes={(attrs) => setProduct({ ...product, attributes: attrs })} />
        <div>
          <label className="block">Category</label>
          <select value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })} className="w-full border p-2">
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fitness">Fitness</option>
            <option value="Home">Home</option>
          </select>
        </div>
        <div>
          <label className="block">Image URL</label>
          <input value={product.imageUrl} onChange={e => setProduct({ ...product, imageUrl: e.target.value })} className="w-full border p-2" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </form>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">Preview</h3>
          {product.imageUrl && <img src={product.imageUrl} alt="Preview" className="w-full h-48 object-cover border" />}
        </div>
        <SyncBadge status={product.syncStatus} />
        <EnrichButton productId={id} onEnriched={(desc) => setProduct({ ...product, aiDescription: desc })} />
        {product.aiDescription && (
          <div>
            <h4>AI Description</h4>
            <p>{product.aiDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductForm;