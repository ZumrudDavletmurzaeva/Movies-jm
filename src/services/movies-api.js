export default class MoviesService {
  constructor() {
    this.apiBase = 'https://api.themoviedb.org/3';
    this.apiKey= '848f19ec462c9603da0ef77885fff95f';


    this.requestOptions = (type, data)  => {
      const obj = {
        method: type
      }
      if (data) 
       {obj.body = data}
  
      return obj;
    }

    this.getResource = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
        // eslint-disable-next-line no-useless-concat
        throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
      }
      return res.json();
    };

    this.searchMovies = async (query, page) => {
      const searchUrl = `${this.apiBase}${'/search/movie'}`;
      const fullUrl = `${searchUrl}?query=${query}&api_key=${this.apiKey}&page=${page}`

      return this.getResource(fullUrl);
    };

    this.allGenres = async () => {
      const genresUrl = `${this.apiBase}/genre/movie/list`;
      const fullUrl = `${genresUrl}?&api_key=${this.apiKey}`;

      return this.getResource(fullUrl);
    };


      
   this.getListOfPopularMovies = async (page) => {
    const genresUrl = `${this.apiBase}/movie/popular`;
  const fullUrl = `${genresUrl}?&api_key=${this.apiKey}&page=${page}`;

  return this.getResource(fullUrl);
}

    this.createGuestSession = async () => {
      const guestSessionUrl = `${this.apiBase}/authentication/guest_session/new`;
      const fullUrl = `${guestSessionUrl}?&api_key=${this.apiKey}`;

      let response;
      try {
        response = await this.getResource(fullUrl);
        if (!response.success) {
          throw new Error('No guest sessions today!');
          
        }
      } catch (error) {
        console.log(error);
        return null;
        
      }

      const guestSessionId = await response.guest_session_id;

      return guestSessionId;
    };


    this.guestSessionId = null;



    this.rate = async (value, id) => {
      const rateUrl = `${this.apiBase}/movie/${id}/rating`;
      if (this.guestSessionId === null) {
        this.guestSessionId = await this.createGuestSession();
      }
      const fullUrl = `${rateUrl}?&api_key=${this.apiKey}&guest_session_id=${this.guestSessionId}`;

      const rating = { value };

      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(rating),
      };
     

      let response;
      try {
        response = await fetch(fullUrl,fetchOptions);
        if (!response.ok) {
          throw new Error(`Tell me to fix this bug!`);
        }

        this.getRatedMovies();

      } catch (error) {
        return error;
      }

      return null;
    };

    this.getRatedMovies = async () => {
      if (this.guestSessionId === null) {
        this.guestSessionId = await this.createGuestSession();
      }

      const getRatingUrl = `${this.apiBase}/guest_session/${this.guestSessionId}/rated/movies`;
      const fullUrl = `${getRatingUrl}?&api_key=${this.apiKey}`;

      return this.getResource(fullUrl);
    };
  }
}
