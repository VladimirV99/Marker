module.exports.encodePost = function(content) {
  return content
    .replace(/\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}