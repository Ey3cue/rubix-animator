Rubix Animator
==============
Welcome to the Rubik's Cube animator!

See it in action [here](http://cdcor.github.io/rubix-animator/).

The __Load Sample__ button will load a sample state and the __Play Sample Solution__ will animate the sequence that solves it.

Loading States
--------------
If you want to load a custom state, drop a plain text file or paste the text containing a sample state into the __Initial State__ text box formatted like this (white space doesn't matter).
```
   GGW
   RRG
   RRG
OWWGGOYYR
OGOYYYRBR
YYYRBGRWW
   BOY
   BOB
   BOB
   OGO
   WWB
   WWB
```

Playing Sequences
-----------------
If you want to play a custom sequence, drop a plain text file or paste the text containing an animation sequence into the __Solution__ text box formatted like this.
```
O1W1R1Y3
```
Every move consists of 2 characters. The first is the color of the center cubie of the face to rotate. The second is the number of clockwise rotations to make. 3 clockwise rotations animates as 1 counterclockwise rotation.
