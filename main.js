"use-strict"; // Strict mode
// ********** Import ***************
import { fetchInitialPhotosInfo, fetchPagination } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.getElementById("search-btn");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

// --------------- Pagination-selection ---------------------
const pagination_wrapper = document.querySelector(
  ".pagination-sec-img-wrapper"
);
const prev_button = document.getElementById("prev-btn");
const next_button = document.getElementById("next-btn");
const page_display_nr = document.getElementById("display-nr");

// ************ Global variables ***********
// ---------------- Pagination object -----------------
const PAGINATION_PAGE_OBJ = {
  "page-1": [],
  "page-2": [],
  "page-3": [],
  "page-4": [],
  "page-5": [],
};
// -----------------------------------------------------
let currentPageNumber = 1;
const amountOfImagePerPage = 12;
let currentSearch = "God morning";
const toasts = new Toasts({
  offsetX: 20, // 20px
  offsetY: 20, // 20px
  gap: 20, // The gap size in pixels between toasts
  width: 300, // 300px
  timing: "ease", // See list of available CSS transition timings
  duration: ".5s", // Transition duration
  dimOld: true, // Dim old notifications while the newest notification stays highlighted
  position: "top-center", // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
});
// Kolla om 'darkMode' är sparad i localStorage
let darkMode = localStorage.getItem("darkMode");

// ************ Global functions ***********
const enableDarkMode = () => {
  // Lägg till klassen till body-elementet
  document.body.classList.add("darkmode");
  // Uppdatera darkMode i localStorage
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  // Ta bort klassen från body-elementet
  document.body.classList.remove("darkmode");
  // Uppdatera darkMode i localStorage
  localStorage.setItem("darkMode", null);
};

// Om användaren redan har besökt och aktiverat darkMode
// starta med det aktiverat
if (darkMode === "enabled") {
  enableDarkMode();
}

// När någon klickar på knappen
darkModeToggle.addEventListener("click", () => {
  // Hämta deras darkMode-inställning
  darkMode = localStorage.getItem("darkMode");

  // Om den inte är aktiverad, aktivera den
  if (darkMode !== "enabled") {
    enableDarkMode();
    // Om den har aktiverats, stäng av den
  } else {
    disableDarkMode();
  }
});

// This function is for fetching the default images
async function searchDefaultImages() {
  try {
    searchbar.value = "Loading...";

    const result = await fetchInitialPhotosInfo(
      currentSearch,
      amountOfImagePerPage,
      currentPageNumber,
      toasts
    );
    PAGINATION_PAGE_OBJ["page-1"] = result;
    displayResult(PAGINATION_PAGE_OBJ["page-1"]);
  } catch (error) {
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
  } finally {
    searchbar.value = currentSearch;
    searchbar.textContent = currentSearch;
  }
}

// This function is for fetching the wanted search-param images
async function searchImages(currentSearch, num_per_page, page_num, toasts) {
  try {
    searchbar.value = "Loading...";
    const result = await fetchInitialPhotosInfo(
      currentSearch,
      num_per_page,
      page_num,
      toasts
    );
    clearPaginationObj();
    PAGINATION_PAGE_OBJ["page-1"] = result;
    pagination_wrapper.innerHTML = "";
    displayResult(PAGINATION_PAGE_OBJ["page-1"]);
    scrollIntoView(page_display_nr);
  } catch (error) {
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
  } finally {
    searchbar.value = currentSearch;
    searchbar.textContent = currentSearch;
  }
}

// *** This function is in charge of updating the pagination_Images variable
// *** with the default images.
window.addEventListener("DOMContentLoaded", async () => {
  await searchDefaultImages();
});

// ************** Node-EventListeners ***************
searchbar.addEventListener("input", (e) => (currentSearch = e.target.value));

// ******* Search - eventListener **
searchIcon.addEventListener("click", async () => {
  currentPageNumber = 1;
  page_display_nr.textContent = currentPageNumber;
  await searchImages(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber,
    toasts
  );
});

// **** Scroll node-element-into-view function
function scrollIntoView(nodeEl) {
  return nodeEl.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "end",
  });
}

// ******************************* Pagination Example ************

// Display images ↓
function displayResult(result) {
  result.forEach((imgUrl) => {
    const img = document.createElement("img");
    img.src = imgUrl;
    pagination_wrapper.appendChild(img);
  });
}

// Next page logic ↓
next_button.addEventListener("click", async () => {
  currentPageNumber =
    currentPageNumber < 5 ? currentPageNumber + 1 : currentPageNumber;

  next_button.disabled = true;
  if (PAGINATION_PAGE_OBJ[`page-${currentPageNumber}`].length === 0) {
    page_display_nr.textContent = "Loading...";
    const result = await fetchPagination(
      currentSearch,
      amountOfImagePerPage,
      currentPageNumber
    );
    PAGINATION_PAGE_OBJ[`page-${currentPageNumber}`] = result;
  }
  pagination_wrapper.innerHTML = "";
  displayResult(PAGINATION_PAGE_OBJ[`page-${currentPageNumber}`]);
  page_display_nr.textContent = currentPageNumber;
  next_button.disabled = false;
});

// Previous page logic ↓
prev_button.addEventListener("click", () => {
  currentPageNumber =
    currentPageNumber > 1 ? currentPageNumber - 1 : currentPageNumber;
  pagination_wrapper.innerHTML = "";

  displayResult(PAGINATION_PAGE_OBJ[`page-${currentPageNumber}`]);
  page_display_nr.textContent = currentPageNumber;
});

// Clear PAGINATION_PAGE_OBJ function ↓
function clearPaginationObj() {
  for (const property in PAGINATION_PAGE_OBJ) {
    PAGINATION_PAGE_OBJ[property] = [];
  }
}
