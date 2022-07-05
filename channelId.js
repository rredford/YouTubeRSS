/*
  Rolf Redford
  7/4/2022
  GPL 3.0 license.
  Content side handler for finding channelId and pushing it to background to handle.
  7-4-22
  2.0: (initial version for this file) Massive rewrite to make it work everywhere user-specific youtube page.
*/

// Data of channel id is found in form like <meta itemprop="channelId" content="XXXXXXXXXXXXXXXXXXXXXXXX">

// Extract channelId and send it to background.
function doit(){
    let bodyHTML = document.documentElement.outerHTML;
    // Split to get first part of channelId define info.
    var getChannelId = bodyHTML.split("<meta itemprop=\"channelId\" content=\"");
    // There should be minium of one, if it has channel id. If not found, it must be some other site, like main page.
    if(getChannelId.length > 1) {
        // get right part of definition in webpage off.
        getChannelId = getChannelId[1].split("\">");
        //since array was successfully split (one has been found),
        //first entry will be channel id. 
        browser.runtime.sendMessage({"channelId": getChannelId[0]});
    } else {
        //Must be on one of those non-user pages. Like main page. Send empty.
        browser.runtime.sendMessage({"channelId": ""});
    }
    getChannelId = [];// empty out big data array
}

// Adding listeners for focus of website. de-focus is not needed.
// Wanted to keep it for future just in case so it is left commented.
// function pause() {
// //Do something
// }
// Got focus! Send code again.
 function play() {
     doit();
 }
// window.addEventListener('blur', pause);
 window.addEventListener('focus', play);

// run it after defined
doit();


