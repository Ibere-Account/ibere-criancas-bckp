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
    $doc: $(document),

    datasheetHandler: function ()  {
        var $datasheet = $('.datasheet');

        FIC.Home.$doc.on('click touchend', '.datasheet-link', function () {
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
