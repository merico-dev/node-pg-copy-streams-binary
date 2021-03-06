module.exports = function (txt, options) {
  return new rowReader(txt, options)
}

const binaryReader = require('./genericReader')

class rowReader extends binaryReader {
  constructor(options = {}) {
    options.readableObjectMode = true
    super(options)

    this.mapping = options.mapping || false
    this._row = null
  }

  rowStart() {
    this._row = this.mapping ? {} : []
  }

  fieldReady() {
    if (this.mapping) {
      this._row[this.mapping[this._fieldIndex].key] = this._fieldHolder
    } else {
      this._row.push(this._fieldHolder)
    }
    if (this._fieldIndex === this._fieldCount - 1) {
      this.push(this._row)
    }
  }

  fieldMode() {
    return 'sync'
  }

  fieldType() {
    return this.mapping ? this.mapping[this._fieldIndex].type : null
  }

  _flush(cb) {
    this._row = null
    super._flush(cb)
  }
}
