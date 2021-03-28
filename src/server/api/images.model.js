const mongoose = require('mongoose')
const algolia = require('../utils/algolia.js')

const schema = mongoose.Schema({
    url: { type: String, default: '' },
    title: { type: String, default: '' },
    source: { type: String, default: '' },
    tags: { type: [String], default: [], text: true },
    click: { type: Number, default: 0 },
}, {
    timestamps: true
})

schema.statics.getSamples = function(size) {
    return this.aggregate([{ $sample: { size: Number(size) || 1 } }])
}

schema.statics.cleanDelete = function(id) {
    algolia('images').deleteObject(id)
    return this.findByIdAndRemove(id)
}

module.exports = mongoose.model('images', schema)
