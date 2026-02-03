const BASE_URL = 'http://localhost:5197/api/User';

export async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordHash: password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}

export async function register(user: { email: string; passwordHash: string; username: string }) {
  const response = await fetch(`${BASE_URL}/create user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
}

export async function getAllUsers(token: string) {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
}

// Add similar functions for updateUser and deleteUser as needed.