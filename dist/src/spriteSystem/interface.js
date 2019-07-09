"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapes_1 = require("./shapes");
const sprite2d_1 = require("./sprite2d");
var ERenderType;
(function (ERenderType) {
    ERenderType[ERenderType["CUSTOM"] = 0] = "CUSTOM";
    ERenderType[ERenderType["STROKE"] = 1] = "STROKE";
    ERenderType[ERenderType["FILL"] = 2] = "FILL";
    ERenderType[ERenderType["STROKE_FILL"] = 3] = "STROKE_FILL";
    ERenderType[ERenderType["CLIP"] = 4] = "CLIP";
})(ERenderType = exports.ERenderType || (exports.ERenderType = {}));
var EOrder;
(function (EOrder) {
    EOrder[EOrder["PREORDER"] = 0] = "PREORDER";
    EOrder[EOrder["POSTORDER"] = 1] = "POSTORDER";
})(EOrder = exports.EOrder || (exports.EOrder = {}));
class SpriteFactory {
    static createGrid(w, h, xStep = 10, yStep = 10) {
        return new shapes_1.Grid(w, h, xStep, yStep);
    }
    static createCircle(radius) {
        return new shapes_1.Circle(radius);
    }
    static createRect(w, h, u = 0, v = 0) {
        return new shapes_1.Rect(w, h, u, v);
    }
    static createEllipse(radiusX, radiusY) {
        return new shapes_1.Ellipse(radiusX, radiusY);
    }
    static createPolygon(points) {
        if (points.length < 3) {
            throw new Error("多边形顶点数量必须大于或等于3!!!");
        }
        return new shapes_1.ConvexPolygon(points);
    }
    static createScale9Grid(data, width, height, u = 0, v = 0) {
        return new shapes_1.Scale9Grid(data, width, height, u, v);
    }
    static createLine(start, end) {
        let line = new shapes_1.Line();
        line.start = start;
        line.end = end;
        return line;
    }
    static createXLine(len = 10, t = 0) {
        return new shapes_1.Line(len, t);
    }
    static createBezierPath(points, isCubic = false) {
        return new shapes_1.BezierPath(points, isCubic);
    }
    static createSprite(shape, name = '') {
        let spr = new sprite2d_1.Sprite2D(shape, name);
        return spr;
    }
    static createISprite(shape, x = 0, y = 0, rotation = 0, scaleX = 1.0, scaleY = 1.0, name = ' ') {
        let spr = new sprite2d_1.Sprite2D(shape, name);
        spr.x = x;
        spr.y = y;
        spr.rotation = rotation;
        spr.scaleX = scaleX;
        spr.scaleY = scaleY;
        return spr;
    }
}
exports.SpriteFactory = SpriteFactory;
var EImageFillType;
(function (EImageFillType) {
    EImageFillType[EImageFillType["NONE"] = 0] = "NONE";
    EImageFillType[EImageFillType["STRETCH"] = 1] = "STRETCH";
    EImageFillType[EImageFillType["REPEAT"] = 2] = "REPEAT";
    EImageFillType[EImageFillType["REPEAT_X"] = 3] = "REPEAT_X";
    EImageFillType[EImageFillType["REPEAT_Y"] = 4] = "REPEAT_Y";
})(EImageFillType = exports.EImageFillType || (exports.EImageFillType = {}));
class Scale9Data {
    set inset(value) {
        this._inset = value;
    }
    get leftMargin() {
        return this._inset.leftMargin;
    }
    get rightMargin() {
        return this._inset.rightMargin;
    }
    get topMargin() {
        return this._inset.topMargin;
    }
    get bottomMargin() {
        return this._inset.bottomMargin;
    }
    constructor(image, inset) {
        this.image = image;
        this._inset = inset;
    }
}
exports.Scale9Data = Scale9Data;
