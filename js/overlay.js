const images = document.querySelectorAll(".pagination-sec_img");

let imgSrc;
let selectedImage;

const modal = document.querySelector(".modal");
const modalItem = document.querySelector(".modal__content");
const clickedImage = document.createElement("img");

//function that finds what image the user clicks on

images.forEach((img) => {
     img.addEventListener("click", (e) => {
         imgSrc = e.target.src;
         selectedImage = imgSrc;
        
        //show modal
         modal.style.display = "initial";

        //send clicked image source to modal and create a new element
        clickedImage.setAttribute("src", `${selectedImage}`);
        clickedImage.setAttribute("class","modal-image");
        modalItem.appendChild(clickedImage);

        //Make it so the user can't scroll behind the modal
        document.body.style.overflow ="hidden";
    });
});


//close function for modal
const close = document.querySelector(".modal__content__close");

const modalClose = () => {
    modal.style.display ="none";
    clickedImage.removeAttribute("src");
    document.body.style.overflow = "initial";
};

close.addEventListener("click", modalClose);

//close if click outside of modal
window.onclick = function(e) {
    if (e.target === modal) {
         modalClose();
        }
}
//close if click escape on keyboard
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modalClose();
    }
})
