  chrome.runtime.onInstalled.addListener(function() {
      console.log("background page working...");
  });

  // maintain the tabs array, addToTabs, removeFromTabs, updateTab

  /* store tabId, windowId and other tab info
   {
      tabId: tabId,
      windowId: windowId,
      title : tab.title
  }
  */

    var tabs = [];

    chrome.tabs.onActivated.addListener(function(activeInfo){
      //avoid duplicate
      removeFromTabs(activeInfo.tabId);
      addToTabs(activeInfo.tabId, activeInfo.windowId);
    })

    chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
        removeFromTabs(tabId);
        console.log("TAB CLOSED BY USER: \n" + 
                    " tabId : " + tabId);
    })

    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
        updateTabs(tabId, changeInfo, tab);
    });





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

    function updateTabs(tabId, changeInfo, tab){
      let updatedTab = {
          tabId: tabId,
          windowId : tab.windowId,
          title : tab.title
        }

        console.log(updatedTab);

        let foundIndex = tabs.findIndex(function(tabInTabs){
          return tabInTabs.tabId == updatedTab.tabId;
        })
        tabs[foundIndex] = updatedTab;
    }