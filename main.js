// // Strict mode
// "use-strict";

// // ********** Import ***************
// import { fetchInitialPhotosInfo } from "./js/api.js";
// import Toasts from "./toast-notification/toast.js";

// // ********** Node-selection ***************
// const searchbar = document.querySelector(".search-sec__search-box__input");
// const searchIcon = document.querySelector(
//   ".search-sec__search-box__search-svg"
// );

// // ************ Global variables ***********
// let SEARCH_PARAM = null;
// const toasts = new Toasts({
//   offsetX: 20, // 20px
//   offsetY: 20, // 20px
//   gap: 20, // The gap size in pixels between toasts
//   width: 300, // 300px
//   timing: "ease", // See list of available CSS transition timings
//   duration: ".5s", // Transition duration
//   dimOld: true, // Dim old notifications while the newest notification stays highlighted
//   position: "top-center", // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
// });

// // ************** Node-EventListeners ***************
// searchbar.addEventListener("input", (e) => (SEARCH_PARAM = e.target.value));

// // ******* Search - eventListener **
// searchIcon.addEventListener("click", async () => {
//   try {
//     searchbar.value = "Loading...";
//     const result = await fetchInitialPhotosInfo(SEARCH_PARAM, 12, 1, toasts);
//     console.log(result);

//     //TEST
//     replaceImages(result);
//     //TEST

//     SEARCH_PARAM = null;
//   } catch (error) {
//     toasts.push({
//       title: "Fetch status",
//       content: `Error: ${error.message}`,
//       style: "error",
//       dismissAfter: "3s", // s = seconds
//       closeButton: false,
//     });
//   } finally {
//     searchbar.value = "";
//   }
// });

//MAYAS TEST KOD
//TEST

// searchIcon.addEventListener("click", () => {
//   let page = 1;
//   async function searchImage(SEARCH_PARAM, numOfImg, page, toasts) {
//     try {
//       searchbar.value = "Loading...";
//       const result = await fetchInitialPhotosInfo(SEARCH_PARAM, numOfImg, page, toasts);
//       // TEST
//       replaceImages(result); //Kalla på funktion för att ersätta bildkällorna med resultatet, hur göra detta med defaultläget??
//       // TEST

//       SEARCH_PARAM = null;
//     } catch (error) {
//       toasts.push({
//         title: "Fetch status",
//         content: `Error: ${error.message}`,
//         style: "error",
//         dismissAfter: "3s", // s = seconds
//         closeButton: false,
//       });
//     } finally {
//       searchbar.value = "";
//     }
//   };
// })

//TEST

//NY KOD
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
  // pagination_box.innerHTML = "";

  const images = document.querySelectorAll(".pagination-sec_img");
  const imagesResult = resultArray;

  images.forEach((img, i) => {
    img.src = imagesResult[i];
  });

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

// prevNext.forEach((button) => {
//   button.addEventListener("click", async (e) => {
//       if (e.target.id === "next") {
//         currentStep += 1;
//         await paginationNext();
//       } else if (e.target.id === "prev") {
//         currentStep -= 1;
//         await paginationPrev();
//       }

//       numbers.forEach((number, numIndex) => {
//         number.classList.toggle("pagination-sec_active", numIndex === currentStep)
//         updateBtn();
//       })
//     })
// })

// ***** Next pagination
// next_button.addEventListener("click", async () => {
//   currentPageNumber = currentPageNumber++;
//   // currentPage_Text.textContent = "Loading...";
//   await paginationNext();
//   // currentPage_Text.textContent = currentPageNumber;
// });

// ***** Prev pagination
// prev_Button.addEventListener("click", async () => {
//   currentPageNumber =
//     currentPageNumber > 1 ? currentPageNumber-- : currentPageNumber;
//   // currentPage_Text.textContent = "Loading...";
//   if (currentPageNumber > 1) {
//     await paginationPrev();
//   }
//   // currentPage_Text.textContent = currentPageNumber;
// });

// **** Scroll node-element-into-view function
function ScrollIntoView(nodeEl) {
  return nodeEl.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "end",
  });
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

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    currentStep = numIndex;

    document
      .querySelector(".pagination-sec_active")
      .classList.remove("pagination-sec_active");

    number.classList.add("pagination-sec_active");

    updateBtn();

    // searchImage(currentStep+1); // uppdatera funktionen för att hämta nästa sida - HUR?
    // console.log(currentStep)
  });
});

// prevNext.forEach((button) => {
//     button.addEventListener("click", (e) => {
//         currentStep += e.target.id === "next" ? 1 : -1;
//         numbers.forEach((number, numIndex) => {
//           number.classList.toggle("pagination-sec_active", numIndex === currentStep)
//           updateBtn();
//         })
//       })
// })

// async function paginationEnd(page) { //skapa funktion till sista sida och första sidan på samma sätt
//   const result = await fetchPagination(
//     currentSearch,
//     amountOfImagePerPage,
//     currentPageNumber
//   );

//   displayPagination(result);
// }

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

endBtn.addEventListener("click", () => {
  document
    .querySelector(".pagination-sec_active")
    .classList.remove("pagination-sec_active");
  numbers[4].classList.add("pagination-sec_active");
  currentStep = 4;
  updateBtn();
  startBtn.disabled = false;
  prevNext[0].disabled = false;
});

// IMAGES

// async function replaceImages(replacement) {

//   const images = document.querySelectorAll(".pagination-sec_img");
//   const imagesResult = replacement;

//   images.forEach((img, i) => {
//     img.src = imagesResult[i];
//   })

// }

// SLUT PÅ MAYAS TEST KOD

prevNext.forEach((button) => {
  button.addEventListener("click", async (e) => {
    if (e.target.id === "next") {
      currentStep += 1;
      await paginationNext();
    } else if (e.target.id === "prev") {
      currentStep -= 1;
      await paginationPrev();
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
