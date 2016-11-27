'use strict';
import * as vscode from 'vscode';
import * as _ from 'lodash';

var keyword = "";
var matchingWords = [];

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerTextEditorCommand("anotherWordCompletion.cycle", (textEditor, edit) => {
        let currentWord = getCurrentWord(textEditor);
        if (_.indexOf(matchingWords, currentWord) == -1) {
            keyword = currentWord;
            matchingWords = getMatchingWords(textEditor.document.getText());
        }

        let suggestionWord = matchingWords.pop();
        edit.delete(getCurrentWordRange(textEditor));
        edit.insert(getCurrentWordRange(textEditor).start, suggestionWord);
        matchingWords.unshift(suggestionWord);
    });

    context.subscriptions.push(disposable);
}

export function getCurrentPosition(textEditor:vscode.TextEditor): vscode.Position {
    let document = textEditor.document;
    let currentPosition = textEditor.selection.active;
    return currentPosition;
}

export function getCurrentWord(textEditor: vscode.TextEditor): string {
    let document = textEditor.document;
    let range = getCurrentWordRange(textEditor);
    let currentWord = document.getText(range);
    return currentWord;
} 

export function getCurrentWordRange(textEditor:vscode.TextEditor): vscode.Range {
    let document = textEditor.document;
    let currentPosition = getCurrentPosition(textEditor);
    let range = document.getWordRangeAtPosition(currentPosition);
    return range;
}

export function getMatchingWords(text:string) {
    let regex = new RegExp("(^|\\s+|\\t+|\\W)("+keyword+"\\w+)", "gm");
    let matchingWords = [];
    let matches;
    while ((matches = regex.exec(text)) !== null) {
        matchingWords.push(matches[2].trim());
    }
    matchingWords = _.uniq(matchingWords);    
    return matchingWords;
}

export function deactivate() {
}