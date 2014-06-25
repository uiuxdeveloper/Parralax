////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ArticlesFilter                                                                                                                 //
//                                                                                                                                //
//  Description: Filter and reload the articles on the page using gapi                                                            //
//  Sample:                                                                                                                       //
//      Load default articles into layout                                                                                         //
//        filterArticle = ArticlesFilter();                                                                                       //
//        filterArticle.filterArticles();                                                                                         //
//                                                                                                                                //
//      Load filter articles into layout                                                                                          //
//         filterArticle = ArticlesFilter.$withData( {ele: $(this)} );    // (ele is a reference from breadcrumb link)            //
//         filterArticle = filterArticle.filterArticles();                                                                        //
//                                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var ArticlesFilter = gapi.$extend({
    filterArticles: function () {
        // Params
        if (typeof this.ele === 'undefined') {
            var month = 'undefined',
              day = 'undefined',
              year = 'undefined',
              boardNo = 'undefined',
              allArticles = 'undefined',
              stateObj = {},
              articleObj = {
                  gameCode: 'ca',
                  enableInfiniteScroll: false,
                  renderSticky: false,
                  rewriteRule: 'overwrite'
              },
              querystring = '?',
              filterParams = [],
              records = typeof this.records === 'undefined' ? 8 : this.records;
        } else {
            var month = this.ele.attr('data-month'),
              day = this.ele.attr('data-day'),
              year = this.ele.attr('data-year'),
              boardNo = this.ele.attr('data-boardNo'),
              allArticles = this.ele.attr('data-allArticles'),
              stateObj = {},
              articleObj = {
                  gameCode: 'ca',
                  enableInfiniteScroll: false,
                  renderSticky: false,
                  rewriteRule: 'overwrite'
              },
              querystring = '?',
              filterParams = [];
        }
        // END: Params

        // Update params with values from querystring
        if (typeof month === 'undefined' || month == 'undefined') {
            month = QueryString.$withData({ value: 'month' });
            month = month.getParameterByName();
        }
        if (typeof day === 'undefined' || day == 'undefined') {
            day = QueryString.$withData({ value: 'day' });
            day = day.getParameterByName();
        }
        if (typeof year === 'undefined' || year == 'undefined') {
            year = QueryString.$withData({ value: 'year' });
            year = year.getParameterByName();
        }
        if (typeof boardNo === 'undefined' || boardNo == 'undefined') {
            boardNo = QueryString.$withData({ value: 'boardNo' });
            boardNo = boardNo.getParameterByName();
        }
        // END: Update params with values from querystring

        // Construct options used in API
        if (typeof allArticles === 'undefined' || allArticles == 'undefined') {
            if (month != '') filterParams['month'] = month, stateObj.month = month, articleObj.month = month;
            if (day != '') filterParams['day'] = day, stateObj.day = day, articleObj.day = day;
            if (year != '') filterParams['year'] = year, stateObj.year = year, articleObj.year = year;
        } else {
            month = ''; day = ''; year = '';
        }
        if (boardNo != '')
            filterParams['boardNo'] = boardNo, stateObj.boardNo = boardNo, articleObj.boardNo = boardNo;

        if (month == '' && day == '' && year == '') action = 'All';
        else action = 'Period';
        // END: Construct options used in API

        // Update url
        var count = 0;
        for (var key in filterParams) {    
            // build querystring for updating url
            if (count > 0) querystring += '&';

            querystring += key + '=' + filterParams[key];

            count++
        }

        if (querystring != '?' && refilter == false)
            History.pushState(stateObj, "Combat Arms", querystring);
        // END: Update url

        // API request
        if (month == '' && day == '' && year == '' && boardNo == '') {

            // Get and Check if there is a One Day Sale
            var ad = false,
                renderAd = false,
                records = 8,
                adData = {};

            $.ajax({
                url: '/api/OnedaySale/now-sale',
                success: function (data) {
                    var IsEventTime = data.IsEventTime;
                    //isSaleActive = true;             // used to benchmark the One Day Sale during dev testing

                    if (IsEventTime) {
                        var price = data.ItemPriceForMain;
                            price = price.split('|');

                        var origPrice = price[0],
                            salePrice = price[1];

                        adData = {
                            isAd: true,
                            url: 'http://combatarms.nexon.net/event/onedaysale/',
                            img: data.BannerImage,
                            title: data.Title,
                            eventDay: data.EndDate,
                            origPrice: origPrice,
                            salePrice: salePrice
                        }

                        var renderAd = true,
                            records = 7;
                    }

                    // load default articles including stickies
                    var articles = new Articles({
                        gameCode: 'ca',
                        startingPage: 1,
                        enableInfiniteScroll: true,
                        records: records,
                        monthThreshold: 12,
                        yearThreshold: 2012,
                        renderSticky: true,
                        renderAd: renderAd,
                        adData: adData,
                        rewriteRule: 'overwrite'
                    });
                }
            });
        } else {
            // update articleObj params
            articleObj.filter = true;

            // Update breadcrumb
            if (typeof this.ele === 'undefined') {
                if (month != '') {
                    this.ele = $('#filter-month-' + month);
                }
                if (boardNo != '') {
                    this.ele = $('#filter-boardNo-' + boardNo);
                }
            }
            // END: Update breadcrumb

            // load new set of articles into page
            var articles = new Articles(articleObj, action);
        }

        this.highlightBreadCrumb();
        this.updateTitle();
        // END: API request
    },
    highlightBreadCrumb: function () {
        if (typeof this.ele !== 'undefined') {
            var filterParent = this.ele.parents('li.dropdown'),
                html = this.ele.html();

            if (html == 'All Articles')
                html = 'All';
            filterParent.find('.filterBy span').html(html);    // update text
            filterParent.addClass('active');                   // update highlight
        }
    },
    updateTitle: function () {
        if (typeof this.ele !== 'undefined') {
            var filterParent = this.ele.parents('li.dropdown'),
                html = this.ele.html();

            var month = this.ele.attr('data-month'),
                year = this.ele.attr('data-year');

            if (typeof month !== 'undefined' && month != 0) {
                var months = new Array();
                months[0] = "January";
                months[1] = "February";
                months[2] = "March";
                months[3] = "April";
                months[4] = "May";
                months[5] = "June";
                months[6] = "July";
                months[7] = "August";
                months[8] = "September";
                months[9] = "October";
                months[10] = "November";
                months[11] = "December";
                month = months[month - 1];

                html = month + '&nbsp;' + '<span class="dark">' + year + '</span>';
            } else if (typeof year !== "undefined") {
                html = year;
            } else if (html == 'News' || html == 'All Articles') {
                html = 'All&nbsp;Articles';
            }

            $('#articleSectionTitle').html(html);
        }
    }
});