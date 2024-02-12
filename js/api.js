// Strict mode
"use-strict";
const KEY = "8ae72c3e923434228e7112a400a6f402";

// This function is for fetching initial data. This function returns an array
// with url for each data/img
export async function fetchInitialPhotosInfo(
  searchParam = "Airplane",
  resultPerPage = 20,
  currentPage = 1,
  toasts
) {
  console.log(searchParam);
  if (!searchParam) {
    toasts.push({
      title: "Fetch status",
      content: `Please enter a valid search query`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
    return;
  }
  try {
    const res = await fetch(
      `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${KEY}&text=${searchParam}&page=${currentPage}&per_page=${resultPerPage}&sort=date-taken-asc&format=json&nojsoncallback=1`
    );
    const { photos } = await res.json();
    const { photo } = photos;

    toasts.push({
      title: "Fetch status",
      content: `Fetch successfully`,
      style: "success",
      dismissAfter: "1s", // s = seconds
      closeButton: false,
    });

    return getImagesSrcArray(photo);
  } catch (error) {
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
      closeButton: false,
    });
  }
}

// This function is to create an array with the url for each image from
// the initial data
function getImagesSrcArray(photosArray) {
  const initialArray = [];
  photosArray.map((img) => {
    const imageUrl = `https://live.staticflickr.com/${img.id}/${img.id}_${img.secret}.jpg`;
    initialArray.push(imageUrl);
  });

  return initialArray;
}








const startBtn = document.querySelector("#pagination-sec_startBtn"),
endBtn = document.querySelector("#pagination-sec_endBtn"),
prevNext = document.querySelectorAll("#pagination-sec_prevNext"),
numbers = document.querySelectorAll(".pagination-sec_link");

let currentStep = 0;

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", () => {
    currentStep = numIndex;
    console.log(currentStep); 
  })
})
