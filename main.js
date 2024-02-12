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
    const result = await fetchInitialPhotosInfo(SEARCH_PARAM, 20, 1, toasts);
    console.log(result);
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






const startBtn = document.querySelector("#pagination-sec_startBtn"),
endBtn = document.querySelector("#pagination-sec_endBtn"),
prevNext = document.querySelectorAll("#pagination-sec_prevNext"),
numbers = document.querySelectorAll(".pagination-sec_link");

let currentStep = 0;

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", () => {
    currentStep = numIndex;

    document.querySelector(".pagination-sec_active").classList.remove("pagination-sec_active");

    number.classList.add("pagination-sec_active");

  })
})