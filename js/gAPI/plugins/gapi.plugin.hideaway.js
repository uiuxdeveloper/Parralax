jQuery.fn.hideaway = function(options) {
    return this.each(function(){
        var el = $(this),
            tab = el.find('.hideaway-tab'),
            con = el.find('.hideaway-content');

        // Sanatize Options
            var height  = typeof options.height     === 'undefined' ? '100px' : options.height,
                easing  = typeof options.easing     === 'undefined' ? '': options.easing,
                speed   = typeof options.speed      === 'undefined' ? '500': options.speed;

        // Events
            tab.click(function(e){
                e.preventDefault();
                
                if(con.is(':visible')){
                    con.animate({'height': '0px'}, speed, easing, function(){
                        $(this).hide();
                    });
                }else{
                    con.show().animate({'height': height}, speed, easing);
                }
            });
    });
};

$(document).ready(function() {
    // Initialize hideaway plugin
    $( '#hideaway' ).hideaway({
        'height': '169px',
        'easing': 'easeInOutQuad',
        'speed': 500
    });
});