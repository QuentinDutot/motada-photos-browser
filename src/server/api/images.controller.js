const Images = require('./images.model.js');

exports.find = async (req, res) => {
  const { query } = req;
  const { random, tags } = query;
  let result = false;

  // api/images?count
  if (Object.prototype.hasOwnProperty.call(query, 'count')) {
    result = {
      count: await Images.estimatedDocumentCount()
    }
  }
  // api/images?random=3
  if (Object.prototype.hasOwnProperty.call(query, 'random')) {
    result = {
      random: await Images.aggregate([{ $sample: { size: Number(random) || 1 } }])
    }
  }
  // api/images?tags=sky,car
  if (Object.prototype.hasOwnProperty.call(query, 'tags')) {
    result = {
      tags: await Images.find({ $text: { $search: tags.split(',').join(' ') } })
    }
  }

  res.send(JSON.stringify(result));
};

exports.update = async (req, res) => {
  const { params, body } = req;
  let result = false;

  if (params.id) {
    const image = await Images.findByIdAndUpdate(params.id, body, { new: true });
    if (image) result = true;
  }

  res.send(JSON.stringify(result));
};

exports.delete = async (req, res) => {
  const { params } = req;
  let result = false;

  if (params.id) {
    const image = await Images.findByIdAndRemove(params.id);
    if (image) result = true;
  }

  res.send(JSON.stringify(result));
};