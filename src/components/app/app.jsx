import React, { Component } from 'react';
import { Tabs, Pagination, Spin, Input } from 'antd';

import '../../../node_modules/antd/dist/antd.css';
import './app.css';
import { debounce } from 'lodash';
import MovieList from '../movie-list/movie-list';
import Alert from '../alert';
import MoviesService from '../../services/movies-api';
import { MoviesServiceProvider } from '../movies-service-context';

export default class App extends Component {
  state = {
    searchString: '',
    movies: [],
    currentPage: 1,
    totalResults: 0,
    loading: false,
    error: false,
    ratedMovies: [],
    ratingResults: 0,
    ratedMoviesPage: 1,
  };
  
  moviesService = new MoviesService();

  componentDidMount = async () => {
    this.moviesService = new MoviesService();
    this.debounced = debounce(this.search, 600);
    const allMovie = await this.moviesService.allGenres();
    this.allMovieGenres = await allMovie.genres;
  };

  // eslint-disable-next-line no-unused-vars
  handleError = (error) => {
    const { searchString } = this.state;
    this.setState({
      searchString,
      currentPage: 1,
      movies: [],
      totalResults: 0,
      loading: false,
      error: true,
       ratedMovies: [],
      ratingResults: 0,
      ratedMoviesPage: 1,
    });
  };

  search = async (page = 1) => {
    const { searchString } = this.state;
    if (!searchString) {
      this.setState({
        searchString: '',
        currentPage: page,
        movies: [],
        totalResults: 0,
        loading: false,
        error: false,
      });
      return;
    }
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=848f19ec462c9603da0ef77885fff95f&query=${searchString}&page=${page}`)
      .then((data) => data.json())
      .then((data) => {
        this.setState({
          movies: [...data.results],
          totalResults: data.total_results,
          currentPage: page,
          loading: false,
          error: false,
        });
      })
      .catch(this.handleError);
  };

  stringChange = (event) => {
    if (!event) {
      return;
    }
    this.setState({
      currentPage: 1,
      searchString: event.currentTarget.value,
      totalResults: 0,
    });
    this.debounced();
  };

  makeRate = (value, id) => {
    
    this.moviesService.rate(value, id);
  };

  getRatedMovies = async (page = 1) => {
    const responseJson = await this.moviesService.getRatedMovies();
    try {
      const ratedMovies = await responseJson.results;
      const ratingResults = await responseJson.total_results;

      this.setState({
        ratedMovies,
        ratingResults,
        ratedMoviesPage: page,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  activekeyChange = (activeKey) => {
    if (activeKey === '2') {
      this.getRatedMovies();
    }
  };

  render() {
    const {
      error,
      loading,
      movies,
      searchString,
      currentPage,
      totalResults,
      ratedMovies,
      ratingResults,
      ratedMoviesPage,
    } = this.state;

    const { TabPane } = Tabs;

    const spinner = loading ? <Spin /> : null;
    const alert = error ? <Alert /> : null;
    const hasData = !(loading || error || movies === []);
    const didSearch = loading || error || movies !== [];
    const data = hasData && didSearch ? <MovieList doRating={this.makeRate} movies={movies} /> : null;
    const contentRated = <MovieList movies={ratedMovies} doRating={this.makeRate} />;

    return (
      <div className="app">
        <MoviesServiceProvider value={this.allMovieGenres}>
          <Tabs defaultActiveKey="1" className="center-layout" onChange={this.activekeyChange}>
            <TabPane tab="Search" key="1" className="center-layout">
              <Input
                placeholder="Type to search…"
                size="small"
                onChange={this.stringChange}
                value={searchString}
                className="search-bar"
              />
              {spinner}
              {alert}
              {data}
              <Pagination
                current={currentPage}
                pageSize={20}
                responsive
                onChange={this.search}
                total={totalResults}
                showSizeChanger={false}
              />
            </TabPane>

            <TabPane tab="Rated" key="2" className="center-layout">
              {contentRated}

              <Pagination
                current={ratedMoviesPage}
                pageSize={20}
                responsive
                onChange={this.getRatedMovies}
                total={ratingResults}
                showSizeChanger={false}
              />
            </TabPane>
          </Tabs>
        </MoviesServiceProvider>
      </div>
    );
  }
}
