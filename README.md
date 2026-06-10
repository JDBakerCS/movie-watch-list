# DOM Workshop Part 2: Movie Watchlist

## The Scenario

You built a trivia game. The buttons did something, the score changed, new content appeared — all because JavaScript was reading and writing the DOM.

Now you build something from scratch, with a partner. A movie watchlist: type in a title and genre, add it to the list. Mark movies watched, remove ones you don't want, and filter the list to see only what you're looking for.

---

## What's Review vs. What's New

You already know how to do this from Part 1:
- Selecting elements with `getElementById` and `querySelectorAll`
- Reading and setting `textContent`
- Toggling classes with `classList`
- Attaching event listeners
- Creating new elements with `document.createElement` and `appendChild`
- Event delegation — one listener on a parent that handles clicks from children

**New things you'll learn today:**
- How to intercept a form submission and read what the user typed
- The difference between HTML attributes and JavaScript properties
- `closest()` — walking up the DOM tree to find an ancestor element
- Filtering a live list by toggling a CSS class

---

## Pair Instructions

Switch who is typing at the start of every phase. The person not typing should read ahead, talk through the logic, and catch errors. Both of you are responsible for understanding every line.

---

## Phase 0: Build the Shell

**Write zero JavaScript.** Build the complete HTML and CSS first. When you open the page, it should look like a real app — even though nothing works yet.

Create a folder named `movie-watchlist/` with three files:

```
movie-watchlist/
  index.html
  styles.css
  script.js
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Movie Watchlist</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <header>
    <h1 id="app-title">My Watchlist</h1>
    <p id="movie-count">0 movies</p>
  </header>

  <main>

    <form id="movie-form">
      <input
        type="text"
        id="title-input"
        placeholder="Movie title..."
        required
      />
      <input
        type="text"
        id="genre-input"
        placeholder="Genre (e.g. Action, Comedy...)"
      />
      <button type="submit" id="add-btn">Add Movie</button>
    </form>

    <div id="filter-bar">
      <button class="filter-btn active-filter" id="filter-all">All</button>
      <button class="filter-btn" id="filter-unwatched">Unwatched</button>
      <button class="filter-btn" id="filter-watched">Watched</button>
      <button id="clear-watched-btn">Clear Watched</button>
    </div>

    <ul id="movie-list"></ul>

  </main>

  <script src="script.js" defer></script>
</body>
</html>
```

### CSS Requirements

Make it look like a real app. At minimum:

- A centered `<main>` with max-width and padding
- The form should sit side by side (try `display: flex` with a gap)
- `#movie-list` items should look like cards — padding, border, box-shadow
- The filter buttons should look distinct from the add button

Define these classes now — JavaScript will apply them during the app:

```css
/* Applied to the <li> when a movie is marked watched */
.watched {
  opacity: 0.5;
  text-decoration: line-through;
}

/* Applied to whichever filter button is currently active */
.active-filter {
  background-color: #1a1a2e;
  color: white;
}

/* Applied to cards that don't match the current filter — hides them */
.filtered-out {
  display: none;
}
```

**Checkpoint — open the page in the browser.** You should see the title, "0 movies", a form with two text inputs, filter buttons, and an empty list. Nothing is interactive yet. That's exactly right.

**Commit your work:**
```
git add .
git commit -m "phase 0: HTML and CSS shell for movie watchlist"
```

---

## Phase 1: Connect to the DOM

Open `script.js`. Your first job is to give JavaScript a variable for every element it will need to touch. The first two are done for you — follow the same pattern for the rest:

```js
const appTitle = document.getElementById("app-title")
const movieCount = document.getElementById("movie-count")

// select #movie-form        → store in movieForm
// select #title-input       → store in titleInput
// select #genre-input       → store in genreInput
// select #movie-list        → store in movieList
// select #clear-watched-btn → store in clearWatchedBtn

// select ALL elements with class "filter-btn" using querySelectorAll
// store them in filterBtns — you'll loop over them in Phase 6
```

Log every variable to the console and open DevTools. If any of them logs as `null`, your `id` in the HTML doesn't match what you passed to `getElementById`. Fix it before moving on.

**Commit your work:**
```
git add .
git commit -m "phase 1: select DOM elements"
```

---

## Phase 2: Review the Core DOM Tools

Before adding any interaction, spend time with the three tools you'll use throughout this project. You've seen two of them already.

Add the following to `script.js` below your selections. After each block, **save and refresh** to see the effect.

---

### Part A — textContent (review)

`textContent` reads or replaces the visible text inside an element.

```js
// Change the app title
appTitle.textContent = "My Movie Watchlist"

// Read and log the current count text
console.log("Count says:", movieCount.textContent)

// Update the count text manually (JavaScript will keep this accurate later)
movieCount.textContent = "0 movies"
```

Open the browser. The title changed. That's it — one property assignment rewrote the DOM.

---

### Part B — classList (review)

`classList` is how JavaScript applies and removes visual state. You used this in Part 1 to show `.correct` and `.wrong` on answer buttons. Same idea here.

```js
// .add() puts a class on the element
movieCount.classList.add("active-filter")
// Look at the browser — what changed?

// .remove() takes it off
movieCount.classList.remove("active-filter")

// .toggle() adds if missing, removes if present — one call does both
movieCount.classList.toggle("active-filter")
movieCount.classList.toggle("active-filter")
```

> Rule of thumb: never do `element.style.color = "red"` in your JavaScript.
> Do this instead: define a CSS class and toggle it with `classList`.
> Visual rules stay in the stylesheet. JavaScript only controls which classes are active.

---

### Part C — Attributes vs. Properties

This is new. It's a subtle distinction that will confuse you if you don't stop and understand it.

An HTML **attribute** is what's written in the markup. A JavaScript **property** is the live, current value on the element in the browser's memory. They start out the same — but they can drift apart.

```js
// getAttribute reads the HTML attribute as it was written in the file
console.log(titleInput.getAttribute("placeholder"))  // → "Movie title..."
console.log(titleInput.getAttribute("type"))         // → "text"
console.log(titleInput.getAttribute("required"))     // → "" (empty string = it exists)

// setAttribute changes or adds an attribute
titleInput.setAttribute("placeholder", "Try: The Matrix")
// Refresh — the placeholder text in the input changed

// removeAttribute removes it entirely
titleInput.removeAttribute("required")
// The input is no longer required — blank submissions won't be blocked
titleInput.setAttribute("required", "")  // put it back
```

Now test this in the console. **Type something into the title input first**, then run:

```js
titleInput.getAttribute("value")  // → null (the HTML never had a value attribute)
titleInput.value                  // → whatever you just typed
```

**`getAttribute("value")` reads what was written in the HTML file.**
**`.value` reads the live state — what the user actually typed right now.**

When you're working with form inputs, always use `.value`. You'll do this in Phase 3.

Fill in this comment in your code before moving on:

```js
// What is the difference between getAttribute("value") and .value on an input?
// getAttribute("value") →
// .value               →
```

---

**Commit your work:**
```
git add .
git commit -m "phase 2: textContent, classList, and attribute methods"
```

---

## Phase 3: Handle the Form

A form has default browser behavior: when you submit it, the browser tries to reload the page (or navigate to a URL). That would wipe everything your JavaScript built. Your first line inside any submit handler must stop that.

```js
movieForm.addEventListener("submit", (event) => {
  // 1. Stop the browser from reloading the page
  //    Without this line, the page refreshes on every submit and you lose everything
  event.preventDefault()

  // 2. Read the movie title from the input — use .value, not getAttribute
  const title = titleInput.value

  // 3. Read the genre the same way
  const genre = genreInput.value

  // 4. Log both values to the console
  //    Type a title and genre, submit — confirm you see them in DevTools

  // 5. At the end, reset the form so the inputs are blank for the next entry
  movieForm.reset()
  //    .reset() clears all inputs in the form at once — no need to blank them one by one

  // 6. Don't build cards yet — that's Phase 4
})
```

**In the browser:** Type a movie title and genre, click Add. Open DevTools → Console. You should see both values logged. If the page reloads instead, `event.preventDefault()` isn't running.

**Commit your work:**
```
git add .
git commit -m "phase 3: form submit reads and logs input values"
```

---

## Phase 4: Build a Card

Now you'll create a real card element from JavaScript and add it to the list on every submit.

Write a function that receives the title and genre, builds a complete `<li>` card, and returns it. The caller (your submit handler) decides where to put it.

Each card should match this structure when it's built:

```html
<li class="movie-card" data-genre="Sci-Fi">
  <div class="movie-info">
    <span class="movie-title">Inception</span>
    <span class="movie-genre">Sci-Fi</span>
  </div>
  <div class="movie-actions">
    <button class="watch-btn">Mark Watched</button>
    <button class="remove-btn">Remove</button>
  </div>
</li>
```

Notice the `data-genre` attribute on the `<li>`. This is called a **data attribute** — a way to store extra information on a DOM element without it affecting the visual appearance. You set it with `setAttribute` and read it back with `getAttribute`. You may use it for the genre filter stretch challenge.

```js
function createMovieCard(title, genre) {
  // 1. Create the outer <li>
  //    - give it the class "movie-card"
  //    - use setAttribute to set data-genre to the genre value

  // 2. Create a <div> for the info section — class "movie-info"
  //    Inside it, create two <span> elements:
  //    - one with class "movie-title" — set its textContent to title
  //    - one with class "movie-genre" — set its textContent to genre (show "No genre" if empty)
  //    Append both spans into the info div

  // 3. Create a <div> for the buttons — class "movie-actions"
  //    Inside it, create two <button> elements:
  //    - one with class "watch-btn" — textContent "Mark Watched"
  //    - one with class "remove-btn" — textContent "Remove"
  //    Append both buttons into the actions div

  // 4. Append the info div and actions div into the <li>

  // 5. return the card — do NOT append it here
  //    The function's job is to build and return. Appending is the caller's job.
}
```

Now update your submit handler to use this function:

```js
// After reading the title and genre (and before form.reset()):

// 1. Call createMovieCard(title, genre) — store the result in a variable
// 2. Append the card to movieList
// 3. // TODO: call updateCount() here — you'll write that function in Phase 6
// 4. Call movieForm.reset()
```

**In the browser:** Type a title and genre, submit. A card should appear in the list with two buttons. Check DevTools — no errors, and the card structure should match the HTML above.

**Commit your work:**
```
git add .
git commit -m "phase 4: createMovieCard function, append on submit"
```

---

## Phase 5: Button Behavior

The cards are created dynamically — the buttons inside them didn't exist when the page loaded. You can't select them at the top of the file. Use **event delegation** the same way you did in Part 1: attach one listener to the list, not one per button.

**New tool you need: `closest()`**

When a button inside a card is clicked, `event.target` is the button. But you often need the whole card — the `<li>` that contains the button. `closest()` walks up the DOM tree and returns the nearest ancestor that matches a CSS selector.

```js
// event.target is the button that was clicked
// event.target.closest("li") walks UP the tree and returns the first <li> it finds
// This gives you the whole card, not just the button

const card = event.target.closest("li")
// Now you can do card.remove(), card.classList.toggle("watched"), etc.
```

```js
movieList.addEventListener("click", (event) => {
  // 1. If the click was not on a BUTTON, return early
  //    hint: event.target.tagName === "BUTTON"

  // 2. Get the card the button lives in
  //    hint: event.target.closest("li")

  // 3. Was it the remove button?
  //    - Check: event.target.classList.contains("remove-btn")
  //    - If yes: remove the card from the DOM entirely
  //      hint: card.remove()
  //    - // TODO: call updateCount() here — Phase 6
  //    - // TODO: call applyFilter(currentFilter) here — Phase 6

  // 4. Was it the watch button?
  //    - Check: event.target.classList.contains("watch-btn")
  //    - If yes: toggle the "watched" class on the card
  //      hint: card.classList.toggle("watched")
  //    - Update the button's textContent based on the new state:
  //      if the card now has .watched → set button text to "Unmark Watched"
  //      if it no longer has .watched → set button text to "Mark Watched"
  //      hint: card.classList.contains("watched") returns true or false
  //    - // TODO: call applyFilter(currentFilter) here — Phase 6
})
```

Fill in this comment before moving on:

```js
// Why do we attach the listener to #movie-list instead of to each button?
// Answer:
//
// What does event.target.closest("li") do?
// Answer:
```

**In the browser:** Add a few movies. Click Remove — the card disappears. Click Mark Watched — the card goes dim with strikethrough and the button text changes.

**Commit your work:**
```
git add .
git commit -m "phase 5: event delegation for remove and watch toggle"
```

---

## Phase 6: Count and Filters

### Part A — Keep the Count Accurate

Write a function that counts how many cards are currently in the list and updates the header.

```js
function updateCount() {
  // 1. Query all cards in the list
  //    hint: movieList.querySelectorAll(".movie-card").length

  // 2. Update movieCount.textContent
  //    e.g. "3 movies" or "1 movie" — handle the singular if you want a bonus
}
```

Now go back and fill in the two `// TODO` comments you left in Phase 4 and Phase 5:
- In your submit handler: call `updateCount()` after appending the card
- In your remove handler: call `updateCount()` after `card.remove()`

---

### Part B — Filter the List

Filtering hides cards that don't match — it doesn't delete them. You toggle the `filtered-out` class on each card.

Add a variable at the top of your file to remember the current filter:

```js
let currentFilter = "all"
```

Now write two small functions. Keeping them separate makes each one easier to reason about.

**Function 1 — update which filter button looks active:**

```js
function updateFilterButtons(activeFilter) {
  // Loop over all filter buttons
  // On each one:
  //   - remove "active-filter"
  //   - if the button's id ends with the active filter name, add "active-filter" back
  //     hint: btn.id === "filter-" + activeFilter
  filterBtns.forEach((btn) => {
    btn.classList.remove("active-filter")
    if (btn.id === "filter-" + activeFilter) {
      btn.classList.add("active-filter")
    }
  })
}
```

**Function 2 — show or hide cards based on the filter:**

```js
function applyFilter(filter) {
  // 1. Update the currentFilter variable
  currentFilter = filter

  // 2. Update the button highlighting
  updateFilterButtons(filter)

  // 3. Get all cards
  const cards = movieList.querySelectorAll(".movie-card")

  // 4. Loop over each card and decide to show or hide it
  cards.forEach((card) => {
    if (filter === "all") {
      // show every card
      card.classList.remove("filtered-out")
    } else if (filter === "watched") {
      // show only watched cards; hide the rest
      if (card.classList.contains("watched")) {
        card.classList.remove("filtered-out")
      } else {
        card.classList.add("filtered-out")
      }
    } else if (filter === "unwatched") {
      // show only unwatched cards; hide the rest
      if (!card.classList.contains("watched")) {
        card.classList.remove("filtered-out")
      } else {
        card.classList.add("filtered-out")
      }
    }
  })
}
```

Now wire up the filter buttons. Add a click listener to each one:

```js
// The filter-all button calls applyFilter("all")
// The filter-watched button calls applyFilter("watched")
// The filter-unwatched button calls applyFilter("unwatched")

// You can do this with three separate addEventListener calls — one per button
// Or loop over filterBtns and extract the filter name from each button's id
//   hint: btn.id.replace("filter-", "") turns "filter-watched" into "watched"
```

Now go back and fill in the two remaining `// TODO` comments from Phase 5:
- In your remove handler: call `applyFilter(currentFilter)` after `card.remove()`
- In your watch toggle handler: call `applyFilter(currentFilter)` after toggling

---

### Part C — Clear Watched

```js
clearWatchedBtn.addEventListener("click", () => {
  // 1. Select all cards that currently have the "watched" class
  //    hint: movieList.querySelectorAll(".watched")

  // 2. Loop over them and call .remove() on each

  // 3. Call updateCount()

  // 4. Call applyFilter(currentFilter)
})
```

**In the browser:** Add several movies. Mark a few as watched. Click the Watched filter — only watched movies show. Click Unwatched — only unwatched show. Click All — everything comes back. Click Clear Watched — watched movies disappear, count updates.

**Commit your work:**
```
git add .
git commit -m "phase 6: count tracking, filter functions, clear watched"
```

---

## Stretch Challenges

Pick one if you finish early:

- **Genre filter** — add "Action", "Comedy", etc. filter buttons. Use the `data-genre` attribute you set in Phase 4 to show only cards matching the selected genre
- **Inline edit** — add an "Edit" button to each card. When clicked, replace the title `<span>` with a pre-filled `<input>`. Show a "Save" button. On save, replace the input with a `<span>` again
- **Empty state** — when the list is empty, show a "Nothing added yet." message. Hide it when the first card appears. Update it on remove
- **Persist to localStorage** — on every change, save the list to `localStorage`. On page load, check for saved data and rebuild the cards

---

## Before You Submit

- [ ] The page looks complete before any JavaScript runs
- [ ] Titles and genres appear in each card via `textContent`
- [ ] `classList` is used (never `element.style.property`) for watched, active-filter, and filtered-out
- [ ] Your fill-in comment about `getAttribute("value")` vs `.value` is answered
- [ ] Your fill-in comments about event delegation and `.closest()` are answered
- [ ] The form clears after every submission
- [ ] Remove works — card disappears from the DOM
- [ ] Mark Watched toggles the style and updates the button text
- [ ] Filters show and hide the correct cards
- [ ] Clear Watched removes all watched cards
- [ ] `#movie-count` stays accurate after every add and remove
- [ ] One listener on `#movie-list` handles both buttons (event delegation)
- [ ] No console errors on load
- [ ] Code is formatted and readable
- [ ] Committed after every phase and pushed to GitHub
