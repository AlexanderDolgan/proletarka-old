var main = function () {
    //Toggle vis terms
    $('.terms__header').click(function () {
        $('.terms__content').toggleClass('is-hide');

        var tag = $('.terms__header');
        $('html,body').animate({scrollTop: tag.offset().top}, 'slow');

    });

    //Toggle vis nav on small screen
    $('.sec-menu-btn').click(function () {
        $('.top-nav').toggleClass('is-show');

    });
};

//Header slider
$(document).ready(main);

var slides = document.querySelectorAll('#slides .slides__item');
var currentSlide = 0;
var slideInterval = setInterval(nextSlide, 5000);

function nextSlide() {
    slides[currentSlide].className = 'slides__item';
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].className = 'slides__item is-showing';
}

$(document).ready(nextSlide);
