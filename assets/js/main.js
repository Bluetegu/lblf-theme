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