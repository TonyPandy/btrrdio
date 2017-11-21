function getJSONPods (url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function renameThisFunction() {
    var resultsDiv = document.getElementById("resultsDiv");
    var searchTerm = document.getElementById("searchField").value;
    var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&media=podcast&limit=6';
    //https://itunes.apple.com/au/rss/topaudiopodcasts/limit=20/json - example request to return top podcasts

    //Load dat data
    var json_obj = JSON.parse(getJSONPods(url));
    var resultCount = json_obj.resultCount;

    console.clear();
    resultsDiv.innerHTML = "";
    
    if (resultCount == 0) {
        resultsDiv.innerHTML = "<br>No results found!";
    }

    //This for loop should be in a function that's called with the .then() function after it, with the results stored
    //before they're displayed. This is to solve the async issue with loading XML data. Hopefully.
    for (var i = 0; i < resultCount; i++) {
        outputResults(json_obj_results[i]);

        getXML('https://cors-anywhere.herokuapp.com/' + json_obj.results[i].feedUrl);
    }
}

function outputResults(jsonResults) {
    var resultsDiv = document.getElementById("resultsDiv");

    resultsDiv.innerHTML += "name: " + jsonResults.artistName + "<br><img name='test" + jsonResults.artistName + "' " +
        "src='" + jsonResults.artworkUrl100 + "'><br><br>";
}

function getXML (url) {
    var resultsDiv = document.getElementById("resultsDiv");
    $(document).ready(function () {
        $.get(url, function (data) {
            var Episode = $(data).find("item");
            resultsDiv.innerHTML += Episode.find("title").first().text() + "<br>";
            //console.log("title: " + Episode.find("title").first().text());
            //console.log("description: " + Episode.find("description").first().text());
        });
    });
}
