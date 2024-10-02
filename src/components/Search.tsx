import React, { useRef } from 'react';
import { useKey } from '../hooks/useKey.ts';

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ query, setQuery }) => {
  const inputElement = useRef<HTMLInputElement>(null);

  useKey('Enter', () => {
    inputElement.current?.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
};
