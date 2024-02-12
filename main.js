// Strict mode
"use-strict";

// ********** Import ***************
import { fetchInitialPhotosInfo } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.querySelector(
  ".search-sec__search-box__search-svg"
);

// ************ Global variables ***********
let SEARCH_PARAM = null;
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

// ************** Node-EventListeners ***************
searchbar.addEventListener("input", (e) => (SEARCH_PARAM = e.target.value));

// ******* Search - eventListener **
searchIcon.addEventListener("click", async () => {
  try {
    searchbar.value = "Loading...";
    const result = await fetchInitialPhotosInfo(SEARCH_PARAM, 12, 1, toasts);
    console.log(result);

    //TEST
    replaceImages(result);
    //TEST

    SEARCH_PARAM = null;
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
});

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
}

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    currentStep = numIndex;

    document.querySelector(".pagination-sec_active").classList.remove("pagination-sec_active");

    number.classList.add("pagination-sec_active");

    updateBtn();
        
    searchImage(currentStep+1); // uppdatera funktionen för att hämta nästa sida - HUR?
    console.log(currentStep)
  })
})

prevNext.forEach((button) => {
    button.addEventListener("click", (e) => {
        currentStep += e.target.id === "next" ? 1 : -1; 
        numbers.forEach((number, numIndex) => {
          number.classList.toggle("pagination-sec_active", numIndex === currentStep)
          updateBtn();
        })
      })
})

startBtn.addEventListener("click", () => {
  document.querySelector(".pagination-sec_active").classList.remove("pagination-sec_active");
  numbers[0].classList.add("pagination-sec_active");
  currentStep = 0;
  updateBtn();
  endBtn.disabled = false;
  prevNext[1].disabled = false;
})

endBtn.addEventListener("click", () => {
  document.querySelector(".pagination-sec_active").classList.remove("pagination-sec_active");
  numbers[4].classList.add("pagination-sec_active");
  currentStep = 4;
  updateBtn();
  startBtn.disabled = false;
  prevNext[0].disabled = false;
})

// IMAGES

async function replaceImages(replacement) {

  const images = document.querySelectorAll(".pagination-sec_img");
  const imagesResult = replacement;

  images.forEach((img, i) => {
    img.src = imagesResult[i];
  })

}

// SLUT PÅ MAYAS TEST KOD