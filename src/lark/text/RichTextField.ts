﻿//////////////////////////////////////////////////////////////////////////////////////
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

    export type RichTextNode = string | IRichTextNode;

    export class RichTextField extends TextField {

        public constructor(format?: TextFormat) {
            super(null, format);
        }

        protected _nodes: RichTextNode[];

        public get nodes(): RichTextNode[]{
            return this._nodes;
        }

        public set nodes(value: RichTextNode[]) {
            this._nodes = value;
        }

        protected _makeContents() {
            if (!hasFlag(this._textFieldFlags, TextFieldFlags.TextDirty)
                && !hasFlag(this._textFieldFlags, TextFieldFlags.MultilineDirty)
                && !hasFlag(this._textFieldFlags, TextFieldFlags.RichNodeDirty))
                return;
            var contents: text.ContentElement[] = [];
            var nodes = this._nodes, length = this._nodes.length;
            for (var i = 0; i < length; i++) {
                var node:any = nodes[i];
                var element: text.ContentElement = null;
                if ((<string>node).charAt) {
                    element = this.parseString(node);
                }
                else if ((<IRichTextNode>node).src) {
                    element = this.parseImage(node);
                }
                else if (node instanceof DisplayObject) {
                    element = this.parseGraphic(node, this._format);
                }
                else if ((<IRichTextNode>node).text) {
                    element = this.parseTextNode(node);
                }
                contents.push(element);
            }
            this._contents = [new text.GroupElement(contents)];
        }

        protected parseGraphic(node: DisplayObject, format?: text.ElementFormat) {
            var ge = new text.GraphicElement(node, node.width, node.height, format);
            return ge;
        }

        protected parseImage(node: IRichTextNode) {
            var width = node.width, height = node.height;
            var bitmap = new Bitmap();
            bitmap.width = width;
            bitmap.height = height;
            bitmap.texture = RichTextField.getPlaceholderTexture();

            var image = new Image(width, height);
            image.src = node.src;
            image.onload = e=> {
                var texture = new Texture();
                texture.$setBitmapData(image);
                bitmap.texture = texture;
                bitmap.width = width;
                bitmap.height = height;
            };

            return this.parseGraphic(bitmap, node.style);
        }

        protected parseString(node: string) {
            return this.parseTextNode({ text: node });
        }

        protected parseTextNode(node: IRichTextNode) {
            var textElement = new text.TextElement(node.text, node.style);
            return textElement;
        }

        protected static $PlaceholderTexture:Texture = null;
        public static getPlaceholderTexture() {
            if (RichTextField.$PlaceholderTexture == null) {
                var img = new Image();
                img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=";
                img.height = img.width = 1;
                var texture: Texture = new Texture();
                texture.$setBitmapData(img);
                RichTextField.$PlaceholderTexture = texture;
            }
            return RichTextField.$PlaceholderTexture;
        }
    }
}