document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed");

  let activeWindowId = window.initialWindowId;
  let popupwindowId = null;

  let tabs = chrome.extension.getBackgroundPage().tabs;
  
  let tabListEl = document.getElementById("tabList");
  let activeTabEl = null;

  let closeOnFocusChange = true;

  function populateTabs(){
    for(let i = tabs.length-1; i >= 0; i--){
      let tab = tabs[i];

      //create new tabEl
      let tabEl = document.createElement("li");
      tabEl.classList.add("tab");

      //set the dataset of each tabEl
      tabEl.dataset.indextInStack = tabs.length - 1 - i;
      tabEl.dataset.tabId = tab.tabId;
      tabEl.dataset.windowId = tab.windowId;

      //title
      let tabTitleEl = document.createElement("p");
      tabTitleEl.innerHTML = tab.title;
      tabEl.appendChild(tabTitleEl);
      
      //append tabEl to tabListEl
      tabListEl.appendChild(tabEl);
    }

    // make index==1 El active
    activeTabEl = document.querySelectorAll(".tab")[1];
    activeTabEl.classList.add("active");
  }

  populateTabs();

  function moveDown(){

    //get array of tabEl
    let tabElList = document.querySelectorAll(".tab");
    let activeIndexInStack = 1;

    //get current active index in stack
    if(activeTabEl){
      activeIndexInStack = Number(activeTabEl.dataset.indextInStack);
      activeTabEl.classList.remove("active");
    }
    
    //move down
    activeIndexInStack = (activeIndexInStack + 1) % tabElList.length;
    console.log(activeIndexInStack);

    //update the activeTabEl and make it active
    activeTabEl = tabElList[activeIndexInStack];
    tabElList[activeIndexInStack].classList.add("active");

    //find the tab in tabs that is going to switch
    let switchTo = null;
    if(activeTabEl){
      for(let i = 0; i < tabs.length; i++){
        if(tabs[i].tabId === Number(activeTabEl.dataset.tabId)){
          switchTo = tabs[i];
        }
      }
    }
    if(switchTo){
      console.log("switch to tab: ", switchTo);
      changeActiveTab(switchTo);
    }
  }

  chrome.commands.onCommand.addListener(function(command){
    switch (command){
      case "down":
        console.log(command);
        moveDown();
        break;
      default:
        break;
    }
  })
  

  /*function changeActiveTab(tab){
    chrome.tabs.update(tab.tabId, { active: true })
    activeWindowId = tab.windowId
  }*/
  





}, false);
