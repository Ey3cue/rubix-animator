/* ----------
   cube.js 
   
   Defines one of 26/27 cubes that make up Rubik's cube.
   ---------- */
   
(function () {

// For lighting
var lightPositionFirst = vec4(5.0, 0.0, 40.0, 0.0);
var lightPositionSecond = vec4(-5.0, 0.0, 40.0, 0.0);
var lightAmbient = vec4(0.0, 0.2, 0.1, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 0.5, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.2, 0.1, 1.0);
var materialSpecular = vec4(1.3, .9, 1.0, 1.0);

/**
 * Creates a new cube.
 * 
 * @param {Array} colors an optional array of six colors denoting the colors for each face of the
 *     cube. By the default view this is [front, right, bottom, top, back, left]
 */
function Cube(colors) {
    this.program = shaders;
    
    this.points = [];
    this.colors = [];
    this.normals = [];
    this.transform = mat4();
    
    this.init(colors);
}

/**
 * Initializes this cube.
 */
Cube.prototype.init = function (colors) {
    colors = colors || [COLORS.white, COLORS.orange, COLORS.blue, COLORS.green, COLORS.yellow, COLORS.red];
    
    this.makeCube(colors);

    this.cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);

    this.vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);
    
    this.nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
};

/**
 * Draws this cube.
 */
Cube.prototype.draw = function () {
    // Add look at
    var newlook = mult(look, lookRotation);
    var transform = mult(newlook, this.transform);
    
    gl.useProgram(this.program);
    
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'projection'), false, flatten(projection));
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'modelView'), false, flatten(transform));
    
    gl.uniform4fv(gl.getUniformLocation(this.program, 'lightPositionFirst'), flatten(lightPositionFirst));
    gl.uniform4fv(gl.getUniformLocation(this.program, 'lightPositionSecond'), flatten(lightPositionSecond));
    gl.uniform4fv(gl.getUniformLocation(this.program, 'lightAmbient'), flatten(lightAmbient));
    gl.uniform4fv(gl.getUniformLocation(this.program, 'lightDiffuse'), flatten(lightDiffuse));
    gl.uniform4fv(gl.getUniformLocation(this.program, 'lightSpecular'), flatten(lightSpecular));
    
    gl.uniform4fv(gl.getUniformLocation(this.program, 'materialAmbient'), flatten(materialAmbient));
    gl.uniform4fv(gl.getUniformLocation(this.program, 'materialSpecular'), flatten(materialSpecular));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nBufferId);
    var vNormalId = gl.getAttribLocation(this.program, 'vNormal');
    gl.vertexAttribPointer(vNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormalId);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cBufferId);
    var vColorId = gl.getAttribLocation(this.program, 'vColor');
    gl.vertexAttribPointer(vColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorId);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
    var vPosId = gl.getAttribLocation(this.program, 'vPosition');
    gl.vertexAttribPointer(vPosId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosId);
    
    gl.drawArrays(gl.TRIANGLES, 0, this.points.length);
};

// Default vertex positions for unit cube centered at the origin.
Cube.prototype.vertices = [
    [ -0.5, -0.5,  0.5, 1.0 ],
    [ -0.5,  0.5,  0.5, 1.0 ],
    [  0.5,  0.5,  0.5, 1.0 ],
    [  0.5, -0.5,  0.5, 1.0 ],
    [ -0.5, -0.5, -0.5, 1.0 ],
    [ -0.5,  0.5, -0.5, 1.0 ],
    [  0.5,  0.5, -0.5, 1.0 ],
    [  0.5, -0.5, -0.5, 1.0 ]
];

/**
 * Build one of the faces for this cube object. 
 */
Cube.prototype.makeQuad = function (a, b, c, d, color) {
    var t1 = subtract(this.vertices[b], this.vertices[a]);
    var t2 = subtract(this.vertices[c], this.vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    normal = normalize(normal);
    
    this.points.push(vec4(this.vertices[a]));
    this.points.push(vec4(this.vertices[b]));
    this.points.push(vec4(this.vertices[c]));
    this.points.push(vec4(this.vertices[a]));
    this.points.push(vec4(this.vertices[c]));
    this.points.push(vec4(this.vertices[d]));
    
    for (var i = 0; i < 6; i++) {
        this.colors.push(vec4(color));
        this.normals.push(normal);
    }
};

/**
 * Build all faces of this cube object.
 * 
 * @param {Array} colors the array of six colors for each face
 */
Cube.prototype.makeCube = function (colors)
{
    this.makeQuad(1, 0, 3, 2, colors[0]);
    this.makeQuad(2, 3, 7, 6, colors[1]);
    this.makeQuad(3, 0, 4, 7, colors[2]);
    this.makeQuad(6, 5, 1, 2, colors[3]);
    this.makeQuad(4, 5, 6, 7, colors[4]);
    this.makeQuad(5, 4, 0, 1, colors[5]);
};

/**
 * Translates this cube along the specified canonical axis. If three arguments are specified,
 * assumes the cube should be moved as specified on the x, y, and z axis, respectively.
 * 
 * @param {Number} distance the distance to move
 * @param {Number} axis the axis to move on
 */
Cube.prototype.move = function (distance, axis) {
    if (arguments.length === 3) {
        this.move(arguments[0], X_AXIS);
        this.move(arguments[1], Y_AXIS);
        this.move(arguments[2], Z_AXIS);
    } else {
        var delta = [0, 0, 0];
        
        if (axis === undefined) axis = Y_AXIS;
        delta[axis] = distance;
        
        this.transform = mult(translate(delta), this.transform);
    }
};

/**
 * Rotate this cube around the specified canonical axis.
 * 
 * @param {Number} angle the angle to rotate
 * @param {Number} axis the axis to rotate around
 */
Cube.prototype.turn = function (angle, axis) {
    var avec = [0, 0, 0];

    axis = axis === undefined ? Y_AXIS : axis;
    avec[axis] = 1;

    this.transform = mult(this.transform, rotate(angle, avec));
};

/**
 * Orbit this cube around the specified axis.
 * 
 * @param {Number} angle the angle to orbit
 * @param {Number} axis the axis to orbit around
 */
Cube.prototype.orbit = function (angle, axis) {
    var avec = [0, 0, 0];

    axis = axis === undefined ? Y_AXIS : axis;
    avec[axis] = 1;

    this.transform = mult(rotate(angle, avec), this.transform);
};

// Make available globally.
window.Cube = Cube;

})();