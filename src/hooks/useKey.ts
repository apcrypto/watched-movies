import { useEffect } from 'react';

export const useKey = (key, action) => {
  useEffect(() => {
    const callBack = (e) => {
      if (e.code === key) action();
    };

    document.addEventListener('keydown', callBack);

    return () => document.removeEventListener('keydown', callBack);
  }, [action, key]);
};
