document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed");

  /*windowId*/
  let activeWindowId = window.initialWindowId;
  let popupwindowId = null;

  /*tabs from background.js */
  let tabs = chrome.extension.getBackgroundPage().tabs;
  
  

  /*element of tabList ul*/
  let tabListEl = document.getElementById("tabList");

  /* current activeEl's info*/
  let activeTabEl = null;

  let closeOnFocusChange = true;


  /* Initialize, render the tabList */
  populateTabs();

  /* tabElList (aka, array of tabEls) rendered by populateTab() in popup.html */
  let tabElList = document.querySelectorAll(".tab");
  let activeIndexInStack = 1;






  /*--------------------------- FUNCTIONS -----------------------------*/

  function getActiveIndexInStack(){

    //get current active index in stack
    if(activeTabEl){
      activeIndexInStack = Number(activeTabEl.dataset.indextInStack);
    }

  }

  function moveDown(){
    getActiveIndexInStack();
    
    //remove active style
    activeTabEl.classList.remove("active");

    //move down 
    activeIndexInStack = (activeIndexInStack + 1) % tabElList.length;
    console.log(activeIndexInStack);


    //update the activeTabEl and add active style
    activeTabEl = tabElList[activeIndexInStack];
    tabElList[activeIndexInStack].classList.add("active");

  }

  function moveUp(){

  }

  function changeActiveTabAndClose(){

    let switchTo = {
      tabId: Number(activeTabEl.dataset.tabId),
      windowId: Number(activeTabEl.dataset.windowId)
    }

    chrome.tabs.update(switchTo.tabId, { active: true }, function(){
      chrome.windows.update(switchTo.windowId, { focused: true }, function(){
        window.close();
      });
    });
  }


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

      //favIcon
      let tabImgEl = document.createElement("img")
      tabImgEl.classList.add("icon")
      tabImgEl.src = tab.favIconUrl || ""
      tabEl.appendChild(tabImgEl);

      //title
      let tabTitleEl = document.createElement("p");
      tabTitleEl.innerHTML = tab.title;
      tabEl.appendChild(tabTitleEl);

      //append tabEl to tabListEl
      tabListEl.appendChild(tabEl);
    }

    if(tabs.length > 1){
      // make index==1 El active
      activeTabEl = document.querySelectorAll(".tab")[1];
      activeTabEl.classList.add("active");
    } else {
      if(tabs.length == 0){
        window.close();
      }
    }
  }
  

// key binding

  document.onkeydown = function(e){
    switch (e.keyCode) {
      case 87: //W
        moveDown();
        break;

      case 69: //E
        moveUp();
        break;

      case 13: //Enter
        changeActiveTabAndClose();
        break;

      default:
        break; 
    }
  }

  document.onkeyup = function(e){
    switch (e.keyCode) {
      case 18:
        changeActiveTabAndClose();
        break;
      default:
        break;
    }
  }
  

  
  
  




}, false);
