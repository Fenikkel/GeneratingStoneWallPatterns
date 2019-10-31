
function firstRow(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal - wallInit;

    var nodeFloor = []; //lista de nodos que forman el techo


    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;


    var brickWidth = 0;
    var brickHeight = 0;

    var nodeIndex = 0;
    var traveled = 0;

    while(traveled < wallWidth){

        brickWidth = Math.floor(averageBrickWidth  * (Math.random() + noise));
        brickHeight = Math.floor(averageBrickHeight  * (Math.random() + noise));

        //SET LEFT SIDE JOINTS

        if(nodeFloor.length == 0){ //Si es el primer ladrillo

            //leftdown (0)
            position = new Position(0, 0);
            leftDownNode = new WallNode(position, null, null, null, null);
            m_GlobalNodeList.push(leftDownNode);

            //leftup (1)
            position = new Position(0, brickHeight);
            leftUpNode = new WallNode(position, null, leftDownNode, null, null);
            m_GlobalNodeList.push(leftUpNode);
            nodeFloor.push(leftUpNode);

            //update links
            leftDownNode.upper = leftUpNode;

            
        }
        else{

            //leftdown (0)
            leftDownNode = m_GlobalNodeList[m_GlobalNodeList.length - 1];
            
            //leftup (1)
            position = new Position(leftDownNode.position.x, leftDownNode.position.y + brickHeight);
            leftUpNode = new WallNode(position, null, null, null, null);

            //update links
            var previousRightUpNode = m_GlobalNodeList[m_GlobalNodeList.length - 2];

            if(previousRightUpNode.position.y < leftUpNode.position.y){ //Bigger brick case

                leftUpNode.lower = previousRightUpNode;
                previousRightUpNode.upper = leftUpNode;

            }
            else{ //Smaller brick case

                leftDownNode.upper = leftUpNode; // previousDonwRightNode
                leftUpNode.lower = leftDownNode;

                previousRightUpNode.lower = leftUpNode;
                leftUpNode.upper = previousRightUpNode;

            }

            //update arrays
            m_GlobalNodeList.push(leftDownNode);
            m_GlobalNodeList.push(leftUpNode);

        }


        //CHECK RIGHT BOUNDARY
        traveled += brickWidth;

        if(traveled > wallWidth){ // si el ladrillo sobrepasa el tamaño del muro, lo ajustamos

            var surplus = traveled - wallWidth;
            brickWidth -= surplus;
            traveled -= surplus;
            //traveled seria igual que wallWidth con lo que esta seria la ultima iteracion del bucle
        }

        //SET RIGHT SIDE JOINTS

        //rightup (2)
        position = new Position(traveled, brickHeight);
        rightUpNode = new WallNode(position, null, null, null, leftUpNode);
        m_GlobalNodeList.push(rightUpNode);
        nodeFloor.push(rightUpNode);

        //rightdown (3)
        position = new Position(traveled, 0);
        rightDownNode = new WallNode(position, rightUpNode, null, null, leftDownNode);
        m_GlobalNodeList.push(rightDownNode);

        //update links
        rightUpNode.lower = rightDownNode;

    }

    return nodeFloor;

}



/*
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
*/