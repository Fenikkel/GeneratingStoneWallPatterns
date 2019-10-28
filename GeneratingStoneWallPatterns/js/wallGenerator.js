function firstLine(init, final, averageWidth, averageHeight){

    var wallWidth = final - init;

    var counter = 0;
    var width = 0;
    var height = 0;

    while (wallWidth > counter){

        width = Math.floor(averageWidth  * (Math.random() + m_Offset));
        height = Math.floor(averageHeight * (Math.random() + m_Offset));

        counter += width;

        if(counter > wallWidth){ //si se pasa,  lo recortamos
            var surplus = counter - wallWidth
            width -=  surplus;
            counter -= surplus;
        }
        //DOWN LEFT
        var downLeftPosition = new Position(init, 0);

        var downLeftNode = new WallNode(downLeftPosition, null, null, null, null); //u, d, r, l

        //UP LEFT
        var upLeftPosition = new Position(init, height);

        var upLeftNode = new WallNode(upLeftPosition, null, downLeftNode, null, null);

        downLeftNode.upper = upLeftNode;

        //DOWN RIGHT
        var downRightPosition = new Position(width, 0);

        var downRightNode = new WallNode(downRightPosition, null, null, null, downLeftNode);

        downLeftNode.right = downRightNode;

        //UP RIGHT
        var upRightPosition = new Position(width, height);

        var upRightNode = new WallNode(upRightPosition, null, downRightNode, null, upLeftNode);

        downRightNode.upper = upRightNode;

        upLeftNode.right = upRightNode;



    }
}