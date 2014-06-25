////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD doT.js TEMPLATE                                                                                                           //
//                                                                                                                                //
//  Description: Dynamically loads doT.js template through an AJAX request                                                        //
//  Params                                                                                                                        //
//      tmpl:                               - Name of the template file                                                           //
//      scriptId:                           - ID of the script reference in file being loaded from JS/tmpl/ directory             //
//      eleId:                              - ID of the DOM element that is being populated with the template                     //
//      data:                               - Incoming data being fed into doT.js template engine and rendered into final output  //
//      mode: (insert, append, prepend)     - Defines how jquery going to populate the ele with the output                        //
//      beforeStart:                        - Call a function when the ajax starts processing                                     //
//      callback:                           - Call a function when the ajax is finished processing                                //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var DotTemplates = gapi.$extend({
  __classvars__ : { tmpl_dir_path: '/js/microsite/a-better-maple/doT/' },

  __init__: function(tmpl, scriptId, eleId, data, mode, beforeStart, callback) {
      $.DotTemplates                = this;

      // Params
      $.DotTemplates.tmpl           = tmpl;
      $.DotTemplates.scriptId       = scriptId;
      $.DotTemplates.eleId          = eleId;
      $.DotTemplates.data           = data;
      $.DotTemplates.mode           = mode;
      $.DotTemplates.beforeStart    = beforeStart;
      $.DotTemplates.callback       = callback;

      $.DotTemplates.model.processTmpl();                       // process the template
  },

  // Model
  model: {
    processTmpl: function() {
      if( typeof $.DotTemplates.beforeStart !== 'undefined' && $.DotTemplates.beforeStart != '' )
        $.DotTemplates.beforeStart();

      if( typeof $.DotTemplates.model.getTmplData() === 'undefined' ) {
        $.ajax({
            type : 'GET',
            url: DotTemplates.tmpl_dir_path + $.DotTemplates.tmpl,
            dataType: 'html',
            cache : true,

            success: function( data ){
                $.DotTemplates.view.createContainer();       // Create container that stores raw template
                $.DotTemplates.view.storeTmplData( data );   // Store raw template into DOM
                $.DotTemplates.view.renderTmpl();             // Render the template
            }
        });
      } else
         $.DotTemplates.view.renderTmpl();                    // Render the template
    },

    // return raw template
    getTmplData: function() {
      return $( $.DotTemplates.scriptId ).html();
    }
  },

    // View
    view: {
      // check if #tmpl-output container already exists and create if necessary
      createContainer: function() {
        if( $( 'tmpl-output' ).length < 1 )
          $('body').append( $('<div/>', {'id':'tmpl-output'}) );
      },

      // empty the container
      resetContainer: function() {
        $( '#tmpl-output' ).html( '' );
      },

      // store the raw template
      storeTmplData: function( data ) {
        $( '#tmpl-output' ).html( data );
      },

      renderTmpl: function() {
        var tmpl = doT.template( $.DotTemplates.model.getTmplData() ),
            html = tmpl( $.DotTemplates.data );

        // insert template into DOM
        switch( $.DotTemplates.mode ) {
          case 'append':
            $( $.DotTemplates.eleId ).append( html );
            break;
          case 'prepend':
            $( $.DotTemplates.eleId ).prepend( html );
            break;
          default:
            $( $.DotTemplates.eleId ).html( html );
        }

        $.DotTemplates.controller.callback();               // Callback
      }
    },

    // Controller
    controller: {
      callback: function() {
        // callback
        if (typeof $.DotTemplates.callback == 'function')
          $.DotTemplates.callback();
        else
          $.DotTemplates.view.resetContainer();            // Reset container that stores raw template
      }
    }
});