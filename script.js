/* ==========================================
   CineScope
   script.js
   Part 1
   API • DOM • Theme • Search
========================================== */

//================ API =================//
const API_KEY = "c11f69f070dbd3b776ee0b625556c315";

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

//================ DOM =================//

const loader = document.getElementById("loader");

const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const themeToggle = document.getElementById("themeToggle");

const trendingContainer = document.getElementById("trendingContainer");

const popularContainer = document.getElementById("popularContainer");

const topRatedContainer = document.getElementById("topRatedContainer");

const upcomingContainer = document.getElementById("upcomingContainer");

const searchResults = document.getElementById("searchResults");

const searchSection = document.getElementById("searchSection");

const noResults = document.getElementById("noResults");

const errorBox = document.getElementById("errorBox");

const movieModal = document.getElementById("movieModal");

const modalBody = document.getElementById("modalBody");

const closeModal = document.getElementById("closeModal");

const favoritesContainer = document.getElementById("favoritesContainer");

const favoritesSection = document.getElementById("favoritesSection");

const favoritesBtn = document.getElementById("favoritesBtn");

const clearFavorites = document.getElementById("clearFavorites");

//================ Loader =================//

function showLoader() {

    loader.style.display = "flex";

}

function hideLoader() {

    loader.style.display = "none";

}

//================ Toast =================//

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

//================ Theme =================//

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("light")) {

        icon.className = "fa-solid fa-sun";

        localStorage.setItem("theme", "light");

    } else {

        icon.className = "fa-solid fa-moon";

        localStorage.setItem("theme", "dark");

    }

});

//================ Load Saved Theme =================//

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light");

    themeToggle.querySelector("i").className = "fa-solid fa-sun";

}

//================ Search =================//

searchBtn.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query === "") return;

    searchMovies(query);

});

searchInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});


//================ Trending =================//

async function getTrendingMovies() {

    showLoader();

    try {

        const response = await fetch(

            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`

        );

        const data = await response.json();

        displayMovies(data.results, trendingContainer);

    } catch (error) {

        console.error(error);

        errorBox.style.display = "block";

    } finally {

        hideLoader();

    }

}

//================ Popular =================//

async function getPopularMovies() {

    try {

        const response = await fetch(

            `${BASE_URL}/movie/popular?api_key=${API_KEY}`

        );

        const data = await response.json();

        displayMovies(data.results, popularContainer);

    } catch (error) {

        console.error(error);

    }

}

//================ Top Rated =================//

async function getTopRatedMovies() {

    try {

        const response = await fetch(

            `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`

        );

        const data = await response.json();

        displayMovies(data.results, topRatedContainer);

    } catch (error) {

        console.error(error);

    }

}

//================ Upcoming =================//

async function getUpcomingMovies() {

    try {

        const response = await fetch(

            `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`

        );

        const data = await response.json();

        displayMovies(data.results, upcomingContainer);

    } catch (error) {

        console.error(error);

    }

}

//================ Search Movies =================//

async function searchMovies(query) {

    showLoader();

    searchSection.style.display = "block";

    noResults.style.display = "none";

    searchResults.innerHTML = "";

    try {

        const response = await fetch(

            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`

        );

        const data = await response.json();

        if (data.results.length === 0) {

            noResults.style.display = "block";

        } else {

            displayMovies(data.results, searchResults);

        }

    } catch (error) {

        console.error(error);

        errorBox.style.display = "block";

    } finally {

        hideLoader();

    }

}
/* ==========================================
   script.js
   Part 3
   Display Movies & Movie Card
========================================== */

//================ Display Movies =================//

function displayMovies(movies, container) {

    container.innerHTML = "";

    movies.forEach(movie => {

        const card = createMovieCard(movie);

        container.appendChild(card);

    });

}

//================ Create Movie Card =================//

function createMovieCard(movie) {

    const card = document.createElement("div");

    card.className = "movie-card";

    const poster = movie.poster_path ?
        `${IMAGE_URL}${movie.poster_path}` :
        "https://via.placeholder.com/500x750?text=No+Image";

    card.innerHTML = `

        <img
            src="${poster}"
            alt="${movie.title}"
            class="movie-poster"
        >

        <div class="movie-info">

            <h3 class="movie-title">

                ${movie.title}

            </h3>

            <div class="movie-meta">

                <span class="rating">

                    ⭐ ${movie.vote_average.toFixed(1)}

                </span>

                <span class="release-date">

                    ${movie.release_date || "N/A"}

                </span>

            </div>

            <div class="movie-actions">

                <button
                    class="details-btn"
                    data-id="${movie.id}"
                >

                    Details

                </button>

                <button
                    class="favorite-btn"
                    data-id="${movie.id}"
                >

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>

        </div>

    `;

    // Details Button

    card.querySelector(".details-btn")
        .addEventListener("click", () => {

            getMovieDetails(movie.id);

        });

    // Favorite Button

    card.querySelector(".favorite-btn")
        .addEventListener("click", () => {

            addToFavorites(movie);

        });

    return card;

}
/* ==========================================
   script.js
   Part 4
   Movie Details Modal
========================================== */

//================ Movie Details =================//

async function getMovieDetails(movieId) {

    showLoader();

    try {

        const response = await fetch(

            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`

        );

        const movie = await response.json();

        displayMovieDetails(movie);

    } catch (error) {

        console.error(error);

        showToast("Failed to load movie details.");

    } finally {

        hideLoader();

    }

}

//================ Display Movie Details =================//

function displayMovieDetails(movie) {

    const poster = movie.poster_path

        ?
        `${IMAGE_URL}${movie.poster_path}`

    : "https://via.placeholder.com/500x750?text=No+Image";

    const genres = movie.genres
        .map(genre => genre.name)
        .join(", ");

    modalBody.innerHTML = `

        <div class="modal-header">

            <img
                src="${poster}"
                alt="${movie.title}"
                class="modal-poster"
            >

            <div class="modal-info">

                <h2>${movie.title}</h2>

                <p class="modal-rating">

                    ⭐ ${movie.vote_average.toFixed(1)}/10

                </p>

                <p>

                    <strong>Release:</strong>
                    ${movie.release_date}

                </p>

                <p>

                    <strong>Runtime:</strong>
                    ${movie.runtime} min

                </p>

                <p>

                    <strong>Genres:</strong>
                    ${genres}

                </p>

                <p>

                    ${movie.overview}

                </p>

            </div>

        </div>

    `;

    movieModal.style.display = "flex";

}

//================ Close Modal =================//

closeModal.addEventListener("click", () => {

    movieModal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === movieModal) {

        movieModal.style.display = "none";

    }

});

/* ==========================================
   script.js
   Part 5
   Favorites • Local Storage • Startup
========================================== */

//================ Favorites =================//

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

//================ Add To Favorites =================//

function addToFavorites(movie) {

    const exists = favorites.some(item => item.id === movie.id);

    if (exists) {

        showToast("Movie already in Favorites ❤️");

        return;

    }

    favorites.push(movie);

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

    loadFavorites();

    showToast("Added to Favorites ❤️");

}

//================ Load Favorites =================//

function loadFavorites() {

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {

        favoritesContainer.innerHTML =

            "<h3>No favorite movies yet.</h3>";

        return;

    }

    favorites.forEach(movie => {

        const card = createMovieCard(movie);

        favoritesContainer.appendChild(card);

    });

}

//================ Favorites Button =================//

favoritesBtn.addEventListener("click", () => {

    favoritesSection.style.display = "block";

    favoritesSection.scrollIntoView({

        behavior: "smooth"

    });

});

//================ Clear Favorites =================//

clearFavorites.addEventListener("click", () => {

    favorites = [];

    localStorage.removeItem("favorites");

    loadFavorites();

    showToast("Favorites Cleared");

});

//================ Startup =================//

window.addEventListener("load", () => {

    loadFavorites();

    getTrendingMovies();

    getPopularMovies();

    getTopRatedMovies();

    getUpcomingMovies();

});

/* ==========================================
   script.js
   Part 6
   Category Filter • View All • Utilities
========================================== */

//================ Category Buttons =================//

const categoryButtons = document.querySelectorAll(".category");

const sections = {
    trending: document.querySelector("#trendingContainer").closest(".movie-section"),
    popular: document.querySelector("#popularContainer").closest(".movie-section"),
    top_rated: document.querySelector("#topRatedContainer").closest(".movie-section"),
    upcoming: document.querySelector("#upcomingContainer").closest(".movie-section")
};

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        // Hide all sections
        Object.values(sections).forEach(section => {
            section.style.display = "none";
        });

        // Show selected section
        sections[button.dataset.type].style.display = "block";

    });

});

//================ Now Playing =================//

async function getNowPlayingMovies() {

    showLoader();

    try {

        const response = await fetch(

            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`

        );

        const data = await response.json();

        popularContainer.innerHTML = "";

        displayMovies(data.results, popularContainer);

    } catch (error) {

        console.error(error);

        showToast("Unable to load movies.");

    } finally {

        hideLoader();

    }

}

//================ View All Buttons =================//

document.getElementById("viewTrending")
    .addEventListener("click", () => {

        window.scrollTo({

            top: trendingContainer.offsetTop - 100,

            behavior: "smooth"

        });

    });

document.getElementById("viewPopular")
    .addEventListener("click", () => {

        window.scrollTo({

            top: popularContainer.offsetTop - 100,

            behavior: "smooth"

        });

    });

document.getElementById("viewTopRated")
    .addEventListener("click", () => {

        window.scrollTo({

            top: topRatedContainer.offsetTop - 100,

            behavior: "smooth"

        });

    });

document.getElementById("viewUpcoming")
    .addEventListener("click", () => {

        window.scrollTo({

            top: upcomingContainer.offsetTop - 100,

            behavior: "smooth"

        });

    });

//================ Image Fallback =================//

document.addEventListener("error", (e) => {

    if (e.target.tagName === "IMG") {

        e.target.src = "assets/no-image.png";

    }

}, true);
