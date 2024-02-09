import Toasts from "../toast-notification/toast";
const KEY = "8ae72c3e923434228e7112a400a6f402";
// const SECRET_KEY = "708dcc5cdce2a9f9";

const toasts = new Toasts({
  offsetX: 20, // 20px
  offsetY: 20, // 20px
  gap: 20, // The gap size in pixels between toasts
  width: 300, // 300px
  timing: "ease", // See list of available CSS transition timings
  duration: ".5s", // Transition duration
  dimOld: true, // Dim old notifications while the newest notification stays highlighted
  position: "top-right", // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
});

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
    toasts.push({
      title: "Fetch status",
      content: `Error: ${error.message}`,
      style: "error",
      dismissAfter: "3s", // s = seconds
    });
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
