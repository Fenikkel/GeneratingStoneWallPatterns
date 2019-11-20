class Brick {
    constructor(leftDownNode, leftUpNode, rightUpNode, rightDownNode) {

      this.leftDownNode = leftDownNode; //node reference
      this.leftUpNode = leftUpNode;
      this.rightUpNode = rightUpNode;
      this.rightDownNode = rightDownNode;

      this.center = new Position(0,0); //el centro a partir de todos los nodos
    }
  }