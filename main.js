"use-strict"; // Strict mode
// ********** Import ***************
import { fetchInitialPhotosInfo, fetchPagination } from "./js/api.js";
import Toasts from "./toast-notification/toast.js";

// ********** Node-selection ***************
const searchbar = document.querySelector(".search-sec__search-box__input");
const searchIcon = document.getElementById("search-btn");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

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

/******Carousel stuff */

// Assuming this import is at the top of your main JavaScript file


// // Placeholder for how you might instantiate and use the carousel
const imageUrls = ['https://picsum.photos/id/12/367/267', 'https://picsum.photos/id/13/2500/1667', 'https://picsum.photos/id/14/367/267', 'https://picsum.photos/id/15/367/267', 'https://picsum.photos/id/16/367/267'];


// Function to create slides with images
function createImageSlides(urlArray) {
  // Find the swiper-wrapper element in the document
  const swiperWrapper = document.querySelector('.swiper-wrapper');

  // Check if swiperWrapper exists
  if (!swiperWrapper) {
      console.warn('swiper-wrapper not found.');
      return;
  }

  // Clear existing content
  swiperWrapper.innerHTML = '';

  // Loop through each URL in the array
  urlArray.forEach(url => {
      // Create a new div element for the slide
      const slideElement = document.createElement('div');
      slideElement.className = 'swiper-slide';
      
      // Create an img element for the image
      const imgElement = document.createElement('img');
      imgElement.src = url;
      imgElement.alt = 'Image slide';
      
      // Append the img to the slide div
      slideElement.appendChild(imgElement);
      
      // Append the new slide to the swiper-wrapper
      swiperWrapper.appendChild(slideElement);
  });
}

// Call the function with the image URLs array
createImageSlides(imageUrls);




const swiper = new Swiper('.swiper', {
  // Optional parameters
  // direction: 'vertical',
  loop: true,
  // slidesPerView: 3,
  effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 2,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 50,
        modifier: 4,
        slideShadows: true,
      },



  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});