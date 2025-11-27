// It initializes the theme based on localStorage or defaults to 'light'
let theme = $state(
    typeof window !== "undefined"
        ? localStorage.getItem("theme") || "light"
        : "light"
);

export function getTheme() {
    return theme;
}

export function toggleTheme() {
    // Toggles between 'light' and 'dark' themes and updates localStorage and document class
    theme = (theme === "light") ? "dark" : "light";
    if(typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
        // If the theme is 'dark', it adds the 'dark' class; if it's 'light', it removes it.
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }
}

export function initializeTheme(){
    if(typeof window !== "undefined") {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }
}

