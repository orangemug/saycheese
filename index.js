var async   = require("async");
var temp    = require("temp");
var phantom = require("phantom");

function isInt(n) {
  return typeof n === 'number' && n % 1 == 0;
}

var port = 12301;

function renderPage(url, size, path, done) {
  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.set("viewportSize", size, function() {
        page.open(url, function(status) {
          if(status !== "success") return done("Failed to load page");
          page.render(path, done);
          ph.exit();
        });
      });
    });
  }, {
    // Horrible hack because the connections seem to hang about for a while
    port: port++
  });
}

module.exports = function(url, sizes, opts, done) {
  if(!url) {
    return done("Invalid url");
  }

  if(!url.match(/.+:\/\//)) {
    // Assume file path
    url = "file://"+process.cwd()+"/"+url;
  }

  function hdl(item, done) {
    var w = parseInt(item.width, 10);
    var h = parseInt(item.height, 10);
    if(!w || !h) {
      return done("Invalid size");
    }

    var size = {
      width: w,
      height: h
    };

    var filename = w+"x"+h+".png";

    if(!opts.output) {
      // Create a temp dir
      temp.mkdir("saycheese", function(err, dirPath) {
        if(err) return done(err);
        renderPage(url, size, dirPath+"/"+filename, done);
      });
    } else {
      // Create a real dir
      temp.mkdir(opts.output, function(err) {
        if(err) return done(err);
        renderPage(url, size, opts.output+"/"+filename, done);
      });
    }
  }

  async.eachSeries(sizes, hdl, done);
};
