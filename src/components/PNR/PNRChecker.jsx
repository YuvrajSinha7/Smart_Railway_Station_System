import React, { useState } from 'react';
import { RailAPI } from '../../services/railApi';
import { Ticket, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function PNRChecker() {
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrData, setPnrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckPNR = async () => {
    if (!pnrNumber.trim()) {
      setError('Please enter a PNR number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await RailAPI.checkPNR(pnrNumber);
      if (result.status) {
        setPnrData(result.data);
      } else {
        setError('Invalid PNR or no booking found');
      }
    } catch (err) {
      setError('Failed to check PNR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-primary" /> PNR Status Check
      </h2>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleCheckPNR()}
            placeholder="Enter 10-digit PNR"
            maxLength="10"
            className="flex-1 bg-surface border border-white/10 rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleCheckPNR}
            disabled={loading}
            className="bg-primary hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Checking...
              </>
            ) : (
              'Check'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-danger/20 border border-danger/50 text-danger px-3 py-2 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {pnrData && (
          <div className="bg-success/10 border border-safe/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-safe font-semibold mb-2">
              <CheckCircle className="w-4 h-4" />
              Booking Confirmed
            </div>
            <div className="text-xs space-y-1 text-gray-300">
              <p>
                <strong>PNR:</strong> {pnrData.pnr}
              </p>
              <p>
                <strong>Train:</strong> {pnrData.train_name} ({pnrData.train_no})
              </p>
              <p>
                <strong>From:</strong> {pnrData.boarding_station.name} ({pnrData.boarding_station.code})
              </p>
              <p>
                <strong>To:</strong> {pnrData.reservation_upto.name} ({pnrData.reservation_upto.code})
              </p>
              <p>
                <strong>Seat:</strong> {pnrData.passenger_info[0]?.seat_number}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="text-safe font-semibold">
                  {pnrData.passenger_info[0]?.current_status === 'CNF'
                    ? 'Confirmed'
                    : 'Waiting List'}
                </span>
              </p>
              {pnrData.chart_prepared && (
                <p className="text-safe">✓ Chart has been prepared</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
