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
            typeSpeed: 20,
            loop: false,
            backDelay: 1100,
            backSpeed: 10,
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
        var modal = document.getElementById("portfolioModal");
        modal.dataset.portfolio = this.dataset.portfolio;
        modal.dataset.type = this.dataset.type;
        modal.dataset.title = this.querySelector('.details h3').textContent;
        modal.dataset.subfolder = this.dataset.subfolder || "";
    });

    $('#portfolioModal').on('show.bs.modal', function () {
        var modal = this;
        $(this).find('.modal-body').empty().html('<p>Loading...</p>');
        $(this).find('.modal-title').text('');

        var pathToLoad = this.dataset.subfolder
            ? `img/${this.dataset.type}/${this.dataset.subfolder}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`
            : `img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`;

        $(this).find('.modal-body').load(pathToLoad, function (response, status, xhr) {
            if (status == "error") {
                console.log("Error loading content:", xhr.status, xhr.statusText);
                $(this).html('<p>Error loading content. Please try again.</p>');
            } else {
                $(modal).find('.modal-title').text(modal.dataset.title);
            }
        });
    });
   
});

const games = [
    {
        title: 'PodPoziomemMorza',
        mainImage: 'img/games/podpoziomemmorza/thumbnail.png',
        video: 'img/games/PodPoziomemMorza/video.mov',
        sideImages: ['img/games/QLaRat/thumbnail.png', 'img/games/res/gmtk24.png'],
        year: 2025,
        award: '',
        description: "Skomponowałam muzykę do gry o tematyce podwodnej, stworzonej podczas Game Jamu. Celem było stworzenie nastrojowej ścieżki dźwiękowej, która buduje poczucie głębi i napięcia, aby odzwierciedlać zarówno ekspolarcje, jak i niebezpieczeństwo. Wszystkie dźwięki zostały zaprojektowane tak, aby łączyć otoczenie, dynamikę bąbelków i stylizowane dźwięki interakcji, aby wzbogacić wrażenia słuchowe gracza i zwiększyć poczucie immersji. ",
        downloadLink: 'https://zinnex.itch.io/pod-poziomem-morza'
    },
    {
        title: 'QLaRat',
        mainImage: 'img/games/QLaRat/thumbnail.png',
        video: 'img/games/QLaRat/video.mov',
        gallery: [
            'img/games/TeatherNFeather/gallery/1.jpg',
            'img/games/TeatherNFeather/gallery/2.jpg',
            'img/games/TeatherNFeather/gallery/3.jpg',
            'img/games/TeatherNFeather/gallery/4.jpg',
            'img/games/TeatherNFeather/gallery/5.jpg',
            'img/games/TeatherNFeather/gallery/6.jpg',
            'img/games/TeatherNFeather/gallery/7.png',
        ],
        sideImages: ['img/games/NoShit/thumbnail.png', 'img/games/res/gmtk21.png'],
        year: 2026,
        award: '',
        description: 'Celem było stworzenie rytmicznej gry zaprojektowanej na kontroler w formie maty do tańca. Gracz wciela się w szczura, który porusza się w rytm muzyki. Stworzyłam rytmiczną ścieżkę dźwiękową, która bezpośrednio wspiera mechanikę rozgrywki, zapewniając wyraźne tempo i responsywność na polecenia gracza. Muzyka została zaprojektowana tak, aby była zarówno angażująca, jak i funkcjonalna.',
        downloadLink: 'https://krecikowicz.itch.io/qlarat'
    },
    {
        title: 'NoShit',
        mainImage: 'img/games/NoShit/thumbnail.png',
        video: 'img/games/NoShit/video.mov',
        gallery: [
            'img/games/FlowState/gallery/1.gif',
            'img/games/FlowState/gallery/2.gif',
            'img/games/FlowState/gallery/3.gif',
            'img/games/FlowState/gallery/4.gif',
            'img/games/FlowState/gallery/5.gif',
            'img/games/FlowState/gallery/1.jpg',
            'img/games/FlowState/gallery/2.jpg',
            'img/games/FlowState/gallery/3.jpg',
            'img/games/FlowState/gallery/4.jpg',
        ],
        sideImages: ['img/games/podpoziomemmorza/thumbnail.png', 'img/games/res/ggj.png'],
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

    $('#portfolioModal').on('show.bs.modal', function () {
        var modal = this;
        $(this).find('.modal-body').empty().html('<p>Loading...</p>');
        $(this).find('.modal-title').text('');

        $(this).find('.modal-body').load(`img/${this.dataset.type}/${this.dataset.portfolio}/${this.dataset.portfolio}.html`, function () {
            $(this).find('.modal-title').text(modal.dataset.title);
            customizeCarousel(modal);
            scrollModalToTop(modal);
        });
    });

    $('#portfolioModal').on('hide.bs.modal', function () {
        $(this).find('video').each(function () {
            this.pause();
        });
    });
});
