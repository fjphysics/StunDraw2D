"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas2DUtil {
    static printAllStates(ctx) {
        console.log("*********LineState**********");
        console.log(" lineWidth : " + ctx.lineWidth);
        console.log(" lineCap : " + ctx.lineCap);
        console.log(" lineJoin : " + ctx.lineJoin);
        console.log(" miterLimit : " + ctx.miterLimit);
        console.log("*********LineDashState**********");
        console.log(" lineDashOffset : " + ctx.lineDashOffset);
        console.log("*********ShadowState**********");
        console.log(" shadowBlur : " + ctx.shadowBlur);
        console.log(" shadowColor : " + ctx.shadowColor);
        console.log(" shadowOffsetX : " + ctx.shadowOffsetX);
        console.log(" shadowOffsetY : " + ctx.shadowOffsetY);
        console.log("*********TextState**********");
        console.log(" font : " + ctx.font);
        console.log(" textAlign : " + ctx.textAlign);
        console.log(" textBaseline : " + ctx.textBaseline);
        console.log("*********RenderState**********");
        console.log(" strokeStyle : " + ctx.strokeStyle);
        console.log(" fillStyle : " + ctx.fillStyle);
        console.log(" globalAlpha : " + ctx.globalAlpha);
        console.log(" globalCompositeOperation : " + ctx.globalCompositeOperation);
    }
    static state(ctx, save = true) {
        if (save === true) {
            ctx.save();
        }
        else {
            ctx.restore();
        }
    }
    static setLineState(ctx, lineWidth = 1.0, lineCap = "butt", lineJoint = "miter", miterLimit = 10.0) {
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.lineJoin = lineJoint;
        ctx.miterLimit = miterLimit;
    }
    static setLineDashState(ctx, lineDashArray, lineDashOffset = 0.0) {
        ctx.setLineDash(lineDashArray);
        ctx.lineDashOffset = lineDashOffset;
    }
    static setShadowState(ctx, shadowBlur = 0, shadowColor = "rgba(0, 0, 0, 0)", shadowOffsetX = 0, shadowOffsetY = 0) {
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = shadowColor;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
    }
    static setTextState(ctx, font, textAlign = "left", textBaseLine = "top") {
        ctx.font = font;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseLine;
    }
    static setRenderState(ctx, strokeStyle = "#000000", fillStyle = "#000000", globalAlpha = 1.0, compositeOperation = "source-over") {
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = globalAlpha;
        ctx.globalCompositeOperation = compositeOperation;
    }
}
Canvas2DUtil.Colors = [
    //'black' ,   //黑色
    // 'white' ,   //白色
    'aqua',
    'blue',
    'fuchsia',
    'gray',
    'green',
    'lime',
    'maroon',
    'navy',
    'olive',
    'orange',
    'purple',
    'red',
    'silver',
    'teal',
    'yellow' //黄色
];
exports.Canvas2DUtil = Canvas2DUtil;
