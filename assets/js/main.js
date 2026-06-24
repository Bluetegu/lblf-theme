/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            navigation.classList.add('is-open');
            document.documentElement.style.overflowY = 'hidden';
        } else {
            navigation.classList.remove('is-open');
            document.documentElement.style.overflowY = null;
        }
    });
})();

/* Language switcher active state */
(function () {
    const pathName = window.location.pathname || '/';
    const isHebrewPath = pathName === '/he/' || pathName.indexOf('/he/') === 0;
    const activeLang = isHebrewPath ? 'he' : 'en';

    document.querySelectorAll('.gh-language-switcher a').forEach(function (link) {
        if (link.getAttribute('data-lang') === activeLang) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
        }
    });
})();

/* Keep nav Home links on Hebrew collection */
(function () {
    const pathName = window.location.pathname || '/';
    const isHebrewPath = pathName === '/he/' || pathName.indexOf('/he/') === 0;
    if (!isHebrewPath) return;

    const origin = window.location.origin;

    document.querySelectorAll('.gh-navigation .nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) return;

        if (href === '/' || href === origin + '/' || href === window.location.host + '/') {
            link.setAttribute('href', '/he/');
        }
    });
})();

/* Apply Hebrew branding overrides */
(function () {
    const pathName = window.location.pathname || '/';
    const isHebrewPath = pathName === '/he/' || pathName.indexOf('/he/') === 0;
    if (!isHebrewPath || !document.body) return;

    const englishTitle = (document.body.dataset.siteTitle || '').trim();
    const englishDescription = (document.body.dataset.siteDescription || '').trim();
    const localeUrl = (document.body.dataset.hebrewLocaleUrl || '').trim();
    const hebrewLogo = (document.body.dataset.hebrewLogoUrl || '').trim();

    function replaceMatchingText(selector, fromText, toText) {
        if (!fromText || !toText) return;

        document.querySelectorAll(selector).forEach(function (element) {
            if (element.textContent.trim() === fromText) {
                element.textContent = toText;
            }
        });
    }

    function replaceBrandLogo(selector, hebrewTitle) {
        document.querySelectorAll(selector).forEach(function (element) {
            const existingImage = element.querySelector('img');

            if (hebrewLogo) {
                const image = existingImage || document.createElement('img');
                const originalSrc = existingImage ? existingImage.getAttribute('src') : '';
                const originalAlt = existingImage ? existingImage.getAttribute('alt') : englishTitle;

                image.onerror = function () {
                    image.onerror = null;

                    if (existingImage && originalSrc) {
                        image.src = originalSrc;
                        image.alt = originalAlt || '';
                    } else if (hebrewTitle) {
                        element.textContent = hebrewTitle;
                    } else if (englishTitle) {
                        element.textContent = englishTitle;
                    }
                };

                image.src = hebrewLogo;
                image.alt = hebrewTitle || englishTitle || originalAlt || '';

                if (!existingImage) {
                    element.textContent = '';
                    element.appendChild(image);
                }

                return;
            }

            if (!existingImage && hebrewTitle && element.textContent.trim() === englishTitle) {
                element.textContent = hebrewTitle;
            }
        });
    }

    if (!localeUrl) return;

    fetch(localeUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load Hebrew locale');
            }

            return response.json();
        })
        .then(function (translations) {
            const hebrewTitle = (translations['Site Title'] || '').trim();
            const hebrewDescription = (translations['Site Description'] || '').trim();

            replaceBrandLogo('.gh-navigation-logo', hebrewTitle);
            replaceBrandLogo('.gh-footer-logo', hebrewTitle);

            replaceMatchingText('.gh-about-title', englishTitle, hebrewTitle);
            replaceMatchingText('.gh-about-description', englishDescription, hebrewDescription);
            replaceMatchingText('.gh-header-title', englishDescription, hebrewDescription);
            replaceMatchingText('.gh-footer-signup-header', englishTitle, hebrewTitle);
            replaceMatchingText('.gh-footer-signup-subhead', englishDescription, hebrewDescription);
            replaceMatchingText('.gh-cta-title', englishTitle, hebrewTitle);
            replaceMatchingText('.gh-cta-description', englishDescription, hebrewDescription);
            replaceMatchingText('.gh-container-title', 'Read more', translations['Read more']);

            if (hebrewTitle && englishTitle && document.title.indexOf(englishTitle) !== -1) {
                document.title = document.title.replace(englishTitle, hebrewTitle);
            }
        })
        .catch(function () {
            // Fall back to the default English branding if locale or logo assets are missing.
        });
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');

    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();