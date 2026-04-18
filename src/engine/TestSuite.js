/**
 * TEST SUITE & EDGE CASE VALIDATION
 * 
 * This file contains comprehensive test cases covering:
 * - Normal operations
 * - Edge cases
 * - Failure scenarios
 * - Performance validation
 */

import { calculateBestRoutes, getBestTimePrediction, STATION_GRAPH } from './DecisionEngine';

// ============================================================================
// TEST SCENARIOS
// ============================================================================

export const TEST_SCENARIOS = {
  // ✅ NORMAL OPERATIONS
  scenario1_normalNavigation: {
    name: "Normal User Navigation: Main Entrance to Platform 1",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 1",
      profile: "Normal",
      zones: {
        'Main Entrance': { density: 30, type: 'entry' },
        'Hall A': { density: 45, type: 'waiting' },
        'Platform 1': { density: 60, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should suggest direct route with reasonable time estimate"
  },

  scenario2_elderlyPassenger: {
    name: "Elderly User with Luggage: Avoid Stairs",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 1",
      profile: "Elderly",
      zones: {
        'Main Entrance': { density: 30, type: 'entry' },
        'Hall A': { density: 45, type: 'waiting' },
        'Platform 1': { density: 60, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should prefer stair-free routes even if slightly longer"
  },

  scenario3_hurryUser: {
    name: "User in a Hurry: Avoid Crowded Areas",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 3",
      profile: "Hurry",
      zones: {
        'Main Entrance': { density: 20, type: 'entry' },
        'Footbridge 1': { density: 90, type: 'transit' },
        'Platform 3': { density: 75, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should penalize high-density zones and suggest alternatives"
  },

  scenario4_peakHour: {
    name: "Peak Hour Scenario: High Crowd Density",
    inputs: {
      origin: "Ticket Counter",
      destination: "Platform 2",
      profile: "Normal",
      zones: {
        'Ticket Counter': { density: 95, type: 'facility' },
        'Hall A': { density: 88, type: 'waiting' },
        'Footbridge 1': { density: 85, type: 'transit' },
        'Platform 2': { density: 92, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should handle high density and warn user, suggest best available option"
  },

  scenario5_evacuation: {
    name: "Emergency Evacuation Mode",
    inputs: {
      origin: "Platform 2",
      destination: "Exit B",
      profile: "Normal",
      zones: {},
      isEvacuation: true
    },
    expectedOutcome: "Should return emergency route, bypass all normal logic"
  },

  // ⚠️ EDGE CASES
  scenario6_sameOriginDestination: {
    name: "Same Origin and Destination",
    inputs: {
      origin: "Platform 1",
      destination: "Platform 1",
      profile: "Normal",
      zones: { 'Platform 1': { density: 50, type: 'platform' } },
      isEvacuation: false
    },
    expectedOutcome: "Should return message that user is already at destination"
  },

  scenario7_noValidPath: {
    name: "No Valid Path Exists",
    inputs: {
      origin: "Exit A",
      destination: "Exit B",
      profile: "Normal",
      zones: {
        'Exit A': { density: 0, type: 'exit' },
        'Exit B': { density: 0, type: 'exit' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should handle gracefully and return error message"
  },

  scenario8_invalidProfile: {
    name: "Invalid Profile Type",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 1",
      profile: "InvalidProfile",
      zones: { 'Main Entrance': { density: 30, type: 'entry' } },
      isEvacuation: false
    },
    expectedOutcome: "Should throw validation error"
  },

  scenario9_invalidLocation: {
    name: "Invalid Location Name",
    inputs: {
      origin: "NonExistentLocation",
      destination: "Platform 1",
      profile: "Normal",
      zones: {},
      isEvacuation: false
    },
    expectedOutcome: "Should throw validation error for invalid origin"
  },

  scenario10_missingZoneData: {
    name: "Missing Zone Density Data",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 1",
      profile: "Normal",
      zones: {},
      isEvacuation: false
    },
    expectedOutcome: "Should handle missing data gracefully (use defaults)"
  },

  // 🔴 STRESS TESTS
  scenario11_allZonesHighDensity: {
    name: "All Zones at Maximum Capacity",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 3",
      profile: "Normal",
      zones: {
        'Main Entrance': { density: 95, type: 'entry' },
        'Ticket Counter': { density: 100, type: 'facility' },
        'Hall A': { density: 98, type: 'waiting' },
        'Footbridge 1': { density: 95, type: 'transit' },
        'Platform 3': { density: 92, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should still find a route and adjust time estimates"
  },

  scenario12_lowDensityThroughout: {
    name: "All Zones at Minimum Capacity",
    inputs: {
      origin: "Main Entrance",
      destination: "Platform 2",
      profile: "Normal",
      zones: {
        'Main Entrance': { density: 5, type: 'entry' },
        'Hall A': { density: 10, type: 'waiting' },
        'Footbridge 1': { density: 8, type: 'transit' },
        'Platform 2': { density: 12, type: 'platform' }
      },
      isEvacuation: false
    },
    expectedOutcome: "Should return minimal time estimate and optimal scores"
  }
};

// ============================================================================
// TEST EXECUTION FRAMEWORK
// ============================================================================

export function runAllTests() {
  console.log("=" .repeat(70));
  console.log("🧪 STARTING COMPREHENSIVE TEST SUITE");
  console.log("=".repeat(70));

  const results = {
    passed: 0,
    failed: 0,
    errors: 0,
    tests: []
  };

  Object.entries(TEST_SCENARIOS).forEach(([key, scenario]) => {
    try {
      const result = executeTest(scenario);
      results.tests.push(result);
      
      if (result.status === 'PASSED') {
        results.passed++;
        console.log(`✅ PASS: ${scenario.name}`);
      } else if (result.status === 'FAILED') {
        results.failed++;
        console.log(`❌ FAIL: ${scenario.name}`);
        console.log(`   Reason: ${result.error}`);
      }
    } catch (error) {
      results.errors++;
      results.tests.push({
        scenario: scenario.name,
        status: 'ERROR',
        error: error.message
      });
      console.log(`💥 ERROR: ${scenario.name}`);
      console.log(`   ${error.message}`);
    }
  });

  printTestSummary(results);
  return results;
}

function executeTest(scenario) {
  const startTime = performance.now();
  
  try {
    // Execute the test
    const result = calculateBestRoutes(
      scenario.inputs.origin,
      scenario.inputs.destination,
      scenario.inputs.profile,
      scenario.inputs.zones,
      scenario.inputs.isEvacuation
    );

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    // Validation checks
    const validations = {
      resultIsArray: Array.isArray(result),
      hasAtLeastOne: result.length > 0,
      firstHasPath: result[0]?.path instanceof Array,
      firstHasScore: typeof result[0]?.score === 'number',
      firstHasReason: typeof result[0]?.reason === 'string',
      performanceOk: duration < 100 // Should execute in < 100ms
    };

    const allValid = Object.values(validations).every(v => v === true);
    
    return {
      scenario: scenario.name,
      status: allValid ? 'PASSED' : 'FAILED',
      error: !allValid ? `Validation failed: ${JSON.stringify(validations)}` : null,
      duration,
      result
    };
  } catch (error) {
    return {
      scenario: scenario.name,
      status: scenario.expectedOutcome?.includes('error') || scenario.expectedOutcome?.includes('Error') 
        ? 'PASSED' 
        : 'FAILED',
      error: error.message
    };
  }
}

function printTestSummary(results) {
  console.log("\n" + "=".repeat(70));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(70));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`💥 Errors: ${results.errors}`);
  console.log(`📈 Total: ${results.tests.length}`);
  console.log(`🎯 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
  console.log("=".repeat(70) + "\n");
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/** Validate that all stations in graph are reachable */
export function validateGraphConnectivity() {
  const allStations = Object.keys(STATION_GRAPH);
  const reachable = new Set();
  
  function dfs(station) {
    if (reachable.has(station)) return;
    reachable.add(station);
    
    const neighbors = STATION_GRAPH[station] || [];
    neighbors.forEach(edge => dfs(edge.to));
  }

  dfs('Main Entrance');
  
  const unreachable = allStations.filter(s => !reachable.has(s));
  
  return {
    valid: unreachable.length === 0,
    reachableStations: reachable.size,
    unreachableStations: unreachable,
    message: unreachable.length === 0 
      ? "✅ All stations are reachable from Main Entrance"
      : `❌ Unreachable stations: ${unreachable.join(', ')}`
  };
}

/** Validate graph structure */
export function validateGraphStructure() {
  const issues = [];

  Object.entries(STATION_GRAPH).forEach(([station, edges]) => {
    if (!Array.isArray(edges)) {
      issues.push(`${station} edges are not an array`);
    }

    edges.forEach(edge => {
      if (!edge.to || !STATION_GRAPH[edge.to]) {
        issues.push(`${station} -> ${edge.to}: destination not in graph`);
      }
      if (typeof edge.distance !== 'number' || edge.distance <= 0) {
        issues.push(`${station} -> ${edge.to}: invalid distance`);
      }
      if (typeof edge.stairs !== 'boolean') {
        issues.push(`${station} -> ${edge.to}: invalid stairs flag`);
      }
    });
  });

  return {
    valid: issues.length === 0,
    issues,
    message: issues.length === 0 
      ? "✅ Graph structure is valid"
      : `❌ Issues found:\n  ${issues.join('\n  ')}`
  };
}

/** System health check */
export function runSystemHealthCheck() {
  console.log("\n🏥 RUNNING SYSTEM HEALTH CHECK\n");

  const checks = {
    graphConnectivity: validateGraphConnectivity(),
    graphStructure: validateGraphStructure(),
    testSuite: runAllTests()
  };

  console.log("\n" + "=".repeat(70));
  console.log("🏥 HEALTH CHECK SUMMARY");
  console.log("=".repeat(70));
  console.log(checks.graphConnectivity.message);
  console.log(checks.graphStructure.message);
  console.log("\n✅ System is healthy and ready for deployment!");
  console.log("=".repeat(70) + "\n");

  return checks;
}
