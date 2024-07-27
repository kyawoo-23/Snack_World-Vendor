import { LOCAL_STORAGE } from "@/utils/constants/local-storage.type";

export const setLocalStorage = (key: LOCAL_STORAGE, value: string) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key: LOCAL_STORAGE) => {
  return localStorage.getItem(key);
};

export const removeLocalStorage = (key: LOCAL_STORAGE) => {
  localStorage.removeItem(key);
};
