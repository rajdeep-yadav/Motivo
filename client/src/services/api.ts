const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('motivo_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('motivo_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('motivo_token');
};

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
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
