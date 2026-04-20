const MOCK_DELAY = 800; // Mock network delay

// Abstract API wrapper for Indian Railways (RapidAPI layout)
export const RailAPI = {
  
  /**
   * PNR Status Check
   */
  async checkPNR(pnr) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // If API Key exists in env, we'd normally route it here:
        // const response = await fetch(`https://indianrailapi.p.rapidapi.com/v1/pnr/${pnr}`, { headers: ... })
        // return response.json();
        
        // Mock fallback returning realistic JSON schema
        resolve({
          status: true,
          message: "Success",
          data: {
            pnr: pnr,
            train_no: "12313",
            train_name: "RAJDHANI EXP",
            boarding_station: { name: "DHANBAD JN", code: "DHN" },
            reservation_upto: { name: "NEW DELHI", code: "NDLS" },
            passenger_info: [
              { seat_number: "B5, 42", current_status: "CNF" }
            ],
            chart_prepared: true
          }
        });
      }, MOCK_DELAY);
    });
  },

  /**
   * Live Train Status
   */
  async getLiveTrainStatus(trainNo) {
    const apiKey = import.meta.env.VITE_INDIANRAIL_API_KEY;
    if (apiKey && apiKey !== '<apikey>') {
      try {
        const today = new Date();
        const yyyymmdd = today.toISOString().split('T')[0].replace(/-/g, '');
        const url = `https://indianrailapi.com/api/v2/livetrainstatus/apikey/${apiKey}/trainnumber/${trainNo}/date/${yyyymmdd}/`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return {
          status: true,
          data: {
            train_no: trainNo,
            current_station: { code: data.CurrentStation?.StationCode || "ASN", name: data.CurrentStation?.StationName || "ASANSOL JN" },
            delay_in_minutes: data.DelayInMinutes || 0,
            is_arrived: data.IsArrived || false,
            status: data.StatusAsOf || "Running late. Expected shortly."
          }
        };
      } catch (error) {
        console.error("IndianRail API Error:", error);
      }
    }
    
    // Fallback Mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          data: {
            train_no: trainNo || "12313",
            current_station: { code: "ASN", name: "ASANSOL JN" },
            delay_in_minutes: Math.floor(Math.random() * 45), // Random mock delay
            is_arrived: true,
            status: "Running late. Expected at DHN shortly."
          }
        });
      }, MOCK_DELAY);
    });
  },

  /**
   * Station Search (Auto Complete)
   */
  async searchStation(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          data: [
            { code: "DHN", name: "DHANBAD JN" },
            { code: "NDLS", name: "NEW DELHI" },
            { code: "HWH", name: "HOWRAH JN" }
          ].filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase()))
        });
      }, MOCK_DELAY);
    });
  },

  /**
   * Live Station (All Trains on Station)
   */
  async getLiveStation(stationCode = "DHN", hours = 2) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          data: {
            station: stationCode,
            trains: [
              { train_no: "12313", name: "RAJDHANI EXP", expected_arrival: "14:30", platform: "1" },
              { train_no: "13301", name: "SUVARNAREKHA EXP", expected_arrival: "15:00", platform: "2" },
              { train_no: "12381", name: "POORVA EXPRESS", expected_arrival: "15:45", platform: "3" }
            ]
          }
        });
      }, MOCK_DELAY);
    });
  }
};
