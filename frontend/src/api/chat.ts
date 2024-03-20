export async function getChatResponse(
  endpoint: string,
  payload: {
    conversationId: string;
    resourceId?: string[];
    userQuery: string;
  },
) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Network response was not ok');

  return response.text();
}
