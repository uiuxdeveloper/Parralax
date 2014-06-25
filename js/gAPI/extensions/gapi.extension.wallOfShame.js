////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Wall of Shame                                                                                                                  //
//                                                                                                                                //
//  Description: Restful API Call to dynamically update content on screen                                                         //
//                                                                                                                                //
//       http:/combatarms.nexon.net/api/Rank?cTab=ws3&ccat=1&pageindex=1                                                          //
//       tab values : ws3, ws1                                                                                                    //
//            desc : It's for Tab for DisHonorable, Suspended                                                                     //
//                                                                                                                                //
//       cat : 1~8                                                                                                                //
//            desc : disciplined soldiers List                                                                                    //
//                                                                                                                                //
//       page                                                                                                                     //
//            desc : current page number                                                                                          //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var WofS,WOFS = gapi.$extend({
    // Initialize
    _create: function () {
        $.WOFS = this;
        $.WOFS.model.bindEvents();
        $('.wos-tab:first').click();
    },
    _init: function ( /* tab, cat, page */) {
        $.WOFS = this;
        $.WOFS.model.getData();
    },

    // Model
    model: {
        bindEvents: function () {
            $.WOFS.controller.updateOnTabClick();
            $.WOFS.controller.updateOnPageClick();
            $.WOFS.controller.updateOnCategoryChange();
        },
        getData: function () {
            var querystring = 'http://combatarms.nexon.net/api/Rank?cTab=' + $.WOFS.tab + '&ccat=' + $.WOFS.cat + '&pageindex=' + $.WOFS.page + '&callback=?';

            //alert(querystring);
            $.ajax({
                type: "GET",
                url: querystring,
                dataType: "jsonp",
                crossDomain: true,
                success: function (data) {
                    data.currentPage = $.WOFS.page;
                    $.WOFS.view.loadData(data);
                }
            });
        },
        load: function (obj) {
            // params
            var cTab = $('#wos-tabs .active').attr('data-cTab'),
                cCat = $('#wos-cat option:selected').val(),
                page = typeof obj.attr('data-page') !== 'undefined' ? obj.attr('data-page') : 1,

            // update content
                WofS = WOFS.$withData({ tab: cTab, cat: cCat, page: page })._init();
        }
    },

    // View
    view: {
        loadData: function (data) {
            // tmpl, scriptId, eleId, data, mode, beforeStart, callback
            DotTemplates('wallOfShame.html', '#tmpl-wofs', '#wallOfShameData', data, 'overwrite', '', '');
        }
    },

    // Controller
    controller: {
        updateOnTabClick: function () {
            // click on tabs
            $('.wos-tab').click(function (event) {
                event.preventDefault();

                // remove active class from tabs
                $('.wos-tab').removeClass('active');

                // add active class to this tab
                $(this).addClass('active');

                $.WOFS.model.load($(this));
            });
        },
        updateOnPageClick: function () {
            // click on pagination
            $(document).on('click', '.wos-page', function (event) {
                event.preventDefault();

                $.WOFS.model.load($(this));
            });
        },
        updateOnCategoryChange: function () {
            // change category
            $('#wos-cat').change(function () {
                $.WOFS.model.load($(this));

                // update label
                var val = $('#wos-cat option:selected').val();
                $('.wos-cat-label').hide();
                $('#wos-cat-' + val).show();
            })
        }
    }
});
WOFS.$withData()._create();