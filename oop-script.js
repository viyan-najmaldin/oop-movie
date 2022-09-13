//the API documentation site https://developers.themoviedb.org/3/
class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    Carousel.renderMovies(movies);
    HomePage.renderMovies(movies);
    // runActorNavbar();
    // runSearchNavbar();
  }
}
const ApiKey = `${process.env.APP_API_KEY}`;
class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static async fetchMovies(Filterby = `now_playing`) {
    const url = APIService._constructUrl(`movie/${Filterby}`);
    const response = await fetch(url);
    const data = await response.json();
    // data.results.map((a) => console.log(a));
    //console.log(data);
    return data.results.map((movie) => new Movie(movie));
  }
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new Movie(data);
  }

  static async fetchActors(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/credits`);
    const response = await fetch(url);
    const data = await response.json();
    //  console.log(data.cast);
    // data.cast.map((actor) => {console.log(actor.name)});
    return data.cast.map((actor) => new Actor(actor));
  }

  static async fetchAllActors() {
    const url = APIService._constructUrl(`person/popular`);
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    // console.log("object-vi");
    return data.results.map((actor) => new Actor(actor));
  }

  static async fetchSingleActor(actorId) {
    const url = APIService._constructUrl(`/person/${actorId}`);
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return new Actor(data);
  }

  static async fetchMoviesForActor(actorId) {
    const url = APIService._constructUrl(`person/${actorId}/movie_credits`);
    const response = await fetch(url);
    const data = await response.json();
    return data.cast.map((movie) => new Movie(movie));
  }

  static async fetchSerch(term) {
    const url = `${this.TMDB_BASE_URL}/search/movie?${ApiKey}=${term}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.results.map((movie) => new Movie(movie));
  }
  static async fetchGenres(TheId) {
    const url = `${this.TMDB_BASE_URL}/discover/movie?${ApiKey}&with_genres=${TheId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((movie) => new Movie(movie));
  }

  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?${ApiKey}`;
    // we removed the equal sign with the old key at the last
  }
}

class HomePage {
  static singlePage = document.getElementById("single-page");

  static container = document.getElementById("container");
  static carouselExampleCaptions = document.getElementById(
    "carouselExampleCaptions"
  );
  static renderMovies(movies) {
    movies.forEach((movie) => {
      //console.log(movie);

      const movieDiv = document.createElement("div");
      const movieImage = document.createElement("img");
      movieImage.src = `${movie.backdropUrl}`;
      // movieImage.alt = "Img";
      const movieTitle = document.createElement("h4");
      const movieRate = document.createElement("p");
      movieTitle.textContent = `${movie.title}`;
      movieRate.textContent = `${movie.vote_average}`;
      movieImage.classList.add("movieImg");
      movieDiv.classList.add("AllMovies");
      movieTitle.classList.add("text-white");

      if (movie.vote_average > 7) {
        movieRate.classList.add("green");
      }
      if (movie.vote_average < 7 && movie.vote_average > 5) {
        movieRate.classList.add("yellow");
      }
      if (movie.vote_average < 5) {
        movieRate.classList.add("red");
      }
      movieImage.addEventListener("click", function () {
        HomePage.singlePage.classList.remove("d-none");
        Movies.run(movie);
        console.log("fffffff");
        overlayContent.innerHTML = ``;
        openNav(movie);
        HomePage.carouselExampleCaptions.innerHTML = ` `;
      });

      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(movieRate);
      movieDiv.appendChild(movieImage);
      this.container.appendChild(movieDiv);
    });
  }
}

class Carousel {
  static ss = document.getElementById("ss");
  static renderMovies(movies) {
    movies.forEach((movie, i) => {
      const movieDi = document.createElement("div");
      const movieImg = document.createElement("img");
      movieImg.src = `${movie.backdropUrl}`;
      const movieText = document.createElement("h3");
      movieImg.addEventListener("click", function () {
        HomePage.singlePage.classList.remove("d-none");
        overlayContent.innerHTML = ``;
        openNav(movie);
        Movies.run(movie);
        HomePage.carouselExampleCaptions.innerHTML = ` `;
      });
      if (i == 0) {
        movieDi.classList.add("active");
      }
      movieDi.classList.add("carousel-item");
      movieText.textContent = `${movie.title}`;
      movieText.classList.add("carousel-caption");
      movieText.classList.add("d-none");
      movieText.classList.add("d-md-block");
      movieImg.classList.add("img-carousel");

      movieDi.appendChild(movieText);
      movieDi.appendChild(movieImg);
      this.ss.appendChild(movieDi);
    });
  }
}

class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    const actors = await APIService.fetchActors(movie.id);
    overlayContent.innerHTML = ``;
    openNav(movie);
    MoviePage.renderMovieSection(movieData);
    ActorPage.renderActorSection(actors);
    //   APIService.fetchActors(movie.id);
    //  console.log(actors);
  }
}

class MoviePage {
  static container = document.getElementById("container");
  //   static actorData = await APIService.fetchActors(actor);
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
}
class ActorPage {
  static ActorName = document.getElementById("actor-name");

  static renderActorSection(actor) {
    // console.log(actor);
    const a = actor.splice(0, 5);
    // console.log(a);
    ActorSection.renderActor(a);
  }
}

class MovieSection {
  static renderMovie(movie) {
    console.log(movie);
    const e = movie.genres.map((e) => e);
    const g = e.map((g) => g.name);
    console.log(g);
    HomePage.singlePage.innerHTML = `
      <div class="row q ">
              <div class="col-md-4 imgg ">
                <img id="single-movie-backdrop" class="imgg" src="${movie.backdropUrl}"> 
              <div
              <div class="col-md-8 tt">
                <h2 id="single-movie-title" class="hh4 pt-3">${movie.title}</h2>
                <p id="single-genres">${g}</p>
                <p id="single-movie-release-date">${movie.releaseDate}</p>
                <p id="single-movie-runtime">${movie.runtime}</p>
  
  
                <button class="btn thebtn purple-backgound text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">Overview</button>
  
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
             <div class="offcanvas-header bg-dark">
               <h2 id="offcanvasLeftLabel ">${movie.title}</h2>
        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        <div class="offcanvas-body w-100 text-white ">
          <h4> Overview :</h4>
            <p id="single-movie-overview">${movie.overview}</p>
      
          </div>
                   </div>
              </div>
            </div>
            
            <h3 class="p-3">Actors :  </h3>
           
  `;

    if (HomePage.carouselExampleCaptions == null) {
      console.log("Home page");
    } else {
      HomePage.carouselExampleCaptions.innerHTML = ` `;
    }
    HomePage.container.classList.add("d-none");
  }
  //  static renderActor(actor) {
}

class ActorSection {
  static renderActor(actors) {
    ActorPage.ActorName.classList.remove("d-none");

    //console.log(ActorName);
    // console.log(actors);
    actors.forEach((actor, i) => {
      const actorDi = document.createElement("div");
      const actorImg = document.createElement("img");
      actorImg.src = `${actor.backdropUrl}`;
      actorImg.classList.add("single-actor-img");
      const actorName = document.createElement("h5");
      actorName.textContent = `${actor.name}`;
      actorName.classList.add("each-actor-name");
      actorImg.addEventListener("click", function () {
        overlayContent.innerHTML = ``;

        ActorPage.ActorName.innerHTML = ``;
        document.getElementById("single-page-actor").classList.remove("d-none");
        HomePage.singlePage.classList.add("d-none");
        EachActor.run(actor);
      });
      actorDi.appendChild(actorImg);
      actorDi.appendChild(actorName);
      ActorPage.ActorName.appendChild(actorDi);
    });
  }
}

class Movie {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.vote_average = json.vote_average;
    this.genres = json.genres;
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
}

class Actor {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.also_known_as = json.also_known_as;
    this.popularity = json.popularity;
    this.gender = json.gender;
    this.biography = json.biography;
    //this.backdropPath = json.backdrop_path;
    this.profile_path = json.profile_path;
  }
  get backdropUrl() {
    return this.profile_path ? Actor.BACKDROP_BASE_URL + this.profile_path : "";
  }
}

////////////////////////////////////////

const b = document.getElementById("Navbar-actor");

b.addEventListener("click", async () => {
  overlayContent.innerHTML = ``;
  ActorsHomePage.AllActors.classList.remove("d-none");
  HomePage.carouselExampleCaptions.innerHTML = ` `;
  ActorPage.ActorName.innerHTML = ``;
  HomePage.singlePage.classList.add("d-none");
  HomePage.container.classList.add("d-none");
  ActorsMoves.Movies.innerHTML = ` `;

  ActorsHomePage.singlePage.classList.add("d-none");
  HomePage.container.innerHTML = ` `;

  const actors = await APIService.fetchAllActors();
  ActorsHomePage.renderActor(actors);
});

const c = document.getElementById("Navbar-search");
const sbutton = document.getElementById("Navbar-search-button");

sbutton.addEventListener("click", async (e) => {
  e.preventDefault();

  const searchTerm = c.value;

  if (searchTerm) {
    // ActorsHomePage.AllActors.classList.remove("d-none");
    const searchMovie = await APIService.fetchSerch(searchTerm);
    HomePage.container.classList.remove("d-none");
    ActorPage.ActorName.innerHTML = ``;
    overlayContent.innerHTML = ``;
    HomePage.carouselExampleCaptions.innerHTML = ` `;
    HomePage.container.innerHTML = ` `;
    HomePage.singlePage.classList.add("d-none");
    ActorsHomePage.singlePage.classList.add("d-none");
    ActorsHomePage.AllActors.classList.add("d-none");
    HomePage.renderMovies(searchMovie);
    // console.log(searchMovies);
  }
});

///////////////////////////// Filter Navbar

const d = document.getElementById("Filter-Navbar");

d.addEventListener("click", async () => {
  const FilterDropdown = document.querySelectorAll(
    "#filterNavbarDropdown >li >a"
  );
  // FilterNavbarBy.renderFilterDropdown();
  for (let i = 0; i < FilterDropdown.length; i++) {
    FilterDropdown[i].addEventListener("click", async (e) => {
      HomePage.container.classList.remove("d-none");
      HomePage.carouselExampleCaptions.innerHTML = ` `;
      HomePage.container.innerHTML = ` `;
      ActorPage.ActorName.innerHTML = ``;
      overlayContent.innerHTML = ``;
      HomePage.singlePage.classList.add("d-none");
      ActorsHomePage.singlePage.classList.add("d-none");
      ActorsHomePage.AllActors.classList.add("d-none");
      // ActorPage.ActorName.innerHTML = ``;

      if (e.srcElement.name == "Popular") {
        const PopularData = await APIService.fetchMovies(`popular`);
        HomePage.renderMovies(PopularData);
      } else if (e.srcElement.name == "up-coming") {
        const UpComingData = await APIService.fetchMovies(`upcoming`);
        HomePage.renderMovies(UpComingData);
      } else if (e.srcElement.name == "now-playing") {
        const nowPlayingData = await APIService.fetchMovies();
        HomePage.renderMovies(nowPlayingData);
      } else if (e.srcElement.name == "Top-rated") {
        const topRatedData = await APIService.fetchMovies(`top_rated`);
        HomePage.renderMovies(topRatedData);
      }
    });
  }
});

const e = document.getElementById("about-navbar");

e.addEventListener("click", () => {
  HomePage.container.classList.remove("d-none");
  HomePage.carouselExampleCaptions.innerHTML = ` `;
  HomePage.container.innerHTML = ` `;
  overlayContent.innerHTML = ``;
  HomePage.singlePage.classList.add("d-none");
  ActorsHomePage.singlePage.classList.add("d-none");
  ActorsHomePage.AllActors.classList.add("d-none");
  ActorPage.ActorName.innerHTML = ``;
  AboutPage.renderAboutPage();
});

const genresArray = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const f = document.getElementById("genres-navbar");
const genresDropdown = document.getElementById("genres-navbar-dropdown");
const createAllgenres = () => {
  // genresDropdown.innerHTML = "";
  genresArray.forEach((genre) => {
    const genreList = document.createElement("li");
    const genreLink = document.createElement("a");
    genreLink.href = "#";
    // console.log(genre.name);

    genreLink.id = genre.id;
    genreLink.innerText = genre.name;
    genreLink.classList.add("dropdown-item");
    // console.log(genreList);

    genreList.append(genreLink);
    genresDropdown.append(genreList);
  });
};

createAllgenres();
f.addEventListener("click", () => {
  createAllgenres();

  const FilterDropdownlink = document.querySelectorAll(
    "#genres-navbar-dropdown >li >a"
  );
  for (let i = 0; i < FilterDropdownlink.length; i++) {
    FilterDropdownlink[i].addEventListener("click", async (e) => {
      const genreData = await APIService.fetchGenres(FilterDropdownlink[i].id);
      HomePage.container.classList.remove("d-none");
      HomePage.carouselExampleCaptions.innerHTML = ` `;
      HomePage.container.innerHTML = ` `;
      overlayContent.innerHTML = ``;
      HomePage.singlePage.classList.add("d-none");
      ActorsHomePage.singlePage.classList.add("d-none");
      ActorsHomePage.AllActors.classList.add("d-none");
      ActorPage.ActorName.innerHTML = ``;

      HomePage.renderMovies(genreData);
    });
  }
});

/////////////////////////////////////////////////////////////////////////////

class AboutPage {
  static renderAboutPage() {
    HomePage.container.innerHTML = `
      <h1>About Page</h1>
      <div><div> This is a movie website </div>
      <div>where it shows movies, their casts, ratings, trailers, related movies, genres, and so on.<div>
      This website uses The Movie DB API:
     <a href="https://api.themoviedb.org/">https://api.themoviedb.org/3</a> 
     <br> link to my repository :
     <a href="#">Github</a> 
      </div>
      
      `;
  }
}

class ActorsHomePage {
  static singlePage = document.getElementById("single-page-actor");
  static AllActors = document.getElementById("all-actors");

  static renderActor(actors) {
    actors.forEach((actor) => {
      const actorDiv = document.createElement("div");
      const actorImage = document.createElement("img");
      actorImage.src = `${actor.backdropUrl}`;
      const actorName = document.createElement("h4");
      actorName.textContent = `${actor.name}`;
      actorImage.classList.add("w-100");
      actorName.classList.add("actors-name");
      actorDiv.classList.add("actors-img");
      // actorImage.classList.add("rounded");
      actorImage.addEventListener("click", function () {
        ActorsHomePage.singlePage.classList.remove("d-none");
        EachActor.run(actor);
      });
      actorDiv.appendChild(actorImage);
      actorDiv.appendChild(actorName);

      this.AllActors.appendChild(actorDiv);
    });
  }
}

class EachActor {
  static async run(actor) {
    const actorData = await APIService.fetchSingleActor(actor.id);
    const movies = await APIService.fetchMoviesForActor(actor.id);

    EachActorPage.renderActorSection(actorData);
    ActorsMoves.renderActorMoviesrSection(movies);
  }
}

class ActorsMoves {
  static container = document.getElementById("container");
  static Movies = document.getElementById("actors-movies");

  static renderActorMoviesrSection(movie) {
    ActorMoviesSection.renderActor(movie);
  }
}

class ActorMoviesSection {
  static renderActor(movies) {
    // const a = movies.splice(0, 10);
    movies.forEach((movie) => {
      //  console.log(movie);

      const movieDiv = document.createElement("div");
      const movieImg = document.createElement("img");
      movieImg.src = `${movie.backdropUrl}`;
      // movieImg.classList.add("single-actor-img");
      const movieTitle = document.createElement("h4");
      movieTitle.textContent = `${movie.title}`;
      // movieImg.classList.add("rounded");
      movieImg.classList.add("movieImg");
      movieDiv.classList.add("AllMovies");
      movieTitle.classList.add("text-white");
      movieImg.addEventListener("click", async () => {
        // const a = document.createElement("div");
        // a.id = "actors-movies";
        // a.className.add("movies-actor");
        // a.className.add("px-2");

        // document.getElementById("single-page-actor").appendChild(a);
        ActorsMoves.Movies.innerHTML = ` `;

        HomePage.singlePage.classList.remove("d-none");

        ActorsHomePage.singlePage.classList.add("d-none");

        Movies.run(movie);
        // const movieData = await APIService.fetchMovie(movie.id);
        // MoviePage.renderMovieSection(movieData);
      });
      movieDiv.appendChild(movieImg);
      movieDiv.appendChild(movieTitle);
      ActorsMoves.Movies.appendChild(movieDiv);
    });
  }
}

class EachActorPage {
  static container = document.getElementById("container");
  //   static actorData = await APIService.fetchAllActors(actor);
  static renderActorSection(actor) {
    EachActorSection.renderMovie(actor);
  }
}

class EachActorSection {
  static renderMovie(actor) {
    const movieImg = document.getElementById("single-actor-backdrop");
    const actorName = document.getElementById("single-actor-name");
    const gender = document.getElementById("gender");
    const Biography = document.getElementById("actor-biography");
    const Popularity = document.getElementById("popularity");
    const knownAs = document.getElementById("known-as");

    const actorGender = {
      1: "female",
      2: "male",
    };

    movieImg.src = `${actor.backdropUrl}`;
    actorName.innerText = `${actor.name}`;
    gender.innerText = `${actorGender[actor.gender]}`;
    Biography.innerText = `${actor.biography}`;
    Popularity.innerText = `${actor.popularity}`;
    knownAs.innerText = `${actor.also_known_as}`;

    if (ActorsHomePage.AllActors == null) {
      console.log("Actor page");
    } else {
      ActorsHomePage.AllActors.innerHTML = ` `;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
const overlayContent = document.getElementById("overlay-content");

function openNav(movie) {
  let id = movie.id;
  console.log(movie);
  fetch("https://api.themoviedb.org/3/movie/" + id + "/videos?" + ApiKey)
    .then((res) => res.json())
    .then((videoData) => {
      // console.log(videoData);
      if (videoData) {
        if (videoData.results.length > 0) {
          var embed = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site, type } = video;

            if (site == "YouTube") {
              if (type == "Trailer") {
                console.log(name);
                embed.push(`
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>    
            `);
              }
            }
          });

          var content = `
            <br><br>
          <h3 class="no-results text-start">Trailer :</h3>
          <br/>
          
          ${embed.join("")}
          <br/>         `;
          overlayContent.innerHTML = content;
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">   </h1>`;
        }
      }
    });
}

////////////////////////////////////////

document.addEventListener("DOMContentLoaded", App.run);
