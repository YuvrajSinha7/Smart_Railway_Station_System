import React, { useState, useEffect } from 'react';
import { RailAPI } from '../../services/railApi';
import { Users, Clock, Zap, AlertCircle, Train } from 'lucide-react';

export default function TrainSchedule() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainSchedule();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchTrainSchedule, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrainSchedule = async () => {
    setLoading(true);
    try {
      const result = await RailAPI.getLiveStation('DHN', 2);
      if (result.status && result.data.trains) {
        let fetched = result.data.trains;
        // Ensure at least 7 train entries (one per platform)
        if (fetched.length < 7) {
          const mock = generateMockTrains(7 - fetched.length);
          fetched = fetched.concat(mock);
        }
        setTrains(fetched);
        setError('');
      }
    } catch (err) {
      setError('Unable to fetch train schedule');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock train data to ensure 7 platforms are represented
  function generateMockTrains(missingCount) {
    const mockTrains = [];
    const baseTime = new Date();
    for (let i = 0; i < missingCount; i++) {
      const platformNum = i + 4; // platforms 4-7
      const arrival = new Date(baseTime.getTime() + (i + 1) * 600000); // +10min increments
      const hh = String(arrival.getHours()).padStart(2, '0');
      const mm = String(arrival.getMinutes()).padStart(2, '0');
      mockTrains.push({
        name: `Mock Express ${platformNum}`,
        train_no: 9000 + platformNum,
        expected_arrival: `${hh}:${mm}`,
        platform: platformNum,
        status: 'On Time'
      });
    }
    return mockTrains;
  }

  return (
    <div className="glass-panel p-5 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Train className="w-5 h-5 text-primary train-anim" /> Live Train Schedule
        </h2>
        <button
          onClick={fetchTrainSchedule}
          disabled={loading}
          className="text-xs bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-danger/20 border border-danger/50 text-danger px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {trains.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-sm">
          {loading ? 'Loading schedules...' : 'No trains scheduled'}
        </div>
      ) : (
        <div className="space-y-2">
          {trains.map((train) => (
            <div
              key={train.train_no}
              className="border border-white/5 rounded-lg p-3 hover:bg-surface/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-white">{train.name}</p>
                  <p className="text-xs text-gray-400">Train #{train.train_no}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-yellow-400 font-semibold">
                    <Clock className="w-4 h-4" />
                    {train.expected_arrival}
                  </div>
                  <p className="text-xs text-gray-400">Platform {train.platform}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <div className="flex-1 bg-surface rounded p-2">
                  <p className="text-xs text-gray-400">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Fast • Air-Conditioned
                  </p>
                </div>
                <button className="text-xs bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded transition-colors text-primary font-semibold">
                  Check Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400 text-center border-t border-white/5 pt-3">
        Live data for Dhanbad Junction Station (DHN)
      </div>
    </div>
  );
}
