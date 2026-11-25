jQuery(document).ready(function($) {

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Header fixed on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });

    if ($(window).scrollTop() > 100) {
        $('#header').addClass('header-scrolled');
    }

    // Real view height for mobile devices
    if (window.matchMedia("(max-width: 767px)").matches) {
        $('#intro').css({ height: $(window).height() });
    }

    // Initiate the wowjs animation library
    new WOW().init();

    // Wlasny lightbox dla certyfikatow
    $(document).on('click', '.cert-zoom', function (e) {
        e.preventDefault();
        var src = this.getAttribute('href');
        var caption = this.getAttribute('title') || '';
        var $ov = $('<div class="cert-lightbox"></div>').css({
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(6,12,34,.92)', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px', cursor: 'zoom-out'
        });
        $ov.append($('<img>').attr('src', src).css({
            maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: '4px'
        }));
        if (caption) {
            $ov.append($('<p></p>').text(caption).css({
                color: '#fff', marginTop: '16px', fontSize: '15px', textAlign: 'center'
            }));
        }
        $ov.on('click', function () { $(this).remove(); });
        $('body').append($ov);
    });

    // Initialize Venobox
    $('.venobox').venobox({
        bgcolor: '',
        overlayColor: 'rgba(6, 12, 34, 0.85)',
        closeBackground: '',
        closeColor: '#fff'
    });

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });


    /*--/ Star Typed /--*/
    if ($('.text-slider').length == 1) {
        var typed_strings = $('.text-slider-items').text();
        var typed = new Typed('.text-slider', {
            strings: typed_strings.split(','),
            typeSpeed: 45,
            loop: true,
            backDelay: 1500,
            backSpeed: 25,
            showCursor: true,
            cursorChar: '|',
            onComplete: function (self) {
                self.cursor.style.display = 'none';
            }
        });
    }

    const grid = $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        percentPosition: true,
        filter: '.portfolio-featured'
    });

    // Function to update "More" button visibility
    function updateMoreButtonVisibility() {
        const isAllActive = $('.portfolio-filter[data-filter=".portfolio-featured"]').hasClass('active');
        $('.more-button').toggle(isAllActive);
    }

    updateMoreButtonVisibility();
    grid.imagesLoaded().progress(function() {
        grid.isotope('layout');
    });

    //Filter Galery Tags
    $("#portfolio .portfolio-filter").click(function() {
        $("#portfolio .portfolio-filter").removeClass('active');
        $(this).addClass('active');

        var selectedFilter = $(this).data("filter");
        //$("#portfolio-wrapper").fadeTo(100, 0);

        grid.isotope({ filter: selectedFilter });
        //setTimeout(function() {
        //$("#portfolio-wrapper").fadeTo(300, 1);
        //}, 300);
        updateMoreButtonVisibility();

    });


    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Smooth scroll for the menu and links with .scrollto classes
    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space - 20;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    // Gallery carousel (uses the Owl Carousel library)
    $(".gallery-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0: { items: 2 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 3 }
        }
    });


    $(".portfolio-element").on("click", function () {
        window.lastClickedPortfolioLink = this;
        var h3El = this.querySelector('.details h3');
        if (h3El) this.dataset.title = h3El.textContent.trim();
        var modal = document.getElementById("portfolioModal");
        modal.dataset.portfolio = this.dataset.portfolio;
        modal.dataset.type = this.dataset.type;
        modal.dataset.title = this.querySelector('.details h3').textContent;
        modal.dataset.subfolder = this.dataset.subfolder || "";
    });

   
});

const games = [
    {
        title: 'PodPoziomemMorza',
        mainImage: 'img/games/podpoziomemmorza.png',
        video: 'img/games/podpoziomemmorza.mp4',
        sideImages: ['img/games/res/PogJam2025.png'],
        gallery: ['img/games/podpoziomemmorza.png'],
        year: 2025,
        award: '',
        description: "Skomponowałam muzykę do gry o tematyce podwodnej, stworzonej podczas Game Jamu. Celem było stworzenie nastrojowej ścieżki dźwiękowej, która buduje poczucie głębi i napięcia, aby odzwierciedlać zarówno ekspolarcje, jak i niebezpieczeństwo. Wszystkie dźwięki zostały zaprojektowane tak, aby łączyć otoczenie, dynamikę bąbelków i stylizowane dźwięki interakcji, aby wzbogacić wrażenia słuchowe gracza i zwiększyć poczucie immersji. ",
        downloadLink: 'https://zinnex.itch.io/pod-poziomem-morza'
    },
    {
        title: 'QLaRat',
        mainImage: 'img/games/qlarat.png',
        video: 'img/games/qlarat.mp4',
        gallery: ['img/games/qlarat.png'],
        sideImages: ['img/games/res/PogJam2026.png'],
        year: 2026,
        award: '',
        description: 'Celem było stworzenie rytmicznej gry zaprojektowanej na kontroler w formie maty do tańca. Gracz wciela się w szczura, który porusza się w rytm muzyki. Stworzyłam rytmiczną ścieżkę dźwiękową, która bezpośrednio wspiera mechanikę rozgrywki, zapewniając wyraźne tempo i responsywność na polecenia gracza. Muzyka została zaprojektowana tak, aby była zarówno angażująca, jak i funkcjonalna.',
        downloadLink: 'https://krecikowicz.itch.io/qlarat'
    },
    {
        title: 'NoShit',
        mainImage: 'img/games/noshit.png',
        video: 'img/games/noshit.mp4',
        gallery: ['img/games/noshit.png'],
        sideImages: ['img/games/res/cyberiada.png'],
        year: 2026,
        award: '',
        description: "Szybka, humorystyczna gra zręcznościowa stworzona w zaledwie 24 godziny w ramach game jamu. Gra opowiada o bezcelowej walce z żywiołem - nagłą awarią hydrauliczną we własnym mieszkaniu. Byłam odpowiedzialna za całościową warstwę audio: muzykę, efekty dźwiękowe, oraz montaż i udźwiękowienie scenek fabularnych.",
        downloadLink: 'https://3pieczarkis.itch.io/no-shit'
    },
];

//specialty links
var specialLinks = {
    "Winner of the 2021 GMTK Game Jam": "https://youtu.be/9U4Zoagd_40?t=643",
    // Add more entries here as needed
};

let currentIndex = 0;
let isTransitioning = false;

function updateGame(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const gamejamInfo = document.querySelector('.gamejam-info');
    gamejamInfo.classList.add('fade-out');

    setTimeout(() => {
        const game = games[index];
        const mainMediaContainer = document.getElementById('gamejam-main-media');


        // Clear previous content
        mainMediaContainer.innerHTML = '';

        if (game.video) {
            // If there's a video, create and append video element
            const videoElement = document.createElement('video');
            videoElement.src = game.video;
            videoElement.className = 'gamejam-main-video';
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.controls = true;
            videoElement.loop = true;
            videoElement.playsInline = true;
            mainMediaContainer.appendChild(videoElement);
        } else if (game.gallery && game.gallery.length > 0) {
            // If there's a gallery, create and append slideshow
            const slideshowElement = document.createElement('div');
            slideshowElement.id = 'gamejam-slideshow';
            game.gallery.forEach((imageSrc, i) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.classList.add('slideshow-image');
                if (i === 0) img.classList.add('active');
                slideshowElement.appendChild(img);
            });
            mainMediaContainer.appendChild(slideshowElement);
            startSlideshow();
        }

        // Update other game details
        document.querySelector('.gamejam-year span').textContent = game.year;

        // Update award
        const awardContainer = document.querySelector('.award-container');
        const awardSpan = document.querySelector('.gamejam-award span');
        if (game.award && game.award.trim() !== '') {
            awardSpan.textContent = game.award;
            awardContainer.style.display = 'inline-flex';
            awardContainer.classList.add('shimmer-effect');
        } else {
            awardContainer.style.display = 'none';
            awardContainer.classList.remove('shimmer-effect');
        }

        // Update description
        const descriptionElement = document.querySelector('.gamejam-description');
        let description = game.description.replace(/\n/g, '<br>');

        // Check for special links
        Object.keys(specialLinks).forEach(key => {
            const regex = new RegExp(key, 'g');
            description = description.replace(regex, `<a href="${specialLinks[key]}" target="_blank">${key}</a>`);
        });

        descriptionElement.innerHTML = description;

        // Update side images
        const sideImages = document.querySelectorAll('.gamejam-side-image');
        sideImages[0].src = game.sideImages[0];
        sideImages[1].src = game.sideImages[1];

        // Update active tab
        document.querySelectorAll('.gamejam-tab').forEach((tab, idx) => {
            tab.classList.toggle('active', idx === index);
        });

        // Update download button
        const downloadButton = document.getElementById('game-download');
        if (game.downloadLink && game.downloadLink !== '#') {
            downloadButton.href = game.downloadLink;
            downloadButton.style.display = 'inline-block';
            downloadButton.target = "_blank";
        } else {
            downloadButton.style.display = 'none';
        }

        // Fade in the content
        gamejamInfo.classList.remove('fade-out');
        isTransitioning = false;
    }, 300); // This timeout should match the transition duration in CSS
}

function startSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slideshow-image');

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2600); // Change slide every 3 seconds
    }
}

function createTabs() {
    const tabsContainer = document.querySelector('.gamejam-tabs');
    games.forEach((game, index) => {
        const tab = document.createElement('img');
        tab.classList.add('gamejam-tab');
        tab.src = game.mainImage;
        tab.alt = game.title;
        tab.addEventListener('click', () => {
            currentIndex = index;
            updateGame(currentIndex);
        });
        tabsContainer.appendChild(tab);
    });
}

document.querySelector('.gamejam-prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + games.length) % games.length;
    updateGame(currentIndex);
});

document.querySelector('.gamejam-next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % games.length;
    updateGame(currentIndex);
});

// Make sure to call updateGame(0) when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateGame(0);
});

createTabs();
updateGame(currentIndex);


$('#portfolioModal').on('show.bs.modal', function () {
    var modal = this;
    $(this).find('.modal-body').load(`img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`, function () {
        $(this).find('.modal-title').text(modal.dataset.title);
        
        // Apply custom behavior to carousel after content is loaded
        customizeCarousel(modal);
    });
});

// Function to customize carousel behavior
function customizeCarousel(modal) {
    var carousel = $(modal).find('.carousel');
    var indicators = $(modal).find('.carousel-indicators .list-inline-item');

    function updateCarouselAndIndicator(index) {
        carousel.carousel('pause');
        carousel.carousel(index);
        indicators.removeClass('active');
        indicators.eq(index).addClass('active');

        // Check if the new active item is a video and play it
        playVideoIfPresent(carousel.find('.carousel-item').eq(index));
    }

    function playVideoIfPresent(carouselItem) {
        var video = carouselItem.find('video')[0];
        if (video) {
            video.currentTime = 0; // Reset video to start
            video.play();
        }
    }

    indicators.off('click').on('click', function (e) {
        e.preventDefault();
        var index = $(this).data('slide-to');
        updateCarouselAndIndicator(index);
    });

    $(modal).find('.carousel-control-prev').off('click').on('click', function (e) {
        e.preventDefault();
        var index = carousel.find('.carousel-item.active').index();
        var prevIndex = (index - 1 + carousel.find('.carousel-item').length) % carousel.find('.carousel-item').length;
        updateCarouselAndIndicator(prevIndex);
    });

    $(modal).find('.carousel-control-next').off('click').on('click', function (e) {
        e.preventDefault();
        var index = carousel.find('.carousel-item.active').index();
        var nextIndex = (index + 1) % carousel.find('.carousel-item').length;
        updateCarouselAndIndicator(nextIndex);
    });

    carousel.on('slid.bs.carousel', function () {
        var activeItem = $(this).find('.carousel-item.active');
        playVideoIfPresent(activeItem);
    });

    // Pause video when leaving the item
    carousel.on('slide.bs.carousel', function () {
        var activeItem = $(this).find('.carousel-item.active');
        var video = activeItem.find('video')[0];
        if (video) {
            video.pause();
        }
    });

    carousel.on('mouseleave', function () {
        carousel.carousel('cycle');
    });
}

$(document).ready(function () {
    function scrollModalToTop(modal) {
        setTimeout(function () {
            var scrollElement = $(modal).find('.simplebar-content-wrapper');
            if (scrollElement.length) {
                scrollElement.scrollTop(0);
            } else {
                $(modal).find('.modal-body').scrollTop(0);
            }
        }, 150);
    }

    var VIDEO_EXT = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

    // Globalna preferencja dzwieku: raz odciszone = kolejne filmy tez z dzwiekiem
    window.portfolioSoundOn = window.portfolioSoundOn || false;

    function parseMedia(trigger) {
        var media = [];
        if (!trigger) return media;

        var tileThumb = trigger.querySelector('img');
        var fallbackPoster = tileThumb ? tileThumb.getAttribute('src') : '';

        // data-gallery="plik.png, film.mp4|plakat.png, plik2.jpg"
        var list = (trigger.dataset.gallery || '').split(',');
        list.forEach(function (entry) {
            entry = entry.trim();
            if (!entry) return;
            var parts = entry.split('|');
            var src = parts[0].trim();
            var poster = (parts[1] || '').trim();
            if (VIDEO_EXT.test(src)) {
                media.push({ type: 'video', src: src, poster: poster || fallbackPoster });
            } else {
                media.push({ type: 'image', src: src, poster: src });
            }
        });

        if (trigger.dataset.video) {
            media.unshift({
                type: 'video',
                src: trigger.dataset.video,
                poster: (trigger.dataset.videoPoster || '').trim() || fallbackPoster
            });
        }

        if (!media.length && fallbackPoster) {
            media.push({ type: 'image', src: fallbackPoster, poster: fallbackPoster });
        }
        return media;
    }

    function slideHtml(m, title) {
        if (m.type === 'video') {
            return '<div class="video-slide" style="position:relative;display:inline-block;max-width:100%;">' +
                '<video class="portfolio-video w-100" src="' + m.src + '" poster="' + m.poster + '" ' +
                'controls loop playsinline preload="metadata" ' +
                'style="max-height:70vh;display:block;object-fit:contain;background:#000;"></video>' +
                '<button type="button" class="unmute-btn" ' +
                'style="position:absolute;left:14px;bottom:52px;z-index:5;border:0;border-radius:4px;' +
                'padding:8px 14px;background:rgba(0,0,0,.72);color:#fff;font-size:14px;cursor:pointer;">' +
                '<i class="fa fa-volume-up"></i> Włącz dźwięk</button>' +
                '</div>';
        }
        return '<img src="' + m.src + '" alt="' + title + '" style="max-height:70vh;object-fit:contain;">';
    }

    function buildPortfolioModal(modal) {
        var trigger = window.lastClickedPortfolioLink;
        var $body = $(modal).find('.modal-body').empty();
        var title = (trigger && trigger.dataset.title) || modal.dataset.title || '';
        var media = parseMedia(trigger);
        if (!media.length) return;

        // 1. EKRAN - karuzela
        var html = '<div class="row"><div class="carousel-wrapper w-100">' +
            '<div id="carousel1" class="carousel slide h-100" data-ride="false" data-interval="false">' +
            '<div class="carousel-inner h-100">';
        media.forEach(function (m, i) {
            html += '<div class="carousel-item h-100 text-center' + (i === 0 ? ' active' : '') + '">' +
                slideHtml(m, title) + '</div>';
        });
        html += '</div>';
        if (media.length > 1) {
            html += '<a class="carousel-control-prev" href="#carousel1" role="button" data-slide="prev">' +
                '<span class="carousel-control-prev-icon" aria-hidden="true"></span></a>' +
                '<a class="carousel-control-next" href="#carousel1" role="button" data-slide="next">' +
                '<span class="carousel-control-next-icon" aria-hidden="true"></span></a>';
        }
        html += '</div></div></div>';

        // 2. MINIATURY u dolu
        if (media.length > 1) {
            html += '<div class="row"><ul class="carousel-indicators w-100">';
            media.forEach(function (m, i) {
                html += '<li class="list-inline-item' + (i === 0 ? ' active' : '') +
                    '" data-target="#carousel1" data-slide-to="' + i + '">' +
                    '<img src="' + m.poster + '" class="img-fluid">' +
                    (m.type === 'video' ? '<i class="fa fa-play fa-2x"></i>' : '') + '</li>';
            });
            html += '</ul></div>';
        }

        // 3. SEKCJE OPISOWE
        var secStyle = 'margin-top:24px;';
        var labStyle = 'text-transform:uppercase;letter-spacing:1px;font-size:13px;opacity:.6;margin-bottom:8px;';

        var d = (trigger && trigger.dataset) || {};
        var time  = d.time  || '';
        var tools = (d.tools || '').split(',');
        var link  = (d.link  || '').trim();

        // dane per sciezka: opis + wlasna galeria
        var roles = [
            { key: 'sound',    label: 'Sound Design',    text: d.descSound    || '', gal: d.gallerySound    || '' },
            { key: 'composer', label: 'Composer',        text: d.descComposer || '', gal: d.galleryComposer || '' },
            { key: 'pm',       label: 'Project Manager', text: d.descPm       || '', gal: d.galleryPm       || '' }
        ].filter(function (r) { return r.text && r.text.trim() !== ''; });

        html += '<div class="row"><div class="modal-details w-100"><div class="page-body project-info">';

        if (title) html += '<h3 class="modal-title">' + title + '</h3>';

        if (link) {
            html += '<div style="margin-top:12px;">' +
                '<a href="' + link + '" target="_blank" rel="noopener noreferrer" ' +
                'class="btn btn-sm btn-outline-light">' +
                '<i class="fas fa-gamepad"></i> Zagraj / Build na itch.io' +
                '</a></div>';

        // 3a. ZAKRES PRAC - wybor sciezki
        if (roles.length) {
            html += '<div class="project-section" style="' + secStyle + '">' +
                '<div style="' + labStyle + '">Zakres prac w projekcie</div>' +
                '<div class="role-buttons" style="display:flex;flex-wrap:wrap;gap:8px;">';
            roles.forEach(function (r, i) {
                html += '<button type="button" class="btn btn-sm btn-outline-light role-tab-btn' +
                    (i === 0 ? ' active' : '') + '" data-role="' + r.key + '">' + r.label + '</button>';
            });
            html += '</div></div>';
        }

        // 3b. CZAS
        html += '<div class="project-section" style="' + secStyle + '">' +
            '<div style="' + labStyle + '">Czas pracy nad projektem</div><p>' + time + '</p></div>';

        // 3c. UZYTE PROGRAMY
        html += '<div class="project-section" style="' + secStyle + '">' +
            '<div style="' + labStyle + '">Użyte programy</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
        tools.forEach(function (t) {
            t = t.trim();
            if (t) html += '<span style="padding:6px 12px;border:1px solid rgba(255,255,255,.2);' +
                'border-radius:20px;font-size:14px;">' + t + '</span>';
        });
        html += '</div></div>';

        // 3d. O PROJEKCIE + 3e. ZDJECIA (zalezne od sciezki)
        html += '<div class="role-desc-output"></div>';
        html += '<div class="role-gallery-output"></div>';

        html += '</div></div></div>';

        function roleGallery(r) {
            var list = (r.gal || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
            if (!list.length) {
                list = [];
            }
            return list;
        }

        function renderRole(key) {
            var r = roles.filter(function (x) { return x.key === key; })[0];
            if (!r) return;

            $body.find('.role-desc-output').html(
                '<div class="project-section" style="' + secStyle + '">' +
                '<div style="' + labStyle + '">O projekcie</div>' +
                '<p style="line-height:1.7;">' + r.text + '</p></div>'
            );

            var gal = '<div class="project-section" style="' + secStyle + '">' +
                '<div style="' + labStyle + '">Zdjęcia do projektu</div>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">';
            roleGallery(r).forEach(function (src) {
                gal += '<a class="cert-zoom" href="' + src + '" title="' + title + '">' +
                    '<img src="' + src + '" alt="' + title + '" ' +
                    'style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:4px;">'
                    '</a>';
            });
            gal += '</div></div>';
            $body.find('.role-gallery-output').html(gal);
        }

        $body.html(html);

        if (roles.length) {
            renderRole(roles[0].key);
            $body.off('click', '.role-tab-btn').on('click', '.role-tab-btn', function () {
                $body.find('.role-tab-btn').removeClass('active');
                $(this).addClass('active');
                renderRole($(this).data('role'));
            });
        }

        // Przycisk odciszania
        $body.off('click', '.unmute-btn').on('click', '.unmute-btn', function () {
            var video = $(this).siblings('video')[0];
            if (!video) return;
            video.muted = false;
            video.volume = 1;
            window.portfolioSoundOn = true;
            video.play();
            $body.find('.unmute-btn').hide();
        });

        // Filmy startuja wyciszone (wymog przegladarek), chyba ze user juz odciszyl
        $body.find('video').each(function () {
            this.muted = !window.portfolioSoundOn;
        });
        if (window.portfolioSoundOn) {
            $body.find('.unmute-btn').hide();
        }

        if (media.length > 1) {
            customizeCarousel(modal);
        }

        // Pauzuj film przy zmianie slajdu
        $body.find('.carousel').on('slide.bs.carousel', function () {
            $body.find('video').each(function () { this.pause(); });
        });
    }

    $('#portfolioModal').on('show.bs.modal', function () {
        buildPortfolioModal(this);
        scrollModalToTop(this);
    });

    $('#portfolioModal').on('hide.bs.modal', function () {
        $(this).find('video').each(function () {
            this.pause();
        });
    });
});
