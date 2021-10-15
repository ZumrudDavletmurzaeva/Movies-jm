/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from "prop-types";
import MovieItem from '../movie-item';
import './movie-list.css';

const MovieList = ({ movies, doRating }) => {
  const elements = movies.map((movie) => {
    return (
      <MovieItem
        key={movie.id}
        image={movie.poster_path}
        movieId={movie.id}
        doRating={doRating}
        rating={movie.rating}
        name={movie.title}
        description={movie.overview}
        date={movie.release_date}
        rate={movie.vote_average}
        genre={movie.genre_ids}
      />
    );
  });

  return (
    <div>
      <ul className="movie-list">{elements}</ul>
    </div>
  );
};


MovieList.defaultProps = {
  movies: [],
};

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object),
  doRating: PropTypes.func.isRequired,
};

export default MovieList;
