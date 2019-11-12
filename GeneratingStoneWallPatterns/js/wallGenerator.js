
function makeWallJointPattern(){

    firstRow(0, m_CanvasWidth, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    nextRow(0, m_CanvasWidth, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

}

function firstRow(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal;// - wallInit;

    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;


    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = wallInit;

    while(traveled < wallWidth){

        if(noise > 1){
            noise = 0.99; //Evade invisible bricks and noise excess
        }

        //random * (max - min) + min;
        brickWidth = Math.floor(Math.random() * ((averageBrickWidth + (averageBrickWidth * noise)) - (averageBrickWidth - (averageBrickWidth * noise))) + averageBrickWidth - (averageBrickWidth * noise));
        brickHeight = Math.floor(Math.random() * ((averageBrickHeight + (averageBrickHeight * noise)) - (averageBrickHeight - (averageBrickHeight * noise))) + averageBrickHeight - (averageBrickHeight * noise));

        //SET LEFT SIDE JOINTS

        if(m_GlobalNodeList.length == 0){ //If its the first brick...

            //leftdown (0)
            position = new Position(wallInit, 0);
            leftDownNode = new WallNode(position, null, null, null, null);
            m_GlobalNodeList.push(leftDownNode);

            //leftup (1)
            position = new Position(wallInit, brickHeight);
            leftUpNode = new WallNode(position, null, leftDownNode, null, null);
            m_GlobalNodeList.push(leftUpNode);
            m_NodeFloorList.push(leftUpNode);

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
        m_NodeFloorList.push(rightUpNode);

        //rightdown (3)
        position = new Position(traveled, 0);
        rightDownNode = new WallNode(position, rightUpNode, null, null, leftDownNode);
        m_GlobalNodeList.push(rightDownNode);

        //update links
        rightUpNode.lower = rightDownNode;

    }

}

function nextRow(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal;// - wallInit;

    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var currentNode;
    var nextNode;


    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = 0;

    var firstBrick = true;
    var index = 0;
    var crash = false;
    

    var TEMPORAL =0;    

    while(TEMPORAL<2){//traveled < wallWidth){

        currentNode = m_NodeFloorList[index];
        nextNode = m_NodeFloorList[index + 1];

        if(noise > 1){
            noise = 0.99; //Evade invisible bricks and noise excess
        }

        //random * (max - min) + min;
        brickWidth = Math.floor(Math.random() * ((averageBrickWidth + (averageBrickWidth * noise)) - (averageBrickWidth - (averageBrickWidth * noise))) + averageBrickWidth - (averageBrickWidth * noise));
        brickHeight = Math.floor(Math.random() * ((averageBrickHeight + (averageBrickHeight * noise)) - (averageBrickHeight - (averageBrickHeight * noise))) + averageBrickHeight - (averageBrickHeight * noise));
    

        //UPDATE TRAVELED

        if(firstBrick){ //first brick
            traveled = nextNode.position.x / 2; // just until half of the first down rown brick 
        }
        else{
            traveled += brickWidth;
        }


        //CHECK RIGHT BOUNDARY

        if(traveled > wallWidth){ // si el ladrillo sobrepasa el tamaño del muro, lo ajustamos
        
            var surplus = traveled - wallWidth;
            brickWidth -= surplus;
            traveled -= surplus;
            //traveled seria igual que wallWidth con lo que esta seria la ultima iteracion del bucle
        }
        if(traveled > nextNode.position.x && nextNode.upper != null){ //si no es null significa que el siguiente techo esta mas arriba con lo que xocara

            crash = true;

        }



        //SET LEFT SIDE JOINTS

        if(firstBrick){ //First brick

            //leftdown (0)
            leftDownNode = currentNode;
            //m_GlobalNodeList.push(leftDownNode); No hace falta porque ya esta...
            
            //leftup (1)
            position = new Position(wallInit, brickHeight + leftDownNode.position.y);
            leftUpNode = new WallNode(position, null, leftDownNode, null, null);
            m_GlobalNodeList.push(leftUpNode);
            m_NodeFloorList.push(leftUpNode);
            
            //update links
            leftDownNode.upper = leftUpNode;

        }
        else{
            //leftdown (0)

            if(crash){
                position = new Position(rightDownNode.position.x, nextNode.upper.position.y);
                leftDownNode = new WallNode(position, null, null, null, null);
                m_GlobalNodeList.push(leftDownNode);
            }
            else{
                leftDownNode = rightDownNode; //our last rightDownNode
            }

                        
            //leftup (1)

            if(crash){
                position = new Position(rightDownNode.position.x, nextNode.upper.position.y + brickHeight);
            }
            else{
                position = new Position(leftDownNode.position.x, brickHeight + leftDownNode.position.y);
                m_NodeFloorList.push(leftUpNode);
            }
            
            leftUpNode = new WallNode(position, null, null, null, null);
            m_GlobalNodeList.push(leftUpNode);


                        
            //update links (MIRAR DE TENER EN CUENTA EL CRASH)

            if( (brickHeight + leftDownNode.position.y) > rightUpNode.position.y){ //si esta mas alto

                leftUpNode.lower = rightUpNode;
                rightUpNode.lower = leftDownNode; //rememeber we still have the last rightUpNode
                rightUpNode.upper = leftUpNode;
                leftDownNode.upper = rightUpNode;
            }
            else{ // si es mas bajo


                leftUpNode.lower = rightDownNode; // or leftdownnode
                leftUpNode.upper = rightUpNode; 

                rightUpNode.lower = leftUpNode; //rememeber we still have the last rightUpNode
                rightUpNode.upper = null;

                leftDownNode.upper = leftUpNode;

            }


        }


        

        //SET RIGHT SIDE JOINTS

        //MIRAR QUE NO CHOQUE CON LADRADRILLOS ALTOS!

        //rightup (2)

        if(crash){
            position = new Position(traveled, brickHeight + nextNode.upper.position.y);
        }
        else{
            position = new Position(traveled, brickHeight + leftDownNode.position.y);
        }

        rightUpNode = new WallNode(position, null, null, null, leftUpNode);
            
        m_GlobalNodeList.push(rightUpNode);
        m_NodeFloorList.push(rightUpNode);

        //rightdown (3)

        if(crash){
            position = new Position(traveled, nextNode.upper.position.y);      
        }
        else{
            position = new Position(traveled, leftDownNode.position.y);
        }

        rightDownNode = new WallNode(position, rightUpNode, null, null, leftDownNode);

        m_GlobalNodeList.push(rightDownNode);

        //update links
        leftUpNode.right = rightUpNode;
        rightUpNode.lower = rightDownNode;
        leftDownNode.right = rightDownNode;
        
        if(firstBrick){
            firstBrick = false;
        }
        else{
            index ++;
            index ++; //+2 porque hemos de passar al otro techo? ?
        }

        crash = false;
        TEMPORAL++;
    }


    //Empezar desde la mitad de el primer ladrillo... (?)

    //Rellenar huecos con teselación

    //Actualizar m_NodeFloorList
}