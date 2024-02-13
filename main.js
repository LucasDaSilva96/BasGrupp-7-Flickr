"use-strict"; // Strict mode

// Kolla om 'darkMode' är sparad i localStorage
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');

const enableDarkMode = () => {
// Lägg till klassen till body-elementet
document.body.classList.add('darkmode');
// Uppdatera darkMode i localStorage
localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
// Ta bort klassen från body-elementet
document.body.classList.remove('darkmode');
// Uppdatera darkMode i localStorage
localStorage.setItem('darkMode', null);
}

// Om användaren redan har besökt och aktiverat darkMode
// starta med det aktiverat
if (darkMode === 'enabled') {
enableDarkMode();
}

// När någon klickar på knappen
darkModeToggle.addEventListener('click', () => {
// Hämta deras darkMode-inställning
darkMode = localStorage.getItem('darkMode');

// Om den inte är aktiverad, aktivera den
if (darkMode !== 'enabled') {
enableDarkMode();
// Om den har aktiverats, stäng av den
} else {
disableDarkMode();
}
});

