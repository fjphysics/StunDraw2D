"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("../application");
const interface_1 = require("./interface");
const math2d_1 = require("../math2d");
class Sprite2DManager {
    constructor() {
        this.name = 'sprite2dManager';
        this._sprites = [];
        this.sprite = undefined;
        this._dragSprite = undefined;
    }
    addSprite(sprite) {
        sprite.owner = this;
        this._sprites.push(sprite);
        return this;
    }
    removeSpriteAt(idx) {
        this._sprites.splice(idx, 1);
    }
    removeSprite(sprite) {
        let idx = this.getSpriteIndex(sprite);
        if (idx != -1) {
            this.removeSpriteAt(idx);
            return true;
        }
        return false;
    }
    removeAll() {
        this._sprites = [];
    }
    getSprite(idx) {
        if (idx < 0 || idx > this._sprites.length - 1) {
            throw new Error("参数idx越界!!");
        }
        return this._sprites[idx];
    }
    getSpriteCount() {
        return this._sprites.length;
    }
    getSpriteIndex(sprite) {
        for (let i = 0; i < this._sprites.length; i++) {
            if (this._sprites[i] === sprite) {
                return i;
            }
        }
        return -1;
    }
    getParentSprite() {
        return undefined;
    }
    get container() {
        return this;
    }
    dispatchUpdate(msec, diff) {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].update(msec, diff, interface_1.EOrder.PREORDER);
        }
        for (let i = this._sprites.length - 1; i >= 0; i--) {
            this._sprites[i].update(msec, diff, interface_1.EOrder.POSTORDER);
        }
    }
    dispatchDraw(context) {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].draw(context);
        }
    }
    dispatchKeyEvent(evt) {
        let spr;
        for (let i = 0; i < this._sprites.length; i++) {
            spr = this._sprites[i];
            if (spr.keyEvent) {
                spr.keyEvent(spr, evt);
            }
        }
    }
    dispatchMouseEvent(evt) {
        if (evt.type === application_1.EInputEventType.MOUSEUP) {
            this._dragSprite = undefined;
        }
        else if (evt.type === application_1.EInputEventType.MOUSEDRAG) {
            if (this._dragSprite !== undefined) {
                if (this._dragSprite.mouseEvent !== null) {
                    this._dragSprite.mouseEvent(this._dragSprite, evt);
                    return;
                }
            }
        }
        let spr;
        for (let i = this._sprites.length - 1; i >= 0; i--) {
            spr = this._sprites[i];
            let mat = spr.getLocalMatrix();
            math2d_1.Math2D.transform(mat, evt.canvasPosition, evt.localPosition);
            if (spr.hitTest(evt.localPosition)) {
                evt.hasLocalPosition = true;
                if (evt.button === 0 && evt.type === application_1.EInputEventType.MOUSEDOWN) {
                    this._dragSprite = spr;
                }
                if (evt.type === application_1.EInputEventType.MOUSEDRAG) {
                    return;
                }
                if (spr.mouseEvent) {
                    spr.mouseEvent(spr, evt);
                    return;
                }
            }
        }
    }
}
exports.Sprite2DManager = Sprite2DManager;
