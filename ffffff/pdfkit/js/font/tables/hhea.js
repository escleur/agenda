// Generated by CoffeeScript 1.7.1
(function() {
  var Data, HheaTable, Table,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Table = require('../table');

  Data = require('../../data');

  HheaTable = (function(_super) {
    __extends(HheaTable, _super);

    function HheaTable() {
      return HheaTable.__super__.constructor.apply(this, arguments);
    }

    HheaTable.prototype.tag = 'hhea';

    HheaTable.prototype.parse = function(data) {
      data.pos = this.offset;
      this.version = data.readInt();
      this.ascender = data.readShort();
      this.decender = data.readShort();
      this.lineGap = data.readShort();
      this.advanceWidthMax = data.readShort();
      this.minLeftSideBearing = data.readShort();
      this.minRightSideBearing = data.readShort();
      this.xMaxExtent = data.readShort();
      this.caretSlopeRise = data.readShort();
      this.caretSlopeRun = data.readShort();
      this.caretOffset = data.readShort();
      data.pos += 4 * 2;
      this.metricDataFormat = data.readShort();
      return this.numberOfMetrics = data.readUInt16();
    };

    HheaTable.prototype.encode = function(ids) {
      var i, table, _i, _ref;
      table = new Data;
      table.writeInt(this.version);
      table.writeShort(this.ascender);
      table.writeShort(this.decender);
      table.writeShort(this.lineGap);
      table.writeShort(this.advanceWidthMax);
      table.writeShort(this.minLeftSideBearing);
      table.writeShort(this.minRightSideBearing);
      table.writeShort(this.xMaxExtent);
      table.writeShort(this.caretSlopeRise);
      table.writeShort(this.caretSlopeRun);
      table.writeShort(this.caretOffset);
      for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        table.writeByte(0);
      }
      table.writeShort(this.metricDataFormat);
      table.writeUInt16(ids.length);
      return table.data;
    };

    return HheaTable;

  })(Table);

  module.exports = HheaTable;

}).call(this);
