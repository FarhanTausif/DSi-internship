// Theme state using $state for reactivity
let themeState = $state({
    current: typeof window !== "undefined"
        ? localStorage.getItem("theme") || "light"
        : "light"
});

export function getTheme() {
    return themeState.current;
}

export function toggleTheme() {
    // Toggle between 'light' and 'dark'
    themeState.current = themeState.current === "light" ? "dark" : "light";
    
    if(typeof window !== "undefined") {
        // Save to localStorage
        localStorage.setItem("theme", themeState.current);
        
        // Update document class
        if (themeState.current === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

export function initializeTheme() {
    if(typeof window !== "undefined") {
        // Apply theme on initialization
        if (themeState.current === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

