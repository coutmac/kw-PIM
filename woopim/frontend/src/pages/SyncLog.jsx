import { useEffect, useState } from 'react';
import api from '../api';
import { useToast } from '../components/Toast';

function SyncLog() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.get('/sync/logs');
      setLogs(res.data);
    } catch (error) {
      toast('Failed to load logs', 'error');
    }
  };

  const filteredLogs = logs.filter(log => !filter || log.action === filter);

  const exportCSV = () => {
    const csv = 'Product,Action,WooCommerce ID,Message,Date\n' + filteredLogs.map(log => `${log.product.name},${log.action},${log.wcProductId || ''},${log.message || ''},${log.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sync_logs.csv';
    a.click();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sync Logs</h1>
      <div className="flex space-x-4 mb-4">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2">
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="FAILED">FAILED</option>
        </select>
        <button onClick={exportCSV} className="bg-green-500 text-white px-4 py-2 rounded">Export CSV</button>
        <button onClick={loadLogs} className="bg-blue-500 text-white px-4 py-2 rounded">Refresh</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Product</th>
            <th className="p-2">Action</th>
            <th className="p-2">WooCommerce ID</th>
            <th className="p-2">Message</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map(log => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.product.name}</td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{log.wcProductId}</td>
              <td className="p-2">{log.message}</td>
              <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SyncLog;