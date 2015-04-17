//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module lark {

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;

    /**
     * 格式化弧线角度的值
     */
    function clampAngle(value):number {
        value %= PI * 2;
        if (value < 0) {
            value += PI * 2;
        }
        return value;
    }

    /**
     * 两个点距离
     */
    function distanceOf(p1:P, p2:P) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    }

    /**
     * 取两点之间的向量
     */
    function getVector(p1:P, p2:P) {
        var l = distanceOf(p1, p2);
        var v = {
            x: (p2.x - p1.x) / l,
            y: (p2.y - p1.y) / l
        };
        return v;
    }


    interface P {
        x: number;
        y: number;
    }

    interface V extends P {
    }

    /**
     * 两个向量夹角
     */
    function angleOf(v1:V, v2:V) {
        var cross = v1.x * v2.x + v1.y * v2.y;
        var l1 = distanceOf(v1, {x: 0, y: 0});
        var l2 = distanceOf(v2, {x: 0, y: 0});

        var cos = cross / (l1 * l2);
        var a = Math.acos(cos);
        return a;
    }

    /**
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     */
    export class Graphics extends HashObject {

        /**
         * 创建一个放射状渐变填充
         */
        public static createRadialGradient(x0:number, y0:number, r0:number, x1:number, y1:number, r1:number):GraphicsGradient {
            return null;
        }

        /**
         * 创建一个线性填充
         */
        public static createLinearGradient(x0:number, y0:number, x1:number, y1:number):GraphicsGradient {
            return null;
        }

        public constructor() {
            super();
            this.reset();
        }

        private _fillStyle:any;

        public get fillStyle():any {
            return this._fillStyle;
        }

        public set fillStyle(value:any) {
            this._fillStyle = value;
            this.pushCommand(player.GraphicsCommandType.fillStyle, arguments);
        }

        private _lineWidth:number;

        public get lineWidth():number {
            return this._lineWidth;
        }

        public set lineWidth(value:number) {
            this._lineWidth = value;
            this.pushCommand(player.GraphicsCommandType.lineWidth, arguments);
        }

        private _lineCap:string;

        public get lineCap():string {
            return this._lineCap;
        }

        public set lineCap(value:string) {
            this._lineCap = value;
            this.pushCommand(player.GraphicsCommandType.lineCap, arguments);
        }

        private _strokeStyle:any;

        public get strokeStyle():any {
            return this._strokeStyle;
        }

        public set strokeStyle(value:any) {
            this._strokeStyle = value;
            this.pushCommand(player.GraphicsCommandType.strokeStyle, arguments);
        }

        private _lineJoin:string;

        public get lineJoin():string {
            return this._lineJoin;
        }

        public set lineJoin(value:string) {
            this._lineJoin = value;
            this.pushCommand(player.GraphicsCommandType.lineJoin, arguments);
        }

        private _miterLimit:number;

        public get miterLimit():number {
            return this._miterLimit;
        }

        public set miterLimit(value:number) {
            this._miterLimit = value;
            this.pushCommand(player.GraphicsCommandType.miterLimit, arguments);
        }


        public arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean):void {
            this.pushCommand(player.GraphicsCommandType.arc, arguments);
            if (radius < 0) {
                return;
            }
            if (anticlockwise) {
                var temp = endAngle;
                endAngle = startAngle;
                startAngle = temp;
            }
            this.arcBounds(x,y,radius,startAngle,endAngle);
        }

        private arcBounds(x:number, y:number, radius:number, startAngle:number, endAngle:number):void{
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);

            var offset = 0;
            if (startAngle > endAngle) {
                offset = TwoPI;
                endAngle += offset;
            }
            var startX = Math.cos(startAngle) * radius;
            var endX = Math.cos(endAngle) * radius;
            if (startAngle <= (PI + offset) && endAngle >= (PI + offset)) {
                var xMin = -radius;
            }
            else {
                xMin = Math.min(startX, endX, 0);
            }
            if (startAngle <= offset && endAngle >= offset) {
                var xMax = radius;
            }
            else {
                xMax = Math.max(startX, endX, 0);
            }
            var startY = Math.sin(startAngle) * radius;
            var endY = Math.sin(endAngle) * radius;
            if (startAngle <= (PacPI + offset) && endAngle >= (PacPI + offset)) {
                var yMin = -radius;
            }
            else {
                yMin = Math.min(0, startY, endY);
            }
            if (startAngle <= (HalfPI + offset) && endAngle >= (HalfPI + offset)) {
                var yMax = radius;
            }
            else {
                yMax = Math.max(startY, endY, 0);
            }
            this.extendByPoint(xMin + x, yMin + y);
            this.extendByPoint(xMax + x, yMax + y);
        }

        public quadraticCurveTo(cpx:number, cpy:number, x:number, y:number):void {
            this.pushCommand(player.GraphicsCommandType.quadraticCurveTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(cpx, cpy);
            this.extendByPoint(x, y);
        }

        public bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number):void {
            this.pushCommand(player.GraphicsCommandType.bezierCurveTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(cp1x, cp1y);
            this.extendByPoint(cp2x, cp2y);
            this.extendByPoint(x, y);
        }


        public lineTo(x:number, y:number):void {
            this.pushCommand(player.GraphicsCommandType.lineTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(x, y);
        }

        public fill(fillRule?:string):void {
            this.pushCommand(player.GraphicsCommandType.fill, arguments);
            this.hasFill = true;
        }

        public closePath():void {
            this.pushCommand(player.GraphicsCommandType.closePath, arguments);
        }

        public rect(x:number, y:number, w:number, h:number):void {
            this.pushCommand(player.GraphicsCommandType.rect, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + w, y + h);
        }

        public moveTo(x:number, y:number):void {
            this.pushCommand(player.GraphicsCommandType.moveTo, arguments);
            this.moveToX = x;
            this.moveToY = y;
            this.hasMoved = true;
        }

        public fillRect(x:number, y:number, w:number, h:number):void {
            this.pushCommand(player.GraphicsCommandType.fillRect, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + w, y + h);
            this.hasFill = true;
        }

        public stroke():void {
            this.pushCommand(player.GraphicsCommandType.stroke, arguments);
            this.hasStroke = true;
        }

        public strokeRect(x:number, y:number, w:number, h:number):void {
            this.pushCommand(player.GraphicsCommandType.strokeRect, arguments);
            this.hasStroke = true;
            this.extendByPoint(x, y);
            this.extendByPoint(x + w, y + h);
        }

        public beginPath():void {
            this.pushCommand(player.GraphicsCommandType.beginPath, arguments);
            this.hasMoved = false;
            this.moveToX = 0x8000000;
            this.moveToY = 0x8000000;
        }

        public arcTo(x1:number, y1:number, x2:number, y2:number, radius:number):void {
            this.pushCommand(player.GraphicsCommandType.arcTo, arguments);
            if (this.moveToX === 0x8000000) {//没有调用过moveTo()方法
                return;
            }
            this.checkMoveTo();

            var p1 = {x: this.moveToX, y: this.moveToY},
                p2 = {x: x1, y: y1},
                p3 = {x: x2, y: y2};
            var R = radius;

            var vx1 = getVector(p1, p2),
                vx3 = getVector(p3, p2);
            //角平分线
            var v = {x: vx1.x + vx3.x, y: vx1.y + vx3.y};
            //角平分向量归1
            v = getVector(v, {x: 0, y: 0});
            var a = angleOf(vx1, v);

            //var halfa = a / 2;
            var l = R / Math.sin(a);
            var target = {
                x: p2.x + v.x * l,
                y: p2.y + v.y * l
            };

            var L21 = R / Math.tan(a);
            var p21 = {
                x: p2.x + vx1.x * L21,
                y: p2.y + vx1.y * L21
            };
            var p23 = {
                x: p2.x + vx3.x * L21,
                y: p2.y + vx3.y * L21
            };

            v = getVector(target,p21);
            var startAngle = Math.atan2(v.y,v.x);
            v = getVector(target,p23);
            var endAngle = Math.atan2(v.y,v.x);
            var offset = endAngle - startAngle;
            offset = clampAngle(offset);
            if(offset>PI){
                var temp = endAngle;
                endAngle = startAngle;
                startAngle = temp;
            }
            this.arcBounds(target.x,target.y,R,startAngle,endAngle);
        }

        /**
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         */
        public clear():void {
            this.reset();
            this.$commands.length = 0;
            this.$targetDisplay.$invalidate();
        }

        private isFirst:boolean;
        private minX:number;
        private minY:number;
        private maxX:number;
        private maxY:number;
        private hasMoved:boolean;
        private moveToX:number;
        private moveToY:number;
        private hasStroke:boolean;
        private hasFill:boolean;


        private reset():void {
            this._fillStyle = "#000000";
            this._lineCap = "butt";
            this._lineJoin = "miter";
            this._lineWidth = 1;
            this._miterLimit = 10;
            this._strokeStyle = "#000000";
            this.hasMoved = false;
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
            this.isFirst = true;
            this.moveToX = 0x8000000;
            this.moveToY = 0x8000000;
            this.hasStroke = false;
            this.hasFill = false;
        }

        /**
         * 目标显示对象
         */
        $targetDisplay:DisplayObject;
        /**
         * 绘图命令列表
         */
        $commands:player.GraphicsCommand[] = [];

        private pushCommand(graphicsType:number, args:any):void {
            this.$commands.push({type: graphicsType, arguments: args});
            this.$targetDisplay.$invalidateContentBounds();
        }

        private checkMoveTo():void {
            if (this.hasMoved) {
                this.hasMoved = false;
                this.extendByPoint(this.moveToX, this.moveToY);
            }
        }

        private extendByPoint(x:number, y:number):void {
            if (this.isFirst) {
                this.isFirst = false;
                this.maxX = this.minX = x;
                this.maxY = this.minY = y;
            }
            else {
                this.minX = Math.min(this.minX, x);
                this.minY = Math.min(this.minY, y);
                this.maxX = Math.max(this.maxX, x);
                this.maxY = Math.max(this.maxY, y);
            }
        }

        $measureContentBounds(bounds:Rectangle):void {
            if (!this.hasFill && !this.hasStroke) {
                bounds.setEmpty();
                return;
            }
            if (this.hasStroke) {
                var lineWidth = this._lineWidth;
                var half = lineWidth * 0.5;
            }
            else {
                half = lineWidth = 0;
            }
            bounds.setTo(this.minX - half, this.minY - half, this.maxX - this.minX + lineWidth, this.maxY - this.minY + lineWidth);
        }
    }
}