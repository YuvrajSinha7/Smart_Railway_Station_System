import { describe, it, expect } from 'vitest';
import { calculateBestRoutes } from './DecisionEngine';

describe('Decision Engine: Route Optimization', () => {
  const mockZones = {
    'Hall A': { id: 'Hall A', density: 20, type: 'hall' },
    'Hall B': { id: 'Hall B', density: 80, type: 'hall' },
    'Platform 1': { id: 'Platform 1', density: 30, type: 'platform' },
    'Platform 2': { id: 'Platform 2', density: 10, type: 'platform' },
    'Ticket Counter': { id: 'Ticket Counter', density: 40, type: 'counter' },
    'Main Entrance': { id: 'Main Entrance', density: 50, type: 'entrance' }
  };

  it('Calculates the fastest route correctly between known nodes', () => {
    const results = calculateBestRoutes('Main Entrance', 'Platform 1', 'Normal', mockZones, false);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].path[0].name).toBe('Main Entrance');
    expect(results[0].path[results[0].path.length - 1].name).toBe('Platform 1');
  });

  it('Prioritizes comfort (low density) when profile is "Elderly"', () => {
    const results = calculateBestRoutes('Main Entrance', 'Platform 2', 'Elderly', mockZones, false);
    expect(results[0].maxDensity).toBeLessThan(80);
  });

  it('Redirects to nearest exit during evacuation mode', () => {
    const results = calculateBestRoutes('Platform 1', 'Hall A', 'Normal', mockZones, true);
    // In evacuation, the last node in the path should be 'Nearest Exit'
    const lastNode = results[0].path[results[0].path.length - 1];
    expect(lastNode.name).toBe('Nearest Exit');
  });
});
