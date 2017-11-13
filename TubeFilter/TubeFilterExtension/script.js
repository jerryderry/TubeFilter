//  Created by Wenru Dong on 2017/11/8.
//  Copyright © 2017年 Wenru Dong. All rights reserved.

document.addEventListener("DOMContentLoaded", function(event) {
    safari.self.addEventListener("message", handleMessage);

    var bodyTarget = document.getElementsByTagName("body")[0];
    // Observe <ytd-app> node loaded. If it is, then observe <page-manager>
    var bodyObserver = new MutationObserver(function(mutations, observer) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].tagName == "YTD-APP") {
                    // alert("ytd-app loaded.");
                    observer.disconnect();
                    observePageManagerNode();
                }
            }
        })
    })
    bodyObserver.observe(bodyTarget, {childList: true});                      
});

function handleMessage(event) {
    switch (event.name) {
        case "result": {
            var isSpam = event.message["isSpam"];
            var nodeIndex = event.message["nodeIndex"];
            if (isSpam) {
                //commentNode.parentNode.removeChild(commentNode);
                var container = document.getElementById("contents");
                var commentNode = container.childNodes[nodeIndex];
                commentNode.getElementsByTagName("h1")[0].textContent = "Blocked!";
                commentNode.getElementsByTagName("yt-formatted-string")[2].textContent = "Blocked!"; // This is the string actually displayed
            }
        }
    }
    
}

// Observe <page-manager> to see if node <ytd-watch> is loaded, then observe the node contains comments
function observePageManagerNode() {
    var pageManagerTarget = document.getElementById("page-manager");
    var pageManagerObserver = new MutationObserver(function(mutations, observer) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].tagName == "YTD-WATCH") {
                    // alert("ytd-watch loaded.");
                    observer.disconnect();
                    observeCommentsNode();
                }
            }
        })
    });
    pageManagerObserver.observe(pageManagerTarget, {childList: true});
}

// Observe node that has id "comments", and see if <ytd-item-section-renderer> is loaded, which contains the actual comments
function observeCommentsNode() {
    var commentsTarget = document.getElementById("comments");
    var commentsObserver = new MutationObserver(function(mutations, observer) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].tagName == "YTD-ITEM-SECTION-RENDERER") {
                    // alert("ytd-item-section-renderer loaded.");
                    observer.disconnect();
                    handleComments();
                }
            }
        })
    });
    commentsObserver.observe(commentsTarget, {childList: true});
}

function handleComments() {
    // Observe mutation of node (div) with id "contents"
    var target = document.getElementById("contents");
    var observer = new MutationObserver(function(mutations, observer) {
        observer.disconnect();
        mutations.forEach(function(mutation) {
       for (var i = 0; i < mutation.addedNodes.length; i++) {
        var commentText = mutation.addedNodes[i].getElementsByTagName("h1")[0].textContent;
        // Store the index of this comment in the div
        var nodeIndex = getElementIndex(mutation.addedNodes[i]);
        // Ask for prediction
        safari.extension.dispatchMessage("predict", {"commentText":commentText, "nodeIndex":nodeIndex});
       }
       observer.observe(target, {childList: true});
     })
    });

    if (target) {
        observer.observe(target, { childList: true });
    }
}

function getElementIndex(node) {
    var index = 0;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    return index;
}