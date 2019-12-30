class Edge {
    constructor(startNode, endNode, position, numberOfPoints, rightSide, leftSide) {
      this.startNode = startNode; //initial node?
      this.endNode = endNode; //final node?
      this.position = position; //initial pos- final pos??
      this.numberOfPoints = numberOfPoints; // 0 means a brick wall
      this.rightSide = rightSide; // true or false //clockwise, from start to end in clockwise order, the right side is occupied or not
      this.leftSide = leftSide;

    }
  }