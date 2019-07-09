"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math2d_1 = require("../math2d");
const interface_1 = require("./interface");
class Sprite2D {
    constructor(shape, name) {
        this.showCoordSystem = false;
        this.renderType = interface_1.ERenderType.FILL;
        this.isVisible = true;
        this.fillStyle = 'white';
        this.strokeStyle = 'black';
        this.lineWidth = 1;
        this.transform = new math2d_1.Transform2D();
        this.mouseEvent = null;
        this.keyEvent = null;
        this.updateEvent = null;
        this.renderEvent = null;
        this.name = name;
        this.shape = shape;
    }
    set x(x) {
        this.transform.position.x = x;
    }
    get x() {
        return this.transform.position.x;
    }
    set y(y) {
        this.transform.position.y = y;
    }
    get y() {
        return this.transform.position.y;
    }
    set rotation(rotation) {
        this.transform.rotation = rotation;
    }
    get rotation() {
        return this.transform.rotation;
    }
    set scaleX(s) {
        this.transform.scale.x = s;
    }
    get scaleX() {
        return this.transform.scale.x;
    }
    set scaleY(s) {
        this.transform.scale.y = s;
    }
    get scaleY() {
        return this.transform.scale.y;
    }
    getWorldMatrix() {
        return this.transform.toMatrix();
    }
    getLocalMatrix() {
        let src = this.getWorldMatrix();
        let out = math2d_1.mat2d.create();
        if (math2d_1.mat2d.invert(src, out)) {
            return out;
        }
        else {
            alert("矩阵求逆失败");
            throw new Error("矩阵求逆失败");
        }
    }
    update(mesc, diff, order) {
        if (this.updateEvent) {
            this.updateEvent(this, mesc, diff, order);
        }
    }
    hitTest(localPt) {
        if (this.isVisible) {
            return this.shape.hitTest(localPt, this);
        }
        else {
            return false;
        }
    }
    draw(context) {
        if (this.isVisible) {
            this.shape.beginDraw(this, this, context);
            if (this.renderEvent !== null) {
                this.renderEvent(this, context, interface_1.EOrder.PREORDER);
            }
            this.shape.draw(this, this, context);
            if (this.renderEvent !== null) {
                this.renderEvent(this, context, interface_1.EOrder.POSTORDER);
            }
            this.shape.endDraw(this, this, context);
        }
    }
}
exports.Sprite2D = Sprite2D;
