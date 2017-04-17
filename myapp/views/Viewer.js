// Interaction variables
var rotateX, rotateY;
var translateZ;
var lastX, lastY;
var dragging;
// WebGL variables
var gl, canvas;
// Arrays
var normals;
var vertexArray, normalArray, triangleArray;
// Locations
var ProjectionLocation, ModelLocation;
var lightDirectionLocation, lightColorLocation;
var objectColorLocation;
var vertexPositionLocation, vertexNormalLocation;
// Buffers
var vertexBuffer, triangleBuffer, normalBuffer;
// Other variables
var Model, Projection;
// Color variables
var red, green, blue;

// Initialization function
function init() {
	// Interaction variable init
	rotateX = 0;
	rotateY = 0;
	red = 0.8;
	green = 0.8;
	blue = 0.8;
	translateZ = 7.5;
	dragging = false;

	// WebGL init
	canvas = document.getElementById('webgl');
	gl = getWebGLContext(canvas, false);

	// Calculating normal array
	normals = [];
	var n = [0, 0, 0];
	for (var i = 0; i < vertices.length; i++)
		normals.push(n);
	for (var i = 0; i < triangles.length; i++) {
		i0 = triangles[i][0];
		i1 = triangles[i][1];
		i2 = triangles[i][2];
		a = normalize(subtract(vertices[i1], vertices[i0]));
		b = normalize(subtract(vertices[i2], vertices[i0]));
		n = normalize(cross(a, b));
		normals[i0] = add(normals[i0], n);
		normals[i1] = add(normals[i1], n);
		normals[i2] = add(normals[i2], n);
	}
	for (var i = 0; i < normals.length; i++)
		normals[i] = normalize(normals[i]);

	// Shader initialization
	initShaders(gl, document.getElementById("vertexShader").text, document.getElementById("fragmentShader").text);

  // Uniform Locations
	ProjectionLocation = gl.getUniformLocation(gl.program, "Projection");
	ModelLocation = gl.getUniformLocation(gl.program, "Model");
	lightDirectionLocation = gl.getUniformLocation(gl.program, "lightDirection");
	lightColorLocation = gl.getUniformLocation(gl.program, "lightColor");
	objectColorLocation = gl.getUniformLocation(gl.program, "objectColor");

	// Buffer initialization
	vertexPositionLocation = gl.getAttribLocation(gl.program, "vertexPosition");
	vertexNormalLocation = gl.getAttribLocation(gl.program, "vertexNormal");
	gl.enableVertexAttribArray(vertexPositionLocation);
	gl.enableVertexAttribArray(vertexNormalLocation);

	vertexArray = new Float32Array(flatten(vertices));
	normalArray = new Float32Array(flatten(normals));
	triangleArray = new Uint16Array(flatten(triangles));

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
  normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW);
  triangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleArray, gl.STATIC_DRAW);

  // Request the first animation frames
  requestAnimationFrame(draw);
}

function draw() {
	// Compute the transform
	Projection = new Matrix4();
	Projection.setPerspective(45, 1, 1, 20);
	gl.uniformMatrix4fv(ProjectionLocation, false, Projection.elements);

  Model = new Matrix4();
  Model.setTranslate(0, 0, -translateZ);
  Model.rotate(rotateX, 1, 0, 0);
  Model.rotate(rotateY, 0, 1, 0);
  gl.uniformMatrix4fv(ModelLocation, false, Model.elements);

  // Specify lighting parameters
  gl.uniform3f(lightDirectionLocation, 0.0, 1.0, 1.0);
  gl.uniform3f(lightColorLocation, 1.0, 1.0, 1.0);
  gl.uniform3f(objectColorLocation, red, green, blue);

  // Configuring attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(vertexNormalLocation, 3, gl.FLOAT, false, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
  gl.drawElements(gl.TRIANGLES, triangleArray.length, gl.UNSIGNED_SHORT, 0);
}

// Interaction functions
function mouseDown(event) {
	dragging = true;
	lastX = event.clientX;
	lastY = event.clientY;
}

function mouseUp(event) {
	dragging = false;
}

function mouseMove(event) {
	if (dragging) {
		rotateY = rotateY + event.clientX - lastX;
		rotateX = rotateX + event.clientY - lastY;

		if (rotateX > 90.0)
			rotateX = 90.0;
		if (rotateX < -90.0)
			rotateX = -90.0;

		requestAnimationFrame(draw);
	}
	lastX = event.clientX;
	lastY = event.clientY;
}

// Slider functions
function transZ() {
	translateZ = parseFloat(document.getElementById("zinput").value);
	document.getElementById("zoutput").innerHTML = translateZ;
	requestAnimationFrame(draw);
}

function changeRed() {
  red = parseFloat(document.getElementById("redinput").value);
	document.getElementById("redoutput").innerHTML = red;
	requestAnimationFrame(draw);
}

function changeGreen() {
	green = parseFloat(document.getElementById("greeninput").value);
	document.getElementById("greenoutput").innerHTML = green;
	requestAnimationFrame(draw);
}

function changeBlue() {
	blue = parseFloat(document.getElementById("blueinput").value);
	document.getElementById("blueoutput").innerHTML = blue;
	requestAnimationFrame(draw);
}

// Vector Operations
function add(a, b) {
	return [
		a[0] + b[0],
		a[1] + b[1],
		a[2] + b[2]
	];
}

function subtract(a, b) {
	return [
		a[0] - b[0],
		a[1] - b[1],
		a[2] - b[2]
	];
}

function dot(a, b) {
	return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}

function cross(a, b) {
	return [
		(a[1] * b[2]) - (a[2] * b[1]),
		(a[2] * b[0]) - (a[0] * b[2]),
		(a[0] * b[1]) - (a[1] * b[0])
	];
}

function normalize(a) {
	var len = Math.sqrt(dot(a, a));
	return [
		a[0] / len,
		a[1] / len,
		a[2] / len
	];
}

function flatten(a) {
	return a.reduce(function (b, v) { b.push.apply(b,v); return b }, []);
}