document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed");

  let tabs = chrome.extension.getBackgroundPage().tabs;
  
  let tabListEl = document.getElementById("tabList");
  let activeTabEl = null;


  function populateTabs(){
    for(let i = tabs.length-1; i >= 0; i--){
      let tab = tabs[i];

      let tabEl = document.createElement("li");
      tabEl.classList.add("tab");
      tabEl.dataset.id = tab.tabId;

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
  
}, false);
