'use client';
import { useState } from 'react';

export default function Home() {
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, city, country, timeWindow }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">AstroMatchAI</h1>
      <p className="mb-6">Find your cosmic soulmate using your birth details.</p>

      <input className="mb-2 w-full p-2 text-black" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input className="mb-2 w-full p-2 text-black" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input className="mb-2 w-full p-2 text-black" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
      <select className="mb-4 w-full p-2 text-black" value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
        <option value="">Select 1-hour window</option>
        {Array.from({ length: 24 }, (_, hour) => (
          <option key={hour} value={hour.toString().padStart(2, '0') + ':00'}>
            {new Date(0, 0, 0, hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(0, 0, 0, hour + 1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </option>
        ))}
      </select>

      <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Find My Match'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <p>{result}</p>
          <p className="mt-4 text-sm text-gray-400">Powered by AstroMatchAI</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </main>
  );
}
