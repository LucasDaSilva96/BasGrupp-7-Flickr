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