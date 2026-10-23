const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('motivo_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('motivo_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('motivo_token');
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
