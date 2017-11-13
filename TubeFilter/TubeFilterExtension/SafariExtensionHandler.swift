//
//  SafariExtensionHandler.swift
//  TubeFilterExtension
//
//  Created by Wenru Dong on 2017/11/8.
//  Copyright © 2017年 Wenru Dong. All rights reserved.
//

import SafariServices

@available(OSXApplicationExtension 10.13, *)
class SafariExtensionHandler: SFSafariExtensionHandler {
    
    let vectorizer = CountVectorizer()
    let model = ISSpam()
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        page.getPropertiesWithCompletionHandler { properties in
            NSLog("The extension received a message (\(messageName)) from a script injected into (\(String(describing: properties?.url))) with userInfo (\(userInfo ?? [:]))")
        }
        
        
        switch messageName {
        case "predict":
            // Convert the comment string into a vector
            let commentVector = vectorizer.convertToVector(comment: userInfo!["commentText"] as! String)
            // Predict whether it's spam or ham
            let output = try! model.prediction(comment: commentVector)
            page.dispatchMessageToScript(withName: "result", userInfo: ["isSpam": output.is_spam, "nodeIndex": userInfo!["nodeIndex"]!])
        default:
            page.dispatchMessageToScript(withName: "result", userInfo: ["isSpam": 0, "nodeIndex": userInfo!["nodeIndex"]!])
        }
        
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
