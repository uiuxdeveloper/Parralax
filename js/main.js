// Notes
//  - Combining and minimizing js using PrePros App which is compatible with codekit syntax
//
//
//
//
// Variables
    //@codekit-prepend variables.js
//
//
//
//
// Libraries
    //<!--@codekit-prepend ../libraries/jquery/jquery.1-8-2.min.js-->
    //<!--@codekit-prepend ../libraries/dot/dot.js-->
    //<!--@codekit-prepend ../libraries/sticky/jquery.sticky.js-->
    //@codekit-prepend ../libraries/easIng/easing.js
    //<!--@codekit-prepend ../libraries/tooltipster/jquery.tooltipster.min.js-->
    //<!--@codekit-prepend ../libraries/raty/jquery.raty.js-->
    //<!--@codekit-prepend ../libraries/colorbox/jquery.colorbox-min.js-->
    //<!--@codekit-prepend ../libraries/jcarousel/jquery.jcarousel.js-->
    //<!--@codekit-prepend ../libraries/jcarousel/jcarousel.simple.js-->
    //<!--@codekit-prepend ../libraries/bxslider/jquery.bxslider.min.js-->
    //<!--@codekit-prepend ../libraries/rotate/jquery.rotate.min.js-->
    //@codekit-prepend ../libraries/nicescroll/jquery.nicescroll.js
    //@codekit-prepend ../libraries/skrollr/skrollr.js
    //<!--@codekit-prepend ../libraries/mousewheel/jquery.mousewheel.js-->
//
//
//
//
// gAPI
    //<!--@codekit-prepend gAPI/gAPI.js-->

    // Extensions
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.doT.js-->
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.articles.js-->
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.preloader.js-->
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.starRating.js-->
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.starRatingStatus.js-->
        //<!--@codekit-prepend gAPI/extensions/gapi.extension.goToOfficialSite.js-->

    // Plugins
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.center.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.navScrollToId.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.colorbox.js-->
        //@codekit-prepend gAPI/plugins/gapi.plugin.playButton.js
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.fullSizeVideoImage.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.hideaway.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.backToTopFollowScroll.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.facebook.js-->
        //<!--@codekit-prepend gAPI/plugins/gapi.plugin.twitter.js-->
//
//
//
//
// Misc
    // Carousel controller
        $(".carousel-thmbs a").click( function(event){
            event.preventDefault();

            $(".carousel-thmbs a").removeClass("active")
            $(this).addClass("active");

            var img = $(this).children("img").attr("data-img");
            $("#carousel-img img").attr("src", img); 
        });
        $(".carousel-thmbs a:first").click();
    // END: Carousel controller

    // Disable Play Button during Maintenance
        $.ajax({
            type: "GET",
            url: "http://dragonnest.nexon.net/api/game/server-status",
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                if(data.IsMaintenance){
                    $("#btnPlayNow")
                        .removeClass("spr-btn_play")
                        .addClass("spr-btn_offline")
                        .css({"position":"relative", "cursor":"default"})
                        .unbind('click').click(function(e){e.preventDefault();});
                }
            }
        });
    // END: Disable Play Button during Maintenance
 
    // Parralax CSS Settings for initial left positioning of fixed elements
        $(window).resize(function(){
            if (window.RT) clearTimeout(window.RT);
                window.RT = setTimeout(function()
            {
                this.location.reload(false); /* false to get page from cache */
            }, 100);
        });

        var eleWidth, elePos, 
            wWidth = $(window).innerWidth(),
            wHeight = $(window).innerHeight();

        // body
        $("body").css({ "width" : wWidth + "px" });

        // Hero Banner
        var eleWidth = 2000,
            elePosL = wWidth < 1050 ? -475 : (wWidth - eleWidth) * .5;
            
            $("#heroBanner, #bg_videoBgWrapper").css({
                "width": wWidth - elePosL + "px",
                "left": elePosL + "px"
            });

        // rc2-title
        var elePosL = ((wWidth - 1050) * .5) + 17; 
            $("#rc2-title").css({
                "left": elePosL + "px"
            });

        // fog1
        var elePosL = wWidth < 1050 ? -4000 : ((wWidth - 1050) * .5) -4000; 
            $("#fog1")
                .attr("data-0", "left: " + (elePosL) + "px;")
                .attr("data-200", "left: " + (elePosL+2000) + "px;")
                .attr("data-350", "left: " + (elePosL+3200) + "px;")
                .attr("data-14000", "left: " + (elePosL+4000) + "px;")
                .attr("data-15000", "left: " + (elePosL+6000) + "px;");

        // fog2
        var elePosL = wWidth < 1050 ? 4000 : ((wWidth - 1050) * .5) + 4000; 
            $("#fog2")
                .attr("data-0", "left: " + (elePosL) + "px;")
                .attr("data-200", "left: " + (elePosL-2000) + "px;")
                .attr("data-350", "left: " + (elePosL-3200) + "px;")
                .attr("data-14000", "left: " + (elePosL-4000) + "px;")
                .attr("data-15000", "left: " + (elePosL-6000) + "px;");

        // event1
        var elePosL = wWidth < 1050 ? 20 : ((wWidth - 1050) * .5) + 20; 
            $("#event1")
                .attr("data-2500", "left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-3000", "left: " + (elePosL+45) + "px; opacity: 1;");
            $("#event2")
                .attr("data-5000", "left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-5500", "left: " + (elePosL+45) + "px; opacity: 1;");
            $("#event3")
                .attr("data-7500", "left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-8000", "left: " + (elePosL+45) + "px; opacity: 1;");
            $("#event4")
                .attr("data-10000", "left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-10500", "left: " + (elePosL+45) + "px; opacity: 1;");
            $("#event5")
                .attr("data-12500", "left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-13000", "left: " + (elePosL+45) + "px; opacity: 1;");

        // event details button
        var elePosL = wWidth < 1050 ? 75 : ((wWidth - 1050) * .5) + 75; 
            $("#details")
                .attr("data-5000", "top: 570px; left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-6000", "opacity: 1;")
                .attr("data-13800", "")
                .attr("data-14000", "top: 475px; left: " + (elePosL) + "px; opacity: 0;");

        // hero
        var elePosL = wWidth < 1050 ? 580 : ((wWidth - 1050) * .5) + 580,
            elePosT = (wHeight - 908);

            $("#hero")
                .css({ "left": elePosL })
                .attr("data-1500", "top: " + elePosT + "px");

        // monster
        var elePosL = wWidth < 1050 ? -153 : ((wWidth - 1050) * .5 * -1); 
            $("#monster")
                .attr("data-1000", "top: 250px; left: " + (elePosL-100) + "px; opacity: 0;")
                .attr("data-2000", "left: " + (elePosL-75) + "px; opacity: 1;")
                .attr("data-14000", "top: 100px; left: " + (elePosL+50) + "px")
                .attr("data-14150", "top: -25px; left: " + (elePosL+20) + "px; opacity: 0;");

        // moon
        var elePosL = wWidth < 1050 ? 485 : ((wWidth - 1050) * .5) + 485; 
            $("#moon").css({ "left": elePosL });

        // rat
        var elePosL = wWidth < 1050 ? -510 : ((wWidth - 1050) * .5) -510; 
            $("#rat")
                .attr("data-13500", "top: 1000px; left: " + (elePosL) + "px; opacity: 0;")
                .attr("data-14500", "opacity: 1;")
                .attr("data-15400", "top: -250px;");

        // boss
        var eleWidth = 561,
            leftPos = $("#boss").offset().left + 561;

            if(leftPos > wWidth){
                var nWidth = eleWidth - (leftPos - wWidth);
                $("#boss").width(nWidth);
            }

        // monsters
        var eleWidth = 2000,
            elePosL = wWidth < 1050 ? -475 : (wWidth - eleWidth) * .5;
            
            $("#monsters").css({
                "width": wWidth - elePosL + "px",
                "left": elePosL + "px"
            });

        skrollr.init({
            smoothScrolling: true,
            easing: "swing",
            scale: 1
        });
    // END: Parralax CSS Settings for initial left positioning of fixed elements

    // Cookie Controls
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

        $(document).ready(function() {
            $.cookie('dragonnestLevel70Event', 'true', { expires: 365, path: '/', domain: 'nexon.net' });
        });
    // Cookie Controls

    // Bounce Scroll Icon
        var intervalCount = 0, 
            intervalID = window.setInterval(function(){
                $(".scroll").animate({ marginTop: "40px" }, 1000, function() {
                    $(this).animate({ marginTop: "0px" }, 1000 );
                });

                intervalCount++;
                if(intervalCount == 5)
                    clearInterval(intervalID);
            },2100);
        
    // END: Bounce Scroll Icon

    var nice = $("html").getNiceScroll().hide(); // The document page (body)