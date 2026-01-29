const API_BASE_URL = 'http://localhost:8000/api';

// Utility: convert snake_case keys to camelCase recursively
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

function convertKeysToCamel(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const camelKey = snakeToCamel(key);
      newObj[camelKey] = convertKeysToCamel(obj[key]);
    });
    return newObj;
  }
  return obj;
}

export const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log(`API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
      }

      // Some endpoints return empty body
      const text = await response.text();
      if (!text) return null;

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      // Normalize keys to camelCase for frontend convenience
      try {
        return convertKeysToCamel(data);
      } catch (err) {
        return data;
      }
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
