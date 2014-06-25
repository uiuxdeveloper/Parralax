// update Rankings on rollover
    $('#topNav-rankings').click(function (event) {
        event.preventDefault();
        $(this).removeClass('active');
    });

// Pop Player Profile
    var popProfile = ({
        // params
        timer: null,

        // initialize
        _init: function () {
            this.bindEvents();
        },

        // methods
        displayPopProfile: function () {
            if (typeof this.origTopPos === 'undefined')
                this.origTopPos = $('#pop-profile').position().top;

            var topPos = $('#topNav-rankings span').offset().top - $('#topNav-rankings').offset().top + 6;
            $('#pop-profile')
                .animate({ top: topPos }, 200, function () {    // animate
                    $(this).css({ 'z-index': '10000' })        // update z-index so that it is displayed on top of the Top Nav wrapper
                });
        },
        hidePopProfile: function () {
            var topPos = this.origTopPos;
            $('#pop-profile')
                .css({ 'z-index': '-1' })                       // update z-index so that it tucks in behind Top Nav bar
                .animate({ top: topPos }, 300);                 // animate
        },

        // events
        bindEvents: function () {
            var that = this;

            // mouseover controls on Rankings Top Nav
            $(document).on('mouseenter', '#topNav-rankings', function () {
                clearTimeout(that.timer);
                that.displayPopProfile();
                $(this).children('.label').addClass('gray').html('Coming Soon');
            });
            $(document).on('mouseleave', '#topNav-rankings', function () {
                $(this).children('.label').removeClass('gray').html('Rankings');
                that.timer = setTimeout(function () {
                    that.hidePopProfile();
                }, 350);
            });

            // mouseover controls on View Profile Top Nav
            $(document).on('mouseenter', '#pop-profile', function () {
                clearTimeout(that.timer);
            });
            $(document).on('mouseleave', '#pop-profile', function () {
                that.timer = setTimeout(function () {
                    that.hidePopProfile();
                }, 350);
            });

            // open iframe onClick
            var win_w = 660,
                            win_h = $(window).height() * .80;
            $("#pop-profile").css({ 'display': 'block' }).colorbox({ iframe: true, innerWidth: win_w, innerHeight: win_h });
        }
    })._init();
// END: Pop Player Profile