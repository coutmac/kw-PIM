import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">WooProduct PIM</h2>
      <nav className="space-y-2">
        <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
        <Link to="/products" className="block py-2 px-4 rounded hover:bg-gray-700">Products</Link>
        <Link to="/sync" className="block py-2 px-4 rounded hover:bg-gray-700">Sync Logs</Link>
      </nav>
    </div>
  );
}

export default Sidebar;