import { apiEndpoints } from '../lib/apiConfig';
import { Collection } from '../types';

export async function fetchCollections() {
  const response = await fetch(apiEndpoints.collections, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const { data } = await response.json();

  return data as Collection[];
}

export async function createCollection(
  collection: Omit<Collection, '_id' | 'paperIds'>,
) {
  const response = await fetch(apiEndpoints.collections, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(collection),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const { data } = await response.json();

  return data as Collection;
}

export async function fetchCollection(collectionId: string) {
  const response = await fetch(apiEndpoints.collectionById(collectionId), {
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const { data } = await response.json();

  return data as Collection;
}
