var $ = require('jbone');
var ajax = require('./ajax');

$.post = ajax.post;
$.get = ajax.get;
$.put = ajax.put;
$.delete = ajax.delete;

module.exports = $;
