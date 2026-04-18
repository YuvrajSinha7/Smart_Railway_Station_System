import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../../store/AppContext';
import { TrendingUp, Users } from 'lucide-react';

function DensityAnalytics() {
  const { simulation } = useAppContext();
  // Convert zones to chart data (Memoized)
  const analyticsData = useMemo(() => {
    return Object.values(simulation.zones).map(zone => ({
      name: zone.id,
      density: zone.density,
      type: zone.type
    }));
  }, [simulation.zones]);

  // Calculate type distribution (Memoized)
  const typeDistribution = useMemo(() => {
    const distribution = {};
    Object.values(simulation.zones).forEach(zone => {
      distribution[zone.type] = (distribution[zone.type] || 0) + zone.density;
    });

    return Object.entries(distribution).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: Math.round(value)
    }));
  }, [simulation.zones]);

  const COLORS = ['#3b82f6', '#ef4444', '#eab308', '#22c55e', '#8b5cf6'];

  const avgDensity = analyticsData.length
    ? Math.round(analyticsData.reduce((acc, zone) => acc + zone.density, 0) / analyticsData.length)
    : 0;

  const maxDensity = analyticsData.length
    ? Math.max(...analyticsData.map(z => z.density))
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Avg Density</p>
            <p className="text-2xl font-bold text-primary">{avgDensity}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-primary opacity-20" />
        </div>
        <div className="glass-panel p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Peak Density</p>
            <p className="text-2xl font-bold text-danger">{maxDensity}%</p>
          </div>
          <Users className="w-8 h-8 text-danger opacity-20" />
        </div>
        <div className="glass-panel p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Active Zones</p>
            <p className="text-2xl font-bold text-warning">{analyticsData.length}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-warning opacity-20" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-panel p-5 rounded-lg">
          <h3 className="text-sm font-bold mb-4">Zone Density Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="density" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel p-5 rounded-lg">
          <h3 className="text-sm font-bold mb-4">Density by Zone Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone List Table */}
      <div className="glass-panel p-5 rounded-lg">
        <h3 className="text-sm font-bold mb-4">Live Zone Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2 font-semibold">Zone</th>
                <th className="text-left py-2 px-2 font-semibold">Type</th>
                <th className="text-right py-2 px-2 font-semibold">Density</th>
                <th className="text-right py-2 px-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((zone) => (
                <tr key={zone.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-2">{zone.name}</td>
                  <td className="py-2 px-2 text-gray-400">{zone.type}</td>
                  <td className="py-2 px-2 text-right font-semibold">{zone.density}%</td>
                  <td className="py-2 px-2 text-right">
                    {zone.density < 40 && <span className="text-safe">✓ Clear</span>}
                    {zone.density >= 40 && zone.density < 75 && <span className="text-warning">◆ Busy</span>}
                    {zone.density >= 75 && <span className="text-danger">⚠ Congested</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
export default React.memo(DensityAnalytics);
