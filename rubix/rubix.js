 /* ----------
   rubix.js 
   
   Defines functions necessary to create and animate a Rubik's cube.
   ---------- */
   
(function () {

// Space separating each cube.
const SEPARATION_FACTOR = 1.05;

/**
 * Creates a new Rubik's cube.
 */
function RubixCube() {
    // Holds the sequence of rotations to animate for the user.
    //   (e.g. ['O2', 'Y3', 'R1'])
    this.animationsQueue = [];
    this.currentCubes = null;
    this.currentFace = null;
    this.currentRotation = 0;
    
    this.cubes = [];
    
    this.init();
}

/**
 * Initializes the cube.
 * 
 * @param {String} state the intial state of the cube
 */
RubixCube.prototype.init = function (state) {
    // TODO Figure out how to color.
    //
    // Iterates through (-1,-1,-1), (-1,-1,0), (-1,-1,1), (-1,0,-1), ..., (1,1,1)
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            for (var k = -1; k < 2; k++) {
                var colors = [
                    k ===  1 ? COLORS.white  : COLORS.black,
                    i ===  1 ? COLORS.orange : COLORS.black,
                    j === -1 ? COLORS.blue   : COLORS.black,
                    j ===  1 ? COLORS.green  : COLORS.black,
                    k === -1 ? COLORS.yellow : COLORS.black,
                    i === -1 ? COLORS.red    : COLORS.black
                ];
                
                // Create a new cube
                var cube = new Cube(colors);
                // Move to appropriate location
                cube.move(i * SEPARATION_FACTOR, j * SEPARATION_FACTOR, k * SEPARATION_FACTOR);
                // Add to array
                this.cubes.push(cube);
                drawables.push(cube);
            }
        }
    }
};

/**
 * Sets the initial state of the rubuk's cube.
 * 
 * @param {String} state the intital state represented as a string
 * 
 * Reference:
 * 
 * Input string    Cube Indices                        Input Indices   
 * 
 *    RRR                   08 05 02                            00 01 02                
 *    RRR                   07 04 01                            03 04 05                
 *    RRR                   06 03 00                            06 07 08                
 * GGGYYYBBB       08 07 06 06 03 00 00 01 02          09 10 11 12 13 14 15 16 17       
 * GGGYYYBBB       17 16 15 15 12 09 09 10 11          18 19 20 21 22 23 24 25 26       
 * GGGYYYBBB       26 25 24 24 21 18 18 19 20          27 28 29 30 31 32 33 34 35       
 *    OOO                   24 21 18                            36 37 38                
 *    OOO                   25 22 19                            39 40 41                
 *    OOO                   26 23 20                            42 43 44                
 *    WWW                   26 23 20                            45 46 47                
 *    WWW                   17 14 11                            48 49 50                
 *    WWW                   08 05 02                            51 52 53                
 */
RubixCube.prototype.setState = function (state) {
    state = state.replace(/[^WOBGYR]/gi, '');
    
    if (state.length < 54) {
        throw 'Length of state must be 54 characters.';
    }
    
    console.log('Setting state: ' + state);
    
    
    // Empty animations queue
    this.animationsQueue = [];
    
    // Reset cubes
    this.cubes = [];
    drawables = [];
    
    // I'm fairly certain there's an easier way to do this...
    
    var colors = this.colors;
    function col(index) {
        return index === undefined ? COLORS.black : colors[state[index]];
    }
    
    //                       [ front  ,right  ,bottom ,top    ,back   ,left    ]
    this.cubes.push(new Cube([ col(  ),col(  ),col(15),col(  ),col(14),col( 8) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(16),col(  ),col(  ),col( 5) ]));
    this.cubes.push(new Cube([ col(53),col(  ),col(17),col(  ),col(  ),col( 2) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(  ),col(13),col( 7) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(  ),col(  ),col( 4) ]));
    this.cubes.push(new Cube([ col(52),col(  ),col(  ),col(  ),col(  ),col( 1) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(11),col(12),col( 6) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(10),col(  ),col( 3) ]));
    this.cubes.push(new Cube([ col(51),col(  ),col(  ),col( 9),col(  ),col( 0) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(24),col(  ),col(23),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(25),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(50),col(  ),col(26),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(  ),col(22),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(49),col(  ),col(  ),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(20),col(21),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(  ),col(  ),col(19),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(48),col(  ),col(  ),col(18),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(38),col(33),col(  ),col(32),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(41),col(34),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(47),col(44),col(35),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(37),col(  ),col(  ),col(31),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(40),col(  ),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(46),col(43),col(  ),col(  ),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(36),col(  ),col(29),col(30),col(  ) ]));
    this.cubes.push(new Cube([ col(  ),col(39),col(  ),col(28),col(  ),col(  ) ]));
    this.cubes.push(new Cube([ col(45),col(42),col(  ),col(27),col(  ),col(  ) ]));
     
    var index = 0;
    
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            for (var k = -1; k < 2; k++) {
                drawables.push(this.cubes[index]);
                this.cubes[index++].move(i * SEPARATION_FACTOR, j * SEPARATION_FACTOR, k * SEPARATION_FACTOR);
            }
        }
    }
};

/**
 * Rotates the entire Rubik's cube.
 * 
 * @param {Number} angle the angle in degrees
 * @param {Number} axis the axis to rotate around
 */
RubixCube.prototype.turn = function (angle, axis) {
    for (var i = 0; i < this.cubes.length; i++) {
        this.cubes[i].orbit(angle, axis);
    }
};

/**
 * Animates the specified sequence of rotations.
 * 
 * @param {String} sequence the sequence string (e.g. "O1W1R1Y3")
 */
RubixCube.prototype.animateSequence = function (sequence) {
    sequence = sequence.toUpperCase();
    console.log('Playing sequence: ' + sequence);
    
    for (var i = 0; i < sequence.length; i += 2) {
        var move = sequence.slice(i, i + 2);
        
        if (!/[WOBGYR][1-3]/.test(move)) {
            throw 'Invalid move: ' + move;
        }
        
        this.animationsQueue.push(move);
    }
};

/**
 * Animates the specified sequence.
 * 
 * @param {String} move the move (e.g. 'W1')
 */
RubixCube.prototype.animate = function (move) {
    var face = move[0]; // W, O, B, G, Y, or R
    var rotations = parseInt(move[1]); // 1, 2, or 3
    
    this.currentFace = face;
    this.currentRotation = rotations < 3 ? rotations * 90 : -90;
    
    // Set current cubes to the 9 cubes to be rotated
    var indices = this.rotationIndices[face];
    this.currentCubes = [];
    
    for (var i = 0; i < indices.length; i++) {
        this.currentCubes.push(this.cubes[indices[i]]);
    }
    
    // Update indices on cubes
    var corners = this.cornerSequences[face];
    var edges = this.edgeSequences[face];
    
    var tempCube;
    
    for (i = 0; i < rotations; i++) {
        tempCube = this.cubes[corners[3]];
        this.cubes[corners[3]] = this.cubes[corners[2]];
        this.cubes[corners[2]] = this.cubes[corners[1]];
        this.cubes[corners[1]] = this.cubes[corners[0]];
        this.cubes[corners[0]] = tempCube;
        
        tempCube = this.cubes[edges[3]];
        this.cubes[edges[3]] = this.cubes[edges[2]];
        this.cubes[edges[2]] = this.cubes[edges[1]];
        this.cubes[edges[1]] = this.cubes[edges[0]];
        this.cubes[edges[0]] = tempCube;
    }
};

/**
 * Updates the cube, performing any queued animations. To be called every frame.
 */
RubixCube.prototype.update = function () {
    // Check if animation in progress
    if (this.currentRotation !== 0) {
        var direction = this.currentRotation < 0 ? -1 : 1;
        
        var degrees = this.rotationDirections[this.currentFace] * direction * DEGREES_PER_FRAME;
        var axis = this.rotationAxes[this.currentFace];
        
        // Orbit each cube
        for (var i = 0; i < this.currentCubes.length; i++) {
            this.currentCubes[i].orbit(degrees, axis);
        }
        
        // Decrement number of rotated degrees
        this.currentRotation += this.currentRotation < 0 ? DEGREES_PER_FRAME : -DEGREES_PER_FRAME;
        
        // Make sure a decrement doesn't bypass 0 as that is our check
        if (Math.abs(this.currentRotation) < DEGREES_PER_FRAME) {
            this.currentRotation = 0;
        }
    } else if (this.animationsQueue.length) {
        // Begin the next animation in the sequence
        this.animate(this.animationsQueue.shift());
    }
};

// Defines the colors for the input string characters.
RubixCube.prototype.colors = {
    'W': COLORS.white,
    'O': COLORS.orange,
    'B': COLORS.blue,
    'G': COLORS.green,
    'Y': COLORS.yellow,
    'R': COLORS.red
};

// The cube indices for each specified face.
RubixCube.prototype.rotationIndices = {
    'W': [ 2, 5, 8,11,14,17,20,23,26],
    'O': [18,19,20,21,22,23,24,25,26],
    'B': [ 0, 1, 2, 9,10,11,18,19,20], 
    'G': [ 6, 7, 8,15,16,17,24,25,26], 
    'Y': [ 0, 3, 6, 9,12,15,18,21,24], 
    'R': [ 0, 1, 2, 3, 4, 5, 6, 7, 8] 
};

// The axis to rotate on in order to rotate the specified face.
RubixCube.prototype.rotationAxes = {
    'W': Z_AXIS,
    'O': X_AXIS,
    'B': Y_AXIS,
    'G': Y_AXIS,
    'Y': Z_AXIS,
    'R': X_AXIS
};

// The direction to rotate the specified face.
RubixCube.prototype.rotationDirections = {
    'W': -1,
    'O': -1,
    'B':  1,
    'G': -1,
    'Y':  1,
    'R':  1
};

// The sequence of corners to reassign when a single rotation occurs.
RubixCube.prototype.cornerSequences = {
    'W': [ 2, 8,26,20],
    'O': [18,20,26,24],
    'B': [ 0, 2,20,18],
    'G': [ 6,24,26, 8],
    'Y': [ 0,18,24, 6],
    'R': [ 0, 6, 8, 2]
};

// The sequence of edges to reassign when a single rotation occurs.
RubixCube.prototype.edgeSequences = {
    'W': [ 5,17,23,11],
    'O': [19,23,25,21],
    'B': [ 1,11,19, 9],
    'G': [ 7,15,25,17],
    'Y': [ 3, 9,21,15],
    'R': [ 1, 3, 7, 5]
};

// Make available globally.
window.RubixCube = RubixCube;

})();