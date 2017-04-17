
function init() {
// renderer
var renderer = new THREE.WebGLRenderer({
canvas: document.getElementById('mainCanvas')
});
renderer.setClearColor(0x000000); // black
// scene
var scene = new THREE.Scene();
// camera
var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000); camera.position.set(0, 0, 5);
scene.add(camera);
// a cube in the scene
var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 3), new THREE.MeshBasicMaterial({
);
color: 0xff0000 })
scene.add(cube);
// render
renderer.render(scene, camera); }


var geometry = new THREE.Geometry();
// 设置顶点位置
// 顶部4顶点
geometry.vertices.push(new THREE.Vector3(-1, 2, -1)); 
geometry.vertices.push(new THREE.Vector3(1, 2, -1)); 
geometry.vertices.push(new THREE.Vector3(1, 2, 1)); 
geometry.vertices.push(new THREE.Vector3(-1, 2, 1)); 
// 底部4顶点
geometry.vertices.push(new THREE.Vector3(-2, 0, -2)); 
geometry.vertices.push(new THREE.Vector3(2, 0, -2)); 
geometry.vertices.push(new THREE.Vector3(2, 0, 2));
geometry.vertices.push(new THREE.Vector3(-2, 0, 2));
// 设置顶点连接情况
// 顶面
geometry.faces.push(new THREE.Face3(0, 1, 2, 3)); // 底面
geometry.faces.push(new THREE.Face3(4, 5, 6, 7)); // 四个侧面
geometry.faces.push(new THREE.Face3(0, 1, 5, 4));
geometry.faces.push(new THREE.Face3(1, 2, 6, 5));
geometry.faces.push(new THREE.Face3(2, 3, 7, 6)); 
geometry.faces.push(new THREE.Face3(3, 0, 4, 7));




var fs = require("fs");

// 异步读取
/*
fs.readFile('bunny.m', function (err, data) {
   if (err) {
       return console.error(err);
   }
   console.log("异步读取: " + data.toString());
   var dataString = data.toString
   var vertex = {
        vertex_x: Array(),
        vertex_y: Array(),
        vertex_z: Array()
   }
   var normal = {
        normal_x: Array(),
        normal_y: Array(),
        normal_z: Array()
   }
   var face = {
        face_x: Array(),
        face_y: Array(),
        face_z: Array()
   }
  
});
*/

var vertex_x = new Array(40002)
var vertex_y = new Array(40002)
var vertex_z = new Array(40002)
var face_x = new Array(80000)
var face_y = new Array(80000)
var face_z = new Array(80000)

var lineReader = require('line-reader');
var xxx =0;
var zzz =0;
lineReader.eachLine('bunny.m', function(line, last) {
   
  //console.log(line);
  if(line.charAt(0)=='V'){
     var array= line.split(' ')
     vertex_x[xxx] = array[3]
     vertex_y[xxx] = array[4]
     vertex_z[xxx] = array[5]
     console.log(vertex_x[xxx])
     //console.log(xxx)
     xxx++

  }
  if(line.charAt(0)=='F'){
    var array1 = line.split(' ')
    face_x[zzz] = array1[3]
    face_x[zzz] = array1[4]
    face_x[zzz] = array1[5]
     //console.log(zzz)
    zzz++
  }
  
   //console.log(line.split(' '))
  
   //console.log(array[])
   //console.log(xxx++);
   // if ( zzz =79999 ) {
   //   return false; 
   // }
});

console.log(vertex_x)
console.log("程序执行完毕。");