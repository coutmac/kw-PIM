import { useEffect, useState } from 'react';
import api from '../api';
import StatsBar from '../components/StatsBar';

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <StatsBar />
    </div>
  );
}

export default Dashboard;