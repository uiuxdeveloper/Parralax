////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Go To Official Site                                                                                                            //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function ($) {
    $.cookie = function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';

            document.cookie = [name, '=', (options.unescape == "true" ? value : encodeURIComponent(value)), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
})(jQuery);

// Document Ready Events
$(document).ready(function() {
    // redirect checkbox
    $('.css-checkbox').live("click", function () {
        if ($('#officialCheck').hasClass("checked")) {
            $(this).removeClass("spr-img_checkbox-over").addClass("spr-img_checkbox");
            $('#officialCheck').removeClass("checked").prop("checked", false);
            
            $.cookie('maplestoryBeastTamerEvent', 'true', { expires: 0, path: '/', domain: 'nexon.net' });
        } else {
            $(this).removeClass("spr-img_checkbox").addClass("spr-img_checkbox-over");

            $('#officialCheck').addClass("checked").prop("checked", true);
            $.cookie('maplestoryBeastTamerEvent', 'true', { expires: 365, path: '/', domain: 'nexon.net' });
        }
    });
    $.cookie('maplestoryBeastTamerEvent', 'true', { expires: 0, path: '/', domain: 'nexon.net' });
});

$('.css-checkbox').on("click", function () {
                if ($('#notshow').hasClass("checked")) {
                    $('#notshow').removeClass("checked");
                    $.cookie('AOSCE', null, { path: '/', domain: 'nexon.net' });
                } else {
                    $('#notshow').addClass("checked");
                    $.cookie('AOSCE', 'true', { expires: 365, path: '/', domain: 'nexon.net' });
                }
            }); 