var duration = 700;
var thumbs = {};
var lock = false;
var xhr;

isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

changeUrl = function(title, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}

id_hash = function(id) {
    return ("#" + id)
}

getdata = function(el, attrs) {
    var el = $(el);
    var data = {};
    var get = {
        top: function() {
            return el.offset().top
        },
        left: function() {
            return el.offset().left
        },
        imgh: function() {
            return el.data('size').split('x')[0]
        },
        imgw: function() {
            return el.data('size').split('x')[1]
        },
        width: function() {
            return el.width()
        }
    }

    for(var i in attrs) {
        data[attrs[i]] = eval('get.' + attrs[i] + '()');
    }
    return data
}

animationData = function(i, f) {
    var id = getdata(i, ['top', 'left', 'imgh', 'imgw']);
    var fd = getdata(f, ['top', 'left', 'width']);
    return {
        top: fd.top - id.top,
        left: fd.left - id.left,
        width: fd.width,
        height: 'auto',
        img_height: id.imgh/id.imgw*fd.width
    }
}

opacity = function(o) {
    return {
        opacity: o
    }
}

smallToLarge = function(fromEl, toEl, duration) {
    var ad = animationData(fromEl, toEl);
    fromEl = $(fromEl);
    toEl = $(toEl);
    fromEl.animate(ad, duration, function() {
        fromEl.appendTo(toEl).css({
            'top': 'auto',
            'left': 'auto',
            'width': toEl.width(),
            'height': 'auto'
        });
        xhr = $.ajax({
            url: fromEl.data('full'),
            cache: true,
            processData: false,
            success: function(data) {
                if(!$('#list').find(fromEl).length) {
                    fromEl.find('img').attr('src', fromEl.data('full'));
                }
                fromEl.find('.overlay').animate(opacity(0), duration);
            }
        });
        lock = false;
    });
    fromEl.find('p').animate({
        'font-size': 42
    }, duration);
    fromEl.find('.overlay').animate(opacity(1), duration);
};

largeToSmall = function(fromEl, beforeEl, duration) {
    var ad = animationData(fromEl, beforeEl);
    fromEl = $(fromEl);
    beforeEl = $(beforeEl);
    fromEl.animate(ad, duration, function() {
        fromEl.insertBefore(beforeEl).css({
            'top': 'auto',
            'left': 'auto',
            'width': beforeEl.width(),
            'height': 'auto'
        });
        fromEl.find('img').attr('src', thumbs[fromEl.attr('id')]);
        beforeEl.remove();
    });
    fromEl.find('p').animate({
        'font-size': 15
    }, duration);
    fromEl.find('.overlay').animate(opacity(0), duration);
}

saveThumb = function(el) {
    thumbs[$(el).attr('id')] = $(el).find('img').attr('src');
}

bindDesktopClick = function() {
    $('.collage-link').each(function(index) {
        saveThumb(this);

        $(this).click(function(e) {
            e.preventDefault();
            clickedEl = $(this);

            large = $(id_hash($('#selected').children().attr('id')));
            if (lock === true || window.location.hash === id_hash(clickedEl.attr('id'))) {
                return;
            }

            lock = true;

            $('<div>').attr('id', 'null').insertBefore(clickedEl);
            smallToLarge(clickedEl, '#selected', duration);
            largeToSmall(large, '#null', duration);

            changeUrl(document.title, id_hash(clickedEl.attr('id')));
        });
    });
}

bindMobileClick = function() {
    $('.collage-link').each(function(index){
        $(this).click(function(e) {
            e.preventDefault();
            el = $(this);
            el.find('.overlay').animate(opacity(1), duration);
            xhr = $.ajax({
                url: el.data('full'),
                cache: true,
                processData: false,
                success: function(data) {
                    el.find('.overlay').animate(opacity(0), duration);
                    el.find('img').attr('src', el.data('full'));
                    el.unbind('click');
                }
            });
        })
    })
}

$(window).load(function() {
    $('body').removeAttr('style');
    $('#preloader').find('div').fadeOut();
    $('#preloader').delay(350).fadeOut();

    if (isMobile) {
        bindMobileClick();
    }
    else {
        bindDesktopClick();

        hash = window.location.hash;
        $(hash).appendTo('#selected');
        if (!$(hash).length) {
            el = $('#list').children()[0];
        }
        else {
            el = hash;
        }
        smallToLarge(el, '#selected', 0);
        changeUrl(document.title, id_hash($(el).attr('id')));
    }

    $('html').niceScroll();
});
