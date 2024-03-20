const apiUrl = 'http://localhost:8000';

export const apiEndpoints = {
  collections: `${apiUrl}/collections`,
  collectionById: (collectionId: string) =>
    `${apiUrl}/collections/${collectionId}`,

  papers: (collectionId: string) => `${apiUrl}/papers/${collectionId}`,
  paperById: (paperId: string) => `${apiUrl}/papers/paper/${paperId}`,

  register: `${apiUrl}/auth/register`,
  login: `${apiUrl}/auth/login`,
  logout: `${apiUrl}/auth/logout`,
  authenticate: `${apiUrl}/auth/authenticate`,

  collectionChat: `${apiUrl}/chats/collection`,
  paperChat: `${apiUrl}/chats/paper`,
  knowledgeBaseChat: `${apiUrl}/chats/knowledge-base`,
};
