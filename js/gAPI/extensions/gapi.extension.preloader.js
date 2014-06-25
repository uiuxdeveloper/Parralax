////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Display Preloader                                                                                                              //
//                                                                                                                                //
//  Description: Display and manage preloader animation                                                                           //
//  Params                                                                                                                        //
//      eleId:                              - ID of the DOM element that is being populated with the preloadewr                   //
//      mode: (append, prepend)             - Defines how jquery going to populate the eleId with the output                      //
//      animated_img:                       - custom location of animated .gif / preloader image                                  //
//      callback:                           - Call a function when the preloader is removed                                       //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var PreLoader = gapi.$extend({

  __init__: function( options ) {
    $.PreLoader                       = this;

    // Params
    $.PreLoader.param                 = {}
    $.PreLoader.param.eleId           = typeof options.eleId      !== 'undefined' ? options.eleId : 'undefined';
    $.PreLoader.param.location        = typeof options.location   !== 'undefined' ? options.location : 'undefined';
    $.PreLoader.param.mode            = typeof options.mode       !== 'undefined' ? options.mode : 'undefined';

    $.PreLoader.param.animated_img  = 'img/anim_preloader.gif';
    //if( options.animated_img !== 'undefined' && options.animated_img !== null && options.animate_img !== '' )
    // $.PreLoader.param.animated_img  = options.animated_img;

    // Display the preloader
    $.PreLoader.view.createWrapper();
    $.PreLoader.view.createPreloader();
    $.PreLoader.view.showPreloader();
  },

  // Model
  model: {},

  // View
  view: {
    createWrapper: function() {
      if ($.PreLoader.param.mode == 'prepend') {
        if ( $.PreLoader.param.eleId == 'undefined')
          $('body').prepend( $.PreLoader.view.createContainer() );
        else
          $( $.PreLoader.param.eleId ).prepend( $.PreLoader.view.createContainer() );
      } else if ($.PreLoader.param.mode == 'append') {
        if ( $.PreLoader.param.eleId == 'undefined')
          $('body').append( $.PreLoader.view.createContainer() );
        else
          $( $.PreLoader.param.eleId ).append( $.PreLoader.view.createContainer() );
      } else {
        if ( $.PreLoader.param.eleId == 'undefined')
          $('body').html( $.PreLoader.view.createContainer() );
        else
          $( $.PreLoader.param.eleId ).html( $.PreLoader.view.createContainer() );
      }

      $.PreLoader.view.createPreloader();
    },
    createContainer: function() {
      if ( $.PreLoader.param.location == 'bottom' )
        return $('<div/>', { 'class':'preloader preloader-bottom' } );
      else
        return $('<div/>', { 'class':'preloader' } );
    },
    createPreloader: function() {
      $( '.preloader' ).html( '<div class="mha tac"><img src="' + $.PreLoader.param.animated_img + '" alt="" /></div>' );
    },
    showPreloader: function() {
      $( '.preloader' ).fadeIn();
    },
    removePreloader: function( callback ) {
      // fade out the preloader and remove
      $( '.preloader' ).fadeOut( 'slow', function(){
        $( '.preloader' ).remove();
        // callback
        $.PreLoader.param.callback        = typeof callback !== 'undefind' ? callback : 'undefined';
        $.PreLoader.controller.callback();
      });
    }
  },

  // Controller
  controller: {
    callback: function() {
      // callback
      if ( $.PreLoader.param.callback == 'undefined' && typeof $.PreLoader.param.callback === 'function')
        $.PreLoader.param.callback();
    }
  }
});