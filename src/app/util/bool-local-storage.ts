export function setLocalStorageBoolean(key: string, value: boolean): void {
  if (value) {
    localStorage.setItem(key, '1');
  } else {
    localStorage.removeItem(key);
  }
}

export function getLocalStorageBoolean(key: string): boolean {
  return localStorage.getItem(key) === '1';
}
