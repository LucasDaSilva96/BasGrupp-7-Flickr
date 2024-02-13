// Strict mode
"use-strict";

// ********** Import ***************
import { fetchInitialPhotosInfo, fetchPagination } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.getElementById("search-btn");

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

const pagination_section = document.querySelector(".pagination-sec"); // MAYA SAVED PAGINATION SEC IN CONST

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
    displayPagination(result); // MAYA LAGT TILL FRÅN GAMMAL KOD
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
    // searchbar.textContent = currentSearch; //MAYA KOMMENTERAT BORT
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

// **** display result - helper - function
function displayPagination(resultArray, page) {

  const images = document.querySelectorAll(".pagination-sec_img");
  const imagesResult = resultArray;

  images.forEach((img, i) => {
    img.src = imagesResult[i];
  });

  savePages(imagesResult, currentPageNumber); // KALLAR PÅ FUNKTION SOM SPARAR RESULTATET SOM KEY I OBJEKTET SAVEDPAGES
  console.log(currentPageNumber);
  console.log(imagesResult)
  // resultArray.map((el) => {
  //   const img = document.createElement("img");
  //   img.src = el;
  //   pagination_box.appendChild(img);
  // });
}
// ***** Next pagination - Helper-function
async function paginationNext() {
  const result = await fetchPagination(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber++
  );

  displayPagination(result, currentPageNumber);
  // savePage(result); //NY FUNKTION
  // console.log(result) // HÄR BORDE RESULTATET SPARAS I OBJEKT
}

// ***** Prev pagination - Helper-function
async function paginationPrev(page) {
  const result = await fetchPagination(
    currentSearch,
    amountOfImagePerPage,
    currentPageNumber > 1 ? currentPageNumber-- : currentPageNumber
  );

  displayPagination(result, currentPageNumber);
}

console.log(currentSearch);

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

// BLÄDDRING VIA SIFFROR

const obj = {
  "page-1": [],
  "page-2": [],
  "page-3": [],
  "page-4": [],
  "page-5": [],
};

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", async (e) => {
    e.preventDefault();
    currentStep = numIndex;

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

    obj[`page-${currentStep}`] = result;

    displayPagination(result);
    console.log(currentStep);
  });
});

// async function paginationEnd(page) { //skapa funktion till sista sida och första sidan på samma sätt
//   const result = await fetchPagination(
//     currentSearch,
//     amountOfImagePerPage,
//     currentPageNumber
//   );

//   displayPagination(result);
// }


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

  // await paginationEnd(currentStep+1)
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

  displayPagination(result);
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

const pages = {
  "page1": [],
  "page2": [],
  "page3": [],
  "page4": [],
  "page5": [],
};

function savePages(result, page) {
  
  // const images = document.querySelectorAll(".pagination-sec_img");
  // const imagesResult = result;

  // images.forEach((img, i) => {
  //   img.src = imagesResult[i]; 
  // });


  if (page === 1 && pages.page1.length === 0) {
    pages.page1 = result;

  } else if (page === 2 && pages.page2.length === 0) {
    pages.page2 = result;
  } else if (page === 3 && pages.page3.length === 0) {
    pages.page23 = result;
  } else if (page === 4 && pages.page4.length === 0) {
    pages.page4 = result;
  } else if (page === 5 && pages.page5.length === 0) {
    pages.page5 = result;
  }

  console.log(`This is pages.page1.length: ${pages.page1.length}`)
  console.log(`This is pages object: ${pages}`);
  console.log(`This is current page: ${page}`)
  
}

// console.log(pages)


// SLUT PÅ MAYAS TEST KOD


