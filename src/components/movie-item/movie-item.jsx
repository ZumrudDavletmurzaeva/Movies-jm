import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Rate } from 'antd';
import { format } from 'date-fns';
import MoviesService from '../../services/movies-api';
import './movie-item.css';
import { MoviesServiceConsumer } from '../movies-service-context';


export default class MovieItem extends Component {

  constructor(props) {
    super(props);
  this.state = {
    rating: props.rating
  };

  this.moviesService = new MoviesService();

  this.setColor = (value) => {
    if (value < 3) return '#E90000';
    if (value < 5) return '#E97E00';
    if (value < 7) return '#E9D100';
    return '#66E900';
  };

  this.getGenreNames = (genre, allMovieGenres) => genre.map((id) => allMovieGenres.map((genr) => {
        if (genr.id === id) {
          return (
            <span key={genr.id} className="genre-style">
              {' '}
              {genr.name}
            </span>
          );
        }
        return '';
      }))

  this.descriptionSmall = (description) => {
    const indexDescription = description.indexOf(' ', 150);
    return description.slice(0, indexDescription).concat('…');
  };

  this.componentDidUpdate = (prevProps) => {
    const { rating } = this.props;
  
    if (rating !== prevProps.rating) {
      this.setState({
        rating
      });
    }
  };


  }

  render() {
    const {date, movieId, image, name, rate, description, genre, doRating} = this.props;

    const { rating } = this.state;

    let dateFormatted;
    try {
      dateFormatted = format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      dateFormatted = '';
    }

    return (
      <MoviesServiceConsumer>
        {(allMovieGenres) => (
            <li className="movie-container" key={movieId}>
              <img alt="" className="movie-img" src={`https://image.tmdb.org/t/p/w200${image}`} />

              <div className="movie-desktop">
                <div className="movie-stats">
                  <div className="movie-header">
                    <h5 className="title">{name}</h5>
                    <span className="title_rate" style={{ border: `1px solid ${this.setColor(rate)}` }}>
                      {rate}
                    </span>
                  </div>

                  <p className="movie-date">{dateFormatted}</p>

                  <div className="movie-genres">{this.getGenreNames(genre, allMovieGenres)}</div>
                </div>

                <div className="movie-footer movie-stats">
                  <p className="movie-description">{this.descriptionSmall(description)}</p>
                  <Rate
                    count={10}
                    allowHalf
                    className="movie-rate"
                    defaultValue={rating}
                    onChange={(value) => 
                      doRating(value, movieId)
                    }
                  />
                </div>
              </div>
            </li>
          )}
      </MoviesServiceConsumer>
    );
  }
}

MovieItem.defaultProps = {
  rating: 0,
};


MovieItem.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  movieId: PropTypes.number.isRequired,
  rating: PropTypes.number,
  rate: PropTypes.number.isRequired,
  genre: PropTypes.arrayOf(PropTypes.number).isRequired,
  doRating: PropTypes.func.isRequired,
};