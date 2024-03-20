export function getBulletPoints(inputString: string) {
  return inputString.split('-').filter((point) => point.trim() !== '');
}

export function getUniqueId(conversationId: string) {
  const randomString = Math.random().toString(36).substring(2, 7);
  return `${conversationId}-${randomString}`;
}

// local storage util functions
export function getLocalStorageItem(key: string) {
  const item = localStorage.getItem(key);
  return item;
}

export function getLocalStorageJson(key: string) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setLocalStorageItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function setLocalStorageJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function deleteLocalStorageItem(key: string) {
  localStorage.removeItem(key);
}
