// Play Button
$(document).ready(function() {
    $( '#btnPlayNow' ).click( function( event ) {
        event.preventDefault();

        nexon.play(gameId);
    });
});