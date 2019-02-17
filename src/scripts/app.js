$(document).ready(function () {
    $(document).on('click touchend', '.datasheet-link', function () {
        $('.datasheet')
            .addClass('open')
            .one('touchend click', function () {
                $(this).removeClass('open');
            });
    });
});
