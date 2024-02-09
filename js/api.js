import Toastify from "../toastify-js/src/toastify.js";

const KEY = "8ae72c3e923434228e7112a400a6f402";
// const SECRET_KEY = "708dcc5cdce2a9f9";

export async function fetchInitialPhotosInfo(
  searchParam = "Airplane",
  resultPerPage = 20,
  currentPage = 1
) {
  try {
    const res = await fetch(
      `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${KEY}&text=${searchParam}&page=${currentPage}&per_page=${resultPerPage}&sort=date-taken-asc&format=json&nojsoncallback=1`
    );
    const { photos } = await res.json();
    const { photo } = photos;
    console.log(photo);
    return getImagesSrcArray(photo);
  } catch (error) {
    Toastify({
      text: `${error.message}`,
      duration: 3000,
    }).showToast();
  }
}

function getImagesSrcArray(photosArray) {
  const initialArray = [];
  photosArray.map((img) => {
    const imageUrl = `https://live.staticflickr.com/${img.id}/${img.id}_${img.secret}.jpg`;
    initialArray.push(imageUrl);
  });

  return initialArray;
}
