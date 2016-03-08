'use strict';

let fs = require('fs');
let url = require('url');
let logFilePath = [].concat(process.argv).slice(2)[0]
let logTypes = [].concat(process.argv).slice(3)

function os(ua) {
  function has(string) {
    return ua.includes(string);
  }
  if (has('PlayStation') || has('PS Vita')) return "PlayStation";
  if (has('Windows Phone')) return "Windows Phone";
  if (has('Windows')) return "Windows";
  if (has('iPhone') || has('iPad')) return "IOS";
  if (has('Android')) return 'Android';
  if (has('Linux')) return "Linux";
  if (has('BlackBerry') || has('BB10') || has('PlayBook')) return "BlackBerry";
  if (has('Googlebot')) return "Googlebot";
  if (has('Baiduspider')) return "Baiduspider";
  if (has('bingbot')) return "Bingbot";
  if (has('Mac OS X')) {
    if (has('Chrome')) {
      return 'Mac OS X Chrome';
    }
    if (has('Safari')) {
      return 'Mac OS X Safari';
    }
    return 'Mac OS X Other';
  }
  return ua;
}

function objectToArray(object) {
  let rs = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      rs.push([key, object[key]]);
    }
  }
  return rs;
}

function format(log) {
  return log.replace(/\[|\]/g, '"').trim().split('\n').map(function(log) {
    return log.split('"').map(function(log, index) {
      return index % 2 === 0 ? log.trim().split(' ') : log;
    }).reduce(function(a, b) {
      return a.concat(b);
    }, []);
      }).map(function(log) {
    return {
      ip: log[1],
      ts: log[4],
      target: log[8].split(" ")[1].split("?")[0],
      code: log[9],
      referer: url.parse(log[11]).host,
      ua: log[13],
      os: os(log[13])
    }
  })
}

function count(formatedLog) {
  let rs = {};
  let types = logTypes.length ? logTypes : ["ip", "target", "referer", "os"];

  formatedLog.forEach(function(log) {
    types.forEach(function(type) {
      if (!(type in rs)) rs[type] = {};
      if (log[type] in rs[type]) {
        rs[type][log[type]]++;
      } else {
        rs[type][log[type]] = 1;
      }
    })
  })
  return rs;
}

function formatStr(str, num, color, c) {
  c = c || {
    reset: '\u001b[0m',
    bold: '\u001b[1m',
    italic: '\u001b[3m',
    underline: '\u001b[4m',
    blink: '\u001b[5m',
    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m'
  }
  str += '';
  str += Array(Math.max(num - str.length, 1)).toString().replace(/\,/g, ' ');
  return color && c[color] ? [c[color], str, c['reset']].join('') : str;
}

function print(log) {
  console.log(log);
}

fs.readFile(logFilePath, function(err, data) {
  if (err) throw err;
  let rs = count(format(data.toString()));

  for (let type in rs) {
    if (rs.hasOwnProperty(type)) {
      print(`====${type}====\n`);
      var array = objectToArray(rs[type]);
      array
        .sort(function(a, b) {
          return b[1] - a[1]
        })
        .forEach(function(keyValue, index) {
          index < 100 && print(
            formatStr(keyValue[1], 8, 'white') +
            formatStr(keyValue[0], 0, 'blue')
          );
        })
      print('\n总条目: ' + array.length + '\n');
    }
  }
});
