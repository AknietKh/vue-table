function getInfo(storageKey) {
  try {
    const info = localStorage.getItem(storageKey);
    return info ? JSON.parse(info) : null;
  } catch (e) {
    console.error('storage connect get info error: ', e);
    return null;
  }
}

function setInfo(storageKey, payload) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('storage connect set info error: ', e);
    return false;
  }
}

function removeInfo(storageKey) {
  localStorage.removeItem(storageKey);
  return true;
}

export default {
  setInfo,
  getInfo,
  removeInfo,
};
