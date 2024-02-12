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
        
    searchImage(SEARCH_PARAM, 12, currentStep++, toasts); // uppdatera funktionen för att hämta nästa sida - HUR?
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
