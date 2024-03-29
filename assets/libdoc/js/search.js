(function () {
    function displaySearchResults(results, store) {
        var searchResults = document.getElementById("libdoc-search-results");

        if (results.length) {
            // Are there any results?
            var appendString = "";
            for (var i = 0; i < results.length; i++) {
                // Iterate over the results
                var item = store[results[i].ref];
                appendString +=
                    '<li>' +
                    '<a href="../..' + item.url + '">' +
                    item.title +
                    '</a>' +
                    '<p class="u-mt-none u-fs-sm u-c-primary-alt">' + item.content.substring(0, 150) + '...</p>' +
                    '</li>';
            }
            searchResults.innerHTML = appendString;
        } else {
            searchResults.innerHTML = "<li>No results found</li>";
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
            }
        }
    }

    function trimmerEnKo(token) {
        return token
            .replace(/^[^\w가-힣]+/, '')
            .replace(/[^\w가-힣]+$/, '');
    };

    var searchTerm = getQueryVariable("query");

    if (searchTerm) {
        document.getElementById("libdoc-search-box").setAttribute("value", searchTerm);

        // stemmerSupport(lunr);
        // ko(lunr); // or any other language you want

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            // this.pipeline.reset();
            // this.pipeline.add(
            //     trimmerEnKo,
            //     this.stopWordFilter,
            //     this.stemmer
            // );
            this.ref("id");
            this.field("title", { boost: 10 });
            this.field("author");
            this.field("category");
            this.field("content");
            for (var key in window.store) {
                // Add the data to lunr
                this.add({
                    id: key,
                    title: window.store[key].title,
                    author: window.store[key].author,
                    category: window.store[key].category,
                    tags: window.store[key].tags,
                    content: window.store[key].content
                });
            }
        });

        var results = idx.search(searchTerm); // Get lunr to perform a search
        displaySearchResults(results, window.store); // We'll write this in the next section

        document.querySelectorAll('.libdoc-search-query').forEach(function (el) {
            el.innerText = searchTerm;
            const href = el.getAttribute('href');
            if (href !== null) {
                el.setAttribute('href', href + searchTerm);
            }
        });
    }
})();