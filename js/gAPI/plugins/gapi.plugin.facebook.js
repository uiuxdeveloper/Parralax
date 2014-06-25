////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FACEBOOK SHARE BUTTON                                                                                                          //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    // Facebook Share Button
    $('#fb-share').click(function(e){
        e.preventDefault();

        var title   = 'Mabinogi - Aces',
            summary = "Meet Erinn's newest living legends! These three figures are shrouded in myth and mystery, and they're going to change the face of Mabinogi.",
            url     = window.location,
            img     = 'http://nxcache.nexon.net/mabinogi/microsite/aces/img/fbShare.jpg';

        window.open(
            'http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + summary + '&p[url]=' + url + '&p[images][0]=' + img,
            'facebooksharedialog',
            'width=626,height=436'
        );
    });
});