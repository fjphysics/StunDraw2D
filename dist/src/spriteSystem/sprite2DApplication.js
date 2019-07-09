"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../application");
const sprite2dSystem_1 = require("./sprite2dSystem");
class Sprite2DApplication extends application_1.Canvas2DApplication {
    constructor(canvas, isHierarchical = true) {
        document.oncontextmenu = function () {
            return false;
        };
        super(canvas);
        {
            this._dispatcher = new sprite2dSystem_1.Sprite2DManager();
        }
    }
    get rootContainer() {
        return this._dispatcher.container;
    }
    update(msec, diff) {
        this._dispatcher.dispatchUpdate(msec, diff);
    }
    render() {
        if (this.context2D) {
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
            this._dispatcher.dispatchDraw(this.context2D);
        }
    }
    dispatchMouseDown(evt) {
        super.dispatchMouseDown(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }
    dispatchMouseUp(evt) {
        super.dispatchMouseUp(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }
    dispatchMouseMove(evt) {
        super.dispatchMouseMove(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }
    dispatchMouseDrag(evt) {
        super.dispatchMouseDrag(evt);
        this._dispatcher.dispatchMouseEvent(evt);
    }
    dispatchKeyDown(evt) {
        super.dispatchKeyDown(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }
    dispatchKeyUp(evt) {
        super.dispatchKeyUp(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }
    dispatchKeyPress(evt) {
        super.dispatchKeyPress(evt);
        this._dispatcher.dispatchKeyEvent(evt);
    }
}
exports.Sprite2DApplication = Sprite2DApplication;
