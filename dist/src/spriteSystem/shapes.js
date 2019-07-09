"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const math2d_1 = require("../math2d");
class BaseShape2D {
    constructor() {
        this.axisXStyle = "rgba( 255 , 0 , 0 , 128 ) ";
        this.axisYStyle = "rgba( 0 , 255 , 0 , 128 ) ";
        this.axisLineWidth = 1;
        this.axisLength = 100;
        this.data = undefined;
    }
    drawLine(ctx, style, isAxisX = true) {
        ctx.save();
        ctx.strokeStyle = style;
        ctx.lineWidth = this.axisLineWidth;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (isAxisX) {
            ctx.lineTo(this.axisLength, 0);
        }
        else {
            ctx.lineTo(0, this.axisLength);
        }
        ctx.stroke();
        ctx.restore();
    }
    beginDraw(transformable, state, context) {
        context.save();
        context.lineWidth = state.lineWidth;
        context.strokeStyle = state.strokeStyle;
        context.fillStyle = state.fillStyle;
        let mat = transformable.getWorldMatrix();
        context.setTransform(mat.values[0], mat.values[1], mat.values[2], mat.values[3], mat.values[4], mat.values[5]);
    }
    draw(transformable, state, context) {
        if (state.renderType === interface_1.ERenderType.STROKE) {
            context.stroke();
        }
        else if (state.renderType === interface_1.ERenderType.FILL) {
            context.fill();
        }
        else if (state.renderType === interface_1.ERenderType.STROKE_FILL) {
            context.stroke();
            context.fill();
        }
        else if (state.renderType === interface_1.ERenderType.CLIP) {
            context.clip();
        }
    }
    endDraw(transformable, state, context) {
        if (state.renderType !== interface_1.ERenderType.CLIP) {
            if (state.showCoordSystem) {
                this.drawLine(context, this.axisXStyle, true);
                this.drawLine(context, this.axisYStyle, false);
            }
            context.restore();
        }
    }
}
exports.BaseShape2D = BaseShape2D;
class Circle extends BaseShape2D {
    constructor(radius = 1) {
        super();
        this.radius = radius;
    }
    hitTest(localPt, transform) {
        return math2d_1.Math2D.isPointInCircle(localPt, math2d_1.vec2.create(0, 0), this.radius);
    }
    draw(transformable, state, context) {
        context.beginPath();
        context.arc(0, 0, this.radius, 0.0, Math.PI * 2.0, true);
        super.draw(transformable, state, context);
    }
    get type() {
        return "Circle";
    }
}
exports.Circle = Circle;
class Ellipse extends BaseShape2D {
    constructor(radiusX = 10, radiusY = 10) {
        super();
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }
    hitTest(localPt, transform) {
        let isHitted = math2d_1.Math2D.isPointInEllipse(localPt.x, localPt.y, 0, 0, this.radiusX, this.radiusY);
        return isHitted;
    }
    draw(transform, state, context) {
        context.beginPath();
        context.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        super.draw(transform, state, context);
    }
    get type() {
        return "Ellipse";
    }
}
exports.Ellipse = Ellipse;
class ConvexPolygon extends BaseShape2D {
    constructor(points) {
        if (points.length < 3) {
            alert("多边形顶点必须大于3或等于3!!");
            new Error("多边形顶点必须大于3或等于3!!");
        }
        if (math2d_1.Math2D.isConvex(points) === false) {
            alert("当前多边形不是凸多边形!!");
            new Error("当前多边形不是凸多边形!!");
        }
        super();
        this.points = points;
    }
    hitTest(localPt, transform) {
        return math2d_1.Math2D.isPointInPolygon(localPt, this.points);
    }
    draw(transformable, state, context) {
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.closePath();
        super.draw(transformable, state, context);
    }
    get type() {
        return "Polygon";
    }
}
exports.ConvexPolygon = ConvexPolygon;
class Rect extends BaseShape2D {
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    constructor(w = 1, h = 1, u = 0, v = 0) {
        super();
        this.width = w;
        this.height = h;
        this.x = -this.width * u;
        this.y = -this.height * v;
    }
    get type() {
        return "Rect";
    }
    hitTest(localPt, transform) {
        return math2d_1.Math2D.isPointInRect(localPt.x, localPt.y, this.x, this.y, this.width, this.height);
    }
    draw(transformable, state, context) {
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.width, this.y);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.lineTo(this.x, this.y + this.height);
        context.closePath();
        super.draw(transformable, state, context);
    }
}
exports.Rect = Rect;
class Grid extends Rect {
    constructor(w = 10, h = 10, xStep = 10, yStep = 10) {
        super(w, h, 0, 0);
        this.xStep = xStep;
        this.yStep = yStep;
    }
    draw(transformable, state, context) {
        state.renderType = interface_1.ERenderType.CUSTOM;
        context.fillRect(0, 0, this.width, this.height);
        context.beginPath();
        for (var i = this.xStep + 0.5; i < this.width; i += this.xStep) {
            context.moveTo(i, 0);
            context.lineTo(i, this.height);
        }
        context.stroke();
        context.beginPath();
        for (var i = this.yStep + 0.5; i < this.height; i += this.yStep) {
            context.moveTo(0, i);
            context.lineTo(this.width, i);
        }
        context.stroke();
    }
    get type() {
        return "Grid";
    }
}
exports.Grid = Grid;
class BezierPath extends BaseShape2D {
    constructor(points, isCubic = false) {
        super();
        this.points = points;
        this.isCubic = isCubic;
        this.data = points;
    }
    get type() {
        return "BezierPath";
    }
    hitTest(localPt, transform) { return false; }
    draw(transformable, state, context) {
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        if (this.isCubic) {
            for (let i = 1; i < this.points.length; i += 3) {
                context.bezierCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y, this.points[i + 2].x, this.points[i + 2].y);
            }
        }
        else {
            for (let i = 1; i < this.points.length; i += 2) {
                context.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
            }
        }
        super.draw(transformable, state, context);
    }
}
exports.BezierPath = BezierPath;
class Line {
    constructor(len = 10, t = 0) {
        if (t < 0.0 || t > 1.0) {
            alert("参数t必须处于 [ 0 , 1 ]之间!!");
            throw new Error("参数t必须处于 [ 0 , 1 ]之间!!");
        }
        this.start = math2d_1.vec2.create(-len * t, 0);
        this.end = math2d_1.vec2.create(len * (1.0 - t), 0);
        this.data = undefined;
    }
    hitTest(localPt, transform) {
        return math2d_1.Math2D.isPointOnLineSegment(localPt, this.start, this.end);
    }
    beginDraw(transformable, state, context) {
        context.save();
        context.lineWidth = state.lineWidth;
        context.strokeStyle = state.strokeStyle;
        let mat = transformable.getWorldMatrix();
        context.setTransform(mat.values[0], mat.values[1], mat.values[2], mat.values[3], mat.values[4], mat.values[5]);
    }
    draw(transformable, state, context) {
        state.renderType = interface_1.ERenderType.STROKE;
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }
    endDraw(transformable, state, context) {
        context.restore();
    }
    get type() {
        return "Line";
    }
}
exports.Line = Line;
class Scale9Grid extends Rect {
    get type() {
        return "Scale9Grid";
    }
    constructor(data, width, height, u, v) {
        super(width, height, u, v);
        this.data = data;
        this._calcDestRects();
    }
    _calcDestRects() {
        this.destRects = [];
        this.srcRects = [];
        let rc;
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(0, 0);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.data.topMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x, this.y);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.data.topMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.image.width - this.data.rightMargin, 0);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.data.topMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.right - this.data.rightMargin, this.y);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.data.topMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.image.width - this.data.rightMargin, this.data.image.height - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.right - this.data.rightMargin, this.bottom - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.data.bottomMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(0, this.data.image.height - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x, this.bottom - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.data.bottomMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(0, this.data.topMargin);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.data.image.height - this.data.topMargin - this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x, this.y + this.data.topMargin);
        rc.size = math2d_1.Size.create(this.data.leftMargin, this.height - this.data.topMargin - this.data.bottomMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.leftMargin, 0);
        rc.size = math2d_1.Size.create(this.data.image.width - this.data.leftMargin - this.data.rightMargin, this.data.topMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x + this.data.leftMargin, this.y);
        rc.size = math2d_1.Size.create(this.width - this.data.leftMargin - this.data.rightMargin, this.data.topMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.image.width - this.data.rightMargin, this.data.topMargin);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.data.image.height - this.data.topMargin - this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.right - this.data.rightMargin, this.y + this.data.topMargin);
        rc.size = math2d_1.Size.create(this.data.rightMargin, this.height - this.data.topMargin - this.data.bottomMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.leftMargin, this.data.image.height - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.data.image.width - this.data.leftMargin - this.data.rightMargin, this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x + this.data.leftMargin, this.bottom - this.data.bottomMargin);
        rc.size = math2d_1.Size.create(this.width - this.data.leftMargin - this.data.rightMargin, this.data.bottomMargin);
        this.destRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.data.leftMargin, this.data.topMargin);
        rc.size = math2d_1.Size.create(this.data.image.width - this.data.leftMargin - this.data.rightMargin, this.data.image.height - this.data.topMargin - this.data.bottomMargin);
        this.srcRects.push(rc);
        rc = new math2d_1.Rectangle();
        rc.origin = math2d_1.vec2.create(this.x + this.data.leftMargin, this.y + this.data.topMargin);
        rc.size = math2d_1.Size.create(this.width - this.data.leftMargin - this.data.rightMargin, this.height - this.data.topMargin - this.data.bottomMargin);
        this.destRects.push(rc);
    }
    _drawImage(context, img, destRect, srcRect, fillType = interface_1.EImageFillType.STRETCH) {
        if (srcRect.isEmpty()) {
            return false;
        }
        if (destRect.isEmpty()) {
            return false;
        }
        if (fillType === interface_1.EImageFillType.STRETCH) {
            context.drawImage(img, srcRect.origin.x, srcRect.origin.y, srcRect.size.width, srcRect.size.height, destRect.origin.x, destRect.origin.y, destRect.size.width, destRect.size.height);
        }
        else {
            let rows = Math.ceil(destRect.size.width / srcRect.size.width);
            let colums = Math.ceil(destRect.size.height / srcRect.size.height);
            let left = 0;
            let top = 0;
            let right = 0;
            let bottom = 0;
            let width = 0;
            let height = 0;
            let destRight = destRect.origin.x + destRect.size.width;
            let destBottom = destRect.origin.y + destRect.size.height;
            if (fillType === interface_1.EImageFillType.REPEAT_X) {
                colums = 1;
            }
            else if (fillType === interface_1.EImageFillType.REPEAT_Y) {
                rows = 1;
            }
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < colums; j++) {
                    left = destRect.origin.x + i * srcRect.size.width;
                    top = destRect.origin.y + j * srcRect.size.height;
                    width = srcRect.size.width;
                    height = srcRect.size.height;
                    right = left + width;
                    bottom = top + height;
                    if (right > destRight) {
                        width = srcRect.size.width - (right - destRight);
                    }
                    if (bottom > destBottom) {
                        height = srcRect.size.height - (bottom - destBottom);
                    }
                    context.drawImage(img, srcRect.origin.x, srcRect.origin.y, width, height, left, top, width, height);
                }
            }
        }
        return true;
    }
    draw(transformable, state, context) {
        for (let i = 0; i < this.srcRects.length; i++) {
            this._drawImage(context, this.data.image, this.destRects[i], this.srcRects[i], interface_1.EImageFillType.STRETCH);
        }
    }
}
exports.Scale9Grid = Scale9Grid;
