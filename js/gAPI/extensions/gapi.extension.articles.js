////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ARTICLES                                                                                                                       //
//  @extends gapi                                                                                                                 //
//                                                                                                                                //
//  Description: News articles stored in Spotlight                                                                                //
//  Params                                                                                                                        //
//      page:                               - what page of data from database should we find                                      //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Articles = gapi.$extend({

    __init__: function (options, action, callback) {
        $.Articles = this;

        // Global Params
        $.Articles.param = {};
        $.Articles.param.loadingStatus = false;
        $.Articles.param.firstArticleLoaded = false;
        $.Articles.param.infiniteScrollAutoThreshold = 0;       // page number when infinite scrolling stops and user has to manually pull up new articles
        $.Articles.param.dataLength = 1;
        $.Articles.param.defaultRecords = 20;
        $.Articles.param.enableInfiniteScroll = typeof options.enableInfiniteScroll === 'undefined' ? false : options.enableInfiniteScroll;
        $.Articles.param.enableClickToLoadArticleDetail = typeof options.enableClickToLoadArticleDetail === 'undefined' ? false : options.enableClickToLoadArticleDetail;

        $.Articles.param.renderSticky = typeof options.renderSticky === 'undefined' ? false : options.renderSticky;
        $.Articles.param.rewriteRule = typeof options.rewriteRule === 'undefined' ? 'append' : options.rewriteRule;
        $.Articles.param.start = typeof options.start === 'undefined' ? null : options.start;
        $.Articles.param.end = typeof options.end === 'undefined' ? null : options.end;
        $.Articles.param.month = typeof options.month === 'undefined' ? null : options.month;
        $.Articles.param.day = typeof options.day === 'undefined' ? null : options.day;
        $.Articles.param.year = typeof options.year === 'undefined' ? null : options.year;
        $.Articles.param.page = typeof options.page === 'undefined' ? 1 : options.page;
        $.Articles.param.records = typeof options.records === 'undefined' ? 20 : options.records;
        $.Articles.param.contentNo = typeof options.contentNo === 'undefined' ? null : options.contentNo;
        $.Articles.param.contentNoNext = typeof options.contentNoNext === 'undefined' ? null : options.contentNoNext;
        $.Articles.param.gameCode = typeof options.gameCode === 'undefined' ? null : options.gameCode;
        $.Articles.param.boardNo = typeof options.boardNo === 'undefined' ? 200 : options.boardNo;
        $.Articles.param.listPage = typeof options.listPage === 'undefined' ? 0 : options.listPage;
        $.Articles.param.lastScrollTop = typeof options.lastScrollTop === 'undefined' ? 0 : options.lastScrollTop;
        $.Articles.param.monthThreshold = typeof options.monthThreshold === 'undefined' ? 0 : options.monthThreshold;
        $.Articles.param.yearThreshold = typeof options.yearThreshold === 'undefined' ? 0 : options.yearThreshold;
        $.Articles.param.renderAd = typeof options.renderAd === 'undefined' ? false : options.renderAd;
        $.Articles.param.filter = typeof options.filter === 'undefined' ? false : options.filter;

        $.Articles.param.action = typeof action === 'undefined' ? 'All' : action;

        // Callback
        $.Articles.callback = callback;

        // Data Sets
        $.Articles.data = {};
        $.Articles.data.overflow = {};
        $.Articles.data.stickyArticles = {};
        $.Articles.adData = typeof options.adData === 'undefined' ? false : options.adData;

        // Load initial set of articles
        $.Articles.model.findStickyArticles('Sticky');
        $.Articles.model.findArticles();

        // Bind infinite scrolling
        if ($.Articles.param.enableInfiniteScroll == true)
            $.Articles.controller.bindInfiniteScroll();

        // Bind LoadMoreArticles Btn
        if ($('#loadMoreArticles').length > 0)
            $.Articles.controller.bindShowMoreArticlesBtn();
    },

    // Model
    model: {
        findArticles: function () {
            var preloader, processRequest = true,
            querystring = "http://gapi.nexon.net/api/" + $.Articles.param.gameCode + "/news/" + $.Articles.param.action + "?boardNo=" + $.Articles.param.boardNo;

            // start loading articles and render
            switch ($.Articles.param.action) {
                case 'Range':
                    preloader = PreLoader({ eleId: '#preLoader' });             // display preloader
                    querystring += "&page=" + $.Articles.param.page + "&start=" + $.Articles.param.start + "&end=" + $.Articles.param.end;
                    break;
                case 'Period':
                    preloader = PreLoader({ eleId: '#preLoader' });             // display preloader
                    querystring += "&records=" + $.Articles.param.records;
                    querystring += $.Articles.param.month !== null ? "&month=" + $.Articles.param.month : '';
                    querystring += $.Articles.param.day !== null ? "&day=" + $.Articles.param.day : '';
                    querystring += $.Articles.param.year !== null ? "&year=" + $.Articles.param.year : '';
                    break;
                case 'Sticky':
                    querystring += "&records=" + $.Articles.param.records;
                    break;
                case 'DetailMenu':
                    preloader = PreLoader({ eleId: '#preLoader' });             // display preloader
                    querystring += "&contentNo=" + $.Articles.param.contentNo + "&pageNo=" + $.Articles.param.page + "&records=" + $.Articles.param.records;
                    break;
                case 'Detail':
                    preloader = PreLoader({ eleId: '#preLoader' });             // display preloader
                    querystring += "&contentNo=" + $.Articles.param.contentNo;
                    break;
                case 'All':
                    if ($.Articles.param.dataLength > 0) {
                        preloader = PreLoader({ eleId: '#preLoader' });             // display preloader
                        querystring += "&page=" + $.Articles.param.page + "&records=" + $.Articles.param.records + "&month=" + $.Articles.param.monthThreshold + "&year=" + $.Articles.param.yearThreshold;
                    } else {
                        $.Articles.param.enableInfiniteScroll = false;
                        processRequest = false;
                    }

                    // send param that counts the number of articles already displayed on the screen minus any stick articles
                    if ($.Articles.param.filter != true)
                        var skip = $('.articlePreview').length;
                    else
                        var skip = 0;

                    var stickyCount = $('.articleSticky').length;
                    if (stickyCount == 2)
                        querystring += "&skip=" + (skip - stickyCount);
                    else if (stickyCount == 1) {
                        skip++;
                        querystring += "&skip=" + skip;
                    } else
                        querystring += "&skip=" + skip;

                    break;
            }
            querystring += "&callback=?";

            // API Call
            //alert(querystring);
            if (processRequest == true) {
                $.ajax({
                    type: "GET",
                    url: querystring,
                    dataType: "jsonp",
                    crossDomain: true,
                    success: function (data) {

                        // extend data
                        if (typeof data !== 'undefined' && data !== null) {

                            if (data.length > 0)
                                data.articles = data;
                            data.page = $.Articles.param.page;

                            // start loading articles and render
                            switch ($.Articles.param.action) {
                                case 'DetailMenu':
                                    //data.stickyArticles = $.Articles.data.stickyArticles;
                                    $.Articles.view.loadArticlesList(data);
                                    break;
                                case 'Detail':
                                    data.articles = data;
                                    $.Articles.view.loadArticlesDetail(data);
                                    break;
                                case 'Range':
                                    $.Articles.view.loadArticles(data);
                                    break;
                                case 'Period':
                                    $.Articles.view.loadArticles(data);
                                    break;
                                case 'All':
                                    data.stickyArticles = $.Articles.data.stickyArticles;
                                    $.Articles.view.loadArticles(data);
                                    break;
                            }
                        }
                    },
                    error: function () {
                        $.PreLoader.view.removePreloader();                                   // remove preloader
                        $.Articles.param.enableInfiniteScroll = false;                        // turn off infinite scroll
                    }
                });
            }
        },
        findStickyArticles: function () {
            querystring = "http://gapi.nexon.net/api/" + $.Articles.param.gameCode + "/news/Sticky?boardNo=" + $.Articles.param.boardNo;
            querystring += "&records=" + $.Articles.param.records;
            querystring += "&callback=?";

            $.ajax({
                type: "GET",
                url: querystring,
                dataType: "jsonp",
                crossDomain: true,
                success: function (data) {
                    $.Articles.data.stickyArticles = data;
                }
            });
        },
        isScrolledIntoView: function (elem) {
            var docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height(),
            elemTop = $(elem).offset().top,
            elemBottom = elemTop + $(elem).height();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
          && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        isScrolledIntoDivView: function (elem, divID) {
            var docViewTop = $(divID).scrollTop();
            var docViewBottom = docViewTop + $(divID).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        preventOverflow: function (data) {
            /* 
            * Prevent overflow from wrapping around bottom
            * save data so that it can be appended to future data from API call during infiniate scrolling
            * offset by 2
            */
            var overflowData = [
                data[data.length - 1],                  // first offset
                data[data.length - 2]                   // second offset
            ];
            $.Articles.data.overflow = overflowData;

            // remove last two objects from array
            data.splice((data.length - 2), 2);

            return data;
        }
    },

    // View
    view: {
        loadArticles: function (data) {
            $.Articles.param.dataLength = data.length;
            if (data.length > 0) {
                if ($.Articles.param.action == 'Period') {
                    DotTemplates('articles.html', '#tmplArticles', '#articles', data, 'overwrite', '', function () {
                        if (typeof $.Articles.callback !== 'undefined')
                            $.Articles.callback();

                        $.Articles.controller.showArticles();
                    });
                } else {
                    // render html
                    if ($.Articles.param.renderSticky == true) {
                        // append sticky articles to data set
                        if ($.Articles.data.stickyArticles.length > 0) {
                            for (var i = 0; i < $.Articles.data.stickyArticles.length; i++) {
                                $.Articles.data.stickyArticles[i].isSticky = true;                          // flag this data to indicate it is a sticky article

                                if (i == 0) {
                                    // Offset overflow that rows always have a full set of 4 articles when avaialble
                                    data = $.Articles.model.preventOverflow(data);

                                    // add sticky to beginning of data set
                                    data.splice(0, 0, $.Articles.data.stickyArticles[0]);
                                }
                                if (i == 1) {
                                    if ($.Articles.param.renderAd == true)
                                        data.splice(2, 0, $.Articles.data.stickyArticles[1]);               // add 2nd sticky into middle of data set
                                    else
                                        data.splice(3, 0, $.Articles.data.stickyArticles[1]);               // add 2nd sticky into middle of data set
                                    data.push($.Articles.data.overflow[1], $.Articles.data.overflow[0]);    // add objects from overflow into data set
                                    $.Articles.data.overflow = {};                                          // reset overflow
                                }
                            }
                        }

                        if ($.Articles.param.renderAd == true) {
                            if ($.Articles.data.stickyArticles.length == 0)
                                data.splice(3, 0, $.Articles.adData);               // splice add ad into 4th slot in the data set
                            else
                                data.splice(2, 0, $.Articles.adData);               // splice add ad into 2nd slot in the data set

                            DotTemplates('articles-withAd.html', '#tmplArticles-withAd', '#articles', data, $.Articles.param.rewriteRule, '', function () {
                                if (typeof $.Articles.callback !== 'undefined')
                                    $.Articles.callback();

                                $.Articles.view.loadStickyArticles($.Articles.data.stickyArticles);

                                // Apply Countdown
                                $(function () {
                                    var eventDay = new Date($.Articles.adData.eventDay);
                                    $('#count-timer').countdown({ until: $.countdown.UTCDate(-7, eventDay), compact: true, format: 'HMS', description: '' });

                                    $('#count-title').html($.Articles.adData.title);

                                    if ($.Articles.adData.origPrice != '' || $.Articles.adData.origPrice > 0)
                                        $('#count-nx-price').html($.Articles.adData.origPrice + ' NX');
                                    $('#count-nx-sale').html($.Articles.adData.salePrice + ' NX');
                                });

                                loadModules();
                            });

                        } else {
                            DotTemplates('articles.html', '#tmplArticles', '#articles', data, $.Articles.param.rewriteRule, '', function () {
                                if (typeof $.Articles.callback !== 'undefined')
                                    $.Articles.callback();

                                $.Articles.controller.showArticles();
                            });
                        }
                    } else {
                        if ($.Articles.data.overflow.length > 0) {
                            // move overflow to beginning of this data set
                            data.unshift($.Articles.data.overflow[0]);
                            data.unshift($.Articles.data.overflow[1]);

                            // reset overflow
                            $.Articles.data.overflow = {};

                            // Offset overflow that rows always have a full set of 4 articles when avaialble
                            data = $.Articles.model.preventOverflow(data);
                        }

                        DotTemplates('articles.html', '#tmplArticles', '#articles', data, $.Articles.param.rewriteRule, '', function () {
                            if (typeof $.Articles.callback !== 'undefined')
                                $.Articles.callback();

                            $.Articles.controller.showArticles();
                        });
                    }
                }
            } else {
                if ($.Articles.param.action == 'Period' || $.Articles.param.boardNo != 200 /* All Articles without filter */) {
                    DotTemplates('articles.html', '#tmplArticles', '#articles', data, 'overwrite', '', function () {
                        if (typeof $.Articles.callback !== 'undefined')
                            $.Articles.callback();

                        $.Articles.controller.showArticles();
                    });
                } else {
                    $.Articles.param.enableInfiniteScroll = false;
                    $.PreLoader.view.removePreloader();                           // remove preloader
                    $.DotTemplates.view.resetContainer();                         // reset template container
                }
            }
        },
        loadDetail: function () {
            if (typeof articlesDetails !== 'object') {
                $.Articles.controller.bindShowArticleDetail();
                $.Articles.controller.bindShowArticleHover();

                articlesDetails = new Articles({
                    gameCode: 'ca',
                    contentNo: contentNo      // contentNo initiallly populated outside of object
                }, 'Detail');
            } else {
                $.Articles.param.contentNo = contentNo;
                $.Articles.param.action = 'Detail';

                $.Articles.model.findArticles();
            }
        },
        loadArticlesList: function (data) {
            // render html
            $('#loadMoreArticles').remove();
            if ($.Articles.param.page == 1) {
                DotTemplates('articles-list.html', '#tmplArticles-list', '#articlesListItems', data, $.Articles.param.rewriteRule, '', function () {
                    // callbacks
                    if (typeof $.Articles.callback !== 'undefined')
                        $.Articles.callback();

                    $.Articles.view.loadStickyArticles($.Articles.data.stickyArticles);

                    // load
                    $.Articles.view.loadDetail();

                    $.Articles.controller.updateWaypoint();
                    $.Articles.controller.bindListScroll();
                    $("#articlesList").perfectScrollbar('update');
                });
            } else {
                DotTemplates('articles-list.html', '#tmplArticles-list', '#articlesListItems', data, $.Articles.param.rewriteRule, '', function () {
                    if (typeof $.Articles.callback !== 'undefined')
                        $.Articles.callback();

                    if ($.Articles.param.page < 4)
                        $.Articles.controller.updateWaypoint();
                    $("#articlesList").perfectScrollbar('update');
                });
            }
        },
        loadArticlesDetail: function (data) {
            DotTemplates('articles-details.html', '#tmplArticles-details', '#articlesDetail', data, 'overwrite', '', function () {
                if (typeof $.Articles.callback !== 'undefined')
                    $.Articles.callback();

                // activate colorbox/lightbox functionality
                // colorbox
                var win_w = $(window).width() * .75;
                var win_h = $(window).height() * .75;
                $(".ssbox1").colorbox({ rel: 'group1', fixed: true, close: "close" });
                $(".ssbox2").colorbox({ rel: 'group2', fixed: true, close: "close" });
                $(".vbox").colorbox({ iframe: true, innerWidth: win_w, innerHeight: win_h });

                // activate correct article in list
                // -- NEEDS TO BE UPDATED TO USE A DYNAMIC REFERENCE TO DOM ELEMENT
                var id = data.content_no;
                $('#articlesListItems li a').each(function () {
                    if ($(this).hasClass('active')) {
                        $(this).find('.title').stop(true).animate({
                            opacity: 0.40
                        });

                        // animate paragraph
                        $(this).find('p').stop(true).animate({
                            opacity: 0.15
                        });
                    }
                }).removeClass('active');
                $('#articlesList #' + id).addClass('active');

                // update height of list wrapper
                var newHeight = window.innerHeight - 100;
                $('#articlesList').show().height(newHeight).perfectScrollbar({ wheelSpeed: 35, wheelPropagation: false });
                $('.global-bg_subNavTop, .global-bg_subNavBottom').show();
                $('.bgScroller').height($('#articlesList ul').height());

                // scroll main content to top
                var docViewTop = $(window).scrollTop(),
                elemTop = $('#gnt_bar').offset().top;

                if (elemTop >= docViewTop) {
                    $(window).scrollTop(0);
                } else {
                    $(window).scrollTop(55);
                }

                // scroll list to top
                var topPos = $('#articlesList .active').position().top;       // get position of current .active relative to the parent
                $("#articlesList").scrollTop(topPos);
                $("#articlesList").perfectScrollbar('update');
                $.Articles.param.rewriteRule

                // reset loadingStatus
                $.Articles.param.loadingStatus = false;

                // update url
                if ($.Articles.param.firstArticleLoaded == true) {
                    historyBool = false;
                    var location = top.location.toString(),
                        query = location.split("?"),
                        newQuery;

                    query = query[1];
                    newQuery = query.split("contentNo");
                    newQuery = '?' + newQuery[0] + 'contentNo=' + contentNo;

                    if (History.getStateByIndex().url.indexOf('contentNo') >= 0) {
                        var stateObj = { contentNo: contentNo };
                        History.pushState(stateObj, "Combat Arms - " + $('#articlesDetail h3').html(), newQuery);
                    }

                    historyBool = true;
                } else {
                    var newState = { state: '', title: "Combat Arms - " + $('#articlesDetail h3').html() };
                    History.setTitle(newState);
                    $.Articles.param.firstArticleLoaded = true;
                }
            });
        },
        loadStickyArticles: function (data) {
            // render html
            data.stickyArticles = data;
            DotTemplates('articles-sticky.html', '#tmplStickyArticles', '#articles-sticky', data, $.Articles.param.rewriteRule, '', function () {
                if (typeof $.Articles.callback !== 'undefined')
                    $.Articles.callback();

                $.Articles.controller.showArticles()
            });
        }
    },

    // Controller
    controller: {
        updateWaypoint: function () {
            // update height of article list scrollbar
            $('.bgScroller').height($('#articlesList ul').height());
            $("#articlesList").perfectScrollbar('update');

            // get length of list
            var lengthCheck = $('#articlesLists li').length - 15;

            // create waypoint marks to indicate pages
            $.Articles.param.listPage = $.Articles.param.listPage + 1;                      // iterate page parameter
            $("#articlesLists li.paginateList").removeClass('paginateList');
            $("#articlesLists li:nth-child(" + lengthCheck + ")").addClass('paginateList');
        },
        bindListScroll: function () {
            // check if waypoint is visible
            $('#articlesList').scroll(function () {
                var st = $(this).scrollTop(),
                    records = 100;

                // if scrolling down
                if ($.Articles.param.listPage < 3) {
                    if ($.Articles.model.isScrolledIntoDivView('.paginateList', '#articlesList') == true && ($.Articles.param.articleLlistLoading == false || typeof $.Articles.param.articleLlistLoading === 'undefined')) {
                        //alert($.Articles.param.listPage + 1);
                        articlesList = new Articles({
                            gameCode: 'ca',
                            contentNo: contentNo,
                            page: $.Articles.param.listPage + 1,
                            records: records,
                            listPage: $.Articles.param.listPage,
                            lastScrollTop: st,
                            rewriteRule: 'append'
                        }, 'DetailMenu');

                        $.Articles.param.articleLlistLoading = true;
                        var articleListLoadingTimer = setTimeout(function () {
                            articleListLoadingTimer = null;
                            $.Articles.param.articleLlistLoading = false;
                        }, 500);
                    }
                }

                //if ($.Articles.param.listPage == 3) {
                if ($.Articles.param.listPage == 3) {
                    //var paddingBottom = 1280;
                    //$("#articlesListItems").css({ 'padding-bottom': paddingBottom + 'px' });
                    $("#articlesList").perfectScrollbar('update');                                                              // update scrollbar
                    //$('.bgScroller').height((($.Articles.param.listPage + 1) * 80 * records) + (($.Articles.param.listPage + 1) * 350));    // update bg behind scrollbar
                    $("#articlesListItems").css({ 'padding-bottom': '102px' });
                    $('.bgScroller').height($('#articlesListItems li').length * 82 + 150);
                    $('#articlesList').unbind('scroll');
                    $(window).unbind('scroll');
                }

                $.Articles.param.lastScrollTop = st;
            });
        },
        showArticles: function () {
            // show articles
            $('#articles-page-' + $.Articles.param.page).delay(500).slideDown(function () {
                $.PreLoader.view.removePreloader();                           // remove preloader
                $(window).trigger('resize');                                  // recalculate size and show article summaries
                $.DotTemplates.view.resetContainer();                         // reset template container
            });
        },
        showArticleSummaries: function () {
            // recalculate size of article summaries and show
            $('.article-summary').each(function () {
                var parent = $(this).parent(),
                    minHeight = 195,
                    newHeight,
                    height = $(this).height(),
                    wrapperHeight = parent.height(),
                    archiveRowHeight = parent.find('.article-summary-btm').height();

                if ((height + archiveRowHeight) > wrapperHeight) {
                    newHeight = wrapperHeight - archiveRowHeight - 14;
                    if (newHeight < 0)
                        newHeight = minHeight;

                    $(this).parent().find('.article-summary-btm').each(function () {
                        $(this).addClass('boxt20blk');
                    });

                    $(this).height(newHeight).css({ 'visibility': 'visible' });
                } else {
                    newHeight = wrapperHeight - archiveRowHeight - 14;
                    $(this).height(newHeight).css({ 'visibility': 'visible' });
                }
            });
        },
        bindShowArticleDetail: function () {
            $(document).on('click', '.articleListed', function (event) {
                event.preventDefault();

                contentNo = $(this).attr('id');
                $.Articles.view.loadDetail();
            });
        },
        bindShowArticleHover: function () {
            $(document).on('mouseenter', '.articlePreview_img', function (event) {
                event.preventDefault();

                var ele = $(this);

                if (ele.parent().hasClass('active') == false) {
                    var showTimer = setTimeout(function () {
                        if (ele.is(':hover')) {
                            // animate title
                            ele.parent().find('.title').animate({
                                opacity: 1
                                //, top: '-=45'
                            });

                            // animate paragraph
                            ele.parent().find('p').animate({
                                opacity: 1
                                //, top: '-=45'
                            });
                        } else
                            clearTimeout(showTimer);
                    }, 0);
                }
            });
            $(document).on('mouseleave', '.articlePreview_img', function (event) {
                event.preventDefault();

                if ($(this).parent().hasClass('active') == false) {
                    // animate title
                    $(this).parent().find('.title').stop(true).animate({
                        opacity: 0.40
                    });

                    // animate paragraph
                    $(this).parent().find('p').stop(true).animate({
                        opacity: 0.15
                    });
                }
            });
        },
        bindShowMoreArticlesBtn: function () {
            $(document).off('click', '#loadMoreArticles');                      // unbind any previous instances
            $(document).on('click', '#loadMoreArticles', function (event) {     // bind a new instance
                event.preventDefault();

                // lower opacity of link
                $(this).addClass('active').fadeTo('slow', 0.2);                 // set to white active state and fade the link out
                $(document).off('click', '#loadMoreArticles');                  // unbind any previous instances

                var st = $('#articlesList').scrollTop(),
                    records = 100,
                    paddingBottom;
                $.Articles.param.listPage = $.Articles.param.listPage + 1;

                // gAPI call to extend list
                var articlesList = new Articles({
                    gameCode: 'ca',
                    contentNo: contentNo,
                    page: $.Articles.param.listPage,
                    records: records,
                    listPage: $.Articles.param.listPage,
                    lastScrollTop: st,
                    rewriteRule: 'append'
                }, 'DetailMenu', function () {
                    // Bottom padding applied into list so that the scrollbar can properly calculate position compared to size of list.
                    /*
                    switch ($.Articles.param.listPage) {
                    case 4: paddingBottom = 1350; break;
                    case 5: paddingBottom = 1705; break;
                    case 6: paddingBottom = 2055; break;
                    case 7: paddingBottom = 2450; break;
                    case 8: paddingBottom = 2750; break;
                    case 9: paddingBottom = 3100; break;
                    case 10: paddingBottom = 3450; break;
                    case 11: paddingBottom = 3880; break;
                    case 12: paddingBottom = 4350; break;
                    default: paddingBottom = 1240;
                    }
                    paddingBottom = $.Articles.param.listPage * 370;
                    */
                    //$("#articlesListItems").css({ 'padding-bottom': paddingBottom + 'px' });

                    $("#articlesList").perfectScrollbar('update');                                                              // update scrollbar
                    //$('.bgScroller').height(($.Articles.param.listPage * 80 * records) + ($.Articles.param.listPage * 300));    // update bg behind scrollbar
                    $("#articlesListItems").css({ 'padding-bottom': '102px' });
                    $('.bgScroller').height($('#articlesListItems li').length * 82 + 150);

                });
                $.Articles.param.lastScrollTop = st;                                                                        // mark last scroll to top position
            });
        },
        bindInfiniteScroll: function () {
            $(document).ready(function () {
                $(window).scroll(function () {
                    if ((($(window).scrollTop()) >= ($(document).height() - 460) - $(window).height()) && $.Articles.param.enableInfiniteScroll == true) {
                        $.Articles.param.renderSticky = false;
                        switch ($.Articles.param.action) {
                            case 'Detail':
                                if ($.Articles.param.loadingStatus == false) {     // prevent from loading more than one instance on scroll
                                    $.Articles.param.contentNoNext = $('#articlesList .active').parent().nextAll().find('.articlePreview:first').attr('id');

                                    $.Articles.param.contentNo = $.Articles.param.contentNoNext;   // assign next content_no
                                    $.Articles.model.findArticles();

                                    $.Articles.param.loadingStatus = true;
                                }
                                break;
                            case 'All':
                                if ($.Articles.param.page < $.Articles.param.infiniteScrollAutoThreshold || $.Articles.param.infiniteScrollAutoThreshold == 0) {
                                    $.Articles.param.enableInfiniteScroll = false;

                                    $.Articles.param.page++;
                                    $.Articles.param.records = 32;
                                    $.Articles.param.rewriteRule = 'append';
                                    $.Articles.model.findArticles();

                                    // create a slight delay between when the current infinate scroll is triggered and one the next set is allowed to load.
                                    // this is added in so that when the user reaches the bottom we can help prevent multiple data sets from overlapping and slowing bandwidth.
                                    var articleListLoadingTimer = setTimeout(function () {
                                        $.Articles.param.enableInfiniteScroll = true;
                                        articleListLoadingTimer = null;
                                    }, 1000);
                                }
                                break;
                        }
                    }
                });
            });
        }
    }
});


$(window).resize(function () {
    $.Articles.controller.showArticleSummaries();                 // recalculate size and show article summaries
});


// bind a window statechange listener so that the article data is updated if the back button is used
var historyBool = true,
    refilter = false;

window.onload = function () {
    History.Adapter.bind(window, 'statechange', function () {
        var State = History.getState(),
        previousState = History.getStateByIndex(-2);

        //don't run our function when we do a pushState
        if (historyBool) {
            historyBool = false;

            var count = 0,
                target = State.data;

            // reload page if forward/back button is used on article detail page
            if (
            target.hasOwnProperty("contentNo") &&
            (previousState.url.indexOf('contentNo') >= 0))
                location.reload();

            for (var k in target) {
                if (target.hasOwnProperty(k)) {
                    //alert("Key is " + k);
                    //alert("Value is " + target[k]);

                    if (k == "boardNo" || k == "month")
                        refilter = true;

                    if (refilter)
                        $('.filter-' + k + '-' + target[k]).click();
                }
                count++;
            }

            refilter = false;

            if (count == 0)
                location.reload();

        }
        historyBool = true;
    });
}