"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EPSILON = 0.00001;
const PiBy180 = 0.017453292519943295;
class vec2 {
    constructor(x = 0, y = 0) {
        this.values = new Float32Array([x, y]);
    }
    toString() {
        return " [ " + this.values[0] + " , " + this.values[1] + " ] ";
    }
    get x() { return this.values[0]; }
    set x(x) { this.values[0] = x; }
    get y() { return this.values[1]; }
    set y(y) { this.values[1] = y; }
    reset(x = 0, y) {
        this.values[0] = x;
        this.values[1] = y;
        return this;
    }
    equals(vector) {
        if (Math.abs(this.values[0] - vector.values[0]) > EPSILON)
            return false;
        if (Math.abs(this.values[1] - vector.values[1]) > EPSILON)
            return false;
        return true;
    }
    negative() {
        this.values[0] = -this.values[0];
        this.values[1] = -this.values[1];
        return this;
    }
    get squaredLength() {
        let x = this.values[0];
        let y = this.values[1];
        return (x * x + y * y);
    }
    get length() {
        return Math.sqrt(this.squaredLength);
    }
    normalize() {
        let len = this.length;
        if (Math2D.isEquals(len, 0)) {
            console.log(" the length = 0 ");
            this.values[0] = 0;
            this.values[1] = 0;
            return 0;
        }
        if (Math2D.isEquals(len, 1)) {
            console.log(" the length = 1 ");
            return 1.0;
        }
        this.values[0] /= len;
        this.values[1] /= len;
        return len;
    }
    static create(x = 0, y = 0) {
        return new vec2(x, y);
    }
    add(right) {
        vec2.sum(this, right, this);
        return this;
    }
    static sum(left, right, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = left.values[0] + right.values[0];
        result.values[1] = left.values[1] + right.values[1];
        return result;
    }
    substract(another) {
        vec2.difference(this, another, this);
        return this;
    }
    static difference(end, start, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = end.values[0] - start.values[0];
        result.values[1] = end.values[1] - start.values[1];
        return result;
    }
    static copy(src, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = src.values[0];
        result.values[1] = src.values[1];
        return result;
    }
    static scale(direction, scalar, result = null) {
        if (result === null)
            result = new vec2();
        result.values[0] = direction.values[0] * scalar;
        result.values[1] = direction.values[1] * scalar;
        return result;
    }
    static scaleAdd(start, direction, scalar, result = null) {
        if (result === null)
            result = new vec2();
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    }
    static moveTowards(start, direction, scalar, result = null) {
        if (result === null)
            result = new vec2();
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    }
    innerProduct(right) {
        return vec2.dotProduct(this, right);
    }
    static dotProduct(left, right) {
        return left.values[0] * right.values[0] + left.values[1] * right.values[1];
    }
    static crossProduct(left, right) {
        return left.x * right.y - left.y * right.x;
    }
    static getOrientation(from, to, isRadian = false) {
        let diff = vec2.difference(to, from);
        let radian = Math.atan2(diff.y, diff.x);
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
    }
    static getAngle(a, b, isRadian = false) {
        let dot = vec2.dotProduct(a, b);
        let radian = Math.acos(dot / (a.length * b.length));
        if (isRadian === false) {
            radian = Math2D.toDegree(radian);
        }
        return radian;
    }
    static cosAngle(a, b, norm = false) {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return vec2.dotProduct(a, b);
    }
    static sinAngle(a, b, norm = false) {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return (a.x * b.y - b.x * a.y);
    }
}
vec2.zero = new vec2(0, 0);
vec2.xAxis = new vec2(1, 0);
vec2.yAxis = new vec2(0, 1);
vec2.nXAxis = new vec2(-1, 0);
vec2.nYAxis = new vec2(0, -1);
vec2.temp = new vec2(0, 0);
vec2.temp1 = new vec2(0, 0);
exports.vec2 = vec2;
class vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.values = new Float32Array([x, y, z]);
    }
    get x() { return this.values[0]; }
    set x(x) { this.values[0] = x; }
    get y() { return this.values[1]; }
    set y(y) { this.values[1] = y; }
    get z() { return this.values[2]; }
    set z(z) { this.values[2] = z; }
    static cross(v1, v2, out = null) {
        if (out === null)
            out = new vec3();
        out.x = v1.y * v2.z - v1.z * v2.y;
        out.y = v1.z * v2.x - v1.x * v2.z;
        out.z = v1.x * v2.y - v1.y * v2.x;
        return out;
    }
    toString() {
        return " [ " + this.values[0] + " , " + this.values[1] + " , " + this.values[2] + " ] ";
    }
}
exports.vec3 = vec3;
class mat2d {
    constructor(a = 1, b = 0, c = 0, d = 1, x = 0, y = 0) {
        this.values = new Float32Array([a, b, c, d, x, y]);
    }
    identity() {
        this.values[0] = 1.0;
        this.values[1] = 0.0;
        this.values[2] = 0.0;
        this.values[3] = 1.0;
        this.values[4] = 0.0;
        this.values[5] = 0.0;
    }
    static create(a = 1, b = 0, c = 0, d = 1, x = 0, y = 0) {
        return new mat2d(a, b, c, d, x, y);
    }
    get xAxis() {
        return vec2.create(this.values[0], this.values[1]);
    }
    get yAxis() {
        return vec2.create(this.values[2], this.values[3]);
    }
    get origin() {
        return vec2.create(this.values[4], this.values[5]);
    }
    getAngle(isRadian = false) {
        let angle = Math.atan2(this.values[1], this.values[0]);
        if (isRadian) {
            return angle;
        }
        return angle / PiBy180;
    }
    static copy(src, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = src.values[0];
        result.values[1] = src.values[1];
        result.values[2] = src.values[2];
        result.values[3] = src.values[3];
        result.values[4] = src.values[4];
        result.values[5] = src.values[5];
        return result;
    }
    static multiply(left, right, result = null) {
        if (result === null)
            result = new mat2d();
        let a0 = left.values[0];
        let a1 = left.values[1];
        let a2 = left.values[2];
        let a3 = left.values[3];
        let a4 = left.values[4];
        let a5 = left.values[5];
        let b0 = right.values[0];
        let b1 = right.values[1];
        let b2 = right.values[2];
        let b3 = right.values[3];
        let b4 = right.values[4];
        let b5 = right.values[5];
        result.values[0] = a0 * b0 + a2 * b1;
        result.values[1] = a1 * b0 + a3 * b1;
        result.values[2] = a0 * b2 + a2 * b3;
        result.values[3] = a1 * b2 + a3 * b3;
        result.values[4] = a0 * b4 + a2 * b5 + a4;
        result.values[5] = a1 * b4 + a3 * b5 + a5;
        return result;
    }
    static determinant(mat) {
        return mat.values[0] * mat.values[3] - mat.values[2] * mat.values[1];
    }
    static invert(src, result) {
        let det = mat2d.determinant(src);
        if (Math2D.isEquals(det, 0)) {
            return false;
        }
        det = 1.0 / det;
        result.values[0] = src.values[3] * det;
        result.values[1] = -src.values[1] * det;
        result.values[2] = -src.values[2] * det;
        result.values[3] = src.values[0] * det;
        result.values[4] = (src.values[2] * src.values[5] - src.values[3] * src.values[4]) * det;
        result.values[5] = (src.values[1] * src.values[4] - src.values[0] * src.values[5]) * det;
        return true;
    }
    static makeRotation(radians, result = null) {
        if (result === null)
            result = new mat2d();
        let s = Math.sin(radians), c = Math.cos(radians);
        result.values[0] = c;
        result.values[1] = s;
        result.values[2] = -s;
        result.values[3] = c;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    onlyRotationMatrixInvert() {
        let s = this.values[1];
        this.values[1] = this.values[2];
        this.values[2] = s;
        return this;
    }
    static makeRotationFromVectors(v1, v2, norm = false, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = vec2.cosAngle(v1, v2, norm);
        result.values[1] = vec2.sinAngle(v1, v2, norm);
        result.values[2] = -vec2.sinAngle(v1, v2, norm);
        result.values[3] = vec2.cosAngle(v1, v2, norm);
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    static makeReflection(axis, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = 1 - 2 * axis.x * axis.x;
        result.values[1] = -2 * axis.x * axis.y;
        result.values[2] = -2 * axis.x * axis.y;
        result.values[3] = 1 - 2 * axis.y * axis.y;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    static makeXSkew(sx, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = 1;
        result.values[1] = 0;
        result.values[2] = sx;
        result.values[3] = 1;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    static makeYSkew(sy, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = 1;
        result.values[1] = sy;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    static makeTranslation(tx, ty, result = null) {
        if (result === null)
            result = new mat2d();
        result.values[0] = 1;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values[4] = tx;
        result.values[5] = ty;
        return result;
    }
    static makeScale(sx, sy, result = null) {
        if (Math2D.isEquals(sx, 0) || Math2D.isEquals(sy, 0)) {
            alert(" x轴或y轴缩放系数为0 ");
            throw new Error(" x轴或y轴缩放系数为0 ");
        }
        if (result === null)
            result = new mat2d();
        result.values[0] = sx;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = sy;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
}
mat2d.temp1 = mat2d.create();
mat2d.temp2 = mat2d.create();
mat2d.quadBezierBasicMatrix = mat2d.create(1, -2, -2, 2, 1, 0);
exports.mat2d = mat2d;
class MatrixStack {
    constructor() {
        this._mats = [];
        this._mats.push(new mat2d());
    }
    get matrix() {
        if (this._mats.length === 0) {
            alert(" 矩阵堆栈为空 ");
            throw new Error(" 矩阵堆栈为空 ");
        }
        return this._mats[this._mats.length - 1];
    }
    pushMatrix() {
        let mat = mat2d.copy(this.matrix);
        this._mats.push(mat);
    }
    popMatrix() {
        if (this._mats.length === 0) {
            alert(" 矩阵堆栈为空 ");
            return;
        }
        this._mats.pop();
    }
    loadIdentity() {
        this.matrix.identity();
    }
    loadMatrix(mat) {
        mat2d.copy(mat, this.matrix);
    }
    multMatrix(mat) {
        mat2d.multiply(this.matrix, mat, this.matrix);
    }
    translate(x = 0, y = 0) {
        let mat = mat2d.makeTranslation(x, y);
        this.multMatrix(mat);
    }
    rotate(degree = 0, isRadian = false) {
        if (isRadian === false) {
            degree = Math2D.toRadian(degree);
        }
        let mat = mat2d.makeRotation(degree);
        this.multMatrix(mat);
    }
    rotateFrom(v1, v2, norm = false) {
        let mat = mat2d.makeRotationFromVectors(v1, v2, norm);
        this.multMatrix(mat);
    }
    scale(x = 1.0, y = 1.0) {
        let mat = mat2d.makeScale(x, y);
        this.multMatrix(mat);
    }
    invert() {
        let ret = new mat2d();
        if (mat2d.invert(this.matrix, ret) === false) {
            alert(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
            throw new Error(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
        }
        return ret;
    }
}
exports.MatrixStack = MatrixStack;
class Math2D {
    static toRadian(degree) {
        return degree * PiBy180;
    }
    static toDegree(radian) {
        return radian / PiBy180;
    }
    static random(from, to) {
        return Math.random() * to + from;
    }
    static angleSubtract(from, to) {
        let diff = to - from;
        while (diff > 180) {
            diff -= 360;
        }
        while (diff < -180) {
            diff += 360;
        }
        return diff;
    }
    static isEquals(left, right, espilon = EPSILON) {
        if (Math.abs(left - right) >= EPSILON) {
            return false;
        }
        return true;
    }
    static getQuadraticBezierPosition(start, ctrl, end, t) {
        if (t < 0.0 || t > 1.0) {
            alert(" t的取值范围必须为[ 0 , 1 ] ");
            throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
        }
        let t1 = 1.0 - t;
        let t2 = t1 * t1;
        return t2 * start + 2.0 * t * t1 * ctrl + t * t * end;
    }
    static getQuadraticBezierVector(start, ctrl, end, t, result = null) {
        if (result === null)
            result = vec2.create();
        result.x = Math2D.getQuadraticBezierPosition(start.x, ctrl.x, end.x, t);
        result.y = Math2D.getQuadraticBezierPosition(start.y, ctrl.y, end.y, t);
        return result;
    }
    static getQuadraticBezierMat(start, ctrl, end, t, result = null) {
        if (result === null)
            result = vec2.create();
        return result;
    }
    static getCubicBezierPosition(start, ctrl0, ctrl1, end, t) {
        if (t < 0.0 || t > 1.0) {
            alert(" t的取值范围必须为[ 0 , 1 ] ");
            throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
        }
        let t1 = (1.0 - t);
        let t2 = t * t;
        let t3 = t2 * t;
        return (t1 * t1 * t1) * start + 3 * t * (t1 * t1) * ctrl0 + (3 * t2 * t1) * ctrl1 + t3 * end;
    }
    static getCubicBezierVector(start, ctrl0, ctrl1, end, t, result = null) {
        if (result === null)
            result = vec2.create();
        result.x = Math2D.getCubicBezierPosition(start.x, ctrl0.x, ctrl1.x, end.x, t);
        result.y = Math2D.getCubicBezierPosition(start.y, ctrl0.y, ctrl1.y, end.y, t);
        return result;
    }
    static createQuadraticBezierEnumerator(start, ctrl, end, steps = 30) {
        return new BezierEnumerator(start, end, ctrl, null, steps);
    }
    static createCubicBezierEnumerator(start, ctrl0, ctrl1, end, steps = 30) {
        return new BezierEnumerator(start, end, ctrl0, ctrl1, steps);
    }
    static projectPointOnLineSegment(pt, start, end, closePoint) {
        let v0 = vec2.create();
        let v1 = vec2.create();
        let d = 0;
        vec2.difference(pt, start, v0);
        vec2.difference(end, start, v1);
        d = v1.normalize();
        let t = vec2.dotProduct(v0, v1);
        if (t < 0) {
            closePoint.x = start.x;
            closePoint.y = start.y;
            return false;
        }
        else if (t > d) {
            closePoint.x = end.x;
            closePoint.y = end.y;
            return false;
        }
        else {
            vec2.scaleAdd(start, v1, t, closePoint);
            return true;
        }
    }
    static isPointOnLineSegment(pt, start, end, radius = 2) {
        let closePt = vec2.create();
        if (Math2D.projectPointOnLineSegment(pt, start, end, closePt) === false) {
            return false;
        }
        return Math2D.isPointInCircle(pt, closePt, radius);
    }
    static isPointInCircle(pt, center, radius) {
        let diff = vec2.difference(pt, center);
        let len2 = diff.squaredLength;
        if (len2 <= radius * radius) {
            return true;
        }
        return false;
    }
    static isPointInRect(ptX, ptY, x, y, w, h) {
        if (ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h) {
            return true;
        }
        return false;
    }
    static isPointInEllipse(ptX, ptY, centerX, centerY, radiusX, radiusY) {
        let diffX = ptX - centerX;
        let diffY = ptY - centerY;
        let n = (diffX * diffX) / (radiusX * radiusX) + (diffY * diffY) / (radiusY * radiusY);
        return n <= 1.0;
    }
    static sign(v0, v1, v2) {
        let e1 = vec2.difference(v0, v2);
        let e2 = vec2.difference(v1, v2);
        return vec2.crossProduct(e1, e2);
    }
    static isPointInTriangle(pt, v0, v1, v2) {
        let b1 = Math2D.sign(v0, v1, pt) < 0.0;
        let b2 = Math2D.sign(v1, v2, pt) < 0.0;
        let b3 = Math2D.sign(v2, v0, pt) < 0.0;
        return ((b1 === b2) && (b2 === b3));
    }
    static isPointInPolygon(pt, points) {
        if (points.length < 3) {
            return false;
        }
        for (let i = 2; i < points.length; i++) {
            if (Math2D.isPointInTriangle(pt, points[0], points[i - 1], points[i])) {
                return true;
            }
        }
        return false;
    }
    static isConvex(points) {
        let sign = Math2D.sign(points[0], points[1], points[2]) < 0;
        let j, k;
        for (let i = 1; i < points.length; i++) {
            j = (i + 1) % points.length;
            k = (i + 2) % points.length;
            if (sign !== Math2D.sign(points[i], points[j], points[k]) < 0) {
                return false;
            }
        }
        return true;
    }
    static transform(mat, pt, result = null) {
        if (result === null)
            result = vec2.create();
        result.values[0] = mat.values[0] * pt.values[0] + mat.values[2] * pt.values[1] + mat.values[4];
        result.values[1] = mat.values[1] * pt.values[0] + mat.values[3] * pt.values[1] + mat.values[5];
        return result;
    }
}
Math2D.matStack = new MatrixStack();
exports.Math2D = Math2D;
class Size {
    constructor(w = 1, h = 1) {
        this.values = new Float32Array([w, h]);
    }
    set width(value) { this.values[0] = value; }
    get width() { return this.values[0]; }
    set height(value) { this.values[1] = value; }
    get height() { return this.values[1]; }
    static create(w = 1, h = 1) {
        return new Size(w, h);
    }
}
exports.Size = Size;
class Rectangle {
    constructor(orign = new vec2(), size = new Size(1, 1)) {
        this.origin = orign;
        this.size = size;
    }
    isEmpty() {
        let area = this.size.width * this.size.height;
        if (Math2D.isEquals(area, 0) === true) {
            return true;
        }
        else {
            return false;
        }
    }
    static create(x = 0, y = 0, w = 1, h = 1) {
        let origin = new vec2(x, y);
        let size = new Size(w, h);
        return new Rectangle(origin, size);
    }
}
exports.Rectangle = Rectangle;
class Inset {
    constructor(l = 0, t = 0, r = 0, b = 0) {
        this.values = new Float32Array([l, t, r, b]);
    }
    get leftMargin() {
        return this.values[0];
    }
    set leftMargin(value) {
        this.values[0] = value;
    }
    get topMargin() {
        return this.values[1];
    }
    set topMargin(value) {
        this.values[1] = value;
    }
    get rightMargin() {
        return this.values[2];
    }
    set rightMargin(value) {
        this.values[2] = value;
    }
    get bottomMargin() {
        return this.values[3];
    }
    set bottomMargin(value) {
        this.values[3] = value;
    }
}
exports.Inset = Inset;
class Transform2D {
    constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
        this.position = new vec2(x, y);
        this.rotation = rotation;
        this.scale = new vec2(scaleX, scaleY);
    }
    toMatrix() {
        Math2D.matStack.loadIdentity();
        Math2D.matStack.translate(this.position.x, this.position.y);
        Math2D.matStack.rotate(this.rotation, false);
        Math2D.matStack.scale(this.scale.x, this.scale.y);
        return Math2D.matStack.matrix;
    }
    toInvMatrix(result) {
        let mat = this.toMatrix();
        return mat2d.invert(mat, result);
    }
}
exports.Transform2D = Transform2D;
class BezierEnumerator {
    constructor(start, end, control0, control1 = null, steps = 30) {
        this._startAnchorPoint = start;
        this._endAnchorPoint = end;
        this._controlPoint0 = control0;
        if (control1 !== null) {
            this._controlPoint1 = control1;
        }
        else {
            this._controlPoint1 = null;
        }
        this._steps = steps;
        this._i = 1.0 / (this._steps);
        this._currentIdx = -1;
    }
    reset() {
        this._currentIdx = -1;
    }
    get current() {
        if (this._controlPoint1 !== null) {
            return Math2D.getCubicBezierVector(this._startAnchorPoint, this._controlPoint0, this._controlPoint1, this._endAnchorPoint, this._currentIdx * this._i);
        }
        else {
            return Math2D.getQuadraticBezierVector(this._startAnchorPoint, this._controlPoint0, this._endAnchorPoint, this._currentIdx * this._i);
        }
    }
    moveNext() {
        this._currentIdx++;
        return this._currentIdx < this._steps;
    }
    get steps() {
        this._i = 1.0 / (this._steps);
        return this._steps;
    }
    set steps(steps) {
        this._steps = steps;
        this.reset();
    }
}
exports.BezierEnumerator = BezierEnumerator;
class QuadraticBezierEnumerator {
    constructor(start, end, control0, steps = 30) {
        this._startAnchorPoint = start;
        this._endAnchorPoint = end;
        this._controlPoint0 = control0;
        this._steps = steps;
        this._i = 1.0 / (this._steps);
        this._currentIdx = -1;
    }
    reset() {
        this._currentIdx = -1;
    }
    get current() {
        let t = this._currentIdx * this._i;
        let ret = vec2.create(t * t, t);
        Math2D.transform(mat2d.quadBezierBasicMatrix, ret, ret);
        ret.x = this._startAnchorPoint.x * ret.x + this._controlPoint0.x * ret.y + this._endAnchorPoint.x;
        ret.y = this._startAnchorPoint.y * ret.x + this._controlPoint0.y * ret.y + this._endAnchorPoint.y;
        return ret;
    }
    moveNext() {
        this._currentIdx++;
        return this._currentIdx < this._steps;
    }
    get steps() {
        this._i = 1.0 / (this._steps);
        return this._steps;
    }
    set steps(steps) {
        this._steps = steps;
        this.reset();
    }
}
exports.QuadraticBezierEnumerator = QuadraticBezierEnumerator;
