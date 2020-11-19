/*
  Rolf Redford
  11/19/2020

  GPL 3.0 license.

  It gets channel url, grabs channel ID number then
  opens a new tab to channel rss feed.
*/

// handler for url errors
function wrongUrl(specific) {
  console.log("Url mismatch for channel: " + specific);
}

// main script area. checks url and if it matches,
// it builds rss url and opens new url.
// it is pretty strict what it expects on url.
function openRSSTab(tabs) {
  console.log("opening new tab rss feed");

  // Grab url
  console.log(tabs.url);
  var url = tabs.url;

  // first check if "www.youtube.com" exists.
  var dom = url.split("www.youtube.com"); 
  if( dom.length == 2 ) {
    // confirmed. now to split the right side of url.
    var code = dom[1].split("/"); 

    // now detect if correct url type is there, then if entry actually exists.
    if(code.includes("channel")) {
      // success. now, does it contain proper number of entries? 3: ("", "channel", ID number)
      console.log(code);
      if( code.length == 3) {
        // this makes new tab with assigned url.
        console.log("Channel id: " + code[2]);
        browser.tabs.create({"url" : "https://www.youtube.com/feeds/videos.xml?channel_id=" + code[2]});
      } else {
        wrongUrl("had \"channel\", but url is different than expected. Expected this kind of url: https://www.youtube.com/channel/(channel ID number) but didn't get it.");
      }
    } else {
      wrongUrl("has no \"/channel/\" in url.");
    }
  } else {
    wrongUrl("has no \"www.youtube.com\" in url.");
  }
}

console.log("youtube rss feed loaded.");

/*
Add openRSSTab() as a listener to clicks on the browser action.
*/
browser.browserAction.onClicked.addListener(openRSSTab);
 

