//node script to clean up input object.
var fs = require("fs");

console.log(process.argv[2]);



//fs.readFile( __dirname + "/" + process.argv[2], function (err, data) {
fs.readFile( process.argv[2], function (err, data) {
  if (err) {
    throw err; 
  }
  var parsedData = JSON.parse(data.toString()).meshes[0];
  var prundedData = {};
  
  if (parsedData.vertices){prundedData.vertices = parsedData.vertices;}
  if (parsedData.normals){prundedData.normals = parsedData.normals;}
  if (parsedData.faces){prundedData.faces = parsedData.faces;}
  if (parsedData.texturecoords){prundedData.texturecoords = parsedData.texturecoords;}
  
  var dataString = JSON.stringify(prundedData);
  dataString.replace("\t","");
  dataString.replace("\r\n","");

  fs.writeFile(process.argv[2]+".min",dataString, ()=>{});
  //console.log(dataString);
});


