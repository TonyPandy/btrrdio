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

    //clear search results
    resultsDiv.innerHTML = "";
    //Load dat data
    var json_obj = JSON.parse(getJSONPods(url));
    var resultCount = json_obj.resultCount;

    console.clear();
    resultsDiv.innerHTML = "";
    console.log(json_obj);
    if (resultCount == 0) {
        resultsDiv.innerHTML = "<br>No results found!";
    }


    for (var i = 0; i < resultCount; i++) {
        outputResults(json_obj.results[i]);
        //NOTE: this could probably be streamlined combining outputResults adn getXML into one method or something, it's a little messy right now but it's fine.

        //NOTE: changes made: outputResults gets called with the results, that then adds the name of the podcast, the artist behind the podcast, the icon and blank spans/p tags with unique ids that get filled in with episode information.
        //Then, getXML gets called with the XML parameters (cors-anywhere shit) as well as the trackID from the JSON. This is what joins the XML and JSON results for display
        //Then in getXML, the same stuff happens, I just added in a bit where the description for the first episode (latest episode) also gets returned.
    }
}

function outputResults(jsonResults) {
    var resultsDiv = document.getElementById("resultsDiv");
    console.log(jsonResults);
    var getXMLParameters = 'https://cors-anywhere.herokuapp.com/' + jsonResults.feedUrl;

    resultsDiv.innerHTML += "<a href='#' id='result" + jsonResults.trackId + "'>" + jsonResults.trackName + "</a><br><p>" + jsonResults.artistName + "</p><img src='" + jsonResults.artworkUrl100 + "'><br><br><strong><span id='epTitle" + jsonResults.trackId + "'></span></strong><br><p id='epDescript" + jsonResults.trackId + "'></p><span id=playEp" + jsonResults.trackId + "></span>";

      //getXML is now called for each outputResults
      getXML(getXMLParameters, jsonResults.trackId);

}

function getXML (url, jsonTrackId) {
  console.log(jsonTrackId);
    let trackId = jsonTrackId;
    var resultsDiv = document.getElementById("resultsDiv");
        $.get(url, function (data) {
            console.log(data);
            console.log(document.getElementById("epTitle"+jsonTrackId));
            var FirstEpisode = $(data).find("item").first();
            document.getElementById("epTitle"+jsonTrackId).innerHTML = FirstEpisode.find("title").text();
            document.getElementById("epDescript"+jsonTrackId).innerHTML = FirstEpisode.find("description").text();
            console.log(FirstEpisode);
            firstEpisodeUrl = FirstEpisode.find("enclosure").attr('url');
            console.log(firstEpisodeUrl);
            document.getElementById("playEp"+jsonTrackId).innerHTML = "<audio controls><source src=" + firstEpisodeUrl + " type='audio/mpeg'></audio><br>";
            console.log("title: " + FirstEpisode.find("title").first().text());
            console.log("description: " + FirstEpisode.find("description").first().text());
        });
}
