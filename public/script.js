let api_key = "6d2d82633c835856aaf0f2d134dc8a5f";

let img_url = "https://image.tmdb.org/t/p/w500";
let original_img_url = "https://image.tmdb.org/t/p/original";
let genres_list_http = "https://api.themoviedb.org/3/genre/movie/list?";
let movie_genres_http = "https://api.themoviedb.org/3/discover/movie?";
let movie_popular_http = "https://api.themoviedb.org/3/movie/popular?";
let movie_id = location.pathname;
let movie_detail_http = "https://api.themoviedb.org/3/movie/";

const main = document.querySelector('.main');

/*fetch(movie_popular_http + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    data.movies.forEach(item => {
       console.log(data)
    })
});
*/



fetch(genres_list_http + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    data.genres.forEach(item => {
        fetchMoviesListByGenres(item.id, item.name);
   
    })
});


const fetchMoviesListByGenres = (id, genres) => {
    fetch(movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: Math.floor(Math.random() * 3) + 1
    }))
    .then(res => res.json())
    .then(data => {
        makeCategoryElement(`${genres}_movies`, data.results);
    })
    .catch(err =>  console.log(err));
}

const makeCategoryElement = (category, data) => {
    main.innerHTML += `
  
    <div class="movie-list">

            <button class="pre-btn"><img src="./img/post.png"></button>
            <h1 class="movie-category">${category.split("_").join(" ")}</h1>
            <div class="movie-container" id="${category}">
               
            </div>
            <button class="nxt-btn"><img src="./img/pre.png"></button>
        </div>
    `;
    makeCards(category, data);
}



const setupScrolling = () => {
    const conainter = [...document.querySelectorAll('.movie-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    conainter.forEach((item, i) => {
        let containerDimensions = item.getBoundingClientRect();
        let containerWidth = containerDimensions.width;

        nxtBtn[i].addEventListener('click', () => {
            item.scrollLeft += containerWidth;
        })

        preBtn[i].addEventListener('click', () => {
            item.scrollLeft -= containerWidth;
        })
    })
}

const makeCards = (id, data) => {
    const movieContainer = document.getElementById(id);
    data.forEach((item, i) => {
        if(item.backdrop_path == null){
            item.backdrop_path = item.poster_path;
            if(item.backdrop_path == null){
                return;
            }
        }

        movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

        if(i == data.length - 1){
            setTimeout(() => {
                setupScrolling();
            }, 100);
        }
    })
}



// fetching movie details
fetch(`${movie_detail_http}${movie_id}?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    setupMovieInfo(data);
})

const setupMovieInfo = (data) => {
    const movieName = document.querySelector('.movie-name');
    const genres = document.querySelector('.genres');
    const des = document.querySelector('.des');
    const title = document.querySelector('title');
    const backdrop = document.querySelector('.movie-info');

    title.innerHTML = movieName.innerHTML = data.title; 
    genres.innerHTML = `${data.release_date.split('-')[0]} | `;
    for(let i = 0; i < data.genres.length; i++){
        genres.innerHTML += data.genres[i].name + formatString(i, data.genres.length);
    }

    if(data.adult == true){
        genres.innerHTML += ' | +18';
    }

    if(data.backdrop_path == null){
        data.backdrop_path = data.poster_path;
    }

    des.innerHTML = data.overview.substring(0, 200) + '...';

    backdrop.style.backgroundImage = `url(${original_img_url}${data.backdrop_path})`;
}

const formatString = (currentIndex, maxIndex) => {
    return (currentIndex == maxIndex - 1) ? '' : ', ';
}

//fetching cast info

fetch(`${movie_detail_http}${movie_id}/credits?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    const cast = document.querySelector('.starring');
    for(let i = 0; i < 5; i++){
        cast.innerHTML += data.cast[i].name + formatString(i, 5);
    }
})

// fetching video clips

fetch(`${movie_detail_http}${movie_id}/videos?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    let trailerContainer = document.querySelector('.trailer-container');

    let maxClips = (data.results.length > 4) ? 4 : data.results.length;

    for(let i = 0; i < maxClips; i++){
        trailerContainer.innerHTML += `
        <iframe src="https://youtube.com/embed/${data.results[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    }
})

// fetch recommendations

fetch(`${movie_detail_http}${movie_id}/recommendations?` + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    let container = document.querySelector('.recommendations-container');
    for(let i = 0; i < 16; i++){
        if(data.results[i].backdrop_path == null){
            i++;
        }
        container.innerHTML += `
        <div class="movie" onclick="location.href = '/${data.results[i].id}'">
            <img src="${img_url}${data.results[i].backdrop_path}" alt="">
            <p class="movie-title">${data.results[i].title}</p>
        </div>
        `;
    }
})