/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin

isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

navbar = {
    hide: function() {
        $('nav.navbar').addClass("hide-navbar");
    },
    show: function() {
        $('nav.navbar').removeClass("hide-navbar");
    },
    menu: {
        hide: function() {
            $('.navbar-collapse').collapse('hide');
        },
        show: function() {
            $('.navbar-collapse').collapse('show');
        },
        isVisible: function() {
            return $('.navbar-collapse').is(':visible');
        }
    }
}


animations = {
    skillSlider: function(){
        $('.all-skills').owlCarousel({
            slideSpeed: 400,
             itemsCustom: [
                 [0, 4],
                 [400, 4],
                 [500, 5],
                 [620, 6],
                 [700, 8],
                 [992, 5],
                 [1200, 6]
             ],
        });

        var sklData = $('.all-skills').data('owlCarousel');

        var sklTgt = $('.nav-btn').find('.go');
        sklTgt.on('click', function(e){
            e.preventDefault();
            if( $(this).hasClass('go-left') ) {
                sklData.prev();
            } else {
                sklData.next();
            }
        });
    },

    scrollSpy: function() {
        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top'
        });
    },

    wow: function() {
        // Wow js to load projects
        new WOW({
            offset: 150,
            mobile: false
        }).init();
    },

    waypoint: function() {
        // Progress bar filler
        $('.skills-box').waypoint({
            handler: function(event, direction) {
                $('.progress .progress-bar').progressbar({});
            },
            offset: '60%'
        });
    },

    niceScroll: function() {
        // Nicescroll plugin
        $("html").niceScroll();
    }
}

bindPageScrollClick = function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        pageScrollClicked = true;
        setTimeout(function(){
          pageScrollClicked = false;
            navbar.hide();
        }, 1500);
        event.preventDefault();
    });
}


bindUpDownScroll = function(){
    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (pageScrollClicked == false) {
            if(isMobile && navbar.menu.isVisible()) {
                navbar.menu.hide();
            }
            if (st > lastScrollTop){
                navbar.hide();
            } else {
                navbar.show();
            }
        }
        lastScrollTop = st;
    });
}

bindNavMenuClick = function(){
    $('.navbar-collapse ul li a').click(function() {
        if (isMobile) {
            navbar.menu.hide();
        }
    });
}

$(window).load(function() {
    $('body').removeAttr('style');
    $('#preloader').find('div').fadeOut();
    $('#preloader').delay(350).fadeOut();

    // Load all animations
    for(var animation in animations) {
        eval("animations." + animation + "()");
    }

    pageScrollClicked = false;
    bindPageScrollClick();

    lastScrollTop = 0;
    bindUpDownScroll();

    bindNavMenuClick();
});
