const BASE_URL = 'https://timewellwasted-api.mercantec.tech/api/User';
const ACTIVITY_BASE_URL = 'https://timewellwasted-api.mercantec.tech/api/ActivityTask';

export async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}

export async function register(user: { email: string; password: string; username: string }) {
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

// ActivityTask functions
export async function createActivityTask(
  activityName: string,
  description: string,
  whenStarted: string,
  whenEnded: string,
  token: string
) {
  const response = await fetch(`${ACTIVITY_BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      activityName,
      description,
      whenStarted,
      whenEnded,
    }),
  });
  if (!response.ok) throw new Error('Failed to create activity');
  return await response.json();
}

export async function getTodayActivities(token: string) {
  const response = await fetch(`${ACTIVITY_BASE_URL}/today`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch today activities');
  return await response.json();
}


// Update an activity task by id
export async function updateActivityTask(
  id: number,
  activityTask: {
    activityId: number;
    activityName: string;
    description: string;
    whenStarted: string;
    whenEnded: string;
  },
  token: string
) {
  const response = await fetch(`${ACTIVITY_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(activityTask),
  });
  if (!response.ok) throw new Error('Failed to update activity');
  // No content expected
}

// Add similar functions for updateUser and deleteUser as needed.

export const updateUser = async (token: string, updatedUser: any) => {
  try {
    const response = await fetch(`${BASE_URL}/update user`,{
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Update failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const deleteUser = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete user`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to delete');
    }
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};