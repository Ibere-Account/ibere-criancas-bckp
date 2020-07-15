"use strict";

var FIC = FIC || [];

function isTablet() {
    const ua = navigator.userAgent;
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
}

$(document).ready(function () {
    FIC.Slides.preloadImages();
    if (!sessionStorage.getItem("viewState")) {
        var viewState = {
            displayGuide: true,
            visitedLinks: [],
        };

        sessionStorage.setItem("viewState", btoa(JSON.stringify(viewState)));
    }

    for (var i in FIC) {
        if ("function" === typeof FIC[i].init) {
            FIC[i].init();
        }
    }
});

FIC.Home = {
    datasheetHandler: function () {
        var $datasheet = $(".datasheet");

        $(document).on("click", ".datasheet-link", function () {
            $datasheet.addClass("open").one("touchend click", function () {
                $(this).removeClass("open");
            });
        });

        $("#help-button").hover(
            function () {
                $("#help-text").removeClass("gato__help__ballon--hide");
                $("#help-text").addClass("gato__help__ballon--show");
            },
            function () {
                $("#help-text").addClass("gato__help__ballon--hide");
                $("#help-text").removeClass("gato__help__ballon--show");
            }
        );
    },

    init: function () {
        FIC.Home.datasheetHandler();

        $(".section__link").on("click", function () {
            var viewState = JSON.parse(
                    atob(sessionStorage.getItem("viewState"))
                ),
                clickedLink = $(this).attr("href").replace(".html", ""),
                hasAlreadyVisited = viewState.visitedLinks.find(
                    (link) => link === clickedLink
                );

            if (!hasAlreadyVisited) {
                viewState.visitedLinks.push(clickedLink);
            }

            sessionStorage.removeItem("viewState");
            sessionStorage.setItem(
                "viewState",
                btoa(JSON.stringify(viewState))
            );
        });

        this.setVisitedLinks();
        this.startFirstGuideTalk();
    },

    setVisitedLinks: function () {
        var viewState = JSON.parse(atob(sessionStorage.getItem("viewState")));

        viewState.visitedLinks.map((link) =>
            $(`[href="${link}.html"]`).addClass("section__link--visited")
        );
    },

    startFirstGuideTalk: function () {
        var viewState = JSON.parse(atob(sessionStorage.getItem("viewState")));

        if (viewState.displayGuide) {
            window.setTimeout(() => {
                $("#guide-talk-1").removeClass("gato__help__ballon--hide");
                $("#guide-talk-1").addClass("gato__help__ballon--show");
            }, 3000);

            window.setTimeout(() => {
                $("#guide-talk-1").removeClass("gato__help__ballon--show");
                $("#guide-talk-1").addClass("gato__help__ballon--hide");

                $("#guide-talk-2").removeClass("gato__help__ballon--hide");
                $("#guide-talk-2").addClass("gato__help__ballon--show");
            }, 10000);

            window.setTimeout(() => {
                $("#guide-talk-2").removeClass("gato__help__ballon--show");
                $("#guide-talk-2").addClass("gato__help__ballon--hide");
                $(".section__link").addClass("section__link--show");
            }, 20000);

            viewState.displayGuide = false;

            sessionStorage.removeItem("viewState");
            sessionStorage.setItem(
                "viewState",
                btoa(JSON.stringify(viewState))
            );
        } else {
            $(".section__link").addClass("section__link--show");
        }
    },
};

FIC.Slides = {
    currentSlide: 1,
    totalSlides: 0,
    $slides: undefined,

    updateState: function (page) {
        window.history.pushState(
            null,
            null,
            window.location.pathname + "?s=" + page.replace(/[^0-9]/gi, "")
        );
    },

    showHideSlides: function (prev, current) {
        FIC.Slides.$slides.filter(prev + ", " + current).toggleClass("hide");

        FIC.Slides.updateState(current);

        FIC.Slides.$pageWrapper.removeClass(
            "no-bg page-wrapper--gallery page-wrapper--curiosities"
        );

        if (FIC.Slides.$slides.filter(current).data("gallery")) {
            FIC.Slides.$pageWrapper.addClass("no-bg page-wrapper--gallery");
        } else if (FIC.Slides.$slides.filter(current).data("curiosities")) {
            FIC.Slides.$pageWrapper.removeClass("no-bg page-wrapper--gallery");
            FIC.Slides.$pageWrapper.addClass("page-wrapper--curiosities");
        }
    },

    gotoPrevSlide: function () {
        var prev = FIC.Slides.currentSlide;

        if (FIC.Slides.currentSlide === 1) {
            window.location.href = "/";
        } else {
            FIC.Slides.currentSlide -= 1;
        }

        FIC.Slides.showHideSlides(
            ".slide--" + prev,
            ".slide--" + FIC.Slides.currentSlide
        );
    },

    gotoNextSlide: function () {
        var prev = FIC.Slides.currentSlide;

        if (FIC.Slides.currentSlide === FIC.Slides.totalSlides) {
            window.location.href = "/";
        } else {
            FIC.Slides.currentSlide += 1;
        }

        FIC.Slides.showHideSlides(
            ".slide--" + prev,
            ".slide--" + FIC.Slides.currentSlide
        );
    },
    controlSlidesHandler: function () {
        $(document).on("click", ".slide__control--prev", function () {
            FIC.Slides.gotoPrevSlide();
        });

        $(document).on("click", ".slide__control--next", function () {
            FIC.Slides.gotoNextSlide();
        });
    },

    swapInteractionHandler: function () {
        var $wrapper = $(".slide__interaction--swap");

        if ($wrapper.length) {
            var $buttons = $wrapper.find(".swap__btn");

            $buttons.on("click", function () {
                var $this = $(this),
                    newFigure = "",
                    swap = $this.data("swap"),
                    $figure = $this
                        .parents(".slide__interaction--swap")
                        .find(".swap__figure"),
                    figureSrc = $figure.data("src");

                $buttons.removeClass("active");

                newFigure = figureSrc + swap + ".jpg";
                if (newFigure == $figure.attr("src")) {
                    newFigure = figureSrc + "original.jpg";
                } else {
                    $this.addClass("active");
                }

                $figure.attr("src", newFigure);
            });
        }
    },

    setPortraitTops: function ($tops, $portrait) {
        var portraitTops = [];

        $tops.filter(".active").each(function () {
            portraitTops.push(this.getAttribute("data-swap"));
        });

        if (
            portraitTops.indexOf("olhos") !== -1 &&
            portraitTops.indexOf("oculos") !== -1
        ) {
            portraitTops.pop();
        }

        $portrait.attr(
            "src",
            portraitTops.length === 0
                ? "./../img/retratos/autorretrato.jpg"
                : "./../img/retratos/retrato/" + portraitTops.join("_") + ".jpg"
        );
    },

    portraitTopsHandler: function () {
        var $wrapper = $(".slide__interaction--portrait");

        if ($wrapper.length) {
            var $buttons = $wrapper.find(".portrait-tops__btn"),
                $figure = $wrapper.find(".portrait-figure");

            $buttons.on("click", function () {
                $(this).toggleClass("active");

                FIC.Slides.setPortraitTops($buttons, $figure);
            });
        }
    },

    swapHandler: function () {
        var $swap = $(".slide__interaction--swap");

        if ($swap.length) {
            $swap
                .find("figure")
                .eq(0)
                .on("touchend click", function () {
                    //$(this).addClass("d-none");
                    $swap.find("figure").eq(1).removeClass("d-none");
                });
        }
    },

    outlineHandler: function () {
        var $controls = $(".slide--7 .slide__button");

        if ($controls.length) {
            $controls.on("touchend click", function () {
                // reset controls
                $controls.find("img:first-child").removeClass("d-none");
                $controls.find("img:nth-child(2)").addClass("d-none");

                // activate the one clicked
                $(this).find("img:first-child").addClass("d-none");
                $(this).find("img:nth-child(2)").removeClass("d-none");

                var idx = $controls.index(this);
                $(".outline__figure").addClass("d-none");
                $(".outline__figure").eq(idx).removeClass("d-none");
            });
        }
    },

    modalsHandler: function () {
        $(document)
            .on("touchend click", ".slide__figure[data-modal]", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();

                var $target = $($(this).data("modal"));
                $target.addClass("show");

                FIC.Slides.$pageWrapper.addClass("modal-show-bg");

                FIC.Slides.$pageWrapper.on("click.modal", function (e) {
                    if (this === e.target) {
                        $target.find(".modal__close").trigger("click");
                    }
                });

                $target.on("click.modal", function (e) {
                    if (this === e.target) {
                        $target.find(".modal__close").trigger("click");
                    }
                });
            })
            .on("touchend click", ".modal__close", function () {
                $(this)
                    .parents(".modal.show")
                    .removeClass("show")
                    .off("click.modal");
                FIC.Slides.$pageWrapper.removeClass("modal-show-bg");
            });
    },

    showAnimation: function () {
        $(document)
            .on("touchend click", "img[data-animation]", function () {
                var $this = $(this),
                    src = $this.data("animation");

                $this.attr("src", src);
            })
            .ready(function () {
                $(window).resize(function () {
                    setTimeout(function () {
                        FIC.Slides.resize();
                    }, 0);
                });
            });
    },

    lightsHandler: function () {
        var $section = $(".section.section--natureza");

        if ($section.length) {
            var $image = $section.find(".lights .slide__figure");
            var $lights = $section.find("a.light__item");
            $lights.on("click", function (e) {
                e.preventDefault();
                $(this).toggleClass("active");
                var numberLight = this.className.match(/\d+/);
                $image.toggleClass("shadow--" + numberLight);
            });
        }
    },

    landscapesHandler: function () {
        var $wrapper = $(".section--paisagem"),
            resetOptions = function () {
                $wrapper
                    .find(".images-left .slide__figure")
                    .removeClass("selected")
                    .removeClass("unselected");
                $wrapper
                    .find(".images-right .slide__figure")
                    .removeClass("selectable");
            };

        if ($wrapper.length) {
            var $imagesLeft = $wrapper.find(".images-left .slide__figure"),
                $imagesRight = $wrapper.find(".images-right .slide__figure");

            $imagesLeft.on("click", function () {
                var $this = $(this);
                $(".gato").removeClass("erro");
                $this.toggleClass("selected");
                $imagesRight.toggleClass("selectable");

                if ($this.hasClass("selected")) {
                    $(".slide__figure").not(".selected").addClass("unselected");
                } else {
                    $(".slide__figure").removeClass("unselected");
                }
            });
            $imagesRight.on("click", $imagesRight, function () {
                var $this = $(this),
                    $optionLeft = $wrapper.find(
                        ".images-left .slide__figure.selected"
                    ),
                    $optionRight = $this.data("image-answer");

                if ($optionLeft.data("image-answer") === $optionRight) {
                    $(".answer" + $optionLeft.data("image-answer")).show();
                    $this.addClass("right-answer");
                    $optionLeft.addClass("right-answer");
                    resetOptions();
                    $(".gato").removeClass("erro");
                } else {
                    $(".gato").addClass("erro");
                }
            });
        }
    },

    preloadImages: function () {
        var srcList = $("img")
            .map(function () {
                return this.src;
            })
            .get();
        var images = [];
        for (var i = 0; i < srcList.length; i++) {
            images[i] = new Image();
            images[i].src = srcList[i];
        }
    },

    verticalScrollPresent: function () {
        return (
            document.documentElement.scrollHeight !==
            document.documentElement.clientHeight
        );
    },

    resize: function () {
        var heightPageWrapper = window.innerHeight,
            scale = heightPageWrapper / FIC.Slides.canvasHeight;

        if (
            // heightPageWrapper < 700 ||
            !isTablet() /*
                (heightPageWrapper < FIC.Slides.canvasHeight ||
                    FIC.Slides.verticalScrollPresent()) && */ &&
            scale < 1
        ) {
            FIC.Slides.$section.css({
                transform:
                    "scale(" +
                    heightPageWrapper / FIC.Slides.canvasHeight +
                    ")",
                "transform-origin": "50% 0%",
            });
            FIC.Slides.$section.addClass("section-scaled");
        } else {
            FIC.Slides.$section.css({
                transform: "scale(1)",
                "transform-origin": "50% 0%",
            });
            FIC.Slides.$section.removeClass("section-scaled");
        }
        FIC.Slides.$section.addClass("section-visible");
    },

    initPagination: function () {
        if (/[&?]s=\d+?/.test(window.location.search)) {
            var pageNumber = Number(
                window.location.search.replace(/^.*[&?]s=(\d+).*$/, "$1")
            );
            FIC.Slides.currentSlide =
                pageNumber !== NaN &&
                pageNumber > 0 &&
                pageNumber <= FIC.Slides.totalSlides
                    ? pageNumber
                    : 1;
        }
        FIC.Slides.showHideSlides(
            ".slide--0",
            ".slide--" + FIC.Slides.currentSlide
        );
    },

    keyboardSetup: function () {
        var x0 = null;
        var lock = function (e) {
            x0 = unify(e).clientX;
        };
        var unify = function (e) {
            return e.changedTouches ? e.changedTouches[0] : e;
        };

        function move(e) {
            e.preventDefault();
            if (x0 || x0 === 0) {
                var dx = unify(e).clientX - x0,
                    s = Math.sign(dx);
                if (Math.abs(dx) > 10) {
                    if (s < 0) FIC.Slides.gotoNextSlide();
                    if (s > 0) FIC.Slides.gotoPrevSlide();
                    x0 = null;
                }
            }
        }

        FIC.Slides.$pageWrapper[0].addEventListener("mousedown", lock, false);
        FIC.Slides.$pageWrapper[0].addEventListener("touchstart", lock, false);

        FIC.Slides.$pageWrapper[0].addEventListener(
            "touchmove",
            (e) => {
                e.preventDefault();
            },
            false
        );

        FIC.Slides.$pageWrapper[0].addEventListener("mouseup", move, false);
        FIC.Slides.$pageWrapper[0].addEventListener("touchend", move, false);

        $(document).on("keydown", function (e) {
            try {
                if (e.key == "ArrowRight") {
                    FIC.Slides.gotoNextSlide();
                }
                if (e.key == "ArrowLeft") {
                    FIC.Slides.gotoPrevSlide();
                }
            } catch (e) {}
        });
    },

    init: function () {
        FIC.Slides.canvasHeight = 875;
        FIC.Slides.$slides = $(".slide");
        FIC.Slides.$pageWrapper = $(".page-wrapper");
        FIC.Slides.$section = FIC.Slides.$pageWrapper.find(">.section");
        FIC.Slides.totalSlides = FIC.Slides.$slides.length;

        if (FIC.Slides.totalSlides > 0) {
            FIC.Slides.initPagination();
            FIC.Slides.controlSlidesHandler();
            FIC.Slides.keyboardSetup();
        }

        setTimeout(function () {
            FIC.Slides.resize();
        }, 0);

        FIC.Slides.swapInteractionHandler();
        FIC.Slides.portraitTopsHandler();
        FIC.Slides.outlineHandler();
        FIC.Slides.swapHandler();
        FIC.Slides.modalsHandler();
        FIC.Slides.showAnimation();
        FIC.Slides.lightsHandler();
        FIC.Slides.landscapesHandler();
    },
};
