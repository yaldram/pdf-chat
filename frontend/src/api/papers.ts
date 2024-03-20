import { apiEndpoints } from '../lib/apiConfig';
import { Paper } from '../types';

export async function fetchPapers(collectionId: string) {
  const response = await fetch(apiEndpoints.papers(collectionId), {
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const { data } = await response.json();

  return data as Paper[];
}

export async function fetchPaper(paperId: string) {
  const response = await fetch(apiEndpoints.paperById(paperId), {
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const { data } = await response.json();

  return data as Paper;
}

export async function createPaper(
  newPaper: Pick<
    Paper,
    'title' | 'author' | 'tags' | 'fileUrl' | 'collectionId'
  >,
) {
  const response = await fetch('http://localhost:8000/papers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(newPaper),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const { data } = await response.json();

  return data as Paper;
}

export async function getSignedUrl(fileInfo: {
  filename: string;
  contentType: string;
}) {
  const response = await fetch('http://localhost:8000/papers/signed-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(fileInfo),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  const { data } = await response.json();

  return data as string;
}

export async function uploadPaper({
  signedUrl,
  file,
}: {
  signedUrl: string;
  file: File;
}) {
  try {
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-type': file.type,
      },
      body: file,
    });
  } catch (error) {
    console.log('Error Uploading file to S3', error);
  }
}
