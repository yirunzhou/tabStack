  chrome.runtime.onInstalled.addListener(function() {
      console.log("background page working...");
  });

  // maintain the tabs array, function addToTabs, removeFromTabs, updateTab

  /* store tabId, windowId and other tab info
   {
      tabId: tabId,
      windowId: windowId,
      title : tab.title,
      favIconUrl: tab.favIconUrl
  }
  */

    var tabs = [];

    chrome.tabs.onActivated.addListener(function(activeInfo){
      removeFromTabs(activeInfo.tabId);
      addToTabs(activeInfo.tabId);

      console.log("Tab added: " + 
                  " tabId - " + activeInfo.tabId +
                  "  windowId - " + activeInfo.windowId);
    })

    chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
      removeFromTabs(tabId);

      console.log("Tab Closed:" +
                    " tabId - " + tabId);
    })

    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
      updateTabs(tabId, changeInfo, tab);

      console.log("Tab Updated: " + 
                  "tabId -" + tabId);
    });

    chrome.windows.onFocusChanged.addListener(function(windowId){
      console.log("Focus Changed");

      //get the most recently activated tab in this window, if it already exists in tabs
      let lastActiveTab = null;
      tabs.forEach(function(tab){
        if(tab.windowId == windowId){
          lastActiveTab = tab;
        }
      });

      if(lastActiveTab != null){
        //remove the lastActive Tab from tabs
        removeFromTabs(lastActiveTab.tabId);
        //add this to bottom of tabs
        addToTabs(lastActiveTab.tabId);
      }
      
      else { // lastActiveTab == null, means the active tab in the window has been opened before
       if(windowId != -1){ 
        chrome.tabs.query({windowId: windowId, active: true}, function(results){
          lastActiveTab = {
            tabId: results[0].id,
            windowId : results[0].windowId,
            title: results[0].title,
            favIconUrl: results[0].favIconUrl
          }
          addToTabs(lastActiveTab.tabId);
        })
       }
      }      
    });



    /*------------------FUNCTIONS------------------*/


    function addToTabs(tabId){
      chrome.tabs.get(tabId, function(tab){
        tabs.push({
          tabId: tabId,
          windowId: tab.windowId,
          title : tab.title,
          favIconUrl: tab.favIconUrl
        })
      })
    }

    function removeFromTabs(tabId){
        tabs = tabs.filter(function(tab){
          let returnVal = tab.tabId !== tabId;
          if(returnVal == false){
            console.log("Tab Removed: " + 
                    " tabId - " + tabId);
          }
          return returnVal;
        });
    }

    function updateTabs(tabId, changeInfo, tab){
      let updatedTab = {
          tabId: tabId,
          windowId : tab.windowId,
          title : tab.title,
          favIconUrl: tab.favIconUrl
        }

        let foundIndex = tabs.findIndex(function(tabInTabs){
          return tabInTabs.tabId == updatedTab.tabId;
        })
        tabs[foundIndex] = updatedTab;
    }