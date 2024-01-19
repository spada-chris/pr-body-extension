function runContentScript() {
  if (shouldRunScript()) {
    let pullUrl;
    if (window.location.href.includes("/files")) {
      pullUrl = window.location.href.split("/files")[0];
    } else {
      pullUrl = window.location.href.split("/commits")[0];
    }
    fetch(pullUrl).then(function (response) {
      if (response.ok) {
        return response.text();
      }
      throw response;
    }).then(function (text) {
      const button = document.createElement("img");
      button.setAttribute("class", "pr-body-button");
      button.src = chrome.runtime.getURL("icon.png");
      button.onclick = function() {
        containerDiv.style.display = containerDiv.style.display === "block" ? "none": "block";
      }

      const containerDiv = document.createElement("div")
      containerDiv.setAttribute("class", "pr-body-container");
      
      const contentDiv = document.createElement("div");
      contentDiv.innerHTML = text.trim();
      
      const pullBody = contentDiv.getElementsByClassName("js-command-palette-pull-body")[0].getElementsByClassName("edit-comment-hide")[0];
      pullBody.setAttribute("class", "pr-body-content");

      const body = document.getElementsByTagName("body")[0];
      body.insertBefore(button, null);
      body.insertBefore(containerDiv, null);
      containerDiv.insertBefore(pullBody, null);
    });
  } else {
    const button = document.getElementsByClassName("pr-body-button").item(0);
    if (button) {
      button.remove();
    }
  }
}

function shouldRunScript() {
  return window.location.href.includes("/pull/") && (window.location.href.includes("/files") || window.location.href.includes("/commits/"))
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'new_url') {
      runContentScript()
    }
});

runContentScript();