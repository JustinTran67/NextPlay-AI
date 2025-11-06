// Get the API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// PLAYER ENDPOINTS

export const getPlayers = async (searchQuery = '') => {
  const url = searchQuery 
    ? `${API_URL}/api/players/?search=${searchQuery}`
    : `${API_URL}/api/players/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
};

export const getPlayer = async (playerId) => {
  const response = await fetch(`${API_URL}/api/players/${playerId}/`);
  if (!response.ok) throw new Error('Failed to fetch player');
  return response.json();
};

// SEASON STATS ENDPOINTS

export const getSeasonStats = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.season) queryParams.append('season', params.season);
  if (params.search) queryParams.append('search', params.search);
  if (params.ordering) queryParams.append('ordering', params.ordering);
  
  const url = queryParams.toString() 
    ? `${API_URL}/api/stats/?${queryParams.toString()}`
    : `${API_URL}/api/stats/`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch season stats');
  return response.json();
};

// GAME STATS ENDPOINTS

export const getGameStats = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.ordering) queryParams.append('ordering', params.ordering);
  
  const url = queryParams.toString()
    ? `${API_URL}/api/game-stats/?${queryParams.toString()}`
    : `${API_URL}/api/game-stats/`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch game stats');
  return response.json();
};

// PREDICTION ENDPOINTS (Basic Model)

/**
 * Make a prediction using basic model
 * @param {Object} data - Prediction input data
 * @param {number} data.minutes - Minutes played
 * @param {number} data.fg_percent - Field goal percentage
 * @param {number} data.threep_percent - Three point percentage
 * @param {number} data.ft_percent - Free throw percentage
 * @param {number} data.rebounds - Total rebounds
 * @param {number} data.assists - Assists
 * @param {number} data.steals - Steals
 * @param {number} data.blocks - Blocks
 * @param {number} data.turnovers - Turnovers
 * @param {number} data.personal_fouls - Personal fouls
 * @returns {Promise<{predicted_points: number}>}
 */
export const makePrediction = async (data) => {
  const response = await fetch(`${API_URL}/api/predictions/predict/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to make prediction');
  }
  
  return response.json();
};

// PLAYER PREDICTION ENDPOINTS (Advanced Model)

/**
 * Make a player prediction using advanced multi-output model
 * @param {Object} data - Player prediction input
 * @param {string} data.player - Player name (case-insensitive)
 * @param {string} data.opponent - Opponent team name
 * @param {number} [data.home=1] - Home game (1) or away (0)
 * @param {string} [data.game_date] - Optional game date (YYYY-MM-DD format)
 * @returns {Promise<{player: string, opponent: string, predictions: Object}>}
 */
export const makePlayerPrediction = async (data) => {
  const response = await fetch(`${API_URL}/api/player-predictions/predict/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to make player prediction');
  }
  
  return response.json();
};

// HELPER FUNCTIONS

/**
 * Search players by name, team, or position
 */
export const searchPlayers = async (query) => {
  return getPlayers(query);
};

/**
 * Get season stats for a specific season
 */
export const getSeasonStatsBySeason = async (season) => {
  return getSeasonStats({ season });
};

/**
 * Get season stats sorted by a specific stat
 * @param {string} stat - Stat to sort by (e.g., 'points', '-points', 'rebounds')
 */
export const getSeasonStatsSorted = async (stat) => {
  return getSeasonStats({ ordering: stat });
};

/**
 * Search game stats by player name, team, opponent, or date
 */
export const searchGameStats = async (query) => {
  return getGameStats({ search: query });
};

/**
 * Get game stats sorted by a specific stat
 * @param {string} stat - Stat to sort by (e.g., 'points', '-points', 'rebounds')
 */
export const getGameStatsSorted = async (stat) => {
  return getGameStats({ ordering: stat });
};