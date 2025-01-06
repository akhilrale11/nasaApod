const API_KEY = "DEMO_KEY"; // Replace with your NASA API key if needed
const BASE_URL = "https://api.nasa.gov/planetary/apod";
const currentDate = new Date().toISOString().split("T")[0];

const currentImageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Fetch and display the current image of the day
async function getCurrentImageOfTheDay() {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${currentDate}`);
    const data = await response.json();
    displayImage(data);
  } catch (error) {
    currentImageContainer.textContent = "Failed to load the image of the day.";
  }
}

// Fetch and display image of a specific date
async function getImageOfTheDay(date) {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
    const data = await response.json();
    displayImage(data);
    saveSearch(date);
    addSearchToHistory(date);
  } catch (error) {
    currentImageContainer.textContent = "Failed to load the image for the selected date.";
  }
}

// Display image and details in the UI
function displayImage(data) {
  currentImageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <img src="${data.url}" alt="NASA Image of the Day" />
    <p>${data.explanation}</p>
  `;
}

// Save search date to local storage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// Add search date to history list in the UI
function addSearchToHistory(date) {
  const listItem = document.createElement("li");
  listItem.textContent = date;
  listItem.addEventListener("click", () => getImageOfTheDay(date));
  searchHistoryList.appendChild(listItem);
}

// Load search history from local storage
function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach(addSearchToHistory);
}

// Event listener for form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = searchInput.value;
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});

// Initialize the page
getCurrentImageOfTheDay();
loadSearchHistory();
