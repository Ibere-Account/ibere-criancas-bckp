'use strict';

var FIC = FIC || [];

$(document).ready(function ()  {
    for (var i in FIC) {
        if ('function' === typeof FIC[i].init) {
            FIC[i].init();
        }
    }
});

FIC.Home = {

    datasheetHandler: function ()  {
        var $datasheet = $('.datasheet');

        $(document).on('click', '.datasheet-link', function () {
            $datasheet
                .addClass('open')
                .one('touchend click', function () {
                    $(this).removeClass('open');
                });
        });
    },

    init: function () {
        FIC.Home.datasheetHandler();
    }
};

FIC.Slides = {
    currentSlide: 1,
    totalSlides: 0,
    $slides: undefined,

    showHideSlides: function (prev, current) {
        FIC.Slides.$slides.filter('.slide--' + prev + ', .slide--' + current).toggleClass('hide');
    },

    controlSlidesHandler: function () {
        $(document).on('click', '.slide__control--prev', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === 1) {
                FIC.Slides.currentSlide = FIC.Slides.totalSlides;
            } else {
                FIC.Slides.currentSlide -= 1;
            }

            FIC.Slides.showHideSlides(prev, FIC.Slides.currentSlide);
        });

        $(document).on('click', '.slide__control--next', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === FIC.Slides.totalSlides) {
                FIC.Slides.currentSlide = 1;
            } else {
                FIC.Slides.currentSlide += 1;
            }

            FIC.Slides.showHideSlides(prev, FIC.Slides.currentSlide);
        });
    },

    init: function () {
        FIC.Slides.$slides = $('.slide');
        FIC.Slides.totalSlides = FIC.Slides.$slides.length;

        if (FIC.Slides.totalSlides > 0) {
            FIC.Slides.controlSlidesHandler();
        }
    }
};
