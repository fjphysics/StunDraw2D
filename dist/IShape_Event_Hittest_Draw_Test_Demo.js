"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./src/spriteSystem/interface");
const application_1 = require("./src/application");
const math2d_1 = require("./src/math2d");
const Canvas2DUtil_1 = require("./src/Canvas2d/Canvas2DUtil");
const sprite2DApplication_1 = require("./src/spriteSystem/sprite2DApplication");
class IShape_Event_Hittest_Draw_Test_Demo {
    constructor(app) {
        this._shapes = [];
        this._lastColor = 'red';
        this._app = app;
        this._idx = 0;
        this._image = document.createElement('img');
        this._image.src = "./data/scale9.png";
        this._image.onload = (ev) => {
            this._createShapes();
            this.createSprites();
            this._app.start();
        };
    }
    createSprites() {
        let grid = interface_1.SpriteFactory.createGrid(this._app.canvas.width, this._app.canvas.height);
        let gridSprite = interface_1.SpriteFactory.createSprite(grid, 'grid');
        gridSprite.fillStyle = "white";
        gridSprite.strokeStyle = 'black';
        this._app.rootContainer.addSprite(gridSprite);
        gridSprite.mouseEvent = (s, evt) => {
            if (this._shapes.length === 0) {
                return;
            }
            if (evt.button === 2) {
                if (evt.type === application_1.EInputEventType.MOUSEUP) {
                    this._idx = this._idx % this._shapes.length;
                    let sprite = interface_1.SpriteFactory.createSprite(this._shapes[this._idx]);
                    sprite.x = evt.canvasPosition.x;
                    sprite.y = evt.canvasPosition.y;
                    if (sprite.shape.type !== "Scale9Grid") {
                        sprite.rotation = math2d_1.Math2D.random(-180, 180);
                    }
                    sprite.renderType = interface_1.ERenderType.FILL;
                    if (this._shapes[this._idx].type === 'Line') {
                        sprite.renderType = interface_1.ERenderType.STROKE;
                        sprite.scaleX = math2d_1.Math2D.random(1, 2);
                        sprite.strokeStyle = Canvas2DUtil_1.Canvas2DUtil.Colors[Math.floor(math2d_1.Math2D.random(3, Canvas2DUtil_1.Canvas2DUtil.Colors.length - 1))];
                    }
                    else {
                        sprite.fillStyle = Canvas2DUtil_1.Canvas2DUtil.Colors[Math.floor(math2d_1.Math2D.random(3, Canvas2DUtil_1.Canvas2DUtil.Colors.length - 1))];
                        if (this._shapes[this._idx].type === 'Circle') {
                            let scale = math2d_1.Math2D.random(1, 3);
                            sprite.scaleX = scale;
                            sprite.scaleY = scale;
                        }
                        else if (this._shapes[this._idx].type !== 'Scale9Grid') {
                            sprite.scaleX = math2d_1.Math2D.random(1, 1.5);
                            sprite.scaleY = math2d_1.Math2D.random(1, 1.5);
                        }
                    }
                    sprite.mouseEvent = this.mouseEventHandler.bind(this);
                    sprite.updateEvent = this.updateEventHandler.bind(this);
                    this._app.rootContainer.addSprite(sprite);
                    this._idx++;
                }
            }
        };
    }
    _createShapes() {
        this._shapes = [];
        this._shapes.push(interface_1.SpriteFactory.createLine(math2d_1.vec2.create(0, 0), math2d_1.vec2.create(100, 0)));
        this._shapes.push(interface_1.SpriteFactory.createXLine(100, 0.5));
        this._shapes.push(interface_1.SpriteFactory.createRect(10, 10));
        this._shapes.push(interface_1.SpriteFactory.createRect(10, 10, 0.5, 0.5));
        this._shapes.push(interface_1.SpriteFactory.createRect(10, 10, 0.5, 0));
        this._shapes.push(interface_1.SpriteFactory.createRect(10, 10, 0, 0.5));
        this._shapes.push(interface_1.SpriteFactory.createRect(10, 10, -0.5, 0.5));
        this._shapes.push(interface_1.SpriteFactory.createCircle(10));
        this._shapes.push(interface_1.SpriteFactory.createEllipse(10, 15));
        let triPoints = [math2d_1.vec2.create(0, 0), math2d_1.vec2.create(20, 0), math2d_1.vec2.create(20, 20)];
        this._shapes.push(interface_1.SpriteFactory.createPolygon(triPoints));
        let polyPoints = [math2d_1.vec2.create(20, 0),
            math2d_1.vec2.create(10, 20),
            math2d_1.vec2.create(-10, 20),
            math2d_1.vec2.create(-20, 0),
            math2d_1.vec2.create(-10, -20),
            math2d_1.vec2.create(10, -20)
        ];
        this._shapes.push(interface_1.SpriteFactory.createPolygon(polyPoints));
        let data = new interface_1.Scale9Data(this._image, new math2d_1.Inset(30, 30, 30, 30));
        this._shapes.push(interface_1.SpriteFactory.createScale9Grid(data, 300, 100, 0.5, 0.5));
        /*
       let points2 : vec2 [ ] = [
        vec2 . create ( - 100 , - 100 ) ,
        vec2 . create ( 0 , - 100.00 ) ,
        vec2 . create ( 100 , - 100 ) ,
        vec2 . create ( 0 , 100 ) ,
       ] ;

       this . _shapes . push ( SpriteFactory . createPolygon ( points2 ) ) ;
       */
    }
    mouseEventHandler(s, evt) {
        if (evt.button === 0) {
            if (evt.type === application_1.EInputEventType.MOUSEDOWN) {
                if (s.shape.type === "Line") {
                    this._lastColor = s.strokeStyle;
                    s.strokeStyle = 'red';
                    s.lineWidth = 10;
                }
                else {
                    this._lastColor = s.fillStyle;
                    s.fillStyle = 'red';
                }
            }
            else if (evt.type === application_1.EInputEventType.MOUSEUP) {
                if (s.shape.type === "Line") {
                    s.lineWidth = 1;
                    s.strokeStyle = this._lastColor;
                }
                else {
                    s.fillStyle = this._lastColor;
                }
            }
            else if (evt.type === application_1.EInputEventType.MOUSEDRAG) {
                s.x = evt.canvasPosition.x;
                s.y = evt.canvasPosition.y;
            }
        }
    }
    updateEventHandler(s, mesc, diffSec, order) {
        if (order === interface_1.EOrder.POSTORDER) {
            return;
        }
        if (s.shape.type !== 'Circle' && s.shape.type !== 'Line' && s.shape.type !== 'Scale9Grid') {
            s.rotation += 100 * diffSec;
            console.log("up");
        }
    }
}
let canvas = document.getElementById('canvas');
let app = new sprite2DApplication_1.Sprite2DApplication(canvas, true);
new IShape_Event_Hittest_Draw_Test_Demo(app);
