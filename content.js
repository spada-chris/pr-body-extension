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
      const button = document.createElement("div");
      const containerDiv = document.createElement("div");
      containerDiv.style = "display: none; position: fixed; max-height: 800px; max-width: 840px; bottom: 10px; top: 15px; left: 50px; overflow: scroll;"
      button.style = "position: fixed; bottom: 10px; left: 10px; z-index: 1000; background-color: #303030; border-radius: 4px; padding: 20px; cursor: pointer;"
      button.onclick = function() {
        containerDiv.style.display = containerDiv.style.display === "block" ? "none": "block";
      }
      
      const contentDiv = document.createElement("div");
      contentDiv.innerHTML = text.trim();
      
      const pullBody = contentDiv.getElementsByClassName("js-command-palette-pull-body")[0].getElementsByClassName("edit-comment-hide")[0];
      pullBody.style = "display: absolute; bottom: 15px; left: 15px; max-width: 840px; border: 1px solid #303030; border-radius: 4px; padding: 10px; background-color: rgba(0,0,0,0.8)";
      
      const body = document.getElementsByTagName("body")[0];
      body.insertBefore(button, null);
      body.insertBefore(containerDiv, null);
      containerDiv.insertBefore(pullBody, null);
    });
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