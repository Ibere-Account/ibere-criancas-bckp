'use strict';

var FIC = FIC || [];

$(document).ready(function () {
    FIC.Slides.preloadImages();
    if (!sessionStorage.getItem('viewState')) {
        var viewState = {
            displayGuide: true,
            visitedLinks: []
        };

        sessionStorage.setItem('viewState', btoa(JSON.stringify(viewState)));
    }

    for (var i in FIC) {
        if ('function' === typeof FIC[i].init) {
            FIC[i].init();
        }
    }
});


FIC.Home = {

    datasheetHandler: function () {
        var $datasheet = $('.datasheet');

        $(document).on('click', '.datasheet-link', function () {
            $datasheet
                .addClass('open')
                .one('touchend click', function () {
                    $(this).removeClass('open');
                });
        });

        $('#help-button').hover(
            function () {
                $('#help-text').removeClass('gato__help__ballon--hide');
                $('#help-text').addClass('gato__help__ballon--show');
            },
            function () {
                $('#help-text').addClass('gato__help__ballon--hide');
                $('#help-text').removeClass('gato__help__ballon--show');
            }
        );
    },

    init: function () {
        FIC.Home.datasheetHandler();

        $('.section__link').on('click', function () {
            var viewState = JSON.parse(atob(sessionStorage.getItem('viewState'))),
                clickedLink = $(this).attr('href').replace('.html', ''),
                hasAlreadyVisited = viewState.visitedLinks.find(link => link === clickedLink);

            if (!hasAlreadyVisited) {
                viewState.visitedLinks.push(clickedLink);
            }

            sessionStorage.removeItem('viewState');
            sessionStorage.setItem('viewState', btoa(JSON.stringify(viewState)));
        });

        this.setVisitedLinks();
        this.startFirstGuideTalk();
    },

    setVisitedLinks: function () {
        var viewState = JSON.parse(atob(sessionStorage.getItem('viewState')));

        viewState.visitedLinks.map(link => $(`[href="${link}.html"]`).addClass('section__link--visited'));

    },

    startFirstGuideTalk: function () {
        var viewState = JSON.parse(atob(sessionStorage.getItem('viewState')));

        if (viewState.displayGuide) {
            window.setTimeout(() => {
                $('#guide-talk-1').removeClass('gato__help__ballon--hide');
                $('#guide-talk-1').addClass('gato__help__ballon--show');
            }, 3000);

            window.setTimeout(() => {
                $('#guide-talk-1').removeClass('gato__help__ballon--show');
                $('#guide-talk-1').addClass('gato__help__ballon--hide');

                $('#guide-talk-2').removeClass('gato__help__ballon--hide');
                $('#guide-talk-2').addClass('gato__help__ballon--show');
            }, 10000);

            window.setTimeout(() => {
                $('#guide-talk-2').removeClass('gato__help__ballon--show');
                $('#guide-talk-2').addClass('gato__help__ballon--hide');
                $('.section__link').addClass('section__link--show');
            }, 20000);

            viewState.displayGuide = false;

            sessionStorage.removeItem('viewState');
            sessionStorage.setItem('viewState', btoa(JSON.stringify(viewState)));
        } else {
            $('.section__link').addClass('section__link--show');
        }
    }
};


FIC.Slides = {
    currentSlide: 1,
    totalSlides: 0,
    $slides: undefined,

    showHideSlides: function (prev, current) {
        FIC.Slides.$slides.filter(prev + ', ' + current).toggleClass('hide');

        if (FIC.Slides.$slides.filter(current).data('gallery')) {
            FIC.Slides.$pageWrapper.addClass('no-bg');
            FIC.Slides.$slides.parent().addClass('section--gallery');
        } else if (FIC.Slides.$slides.filter(current).data('curiosities')) {
            FIC.Slides.$pageWrapper.addClass('no-bg page-wrapper--curiosities');
        }
        else {
            FIC.Slides.$pageWrapper.removeClass('no-bg');
            FIC.Slides.$slides.parent().removeClass('section--gallery');
        }

    },

    controlSlidesHandler: function () {

        $(document).on('click', '.slide__control--prev', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === 1) {
                window.location.href = '/';
            } else {
                FIC.Slides.currentSlide -= 1;
            }

            FIC.Slides.showHideSlides('.slide--' + prev, '.slide--' + FIC.Slides.currentSlide);
        });

        $(document).on('click', '.slide__control--next', function () {
            var prev = FIC.Slides.currentSlide;

            if (FIC.Slides.currentSlide === FIC.Slides.totalSlides) {
                window.location.href = '/';
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
                    $figure = $this.parents('.slide__interaction--swap').find('.swap__figure'),
                    figureSrc = $figure.data('src');

                $buttons.removeClass('active');
                $this.addClass('active');

                $figure.attr('src', figureSrc + swap + '.jpg');
            });
        }
    },

    setPortraitTops: function ($tops, $portrait) {
        var portraitTops = [];

        $tops.filter('.active').each(function () {
            portraitTops.push(this.getAttribute('data-swap'));
        });

        if (portraitTops.indexOf('olhos') !== -1 && portraitTops.indexOf('oculos') !== -1) {
            portraitTops.pop();
        }

        $portrait.attr('src', portraitTops.length === 0 ? './../img/retratos/autorretrato.jpg' : './../img/retratos/retrato/' + portraitTops.join('_') + '.jpg');
    },

    portraitTopsHandler: function () {
        var $wrapper = $('.slide__interaction--portrait');

        if ($wrapper.length) {
            var $buttons = $wrapper.find('.portrait-tops__btn'),
                $figure = $wrapper.find('.portrait-figure');

            $buttons.on('click', function () {
                $(this).toggleClass('active');

                FIC.Slides.setPortraitTops($buttons, $figure);
            });
        }
    },

    swapHandler: function () {
        var $swap = $('.slide__interaction--swap');

        if ($swap.length) {
            $swap.find('figure').eq(0).on('touchend click', function () {
                $(this).addClass('d-none');
                $swap.find('figure').eq(1).removeClass('d-none');
            });
        }
    },

    outlineHandler: function () {
        var $controls = $('.slide--7 .slide__button');

        if ($controls.length) {
            $controls.on('touchend click', function () {
                // reset controls
                $controls.find('img:first-child').removeClass('d-none');
                $controls.find('img:nth-child(2)').addClass('d-none');

                // activate the one clicked
                $(this).find('img:first-child').addClass('d-none');
                $(this).find('img:nth-child(2)').removeClass('d-none');

                var idx = $controls.index(this);
                $('.outline__figure').addClass('d-none');
                $('.outline__figure').eq(idx).removeClass('d-none');
            });
        }
    },

    modalsHandler: function () {
        $(document).on('touchend click', '.slide__figure[data-modal]', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            var $target = $($(this).data('modal'));
            $target.addClass('show');

            $target.on('click.modal', function (e) {
                if (this === e.target) {
                    $target.find('.modal__close').trigger('click');
                }
            });
        }).on('touchend click', '.modal__close', function () {
            $(this).parents('.modal.show').removeClass('show').off('click.modal');
        });
    },

    showAnimation: function () {
        $(document).on('touchend click', 'img[data-animation]', function () {
            var $this = $(this),
                src = $this.data('animation');

            $this.attr('src', src);
        }).ready(function () {
            $(window).resize(function () {
                FIC.Slides.resize();
            });
        });
    },

    lightsHandler: function () {
        var $section = $('.section.section--natureza');

        if ($section.length) {
            var $image = $section.find('.lights .slide__figure');
            var $lights = $section.find('a.light__item');
            $lights.on('click', function (e) {
                e.preventDefault();
                $(this).toggleClass('active');
                var numberLight = this.className.match(/\d+/);
                $image.toggleClass('shadow--' + numberLight);
            });
        }
    },

    landscapesHandler: function () {
        var $wrapper = $('.section--paisagem'),
            resetOptions = function () {
                $wrapper.find('.images-left .slide__figure').removeClass('selected').removeClass('unselected');
                $wrapper.find('.images-right .slide__figure').removeClass('selectable');
            };

        if ($wrapper.length) {
            var $imagesLeft = $wrapper.find('.images-left .slide__figure'),
                $imagesRight = $wrapper.find('.images-right .slide__figure');

            $imagesLeft.on('click', function () {
                var $this = $(this);
                $('.gato').removeClass('erro');
                $this.toggleClass('selected');
                $imagesRight.toggleClass('selectable');

                if ($this.hasClass('selected')) {
                    $('.slide__figure').not('.selected').addClass('unselected');
                } else {
                    $('.slide__figure').removeClass('unselected');
                }
            });
            $imagesRight.on('click', $imagesRight, function () {
                var $this = $(this),
                    $optionLeft = $wrapper.find('.images-left .slide__figure.selected'),
                    $optionRight = $this.data('image-answer');

                if ($optionLeft.data('image-answer') === $optionRight) {
                    $('.answer' + $optionLeft.data('image-answer')).show();
                    $this.addClass('right-answer');
                    $optionLeft.addClass('right-answer');
                    resetOptions();
                    $('.gato').removeClass('erro');
                } else {
                    $('.gato').addClass('erro');
                }
            });
        }
    },

    preloadImages: function () {
        var srcList = $('img').map(function () {
            return this.src;
        }).get();
        var images = [];
        for (var i = 0; i < srcList.length; i++) {
            images[i] = new Image();
            images[i].src = srcList[i];
        }
    },

    verticalScrollPresent: function () {
        return (document.documentElement.scrollHeight !== document.documentElement.clientHeight);
    },

    resize: function () {
        var heightPageWrapper = window.innerHeight,
            scale = heightPageWrapper / FIC.Slides.canvasHeight;

        if ((heightPageWrapper < FIC.Slides.canvasHeight || FIC.Slides.verticalScrollPresent()) && (scale < 1)) {
            FIC.Slides.$section.css({
                transform: 'scale(' + heightPageWrapper / FIC.Slides.canvasHeight + ')',
                'transform-origin': '50% 0%'
            });
            FIC.Slides.$section.addClass('section-scaled').addClass('section-visible');
        } else {
            FIC.Slides.$section.removeClass('section-scaled').addClass('section-visible');
        }
    },

    init: function () {
        FIC.Slides.canvasHeight = 875;
        FIC.Slides.$slides = $('.slide');
        FIC.Slides.$pageWrapper = $('.page-wrapper');
        FIC.Slides.$section = FIC.Slides.$pageWrapper.find('>.section');
        FIC.Slides.totalSlides = FIC.Slides.$slides.length;

        if (FIC.Slides.totalSlides > 0) {
            FIC.Slides.controlSlidesHandler();
        }

        FIC.Slides.resize();

        FIC.Slides.swapInteractionHandler();
        FIC.Slides.portraitTopsHandler();
        FIC.Slides.outlineHandler();
        FIC.Slides.swapHandler();
        FIC.Slides.modalsHandler();
        FIC.Slides.showAnimation();
        FIC.Slides.lightsHandler();
        FIC.Slides.landscapesHandler();
    }
};
