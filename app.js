




function getJSONPods (url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function findPod() {
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
    console.log(json_obj);
    if (resultCount == 0) {
        resultsDiv.innerHTML = "No results found!";
    }


    for (var i = 0; i < resultCount; i++) {
        outputResults(json_obj.results[i]);
        //NOTE: this could probably be streamlined combining outputResults adn getXML into one method or something, it's a little messy right now but it's fine.

        //NOTE: changes made: outputResults gets called with the results, that then adds the name of the podcast, the artist behind the podcast, the icon and blank spans/p tags with unique ids that get filled in with episode information.
        //Then, getXML gets called with the XML parameters (cors-anywhere shit) as well as the trackID from the JSON. This is what joins the XML and JSON results for display
        //Then in getXML, the same stuff happens, I just added in a bit where the description for the first episode (latest episode) also gets returned.
    }

    return false;
}

function outputResults(jsonResults) {
    var resultsOutput;
    var resultsDiv = document.getElementById("resultsDiv");
    console.log(jsonResults);
    var getXMLParameters = jsonResults.feedUrl;
// 'https://cors-anywhere.herokuapp.com/' +
  resultsOutput = "<div class='row podResult'><div class='col-sm-3'><img src='" + jsonResults.artworkUrl600 + "' style='width: 100%;'></div> <div class='col-sm-9'><a href='#' class='podTitle' id='result" + jsonResults.trackId + "'>" + jsonResults.trackName + "</a><br><p class='artist'>" + jsonResults.artistName + "</p><p id='description" + jsonResults.trackId + "'></p><br><span id='epList" + jsonResults.trackId + "'>See Episode List</span><br>Latest Ep: <strong><span id='epTitle" + jsonResults.trackId + "'></span></strong><br><span id=playEp" + jsonResults.trackId +"> </span><br><span id='epListing" + jsonResults.trackId + "'></span></div></div></div>";
// <p id='epDescript" + jsonResults.trackId + "'></p>
      //getXML is now called for each outputResults
      getXML(getXMLParameters, jsonResults.trackId, resultsOutput);

}

function getXML (url, jsonTrackId, resultsHTML) {
    var resultsDiv = document.getElementById("resultsDiv");
      $.when($.get(url, function (data) {
        })).then(function(data){
          console.log(data);
          var podcastDescript = $(data).find("channel > description");
          console.log(podcastDescript["0"].textContent);
          var FirstEpisode = $(data).find("item").first();
          var episodes = $(data).find("item");
          var resultsDiv = document.getElementById("resultsDiv");
          resultsDiv.innerHTML += resultsHTML;
          document.getElementById("description"+jsonTrackId).innerHTML = podcastDescript["0"].textContent;
          document.getElementById("epTitle"+jsonTrackId).innerHTML = FirstEpisode.find("title").text();
          var epListLink = document.getElementById("epList"+jsonTrackId);
          //document.getElementById("epDescript"+jsonTrackId).innerHTML = FirstEpisode.find("description").text();
          firstEpisodeUrl = FirstEpisode.find("enclosure").attr('url');
          document.getElementById("playEp"+jsonTrackId).innerHTML = "<audio controls style='width: 100%'><source src=" + firstEpisodeUrl + " type='audio/mpeg'></audio><br>";
          document.getElementById("epList"+jsonTrackId).innerHTML = "<a href='#'>Episode List</a>";
          displayEpisodes(episodes, jsonTrackId);
        });
}

function displayEpisodes(eps, jsonTrackId) {
  console.log(eps);
  for(var i = 1; i < 10; i++){

    var title = $(eps[i]).find("title").text();
    var url = $(eps[i]).find("enclosure").attr('url');

    document.getElementById("epListing"+jsonTrackId).innerHTML += "<p>" +title + "</p>" + "<audio controls style='width: 100%'><source src=" + url + " type='audio/mpeg'></audio><br>";
  }

  document.getElementById("epListing"+jsonTrackId).innerHTML += "<strong>See More</strong>";
}
