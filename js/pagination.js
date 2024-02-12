const startBtn = document.querySelector("#pagination-sec_startBtn"),
endBtn = document.querySelector("#pagination-sec_endBtn"),
prevNext = document.querySelectorAll(".pagination-sec_prevNext"),
numbers = document.querySelectorAll(".pagination-sec_link");

let currentStep = 0;

numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    currentStep = numIndex;

    document.querySelector(".pagination-sec_active").classList.remove("pagination-sec_active");

    number.classList.add("pagination-sec_active");

  })
})

prevNext.forEach((button) => {
    button.addEventListener("click", (e) => {
        currentStep += e.target.id === "next" ? 1 : -1;
        console.log(currentStep);
        numbers.forEach((number, numIndex) => {
          
        })
      })
})