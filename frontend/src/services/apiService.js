const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const register = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email,
        password,
        password_confirmation: password,
      },
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    const token = response.headers.get('Authorization');
    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }
  }
  
  return { success: response.ok, data };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    const token = response.headers.get('Authorization');
    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }
  }
  
  return { success: response.ok, data };
};

export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  } finally {
    setAuthToken(null);
  }
};

export const processDocument = async (content, language) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/documents/process`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      content,
      language,
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.errors || 'Failed to process document');
  }
  
  return data;
};

export const getDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/documents`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  
  return data;
};

export const getDocument = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }
  
  return data;
};
