/**
 * @fileoverview
 * @author Taketshi Aono
 */

'use strict';
var fs = require('fs');
var Promise = require('node-promise');
var path = require('path');

var ANY = /[\s\S]*/;
var PATH_REG = /\\/g;

function resolve(p) {
  return path.resolve(p).replace(PATH_REG, '/');
}

function promise(fn) {
  var defer = Promise.defer();
  fn(function(ret, err) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(ret);
    }
  });
  return defer.promise;
};


/**
 * Walk directory tree.
 * @param {string} path
 * @param {Function} fn
 */
module.exports = function(path, fn, excludes, matcher) {
  excludes = excludes || /[^\s\S]/;
  matcher = matcher || ANY;
  path = resolve(path);
  var defer = Promise.defer();
  var promises = [];

  fs.readdir(path, function(err, node) {
    if (err) return defer.reject(err);
    var stack = [[node, path]];
    var currentpath = path;
    var next;
    var dirEnt;
    var entry;
    var match;
    var code = [];

    function innerLoop() {
      dirEnt = node[0];
      if (!dirEnt.length) return setImmediate(outerLoop);
      next = node[0].shift();
      if (next !== '.' && next !== '..') {
        entry = node[1] + '/' + next;
        fs.stat(entry, function(err, stat) {
          if (err) return defer.reject(err);
          if (stat.isDirectory()) {
            stack.push([node[0], node[1]]);
            fs.readdir(entry, function(err, dir) {
              if (err) return defer.reject(err);
              node = [dir, entry];
              dirEnt = node[0];
              setImmediate(innerLoop);
            });
          } else {
            if (!matcher.test(entry)) {
              return setImmediate(innerLoop);
            }
            if (excludes.test(entry)) {
              return setImmediate(innerLoop);
            }
            promises.push(promise(fn.bind(entry, entry)));
            return setImmediate(innerLoop);
          }
        });
      }
    }

    function outerLoop() {
      if (!stack.length) return defer.resolve();
      node = stack.pop();
      innerLoop();
    }
    outerLoop();
  });

  return defer.then(function() {
    return Promise.all(promises);
  });
};


/**
 * Walk directory tree asyc.
 * @param {string} path
 * @param {Function} fn
 */
module.exports.sync = function(path, fn, excludes, matcher) {
  excludes = excludes || /[^\s\S]/;
  matcher = matcher || ANY;
  path = resolve(path);

  var node = fs.readdirSync(path);
  var isCall = typeof fn === 'function';
  var stack = [[node, path]];
  var currentpath = path;
  var next;
  var dirEnt;
  var entry;
  var match;
  var code = [];

  while (stack.length) {

    node = stack.pop();
    dirEnt = node[0];

    while (dirEnt.length) {
      next = node[0].shift();
      if (next !== '.' && next !== '..') {
        entry = node[1] + '/' + next;
        if (fs.statSync(entry).isDirectory()) {
          stack.push([node[0], node[1]]);
          node = [fs.readdirSync(entry), entry];
          dirEnt = node[0];
        } else {
          if (!matcher.test(entry)) {
            continue;
          }
          if (excludes.test(entry)) {
            continue;
          }
          isCall? code.push('fn("' + entry + '");') : code.push(entry);
        }
      }
    }
  }

  if (!isCall) return code;
  Function('fn', code.join(''))(fn);
};
