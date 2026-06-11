// =====================================================
// Phase 1: Connect to the DOM
// =====================================================

// Select the title and movie count display
const appTitle = document.getElementById("app-title");
const movieCount = document.getElementById("movie-count");

// Select the form and inputs
const movieForm = document.getElementById("movie-form");
const titleInput = document.getElementById("title-input");
const genreInput = document.getElementById("genre-input");

// Select the list where movie cards will be added
const movieList = document.getElementById("movie-list");

// Select the clear watched button
const clearWatchedBtn = document.getElementById("clear-watched-btn");

// Select all filter buttons
const filterBtns = document.querySelectorAll(".filter-btn");

// This variable remembers which filter is currently active
let currentFilter = "all";

// Log everything to make sure selections worked
console.log("App title:", appTitle);
console.log("Movie count:", movieCount);
console.log("Movie form:", movieForm);
console.log("Title input:", titleInput);
console.log("Genre input:", genreInput);
console.log("Movie list:", movieList);
console.log("Clear watched button:", clearWatchedBtn);
console.log("Filter buttons:", filterBtns);


// =====================================================
// Phase 2: Review DOM Tools
// =====================================================

// Change the title text
appTitle.textContent = "My Movie Watchlist";

// Read and log the count text
console.log("Count says:", movieCount.textContent);

// Update the count manually for now
movieCount.textContent = "0 movies";

// Practice classList
movieCount.classList.add("active-filter");
movieCount.classList.remove("active-filter");
movieCount.classList.toggle("active-filter");
movieCount.classList.toggle("active-filter");

// Practice attributes
console.log(titleInput.getAttribute("placeholder"));
console.log(titleInput.getAttribute("type"));
console.log(titleInput.getAttribute("required"));

titleInput.setAttribute("placeholder", "Try: The Matrix");
titleInput.removeAttribute("required");
titleInput.setAttribute("required", "");

// What is the difference between getAttribute("value") and .value on an input?
// getAttribute("value") → reads the original HTML attribute value, if one exists.
// .value               → reads what the user actually typed right now.


// =====================================================
// Phase 4 Helper: Create a Movie Card
// =====================================================

function createMovieCard(title, genre) {
  // Create the outer li card
  const card = document.createElement("li");
  card.classList.add("movie-card");

  // Store genre as a data attribute
  card.setAttribute("data-genre", genre);

  // Create the movie info div
  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  // Create the movie title span
  const movieTitle = document.createElement("span");
  movieTitle.classList.add("movie-title");
  movieTitle.textContent = title;

  // Create the movie genre span
  const movieGenre = document.createElement("span");
  movieGenre.classList.add("movie-genre");

  if (genre === "") {
    movieGenre.textContent = "No genre";
  } else {
    movieGenre.textContent = genre;
  }

  // Put title and genre inside the info div
  movieInfo.appendChild(movieTitle);
  movieInfo.appendChild(movieGenre);

  // Create the actions div
  const movieActions = document.createElement("div");
  movieActions.classList.add("movie-actions");

  // Create the watched button
  const watchButton = document.createElement("button");
  watchButton.classList.add("watch-btn");
  watchButton.textContent = "Mark Watched";

  // Create the remove button
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-btn");
  removeButton.textContent = "Remove";

  // Put buttons inside the actions div
  movieActions.appendChild(watchButton);
  movieActions.appendChild(removeButton);

  // Put both sections inside the card
  card.appendChild(movieInfo);
  card.appendChild(movieActions);

  // Return the finished card
  return card;
}


// =====================================================
// Phase 6 Helper: Update Movie Count
// =====================================================

function updateCount() {
  // Count all movie cards currently in the list
  const totalMovies = movieList.querySelectorAll(".movie-card").length;

  // Handle singular/plural text
  if (totalMovies === 1) {
    movieCount.textContent = "1 movie";
  } else {
    movieCount.textContent = `${totalMovies} movies`;
  }
}


// =====================================================
// Phase 6 Helper: Update Active Filter Button
// =====================================================

function updateFilterButtons(activeFilter) {
  filterBtns.forEach(function(btn) {
    // Remove active style from every filter button
    btn.classList.remove("active-filter");

    // Add active style only to the selected filter button
    if (btn.id === "filter-" + activeFilter) {
      btn.classList.add("active-filter");
    }
  });
}


// =====================================================
// Phase 6 Helper: Apply Filter
// =====================================================

function applyFilter(filter) {
  // Remember the current filter
  currentFilter = filter;

  // Update which filter button looks active
  updateFilterButtons(filter);

  // Select all current movie cards
  const cards = movieList.querySelectorAll(".movie-card");

  cards.forEach(function(card) {
    if (filter === "all") {
      card.classList.remove("filtered-out");
    } else if (filter === "watched") {
      if (card.classList.contains("watched")) {
        card.classList.remove("filtered-out");
      } else {
        card.classList.add("filtered-out");
      }
    } else if (filter === "unwatched") {
      if (!card.classList.contains("watched")) {
        card.classList.remove("filtered-out");
      } else {
        card.classList.add("filtered-out");
      }
    }
  });
}


// =====================================================
// Phase 3 and 4: Handle Form Submit
// =====================================================

movieForm.addEventListener("submit", function(event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Read what the user typed
  const title = titleInput.value;
  const genre = genreInput.value;

  // Log values to test
  console.log("Movie title:", title);
  console.log("Movie genre:", genre);

  // Create a new movie card
  const newCard = createMovieCard(title, genre);

  // Add the card to the movie list
  movieList.appendChild(newCard);

  // Update the count
  updateCount();

  // Keep current filter applied
  applyFilter(currentFilter);

  // Clear the form inputs
  movieForm.reset();
});


// =====================================================
// Phase 5: Button Behavior with Event Delegation
// =====================================================

// Why do we attach the listener to #movie-list instead of to each button?
// Answer: Because movie cards and their buttons are created after the page loads.
// One listener on the parent list can handle clicks from all current and future buttons.

// What does event.target.closest("li") do?
// Answer: It starts from the clicked element and walks upward until it finds the nearest li.

movieList.addEventListener("click", function(event) {
  // Ignore clicks that are not on buttons
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  // Find the movie card that contains the clicked button
  const card = event.target.closest("li");

  // If Remove button was clicked
  if (event.target.classList.contains("remove-btn")) {
    card.remove();

    updateCount();
    applyFilter(currentFilter);
  }

  // If Mark Watched button was clicked
  if (event.target.classList.contains("watch-btn")) {
    card.classList.toggle("watched");

    // Change button text depending on watched state
    if (card.classList.contains("watched")) {
      event.target.textContent = "Unmark Watched";
    } else {
      event.target.textContent = "Mark Watched";
    }

    applyFilter(currentFilter);
  }
});


// =====================================================
// Phase 6: Filter Buttons
// =====================================================

filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    // Example:
    // "filter-watched" becomes "watched"
    const filterName = btn.id.replace("filter-", "");

    applyFilter(filterName);
  });
});


// =====================================================
// Phase 6: Clear Watched
// =====================================================

clearWatchedBtn.addEventListener("click", function() {
  // Select all watched movie cards
  const watchedCards = movieList.querySelectorAll(".watched");

  // Remove each watched card
  watchedCards.forEach(function(card) {
    card.remove();
  });

  // Update count and keep current filter active
  updateCount();
  applyFilter(currentFilter);
});