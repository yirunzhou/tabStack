document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed");

  let tabs = chrome.extension.getBackgroundPage().tabs;
  
  let tabListEl = document.getElementById("tabList");

  for(let i = tabs.length-1; i >= 0; i--){
    let tab = tabs[i];

    let tabEl = document.createElement("li");
    tabEl.dataset.id = tab.tabId;

    let tabTitleEl = document.createElement("p")
    tabTitleEl.innerHTML = tab.title;

    tabEl.appendChild(tabTitleEl);
    tabListEl.appendChild(tabEl);
  }



}, false);
