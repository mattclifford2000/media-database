const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5055';

export async function fetchMediaItems(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.type) query.append('type', filters.type);
  if (filters.status) query.append('status', filters.status);

  const url = `${API_BASE_URL}/api/media${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media items: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function createMediaItem(item) {
  const response = await fetch(`${API_BASE_URL}/api/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to create media item: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function updateMediaItem(id, item) {
  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(`Failed to update media item: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function deleteMediaItem(id) {
  const response = await fetch(`${API_BASE_URL}/api/media/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete media item: ${response.status} ${response.statusText}`);
  }

  return true;
}
