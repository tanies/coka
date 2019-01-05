var csv2json = require('csv2json');
var fs = require('fs');


fs.createReadStream(__dirname + '/data/table_array.csv')
    .pipe(csv2json({
        // Defaults to comma.
        separator: ';'
    }))
    .pipe(fs.createWriteStream('data.json'));