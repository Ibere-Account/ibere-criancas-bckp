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
        FIC.Slides.$slides.filter(prev + ', ' + current).toggleClass('hide');

        if (FIC.Slides.$slides.filter(current).data('gallery')) {
            FIC.Slides.$slides.parent().addClass('section--gallery');
        } else {
            FIC.Slides.$slides.parent().removeClass('section--gallery');
        }

    },

    controlSlidesHandler: function () {
        $(document).on('click', '.slide__control--prev', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === 1) {
                FIC.Slides.currentSlide = FIC.Slides.totalSlides;
            } else {
                FIC.Slides.currentSlide -= 1;
            }

            FIC.Slides.showHideSlides('.slide--' + prev, '.slide--' + FIC.Slides.currentSlide);
        });

        $(document).on('click', '.slide__control--next', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === FIC.Slides.totalSlides) {
                FIC.Slides.currentSlide = 1;
            } else {
                FIC.Slides.currentSlide += 1;
            }

            FIC.Slides.showHideSlides('.slide--' + prev, '.slide--' + FIC.Slides.currentSlide);
        });
    },

    swapInteractionHandler: function () {
        var $wrapper = $('.slide__interaction--swap');

        if ($wrapper.length) {
            var $buttons = $wrapper.find('.swap__btn');

            $buttons.on('click', function () {
                var $this = $(this),
                    swap = $this.data('swap'),
                    $figure = $this.parents('.swap__actions').prev().find('.swap__figure'),
                    figureSrc = $figure.data('src');

                $buttons.removeClass('active');
                $this.addClass('active');

                $figure.attr('src', figureSrc + swap + '.jpg');
            });
        }
    },

    modalsHandler: function () {
        $(document).on('touchend click', '.slide__figure[data-modal]', function () {
            var target = $(this).data('modal');

            $(target).addClass('show');
        }).on('touchend click', '.modal__close', function () {
            $(this).parents('.modal').removeClass('show');
        });
    },

    backPageHandler: function () {
        $(document).on('click', '.logo', function () {
            history.back();
        });
    },

    init: function () {
        FIC.Slides.$slides = $('.slide');
        FIC.Slides.totalSlides = FIC.Slides.$slides.length;

        if (FIC.Slides.totalSlides > 0) {
            FIC.Slides.controlSlidesHandler();
        }

        FIC.Slides.swapInteractionHandler();
        FIC.Slides.modalsHandler();
        FIC.Slides.backPageHandler();
    }

};
