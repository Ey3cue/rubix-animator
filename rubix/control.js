/* ----------
   control.js 
   
   Provides essential setup for this WebGL application.
   ---------- */

// Globals

var canvas;
var gl;

var shaders;

var projection;
var look;
var lookRotation;

var rubixCube;

var drawables = []; // used to store any objects that need to be drawn

// Constants
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

const DEGREES_PER_FRAME = 2;

const COLORS = {
    black  : [ 0.0, 0.0, 0.0, 1.0 ],
    red    : [ 1.0, 0.0, 0.0, 1.0 ],
    orange : [ 1.0, 0.5, 0.0, 1.0 ],
    yellow : [ 1.0, 1.0, 0.0, 1.0 ],
    green  : [ 0.0, 1.0, 0.0, 1.0 ],
    blue   : [ 0.0, 0.0, 1.0, 1.0 ],
    white  : [ 1.0, 1.0, 1.0, 1.0 ]
};

const SAMPLE_STATE = 'GGWRRGRRGOWWGGOYYROGOYYYRBRYYYRBGRWWBOYBOBBOBOGOWWBWWB';
const SAMPLE_SOLUTION = 'O1W1R1Y3';


(function () {

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

window.onload = function () {
    Control.initGL();
    Control.initScene();
    Control.initEvents();
    ControlInterface.init();
    Control.render();
};

/**
 * Provides functions essential to the entire applicaiton.
 */
function Control() {}

/**
 * Initializes WebGL elements.
 */
Control.initGL = function () {
    canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL( canvas );
    
    if (!gl) {
        alert('WebGL is not avaiable.');
        return;
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    // Projection matrix
    projection = perspective(10, canvas.width / canvas.height, 0.1, 100);
    look = lookAt(vec3(0, 0, 40), vec3(0, 0, 0), vec3(0, 1, 0));
    
    // Default rotated view
    lookRotation = mat4(0.74,  0   , -0.68, 0,
                        0.37,  0.83,  0.42, 0,
                        0.57, -0.57,  0.60, 0,
                        0   , 0    ,  0   , 1);
};

/**
 * Initializes specific scene elements.
 */
Control.initScene = function () {
    shaders = initShaders(gl, 'vertex-shader', 'fragment-shader');
    
    rubixCube = new RubixCube();
};

/**
 * Initializes specific HTML events for this application.
 */
Control.initEvents = function () {
    // Button handlers
    document.getElementById('state-button').addEventListener('click', function () {
        try {
            rubixCube.setState(document.getElementById('state-text').value);
        } catch (e) {
            alert(e);
        }
    }, false);
    
    document.getElementById('solution-button').addEventListener('click', function () {
        try {
            rubixCube.animateSequence(document.getElementById('solution-text').value);
        } catch (e) {
            alert(e);
        }
    }, false);
    
    document.getElementById('state-sample-button').addEventListener('click', function () {
        rubixCube.setState(SAMPLE_STATE);
    }, false);
    
    document.getElementById('solution-sample-button').addEventListener('click', function () {
        rubixCube.animateSequence(SAMPLE_SOLUTION);
    }, false);
    
    // For rotating the cube with mouse.
    canvas.onmousedown = function (e) { 
        mouseDown = true; 
        mouseX = e.x;
        mouseY = e.y;
    };
    
    canvas.onmouseup = function (e) { 
        mouseDown = false;
    };
    
    canvas.onmousemove = function (e) {
        if (mouseDown) {
            var dx = e.x - mouseX;
            var dy = e.y - mouseY;
            
            var newRotation = mat4();
            
            newRotation = mult(newRotation, rotate(dx / 3, [0, 1, 0]));
            newRotation = mult(newRotation, rotate(dy / 3, [1, 0, 0]));
            
            lookRotation = mult(newRotation, lookRotation);
            
            mouseX = e.x;
            mouseY = e.y;
        }
    };
};

Control.render = function () {
    // Clear buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update cube
    rubixCube.update();

    // Draw objects
    for (var i = 0; i < drawables.length; i++) {
        drawables[i].draw();
    }

    // Queue up this same callback for the next frame
    requestAnimFrame(Control.render);
};

// Make available globally.
window.Control = Control;

})();