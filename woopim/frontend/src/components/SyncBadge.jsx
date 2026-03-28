function SyncBadge({ status }) {
  const colors = {
    PENDING: 'bg-yellow-500',
    SYNCED: 'bg-green-500',
    FAILED: 'bg-red-500'
  };
  return <span className={`inline-block px-2 py-1 rounded text-white text-xs ${colors[status] || 'bg-gray-500'}`}>{status}</span>;
}

export default SyncBadge;