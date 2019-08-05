const mongoose = require('mongoose')

const schema = mongoose.Schema({
    url: { type: String, default: '' },
    title: { type: String, default: '' },
    source: { type: String, default: '' },
    tags: { type: [String], default: [], text: true },
    click: { type: Number, default: 0 }
}, {
    timestamps: true
})

module.exports = mongoose.model('images', schema)