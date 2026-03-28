import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SyncBadge from '../components/SyncBadge';
import { useToast } from '../components/Toast';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast('Failed to load products', 'error');
    }
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (category === '' || p.category === category))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

  const syncProduct = async (id) => {
    try {
      await api.post(`/sync/${id}`);
      toast('Product synced successfully', 'success');
      loadProducts();
    } catch (error) {
      toast('Sync failed', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast('Product deleted', 'success');
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        toast('Delete failed', 'error');
      }
    }
  };

  const enrichProduct = async (id) => {
    try {
      await api.post(`/enrich/${id}`);
      toast('Product enriched', 'success');
      loadProducts();
    } catch (error) {
      toast('Enrich failed', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</Link>
      </div>
      <div className="flex space-x-4 mb-4">
        <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="border p-2" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fitness">Fitness</option>
          <option value="Home">Home</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2">
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="createdAt">Date</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="border p-2">{sortOrder === 'asc' ? '↑' : '↓'}</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2"><img src={p.imageUrl} alt="" className="w-12 h-12 object-cover" /></td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.sku}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2"><SyncBadge status={p.syncStatus} /></td>
              <td className="p-2 space-x-2">
                <Link to={`/products/${p.id}`} className="text-blue-500">Edit</Link>
                <button onClick={() => enrichProduct(p.id)} className="text-green-500">Enrich</button>
                <button onClick={() => syncProduct(p.id)} className="text-purple-500">Sync</button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;