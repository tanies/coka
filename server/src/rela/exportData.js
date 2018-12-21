

const json2csv = require('json2csv').parse
const fs = require('fs')
const counts = require('./data/table_array.js')

counts.forEach((item)=>{
    item.parents = item.parents.join(",")
    item.children = item.children.join(",")
})

let csv = json2csv(counts,{fields:Object.keys(counts[0]),eol:'\r\n',})

fs.writeFile('./data/table_array.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved')
})



