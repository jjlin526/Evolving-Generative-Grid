var stepSize = 20;

function setup() {
  createCanvas(500, 500);
  // Use degrees instead of radians for rotations
  angleMode(DEGREES);
}
///////////////////////////////////////////////////////////////////////
function draw() {
  background(125);

  colorGrid();
  compassGrid();
}
///////////////////////////////////////////////////////////////////////
// This function creates a colorful grid
function colorGrid() {
  // Create a 25 x 25 grid of rectangles
  for (var xCoordinate = 0; xCoordinate < 25; ++xCoordinate) {
    for (var yCoordinate = 0; yCoordinate < 25; ++yCoordinate) {
      // Make the grid color change speed depend on the mouse's x-coordinate
      // A small mouseX yields faster color changes while a large mouseX yields slower color changes
      let colorChangeRate = map(mouseX, 0, width, 0.2, 1);
      // Generate a 3-D noise value with scaled input parameters to create organic changes
      let interpolationAmount = noise(
        xCoordinate / (100 * colorChangeRate),
        yCoordinate / (100 * colorChangeRate),
        frameCount / (100 * colorChangeRate)
      );
      // Generate two colors to interpolate
      let blueColor = color(0, 0, 255);
      let redColor = color(255, 0, 0);
      // Lerp the two colours together based on the interpolation amount specified by the 3D noise value
      let blendedColor = lerpColor(blueColor, redColor, interpolationAmount);
      // Remove black outline
      noStroke();
      // Fill the rectangles with a slowly changing color
      fill(blendedColor);
      rect(xCoordinate * stepSize, yCoordinate * stepSize, stepSize, stepSize);
    }
  }
}

///////////////////////////////////////////////////////////////////////
function compassGrid() {
  // Create a 25 x 25 grid of compasses with natural rotation
  // Place compass in the center of each grid tile
  translate(stepSize / 2, stepSize / 2);
  for (
    var xCoordinate = 0;
    xCoordinate < 25 * stepSize;
    xCoordinate += stepSize
  ) {
    for (
      var yCoordinate = 0;
      yCoordinate < 25 * stepSize;
      yCoordinate += stepSize
    ) {
      push();
      // Fix the point of rotation for the compass needle
      var xRotationPoint = xCoordinate;
      var yRotationPoint = yCoordinate;
      translate(xRotationPoint, yRotationPoint);
      // Create dependency between mouse x-coordinate and compass rotation speed
      var compassRotationSpeed = map(mouseX, 0, width, 0.1, 1);
      // Generate an organic value for rotation using Perlin noise with scaled parameters
      let noiseValue = noise(
        xCoordinate / (1000 * compassRotationSpeed),
        yCoordinate / (1000 * compassRotationSpeed),
        frameCount / (1000 * compassRotationSpeed)
      );
      // Map angle to a suitable range
      let angleOfRotation = map(noiseValue, 0, 1, 0, 720);
      // Apply rotation about fixed rotation point
      rotate(angleOfRotation);
      // Define attributes of compass needle
      stroke(0);
      strokeWeight(2);
      // Map the 3D noise into a suitable range to scale arrow lengths
      var arrowLengthScaleFactor = map(noiseValue, 0, 1, 0, 2.5);
      // Draw compass needle as an arrow
      drawArrow(
        createVector(
          (xCoordinate - xRotationPoint) * arrowLengthScaleFactor,
          (yCoordinate - yRotationPoint) * arrowLengthScaleFactor
        ),
        createVector(
          (xCoordinate - xRotationPoint) * arrowLengthScaleFactor,
          (yCoordinate + stepSize - yRotationPoint) * arrowLengthScaleFactor
        ),
        // Modify the arrow color based on the 3D Perlin noise value
        color(noiseValue * 255),
        // Specify diameter of arrow
        7
      );
      pop();
    }
  }
}

// Draw an arrow for a vector at a given base location
function drawArrow(baseLocation, vector, arrowColor, arrowDiameter) {
  push();
  // Define appearance of line segment
  stroke(arrowColor);
  strokeWeight(1);
  fill(arrowColor);
  // Move to base location
  translate(baseLocation.x, baseLocation.y);
  // Draw line based on vector coordinates
  line(0, 0, vector.x, vector.y);
  // Rotate vector
  rotate(vector.heading());
  // Move to position to draw arrow head
  translate(vector.mag() - arrowDiameter, 0);
  // Draw arrow head
  triangle(0, arrowDiameter / 2, 0, -arrowDiameter / 2, arrowDiameter, 0);
  pop();
}
