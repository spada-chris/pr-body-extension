function runContentScript() {
  if (shouldRunScript()) {
    console.log("should run script", window.location.href)
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
      const testDiv = document.createElement("div");
      testDiv.innerHTML = text.trim();
      
      const pullBody = testDiv.getElementsByClassName("js-command-palette-pull-body")[0].getElementsByClassName("edit-comment-hide")[0];
      pullBody.style = "max-width: 840px; margin: 0 auto 10px auto; border: 1px solid #303030; border-radius: 4px; padding: 10px;";
      
      const el = document.getElementById("files");
      el.insertBefore(pullBody, el.firstChild);
    });
  } else {
    console.log("shouldnt run script", window.location.href)
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