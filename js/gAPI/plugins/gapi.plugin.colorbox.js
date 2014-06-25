// Colorbox
$(document).ready(function() {
    var win_w = $(window).width() * .60,
        win_h = $(window).height() * .75;

    $(".vbox").colorbox({iframe:true, innerWidth:win_w, innerHeight:win_h});
    $(".lbox").colorbox({ rel: 'group2', fixed: true, close: "close" });
});