// Strict mode
"use-strict";

// ********** Import ***************
import { fetchInitialPhotosInfo, fetchPagination } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.querySelector(
  ".search-sec__search-box__search-svg"
);
const pagination_section = document.querySelector(".pagination-sec");
const pagination_box = document.querySelector(".pagination-box");
const prev_Button = document.getElementById("prev-btn");
const next_button = document.getElementById("next-btn");
const currentPage_Text = document.getElementById("current-page");

// ************ Global variables ***********
let currentPageNumber = 1;
const amountOfImagePerPage = 12;
let currentSearch = "Iphone";
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

// ************ Global functions ***********

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
    displayPagination(result);
  } catch (error) {
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
  } finally {
    searchbar.value = "";
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

    displayPagination(result);
    ScrollIntoView(pagination_section);
  } catch (error) {
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
  } finally {
    searchbar.value = "";
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
  await searchImages(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber,
    toasts
  );
});

// ************************* Example of pagination - (Not Best Practice) **************************

// **** display result - helper - function
function displayPagination(resultArray) {
  pagination_box.innerHTML = "";

  resultArray.map((el) => {
    const img = document.createElement("img");
    img.src = el;
    pagination_box.appendChild(img);
  });
}
// ***** Next pagination - Helper-function
async function paginationNext() {
  const result = await fetchPagination(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber++
  );

  displayPagination(result);
}

// ***** Prev pagination - Helper-function
async function paginationPrev() {
  const result = await fetchPagination(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber > 1 ? currentPageNumber-- : currentPageNumber
  );

  displayPagination(result);
}

// ***** Next pagination
next_button.addEventListener("click", async () => {
  currentPageNumber = currentPageNumber++;
  currentPage_Text.textContent = "Loading...";
  await paginationNext();
  currentPage_Text.textContent = currentPageNumber;
});

// ***** Prev pagination
prev_Button.addEventListener("click", async () => {
  currentPageNumber =
    currentPageNumber > 1 ? currentPageNumber-- : currentPageNumber;
  currentPage_Text.textContent = "Loading...";
  if (currentPageNumber > 1) {
    await paginationPrev();
  }
  currentPage_Text.textContent = currentPageNumber;
});

// **** Scroll node-element-into-view function
function ScrollIntoView(nodeEl) {
  return nodeEl.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "end",
  });
}
