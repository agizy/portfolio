/* js/theme-switch.js */
document.addEventListener('DOMContentLoaded', function() {
    const themes = [
        'light', 'dark', 'mint', 'candy', 'nord',
        'dracula', 'monokai', 'tokyo_night', 'gruvbox_dark', 'gruvbox_light',
        'catppuccin_mocha', 'ocean', 'sunset', 'lavender', 'serika',
        'terminal', 'cyberpunk', 'paper', 'high_contrast', 'botanical', 'sky'
    ];

    let currentThemeIndex = 0;
    const themeToggle = document.getElementById('themeToggle');
    const themeName = themeToggle ? themeToggle.querySelector('.theme-name') : null;
    const currentThemeDisplay = document.getElementById('currentTheme');
    let previewTimeout = null;

    // Initialize theme
    function init() {
        console.log('Theme switcher initializing...');

        // Load saved theme or use system preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme && themes.includes(savedTheme)) {
            currentThemeIndex = themes.indexOf(savedTheme);
            console.log('Loaded saved theme:', savedTheme);
        } else if (prefersDark && !savedTheme) {
            currentThemeIndex = themes.indexOf('dark');
            console.log('Using system dark theme');
        } else {
            currentThemeIndex = 0; // default to light
            console.log('Using default light theme');
        }

        applyTheme();
        bindEvents();
    }

    // Apply theme
    function applyTheme() {
        const theme = themes[currentThemeIndex];
        console.log('Applying theme:', theme);

        // Set the new theme
        document.documentElement.setAttribute('data-theme', theme);

        // Update display elements
        if (currentThemeDisplay) {
            currentThemeDisplay.textContent = theme.replace('_', ' ');
        }

        if (themeToggle && themeName) {
            const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
            themeName.textContent = nextTheme.replace('_', ' ');
            themeToggle.setAttribute('aria-label', `Switch to ${nextTheme.replace('_', ' ')} theme`);
        }

        console.log('Theme applied successfully:', theme);
    }

    // Preview theme on hover
    function previewTheme() {
        const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
        console.log('Previewing theme:', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);

        // Update footer display during preview
        if (currentThemeDisplay) {
            currentThemeDisplay.textContent = nextTheme.replace('_', ' ');
        }
    }

    // Revert to current theme
    function revertTheme() {
        console.log('Reverting to theme:', themes[currentThemeIndex]);
        document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);

        // Restore footer display
        if (currentThemeDisplay) {
            currentThemeDisplay.textContent = themes[currentThemeIndex].replace('_', ' ');
        }
    }

    // Cycle to next theme
    function cycleTheme() {
        console.log('Cycling theme...');
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        animateThemeChange();
        setTimeout(() => {
            applyTheme();
            saveTheme();
        }, 150); // Delay theme application to sync with animation
    }

    // Save theme to localStorage
    function saveTheme() {
        const theme = themes[currentThemeIndex];
        localStorage.setItem('portfolio-theme', theme);
        console.log('Theme saved:', theme);
    }

    // Bind events
    function bindEvents() {
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Theme button clicked');
                clearTimeout(previewTimeout);
                cycleTheme();
            });

            themeToggle.addEventListener('mouseenter', function() {
                console.log('Theme button hovered');
                previewTimeout = setTimeout(previewTheme, 200); // Small delay for smoother UX
            });

            themeToggle.addEventListener('mouseleave', function() {
                console.log('Theme button mouseout');
                clearTimeout(previewTimeout);
                revertTheme();
            });

            console.log('Theme toggle events bound');
        } else {
            console.error('Theme toggle button not found');
        }

        // Keyboard shortcut: Ctrl/Cmd + Shift + T
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                console.log('Keyboard shortcut used');
                cycleTheme();
            }
        });

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            if (!localStorage.getItem('portfolio-theme')) {
                currentThemeIndex = e.matches ? themes.indexOf('dark') : 0;
                applyTheme();
                console.log('System theme changed:', e.matches ? 'dark' : 'light');
            }
        });
    }

    // Theme change animation (inspired by MonkeyType's smooth transition)
    function animateThemeChange() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.body.appendChild(overlay);

        // Trigger fade-in
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.5';
        });

        // Fade out and remove
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 150);
    }

    // Initialize everything
    init();

    // Expose for debugging
    window.themeDebug = {
        themes,
        currentTheme: () => themes[currentThemeIndex],
        cycleTheme,
        applyTheme,
        previewTheme,
        revertTheme
    };
});

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
