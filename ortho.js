
"use strict";

function orthoExample() {

var canvas;
var gl;

var numVertices  = 36;

var positionsArray = [];
var colorsArray = [];

var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
    ];

// Set random face colours for cube
var colour1 = Math.random();
var colour2 = Math.random();
var colour3 = Math.random();
var colour4 = Math.random();
var vertexColors = [
        vec4(colour1, colour2, colour3, 1.0),  
        vec4(colour1, colour3, colour2, 1.0),  
        vec4(colour3, colour2, colour1, 1.0),  
        vec4(colour2, colour3, colour4, 1.0),  
        vec4(colour4, colour3, colour1, 1.0),  
        vec4(colour4, colour1, colour2, 1.0),  
        vec4(colour3, colour4, colour1, 1.0),  
        vec4(colour4, colour2, colour3, 1.0),  
    ];

// Variables for rotation
var near = -10;
var far = 10;
var radius = 7.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var top = 1.0;
var bottom = -1.0;

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d) {
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     positionsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

// Set cube faces

function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set background
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Load shaders and buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

	
	window.onkeydown = function (event) { // Read key inputs for rotation
		var key = String.fromCharCode(event.keyCode);
		switch (event.keyCode) {
			case 38: //"Up"
				theta -= dr;
			break;
			case 37: //"Left"
				phi += dr;
			break;
			case 39: //"Right"
				phi -= dr;
			break;	
			case 40: //"Down"
				theta += dr;
			break;
			case 82: //"R"
				colour1 = Math.random();
				colour2 = Math.random();
				colour3 = Math.random();
				colour4 = Math.random();
			break;
		}
	}

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta),
             radius*Math.cos(phi));

        modelViewMatrix = lookAt(eye, at , up);
        projectionMatrix = ortho(left, right, bottom, top, near, far);


        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        requestAnimationFrame(render);
    }
}


orthoExample();
