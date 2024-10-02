import React, { useState, useRef, useEffect } from 'react';
import { useKey } from '../hooks/useKey.ts';
import { Loader } from './Loader.tsx';
import { StarRating } from './StarRating.tsx';
import { Movie } from '../types/Movie.ts';
import { WatchedMovie } from '../types/WatchedMovie.ts';

const KEY = process.env.REACT_APP_PUBLIC_API_KEY;

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState<Partial<Movie>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<string>('');

  const countRef = useRef<number>(0);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  const isWatched = watched.find((movie) => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      title: title || '',
      year: year || '',
      poster: poster || '',
      imdbRating: Number(imdbRating),
      runtime: Number(runtime?.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data: Movie = await res.json();
      setMovie(data);
      setIsLoading(false);
    };
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = 'usePopcorn';
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
