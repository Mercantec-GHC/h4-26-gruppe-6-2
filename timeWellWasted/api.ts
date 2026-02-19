const BASE_URL = 'http://localhost:5197/api/User';
const ACTIVITY_BASE_URL = 'http://localhost:5197/api/ActivityTask';

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

export async function getLast7DaysActivities(token: string) {
  const response = await fetch(`${ACTIVITY_BASE_URL}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch activities');

  const activities = await response.json();

  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  return activities
    .filter((activity: { whenStarted: string }) => {
      const started = new Date(activity.whenStarted);
      return started >= startDate && started <= now;
    })
    .sort(
      (a: { whenStarted: string }, b: { whenStarted: string }) =>
        new Date(b.whenStarted).getTime() - new Date(a.whenStarted).getTime()
    );
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