import { useEffect, useState } from 'react';
import api from '../api';

function StatsBar() {
  const [stats, setStats] = useState({ total: 0, synced: 0, pending: 0, failed: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/products/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load stats');
      }
    };
    loadStats();
  }, []);

  return (
    <div className="flex space-x-6 bg-white p-4 rounded shadow">
      <div className="text-center">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{stats.synced}</div>
        <div className="text-sm text-gray-600">Synced</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">Pending</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        <div className="text-sm text-gray-600">Failed</div>
      </div>
    </div>
  );
}

export default StatsBar;