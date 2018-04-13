import React from 'react';
import './Main.css'
import BasicAutocomplete from '../basic-autocomplete/BasicAutocomplete'
import { DEFAULT_MOVIE_ID, MOVIE_API_URL, API_KEY_PARAM, NO_IMAGE_URL } from '../Constant'
class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      movie: {
        title: '',
        tagLine: '',
        image: '',
        overview: '',
        releaseDate: '',
        runTime: '',
        revenue: '',
        voteAverage: '',
      }
    }
    this.openMovie(DEFAULT_MOVIE_ID);
    this.goToHomePage = this.goToHomePage.bind(this);
  }

  openMovie(id) {
    if(id !== undefined && id !== '') {
      fetch(MOVIE_API_URL+id+"?&"+API_KEY_PARAM)
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        let image = NO_IMAGE_URL;
        if(response.poster_path !== undefined && response.poster_path !== null) {
          image = 'https://image.tmdb.org/t/p/w500'+response.poster_path;
        }
        if(response.backdrop_path !== undefined && response.backdrop_path !== null) {
          let backgroundImage = 'url(https://image.tmdb.org/t/p/w500'+response.backdrop_path+')';
          document.body.style.backgroundImage = backgroundImage;
          document.body.style.backgroundSize = 'cover';
        }
        let revenue = '';
        if(response.revenue !== undefined && response.revenue !== null) {
          revenue = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'USD',
            maximumSignificantDigits: 3
          }).format(response.revenue);
        }
        this.setState({
          movie: {
            title: response.title,
            tagLine: response.tagline,
            image: image,
            overview: response.overview,
            releaseDate: response.release_date,
            runTime: response.runtime,
            revenue: revenue,
            voteAverage: response.vote_average,
          }
        });
      });
    }
  }

  goToHomePage() {
    this.openMovie(DEFAULT_MOVIE_ID);
  }

  render() {
    const faviconURL = `${window.location.origin}/favicon.png`;
      return (
        <div className="body">
          <div className="container">

            <div className="header row">
              <div className="col-lg-5 col-sm-6 col-md-5 col-xs-12">
                <img alt="Music App" src={faviconURL} className="img-brand" onClick={this.goToHomePage}/>
                <span className="white-color small-caps website-tagline">React Movie App</span>
              </div>
              <div className="col-lg-7 col-sm-6 col-md-7 col-xs-12">
                <BasicAutocomplete
                  onChange={movie => this.openMovie(movie.id)}
                />
              </div>

            </div>

            <div className="movie-hub-container row-eq-height">
              <div className="col-lg-5 col-sm-4 col-md-4 col-xs-12 movie-image">
                <img src={this.state.movie.image} alt="" className="img img-responsive"/>
              </div>

              <div className="col-lg-7 col-sm-8 col-md-8 col-xs-12 movie-detail">
                <h1 className="white-color small-caps movie-title">{this.state.movie.title}</h1>
                <h3 className="blue-color">{this.state.movie.tagline}</h3>

                <p className="white-color">{this.state.movie.overview}</p>
                <label className="white-color small-caps">Original Release:</label>
                <h2 className="header-reverse-margin blue-color">{this.state.movie.releaseDate}</h2>
                <label className="white-color small-caps">Running Time:</label>
                <h2 className="header-reverse-margin blue-color">{this.state.movie.runTime} mins</h2>
                <label className="white-color small-caps">Box Office:</label>
                <h2 className="header-reverse-margin blue-color">{this.state.movie.revenue}</h2>
                <label className="white-color small-caps">Vote Average:</label>
                <h2 className="header-reverse-margin blue-color">{this.state.movie.voteAverage} / 10</h2>
              </div>
            </div>
          </div>
        </div>
    );
  }

}

export default Main
