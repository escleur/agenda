// Generated by CoffeeScript 1.7.1

/*
PDFDocument - represents an entire PDF document
By Devon Govett
 */

(function() {
  var PDFDocument, PDFObject, PDFPage, PDFReference, fs, stream,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  stream = require('stream');

  fs = require('fs');

  PDFObject = require('./object');

  PDFReference = require('./reference');

  PDFPage = require('./page');

  PDFDocument = (function(_super) {
    var mixin;

    __extends(PDFDocument, _super);

    function PDFDocument(options) {
      var key, val, _ref, _ref1;
      this.options = options != null ? options : {};
      PDFDocument.__super__.constructor.apply(this, arguments);
      this.version = 1.3;
      this.compress = (_ref = this.options.compress) != null ? _ref : true;
      this._pageBuffer = [];
      this._pageBufferStart = 0;
      this._offsets = [];
      this._waiting = 0;
      this._ended = false;
      this._offset = 0;
      this._root = this.ref({
        Type: 'Catalog',
        Pages: this.ref({
          Type: 'Pages',
          Count: 0,
          Kids: []
        })
      });
      this.page = null;
      this.initColor();
      this.initVector();
      this.initFonts();
      this.initText();
      this.initImages();
      this.info = {
        Producer: 'PDFKit',
        Creator: 'PDFKit',
        CreationDate: new Date()
      };
      if (this.options.info) {
        _ref1 = this.options.info;
        for (key in _ref1) {
          val = _ref1[key];
          this.info[key] = val;
        }
      }
      this._write("%PDF-" + this.version);
      this._write("%\xFF\xFF\xFF\xFF");
      this.addPage();
    }

    mixin = function(methods) {
      var method, name, _results;
      _results = [];
      for (name in methods) {
        method = methods[name];
        _results.push(PDFDocument.prototype[name] = method);
      }
      return _results;
    };

    mixin(require('./mixins/color'));

    mixin(require('./mixins/vector'));

    mixin(require('./mixins/fonts'));

    mixin(require('./mixins/text'));

    mixin(require('./mixins/images'));

    mixin(require('./mixins/annotations'));

    PDFDocument.prototype.addPage = function(options) {
      var pages;
      if (options == null) {
        options = this.options;
      }
      if (!this.options.bufferPages) {
        this.flushPages();
      }
      this.page = new PDFPage(this, options);
      this._pageBuffer.push(this.page);
      pages = this._root.data.Pages.data;
      pages.Kids.push(this.page.dictionary);
      pages.Count++;
      this.x = this.page.margins.left;
      this.y = this.page.margins.top;
      this._ctm = [1, 0, 0, 1, 0, 0];
      this.transform(1, 0, 0, -1, 0, this.page.height);
      return this;
    };

    PDFDocument.prototype.bufferedPageRange = function() {
      return {
        start: this._pageBufferStart,
        count: this._pageBuffer.length
      };
    };

    PDFDocument.prototype.switchToPage = function(n) {
      var page;
      if (!(page = this._pageBuffer[n - this._pageBufferStart])) {
        throw new Error("switchToPage(" + n + ") out of bounds, current buffer covers pages " + this._pageBufferStart + " to " + (this._pageBufferStart + this._pageBuffer.length - 1));
      }
      return this.page = page;
    };

    PDFDocument.prototype.flushPages = function() {
      var page, pages, _i, _len;
      pages = this._pageBuffer;
      this._pageBuffer = [];
      this._pageBufferStart += pages.length;
      for (_i = 0, _len = pages.length; _i < _len; _i++) {
        page = pages[_i];
        page.end();
      }
    };

    PDFDocument.prototype.ref = function(data) {
      var ref;
      ref = new PDFReference(this, this._offsets.length + 1, data);
      this._offsets.push(null);
      this._waiting++;
      return ref;
    };

    PDFDocument.prototype._read = function() {};

    PDFDocument.prototype._write = function(data) {
      if (!Buffer.isBuffer(data)) {
        data = new Buffer(data + '\n', 'binary');
      }
      this.push(data);
      return this._offset += data.length;
    };

    PDFDocument.prototype.addContent = function(data) {
      this.page.write(data);
      return this;
    };

    PDFDocument.prototype._refEnd = function(ref) {
      this._offsets[ref.id - 1] = ref.offset;
      if (--this._waiting === 0 && this._ended) {
        this._finalize();
        return this._ended = false;
      }
    };

    PDFDocument.prototype.write = function(filename, fn) {
      var err;
      err = new Error('PDFDocument#write is deprecated, and will be removed in a future version of PDFKit. Please pipe the document into a Node stream.');
      console.warn(err.stack);
      this.pipe(fs.createWriteStream(filename));
      this.end();
      return this.once('end', fn);
    };

    PDFDocument.prototype.output = function(fn) {
      throw new Error('PDFDocument#output is deprecated, and has been removed from PDFKit. Please pipe the document into a Node stream.');
    };

    PDFDocument.prototype.end = function() {
      var font, key, name, val, _ref, _ref1;
      this.flushPages();
      this._info = this.ref();
      _ref = this.info;
      for (key in _ref) {
        val = _ref[key];
        if (typeof val === 'string') {
          val = new String(val);
        }
        this._info.data[key] = val;
      }
      this._info.end();
      _ref1 = this._fontFamilies;
      for (name in _ref1) {
        font = _ref1[name];
        font.embed();
      }
      this._root.end();
      this._root.data.Pages.end();
      if (this._waiting === 0) {
        return this._finalize();
      } else {
        return this._ended = true;
      }
    };

    PDFDocument.prototype._finalize = function(fn) {
      var offset, xRefOffset, _i, _len, _ref;
      xRefOffset = this._offset;
      this._write("xref");
      this._write("0 " + (this._offsets.length + 1));
      this._write("0000000000 65535 f ");
      _ref = this._offsets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        offset = _ref[_i];
        offset = ('0000000000' + offset).slice(-10);
        this._write(offset + ' 00000 n ');
      }
      this._write('trailer');
      this._write(PDFObject.convert({
        Size: this._offsets.length + 1,
        Root: this._root,
        Info: this._info
      }));
      this._write('startxref');
      this._write("" + xRefOffset);
      this._write('%%EOF');
      return this.push(null);
    };

    PDFDocument.prototype.toString = function() {
      return "[object PDFDocument]";
    };

    return PDFDocument;

  })(stream.Readable);

  module.exports = PDFDocument;

}).call(this);
