// Strict mode
"use-strict";

// ********** Import ***************
import { fetchInitialPhotosInfo, fetchPagination } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.getElementById("search-btn");
const pagination_section = document.querySelector(".pagination-sec") //MAYA ADDED CONST

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
    savePages(result, currentPageNumber); //MAYA LAGT TILL
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

    savePages(result, page_num); //MAYA LAGT TILL
    // console.log(`This is the result: ${result} and this is page number: ${page_num}`)
    // displayPagination(result); MAYA KOMMENTERAT BORT
    
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

  rinsePages(); //MAYA ADDED - Rinse pages-object

  await searchImages(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber,
    toasts
  );
});

// **** Scroll node-element-into-view function
function ScrollIntoView(nodeEl) {
  return nodeEl.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "end",
  });
}



//MAYAS KOD


// ************************* Example of pagination - (Not Best Practice) **************************

// BUTTONS

const startBtn = document.querySelector("#pagination-sec_startBtn"),
  endBtn = document.querySelector("#pagination-sec_endBtn"),
  prevNext = document.querySelectorAll(".pagination-sec_prevNext"),
  numbers = document.querySelectorAll(".pagination-sec_link");

let currentStep = 0;

const updateBtn = () => {
  if (currentStep === 4) {
    endBtn.disabled = true;
    prevNext[1].disabled = true;
  } else if (currentStep === 0) {
    startBtn.disabled = true;
    prevNext[0].disabled = true;
  } else {
    endBtn.disabled = false;
    prevNext[1].disabled = false;
    startBtn.disabled = false;
    prevNext[0].disabled = false;
  }
};

// **** display result - helper - function

// LÄGG BILDER I IMG-ELEMENT
function displayPagination(resultArray, page) {

  const images = document.querySelectorAll(".pagination-sec_img");
  const imagesResult = resultArray;

  // CHECK IF EMPTY ----- Kolla om den är tom här??
//  if (images.length === 0) {
//   images.forEach((img, i) => {
//     img.src = imagesResult[i];
//   });
//  }

 images.forEach((img, i) => {
  img.src = imagesResult[i];
});

}

// ***** Next pagination - Helper-function
async function paginationNext() {
  const result = await fetchPagination( //----görs här en ny sökning??
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber++
  );

  savePages(result, currentPageNumber); //---kallar på funktion som sparar sidor i objektet
  // displayPagination(result, currentPageNumber);
}

// ***** Prev pagination - Helper-function
async function paginationPrev() {
  const result = await fetchPagination( //---görs här en ny sökning??
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber > 1 ? currentPageNumber-- : currentPageNumber
  );

  savePages(result, currentPageNumber);
  // displayPagination(result, currentPageNumber);
}

// BLÄDDRING VIA SIFFROR

// const obj = {
//   "page-1": [],
//   "page-2": [],
//   "page-3": [],
//   "page-4": [],
//   "page-5": [],
// };

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", async (e) => {
    e.preventDefault();
    currentStep = numIndex + 1;

    document
      .querySelector(".pagination-sec_active")
      .classList.remove("pagination-sec_active");

    number.classList.add("pagination-sec_active");

    updateBtn();

    const result = await fetchPagination(
      currentSearch,
      amountOfImagePerPage,
      currentStep
    );

    // obj[`page-${currentStep}`] = result;

    //HÄR BORDE DEN KOLLA OM DEN ÄR TOM ELLER INTE
    savePages(result, currentStep);
    console.log(`This is current step ${currentStep}`)
  });
});


//START and END BUTTONS

startBtn.addEventListener("click", async () => {
  document
    .querySelector(".pagination-sec_active")
    .classList.remove("pagination-sec_active");
  numbers[0].classList.add("pagination-sec_active");
  currentStep = 0;
  updateBtn();
  endBtn.disabled = false;
  prevNext[1].disabled = false;

  savePages(result, currentStep);
});


endBtn.addEventListener("click", async () => {
  document
    .querySelector(".pagination-sec_active")
    .classList.remove("pagination-sec_active");
  numbers[4].classList.add("pagination-sec_active");
  currentStep = 4;
  updateBtn();
  startBtn.disabled = false;
  prevNext[0].disabled = false;

  const result = await fetchPagination(
    currentSearch,
    amountOfImagePerPage,
    currentStep
  );

  savePages(result, currentStep);
});

// PREV-NEXT BUTTONS

prevNext.forEach((button) => {
  button.addEventListener("click", async (e) => {
    if (e.target.id === "next") {
      currentStep += 1;
      await paginationNext(); //Kallar på funktion
    } else if (e.target.id === "prev") {
      currentStep -= 1;
      await paginationPrev(); //Kallar på funktion
    }

    numbers.forEach((number, numIndex) => {
      number.classList.toggle(
        "pagination-sec_active",
        numIndex === currentStep
      );
      updateBtn();
    });
  });
});

//SPARA SÖKNING I OBJEKT

let pages = {
  "page1": [],
  "page2": [],
  "page3": [],
  "page4": [],
  "page5": [],
};

function savePages(result, page) {

  if (page === 1 && pages.page1.length === 0) {
    pages.page1 = result;
    displayPagination(result);
  } else if (page === 2 && pages.page2.length === 0) {
    pages.page2 = result;
    displayPagination(result);
  } else if (page === 3 && pages.page3.length === 0) {
    pages.page3 = result;
    displayPagination(result);
  } else if (page === 4 && pages.page4.length === 0) {
    pages.page4 = result;
    displayPagination(result);
  } else if (page === 5 && pages.page5.length === 0) {
    pages.page5 = result;
    displayPagination(result);
  }

  console.log(`This is pages.page1.length: ${pages.page1.length}`)
console.log(`This is pages object: ${pages}`);
console.log(`This is current page: ${page}`)

}

function rinsePages() {
  pages = {
    "page1": [],
    "page2": [],
    "page3": [],
    "page4": [],
    "page5": [],
  };
}

console.log(`This is pages.page1.length: ${pages.page1.length}`)





// SLUT PÅ MAYAS TEST KOD


