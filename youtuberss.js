/*
  Rolf Redford
  11/19/2020

  GPL 3.0 license.

  It gets channel url, grabs channel ID number then
  opens a new tab to channel rss feed.

  11-20-2020 
  1.1: rewrite to make icon more olvious when url won't be supported.
       it also just opens url rather than open new tab.
       Added tooltip

  11-21-20
  1.2: Slight changes to make this also work in chrome.
*/

// save current url
var channelId = "";
// enabled when it IS channel id, error message otherwise
var enabled = false;

// set to true if you want console to output.
var DEBUG = false;

// handler for url errors
function wrongUrl(specific) {
  enabled = false;
  channelId = specific;
  DEBUG && console.log("Url mismatch for channel: " + specific);
  DEBUG && console.log("--------------------------------------------------------------------");
}

// main script area. checks url and if it matches,
// it builds rss url and opens new url.
// it is pretty strict what it expects on url.
function newTabProcess(url) {
  DEBUG && console.log("--------------------------------------------------------------------");

  // remove any ? and after that, it breaks script.
  // also avoids weird case where www.youtube.com exists entirely
  // as some parameter like for example http://url.com/some.html?www.youtube.com
  DEBUG && console.log(url);
  var dom = url.split("?"); 
  // first check if "www.youtube.com" exists.
  dom = dom[0].split("www.youtube.com"); 
  if( dom.length == 2 ) {
    // domain was confirmed. now to split the right side of url.
    var code = dom[1].split("/"); 

    // now detect if correct url type is there, then if entry actually exists.
    if(code.includes("channel")) {
      // success. now, does it contain proper number of entries? 3: ("", "channel", ID number)
      DEBUG && console.log(code);
      if( code.length == 3) {
        // this makes new tab with assigned url.
        DEBUG && console.log("Channel id: " + code[2]);
        enabled = true;
        channelId = code[2];
        DEBUG && console.log("--------------------------------------------------------------------");
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

/*
 * Updates the browserAction icon to reflect whether the current page
 * is a youtube channel url or not.
 */
// From https://github.com/mdn/webextensions-examples/tree/master/bookmark-it
function updateIcon() {
  chrome.browserAction.setIcon({
    path: enabled ? {
      32: "icons/page-32.png",
      48: "icons/page-48.png"
    } : {
      32: "icons/page-disabled-32.png",
      48: "icons/page-disabled-48.png"
    },
    tabId: currentTab.id
  });
  chrome.browserAction.setTitle({
    // Screen readers can see the title
    // channelID contains error message if not enabled.
    title: enabled ? 'YouTubeRSS\nOpen rss link for this channel\nChannel id: ' + channelId : 'YouTubeRSS: ' + channelId,
    tabId: currentTab.id
  }); 
}

function openRSSTab() {
  if(enabled) {
    try {
      chrome.tabs.update({"url" : "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId});
    }
    catch (err) {
      error.log(err.message);
    }
  }
}


/*
 * updates icon and tooltip to reflect the currently active tab
 */
// From https://github.com/mdn/webextensions-examples/tree/master/bookmark-it
function updateActiveTab(tabs) {

  function isSupportedProtocol(urlString) {
    var supportedProtocols = ["https:", "http:"];
    var url = document.createElement('a');
    url.href = urlString;
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      // url process will also handle any error so no need handle it here.
      if (isSupportedProtocol(currentTab.url)) {
        // process new url
        newTabProcess(currentTab.url);
        // update icon and title
        updateIcon();
      }
    }
  }

  // call update tab function on current, active tab.
  chrome.tabs.query({active: true, currentWindow: true}, function(tab){updateTab(tab);});
}


// Add openRSSTab() as a listener to clicks on the browser action.
chrome.browserAction.onClicked.addListener(openRSSTab);

// This 3 handles 3 different aspects of tab updating.
// listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
chrome.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
chrome.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();


// Done load everything.
console.log("youtube rss feed loaded.");





