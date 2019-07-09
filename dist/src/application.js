"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math2d_1 = require("./math2d");
var EInputEventType;
(function (EInputEventType) {
    EInputEventType[EInputEventType["MOUSEEVENT"] = 0] = "MOUSEEVENT";
    EInputEventType[EInputEventType["MOUSEDOWN"] = 1] = "MOUSEDOWN";
    EInputEventType[EInputEventType["MOUSEUP"] = 2] = "MOUSEUP";
    EInputEventType[EInputEventType["MOUSEMOVE"] = 3] = "MOUSEMOVE";
    EInputEventType[EInputEventType["MOUSEDRAG"] = 4] = "MOUSEDRAG";
    EInputEventType[EInputEventType["KEYBOARDEVENT"] = 5] = "KEYBOARDEVENT";
    EInputEventType[EInputEventType["KEYUP"] = 6] = "KEYUP";
    EInputEventType[EInputEventType["KEYDOWN"] = 7] = "KEYDOWN";
    EInputEventType[EInputEventType["KEYPRESS"] = 8] = "KEYPRESS";
})(EInputEventType = exports.EInputEventType || (exports.EInputEventType = {}));
;
class CanvasInputEvent {
    constructor(type, altKey = false, ctrlKey = false, shiftKey = false) {
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.type = type;
    }
}
exports.CanvasInputEvent = CanvasInputEvent;
class Timer {
    constructor(callback) {
        this.id = -1;
        this.enabled = false;
        this.callbackData = undefined;
        this.countdown = 0;
        this.timeout = 0;
        this.onlyOnce = false;
        this.callback = callback;
    }
}
class CanvasMouseEvent extends CanvasInputEvent {
    constructor(type, canvasPos, button, altKey = false, ctrlKey = false, shiftKey = false) {
        super(type, altKey, ctrlKey, shiftKey);
        this.canvasPosition = canvasPos;
        this.button = button;
        this.hasLocalPosition = false;
        this.localPosition = math2d_1.vec2.create();
    }
}
exports.CanvasMouseEvent = CanvasMouseEvent;
class CanvasKeyBoardEvent extends CanvasInputEvent {
    constructor(type, key, keyCode, repeat, altKey = false, ctrlKey = false, shiftKey = false) {
        super(type, altKey, ctrlKey, shiftKey);
        this.key = key;
        this.keyCode = keyCode;
        this.repeat = repeat;
    }
}
exports.CanvasKeyBoardEvent = CanvasKeyBoardEvent;
class Application {
    constructor(canvas) {
        this.timers = [];
        this._timeId = -1;
        this._fps = 0;
        this._start = false;
        this._requestId = -1;
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", this, false);
        this.canvas.addEventListener("mouseup", this, false);
        this.canvas.addEventListener("mousemove", this, false);
        window.addEventListener("keydown", this, false);
        window.addEventListener("keyup", this, false);
        window.addEventListener("keypress", this, false);
        this._isMouseDown = false;
        this.isSupportMouseMove = false;
    }
    isRunning() {
        return this._start;
    }
    get fps() {
        return this._fps;
    }
    start() {
        if (!this._start) {
            this._start = true;
            this._lastTime = -1;
            this._startTime = -1;
            this._requestId = requestAnimationFrame((msec) => {
                this.step(msec);
            });
        }
    }
    step(timeStamp) {
        if (this._startTime === -1)
            this._startTime = timeStamp;
        if (this._lastTime === -1)
            this._lastTime = timeStamp;
        let elapsedMsec = timeStamp - this._startTime;
        let intervalSec = (timeStamp - this._lastTime);
        if (intervalSec !== 0) {
            this._fps = 1000.0 / intervalSec;
        }
        intervalSec /= 1000.0;
        this._lastTime = timeStamp;
        this._handleTimers(intervalSec);
        this.update(elapsedMsec, intervalSec);
        this.render();
        requestAnimationFrame((elapsedMsec) => {
            this.step(elapsedMsec);
        });
    }
    stop() {
        if (this._start) {
            cancelAnimationFrame(this._requestId);
            this._lastTime = -1;
            this._startTime = -1;
            this._start = false;
        }
    }
    update(elapsedMsec, intervalSec) { }
    render() { }
    handleEvent(evt) {
        switch (evt.type) {
            case "mousedown":
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN));
                break;
            case "mouseup":
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP));
                break;
            case "mousemove":
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE));
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG));
                }
                break;
            case "keypress":
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYPRESS));
                break;
            case "keydown":
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYDOWN));
                break;
            case "keyup":
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYUP));
                break;
        }
    }
    dispatchMouseDown(evt) {
        return;
    }
    dispatchMouseUp(evt) {
        return;
    }
    dispatchMouseMove(evt) {
        return;
    }
    dispatchMouseDrag(evt) {
        return;
    }
    dispatchKeyDown(evt) {
        return;
    }
    dispatchKeyUp(evt) {
        return;
    }
    dispatchKeyPress(evt) {
        return;
    }
    _viewportToCanvasCoordinate(evt) {
        if (this.canvas) {
            let rect = this.canvas.getBoundingClientRect();
            if (evt.type === "mousedown") {
                console.log(" boundingClientRect : " + JSON.stringify(rect));
                console.log(" clientX : " + evt.clientX + " clientY : " + evt.clientY);
            }
            if (evt.target) {
                let borderLeftWidth = 0;
                let borderTopWidth = 0;
                let paddingLeft = 0;
                let paddingTop = 0;
                let decl = window.getComputedStyle(evt.target);
                let strNumber = decl.borderLeftWidth;
                if (strNumber !== null) {
                    borderLeftWidth = parseInt(strNumber, 10);
                }
                if (strNumber !== null) {
                    borderTopWidth = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingLeft;
                if (strNumber !== null) {
                    paddingLeft = parseInt(strNumber, 10);
                }
                strNumber = decl.paddingTop;
                if (strNumber !== null) {
                    paddingTop = parseInt(strNumber, 10);
                }
                let x = evt.clientX - rect.left - borderLeftWidth - paddingLeft;
                let y = evt.clientY - rect.top - borderTopWidth - paddingTop;
                let pos = math2d_1.vec2.create(x, y);
                if (evt.type === "mousedown") {
                    console.log(" borderLeftWidth : " + borderLeftWidth + " borderTopWidth : " + borderTopWidth);
                    console.log(" paddingLeft : " + paddingLeft + " paddingTop : " + paddingTop);
                    console.log(" 变换后的canvasPosition : " + pos.toString());
                }
                return pos;
            }
            alert("canvas为null");
            throw new Error("canvas为null");
        }
        alert("evt . target为null");
        throw new Error("evt . target为null");
    }
    _toCanvasMouseEvent(evt, type) {
        let event = evt;
        let mousePosition = this._viewportToCanvasCoordinate(event);
        let canvasMouseEvent = new CanvasMouseEvent(type, mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey);
        return canvasMouseEvent;
    }
    _toCanvasKeyBoardEvent(evt, type) {
        let event = evt;
        let canvasKeyboardEvent = new CanvasKeyBoardEvent(type, event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey);
        return canvasKeyboardEvent;
    }
    addTimer(callback, timeout = 1.0, onlyOnce = false, data = undefined) {
        let timer;
        let found = false;
        for (let i = 0; i < this.timers.length; i++) {
            let timer = this.timers[i];
            if (timer.enabled === false) {
                timer.callback = callback;
                timer.callbackData = data;
                timer.timeout = timeout;
                timer.countdown = timeout;
                timer.enabled = true;
                timer.onlyOnce = onlyOnce;
                return timer.id;
            }
        }
        timer = new Timer(callback);
        timer.callbackData = data;
        timer.timeout = timeout;
        timer.countdown = timeout;
        timer.enabled = true;
        timer.id = ++this._timeId;
        timer.onlyOnce = onlyOnce;
        this.timers.push(timer);
        return timer.id;
    }
    removeTimer(id) {
        let found = false;
        for (let i = 0; i < this.timers.length; i++) {
            if (this.timers[i].id === id) {
                let timer = this.timers[i];
                timer.enabled = false;
                found = true;
                break;
            }
        }
        return found;
    }
    _handleTimers(intervalSec) {
        for (let i = 0; i < this.timers.length; i++) {
            let timer = this.timers[i];
            if (timer.enabled === false) {
                continue;
            }
            timer.countdown -= intervalSec;
            if (timer.countdown < 0.0) {
                timer.callback(timer.id, timer.callbackData);
                if (timer.onlyOnce === false) {
                    timer.countdown = timer.timeout;
                }
                else {
                    this.removeTimer(timer.id);
                }
            }
        }
    }
}
exports.Application = Application;
class Canvas2DApplication extends Application {
    constructor(canvas) {
        super(canvas);
        this.context2D = this.canvas.getContext("2d");
    }
}
exports.Canvas2DApplication = Canvas2DApplication;
class WebGLApplication extends Application {
    constructor(canvas, contextAttributes) {
        super(canvas);
        this.context3D = this.canvas.getContext("webgl", contextAttributes);
        if (this.context3D === null) {
            this.context3D = this.canvas.getContext("experimental-webgl", contextAttributes);
            if (this.context3D === null) {
                alert(" 无法创建WebGLRenderingContext上下文对象 ");
                throw new Error(" 无法创建WebGLRenderingContext上下文对象 ");
            }
        }
    }
}
exports.WebGLApplication = WebGLApplication;
