var $main = $('#main');

$('[data-menu]').click( function(e) {
    var $this = $(this),
        data = $this.data();

    var $menu = $(data.menu),
        menuWidth = $menu.outerWidth( true),
        x = data.direction == 'left'? -menuWidth : menuWidth;   // Accepts 'left' or 'right')

    $menu.css({
        'transition-duration': '300ms'
    });

    $main.css({
        'transition-duration': '300ms'
    });

    if ( $menu.hasClass('active')) {
        // If we clicked the same element twice, toggle closed
        $menu.removeClass('active');
        $main.css({
            'transform': ''
        })
    } else {
        // Open
        $menu.addClass('active');
        $main.css({
            'transform': 'translate3d('+ x +'px, 0px, 0px) scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skewX(0deg) skewY(0deg)'
        });
    }

    // Prevent the default behavior and stop propagation
    e.preventDefault();
});

