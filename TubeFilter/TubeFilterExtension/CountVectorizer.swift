//
//  CountVectorizer.swift
//  TubeFilterExtension
//
//  Created by Wenru Dong on 2017/11/13.
//  Copyright © 2017年 Wenru Dong. All rights reserved.
//

import Foundation
import CoreML

struct CountVectorizer {
    static let wordsFilePath = Bundle.main.path(forResource: "word_features", ofType: "txt")
    var words: [String]
    
    init() {
        let word_features = try! String(contentsOfFile: CountVectorizer.wordsFilePath!)
        words = word_features.components(separatedBy: .newlines)
        words.removeLast()
    }
    
    @available(OSXApplicationExtension 10.13, *)
    func convertToVector(comment: String) -> MLMultiArray {
        var commentVector = try! MLMultiArray(shape: [NSNumber(integerLiteral: words.count)], dataType: MLMultiArrayDataType.int32)
        let commentWords = comment.split(separator: " ")
        for i in 0..<words.count {
            let word = words[i]
            if comment.contains(word) {
                var wordCount = 0
                for commentWord in commentWords {
                    if commentWord.elementsEqual(word) {
                        wordCount += 1
                    }
                }
                commentVector[i] = NSNumber(value: wordCount)
            } else {
                commentVector[i] = 0
            }
        }
        return commentVector
    }
}
