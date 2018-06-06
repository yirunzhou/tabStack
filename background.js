  chrome.runtime.onInstalled.addListener(function() {
      console.log("background page working...");
  });

  chrome.commands.getAll(function(commands){
      console.log(commands);
  })

  


    var tabs = [];

    // push tab into stack
    function addToTabs(tabId, windowId){
      chrome.tabs.get(tabId, function(tab){
        tabs.push({
          tabId: tabId,
          windowId: windowId,
          title : tab.title
        })
      console.log("TAB ADDED: \n" + 
                  " tabId - " + tabId + "\n" +
                  " windowId - " + windowId);
      })
    }

    chrome.tabs.onActivated.addListener(function(activeInfo){
      //avoid duplicate
      removeFromTabs(activeInfo.tabId);
      addToTabs(activeInfo.tabId, activeInfo.windowId);
    })

    // remove tab
    function removeFromTabs(tabId){
        tabs = tabs.filter(function(tab){
          let returnVal = tab.tabId !== tabId;
          if(returnVal == false){
            console.log("TAB REMOVED: \n" + 
                    " tabId : " + tabId);
          }
          return returnVal;
        });
    }

    chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
        removeFromTabs(tabId);
        console.log("TAB CLOSED BY USER: \n" + 
                    " tabId : " + tabId);
    })