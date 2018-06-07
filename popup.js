document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed");

  let activeWindowId = window.initialWindowId;
  let popupwindowId = null;

  let tabs = chrome.extension.getBackgroundPage().tabs;
  
  let tabListEl = document.getElementById("tabList");
  var activeTabEl = null;
  let closeOnFocusChange = true;

  function populateTabs(){
    for(let i = tabs.length-1; i >= 0; i--){
      let tab = tabs[i];

      let tabEl = document.createElement("li");
      tabEl.classList.add("tab");
      tabEl.dataset.indextInStack = tabs.length - 1 - i;
      tabEl.dataset.tabId = tab.tabId;
      tabEl.dataset.windowId = tab.windowId;

      let tabTitleEl = document.createElement("p");
      tabTitleEl.innerHTML = tab.title;

      tabEl.appendChild(tabTitleEl);
      tabListEl.appendChild(tabEl);
    }

    activeTabEl = document.querySelectorAll(".tab")[1];
    activeTabEl.classList.add("active");
  }

  populateTabs();

  function moveDown(){
    let tabElList = document.querySelectorAll(".tab");
    let activeIndexInStack = 1;

    if(activeTabEl){
      activeIndexInStack = Number(activeTabEl.dataset.indextInStack);
      activeTabEl.classList.remove("active");
    }
    
    activeIndexInStack = (activeIndexInStack + 1) % tabElList.length;
    console.log(activeIndexInStack);

    activeTabEl = tabElList[activeIndexInStack];
    tabElList[activeIndexInStack].classList.add("active");



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
  

  function changeActiveTab(tab){
    if (tab.windowId != activeWindowId) {
      chrome.windows.update(tab.windowId, { focused: true })
    }

    chrome.tabs.update(tab.id, { active: true })
    activeWindowId = tab.windowId
  }
  





}, false);
