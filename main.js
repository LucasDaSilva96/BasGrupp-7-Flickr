"use-strict";
import { fetchInitialPhotosInfo } from "./js/api.js";

// Strict mode

fetchInitialPhotosInfo().then((res) => console.log(res));
