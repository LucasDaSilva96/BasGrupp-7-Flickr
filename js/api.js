// Strict mode
"use-strict";
const KEY = "8ae72c3e923434228e7112a400a6f402";

// This function is for fetching initial data. This function returns an array
// with url for each data/img
export async function fetchInitialPhotosInfo(
  searchParam,
  resultPerPage = 20,
  currentPage = 1,
  // ↓ MUST ↓
  toasts
) {
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
      `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${KEY}&text=${searchParam}&page=${currentPage}&per_page=${resultPerPage}&sort=relevance&orientation=landscape&format=json&nojsoncallback=1`
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

export async function fetchPagination(
  searchParam,
  resultPerPage = 20,
  currentPage = 1
) {
  if (!searchParam) {
    alert("Please enter a valid search query");
    return;
  }
  try {
    const res = await fetch(
      `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${KEY}&text=${searchParam}&page=${currentPage}&per_page=${resultPerPage}&sort=relevance&orientation=landscape&format=json&nojsoncallback=1`
    );
    const { photos } = await res.json();
    const { photo } = photos;

    return getImagesSrcArray(photo);
  } catch (error) {
    throw new Error(error.message);
  }
}

// This function is to create an array with the url for each image from
// the initial data
function getImagesSrcArray(photosArray) {
  const initialArray = [];
  photosArray.map((img) => {
    const imageUrl = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}.jpg`;
    initialArray.push(imageUrl);
  });

  return initialArray;
}
