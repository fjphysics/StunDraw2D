"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpRequest {
    static doGet(url) {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, false, null, null);
        xhr.send();
        if (xhr.status === 200) {
            return { success: true, responseType: "text", response: xhr.response };
        }
        else {
            return { success: false, responseType: "text", response: null };
        }
    }
    static doGetAsync(url, callback, responseType = "text") {
        let xhr = new XMLHttpRequest();
        xhr.responseType = responseType;
        xhr.onreadystatechange = (ev) => {
            if (xhr.readyState == 4 && xhr.status === 200) {
                let response = { success: true, responseType: responseType, response: xhr.response };
                callback(response);
            }
            else {
                let response = { success: false, responseType: responseType, response: null };
                callback(response);
            }
        };
        xhr.open("get", url, true, null, null);
        xhr.send();
    }
}
exports.HttpRequest = HttpRequest;
