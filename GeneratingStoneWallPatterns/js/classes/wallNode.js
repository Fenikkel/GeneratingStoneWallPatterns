class WallNode {
  constructor(nodePosition, nodeUpper, nodeLower, nodeRight, nodeLeft) {
    this.position = nodePosition; //obj with x and y
    this.upper = nodeUpper; //node reference
    this.lower = nodeLower;
    this.right = nodeRight;
    this.left = nodeLeft;
  }
}
