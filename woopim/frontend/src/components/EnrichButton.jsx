import { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from './Toast';

function EnrichButton({ productId, onEnriched }) {
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const toast = useToast();

  const enrich = async () => {
    setLoading(true);
    setDisplayedText('');
    try {
      const res = await api.post(`/enrich/${productId}`);
      const aiText = res.data.aiDescription;
      onEnriched(aiText);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(aiText.slice(0, i + 1));
        i++;
        if (i >= aiText.length) clearInterval(interval);
      }, 50);
      toast('Product enriched successfully', 'success');
    } catch (error) {
      toast('Enrich failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={enrich} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? 'Enriching...' : 'Enrich with AI'}
      </button>
      {displayedText && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">{displayedText}</p>
          <span className="text-xs text-gray-500">{displayedText.length}/80</span>
        </div>
      )}
    </div>
  );
}

export default EnrichButton;