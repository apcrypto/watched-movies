import React, { useState } from 'react';
import { useGetMovies } from './hooks/useGetMovies.ts';
import { useLocalStorageState } from './hooks/useLocalStorageState.ts';
import { Loader } from './components/Loader.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { NavBar } from './components/NavBar.tsx';
import { NumResults } from './components/NumResults.tsx';
import { Logo } from './components/Logo.tsx';
import { Search } from './components/Search.tsx';
import { Main } from './components/Main.tsx';
import { Box } from './components/Box.tsx';
import { MovieList } from './components/MovieList.tsx';
import { MovieDetails } from './components/MovieDetails.tsx';
import { WatchedSummary } from './components/WatchedSummary.tsx';
import { WatchedMovieList } from './components/WatchedMovieList.tsx';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = process.env.REACT_APP_PUBLIC_API_KEY;

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useGetMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== id)
    );
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
