var yargs = require('yargs');
var sayCheese = require("../");

var argv = yargs
    .usage('Take some screenshots at different screensizes\nUsage: $0')
    .example('$0 -s 400x600 -s 768x1024 http://google.com', '')
    .alias('h', 'help')
    .alias('s', 'size')
    .demand('s')
    .describe('s', 'Size of screen, format 768x1024 (multiple allowed)')
    .alias('o', 'output')
    .describe('o', 'Output to file')
    // .alias('d', 'display')
    // .describe('d', 'Display in browser')
    .argv;

// HELP!
if(argv.h) {
  yargs.showHelp();
  return;
}

var url = argv._[0];
var sizes = argv.size;
if(!(sizes instanceof Array)) {
  sizes = [sizes];
}
sizes = sizes.map(function(item) {
  var parts = item.split("x");
  return {
    width:  parts[0],
    height: parts[1]
  };
});

var opts = {
  display: argv.display,
  output:  argv.output,
};

sayCheese(url, sizes, opts, function(err) {
  if(err) {
    console.log(err);
    return yargs.showHelp();
  }
});
