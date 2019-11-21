
function makeWallJointPattern(){

    // firstRow(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // //nextRow(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetris(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetris(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetris(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetris(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    firstRowEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    console.log(m_GlobalEdgeList);


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

        if(noise >= 1){
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
                previousRightUpNode.lower = leftDownNode; //secure step
                leftDownNode.upper = previousRightUpNode; //secure step

                m_GlobalNodeList.push(leftUpNode);

            }
            else if(previousRightUpNode.position.y > leftUpNode.position.y){ //Smaller brick case

                leftDownNode.upper = leftUpNode; // previousDonwRightNode
                leftUpNode.lower = leftDownNode;

                previousRightUpNode.lower = leftUpNode;
                leftUpNode.upper = previousRightUpNode;

                m_GlobalNodeList.push(leftUpNode);

            }
            else{ //same node (rare case)
                leftUpNode = previousRightUpNode;
            }

            //update arrays

            //leftDownNode and leftUpNode are already in the global node list
            m_NodeFloorList.push(leftUpNode); //The array accept repeted right?
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
        leftUpNode.right = rightUpNode;
        leftDownNode.right = rightDownNode;

    }
    paintFloor(); // pinta el techo m_NodeFloorList

}

function nextRow(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal;

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

    var peak = 0;
    var peakNode;
    var nextPeakNode;


    var nextNodeFloorList = []; //list for save the next floor (while constructing we are still using the old floor)
    

    var TEMPORAL =0;  
    
    //Initialize the first piece of foof for stand our first brick of the row
    currentNode = m_NodeFloorList[index]; 
    nextNode = m_NodeFloorList[index + 1];

    while(traveled < wallWidth){//traveled < wallWidth){ //TEMPORAL < 6){

        if(noise >= 1){
            noise = 0.99; //Evade invisible bricks and noise excess
        }

        //random * (max - min) + min;
        brickWidth = Math.floor(Math.random() * ((averageBrickWidth + (averageBrickWidth * noise)) - (averageBrickWidth - (averageBrickWidth * noise))) + averageBrickWidth - (averageBrickWidth * noise));
        brickHeight = Math.floor(Math.random() * ((averageBrickHeight + (averageBrickHeight * noise)) - (averageBrickHeight - (averageBrickHeight * noise))) + averageBrickHeight - (averageBrickHeight * noise));
    

        //UPDATE TRAVELED

        if(firstBrick){ //fisrt brick always be the half of the previous first brick
            traveled = (nextNode.position.x + wallInit) / 2;
        }
        else{
            traveled += brickWidth;
        }

        //CHECK RIGHT BOUNDARY

        if(traveled > wallWidth){ // if traveled is greater than the wall width, we adjust it
        
            var surplus = traveled - wallWidth;
            brickWidth -= surplus;
            traveled -= surplus;
            //traveled seria igual que wallWidth con lo que esta seria la ultima iteracion del bucle
        }

        peak = nextNode.position.y;//reset peak
        peakNode = currentNode; 
        nextPeakNode = nextNode;
        while(traveled > nextNode.position.x){ //find the last piece of roof

            console.log("Iterations");
            if(nextNode.position.y > peak){ //and save the most peak altitude

                peak = nextNode.position.y;

                peakNode = currentNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextNode;

                crash = true;
                console.log("PEAKED");

            }

            //update current and next node
            index += 2;

            currentNode = m_NodeFloorList[index];
            nextNode = m_NodeFloorList[index + 1];

            console.log("currentNode.position.x = " + currentNode.position.x);
            console.log("nextNode.position.x = " +nextNode.position.x);

            console.log("traveled = " + traveled);




            //Se supone que aqui no debe llegar nunca pero por si acaso
            if ( index >= m_NodeFloorList.lenght){ //if traveled is greater than last floor means that we pass the right boundary
                index = m_NodeFloorList.lenght-1;
                console.log("BREAK!");
                currentNode = m_NodeFloorList[index];
                nextNode = m_NodeFloorList[index + 1];

                break;
            }

        }



        //SET LEFT SIDE JOINTS

        if(firstBrick){ //First brick

            //leftdown (0)
            leftDownNode = currentNode;
            
            
            //leftup (1)
            position = new Position(wallInit, brickHeight + leftDownNode.position.y); // wallInit o leftdownnode.position.x
            leftUpNode = new WallNode(position, null, leftDownNode, null, null);
            m_GlobalNodeList.push(leftUpNode);
            nextNodeFloorList.push(leftUpNode);
            
            //update links
            leftDownNode.upper = leftUpNode;

        }
        else{
            //leftdown (0)

            if(crash){ //estara encima del siguiente ladrillo

                position = new Position(rightDownNode.position.x, peakNode.position.y);
                leftDownNode = new WallNode(position, null, null, null, null);

                if(rightUpNode.position.y == peakNode.position.y){ //Si toca con el vertice del anterior ladrillo..

                    leftDownNode = rightUpNode;
                    //AQUI CERRAMOS UN ESPACIO. SE HA FORMADO UN LADRILLO O TOCARA PROCESARLO? (puede que no tenga forma rectangular)

                }
                else if(rightUpNode.position.y > peakNode.position.y ){ //si toca la pared del vertice anterior

                    leftDownNode.lower = rightDownNode;
                    rightDownNode.upper = leftDownNode;
                    leftDownNode.upper = rightUpNode;
                    rightUpNode.lower = leftDownNode;

                    m_GlobalNodeList.push(leftDownNode);

                    //AQUI CERRAMOS UN ESPACIO. SE HA FORMADO UN LADRILLO O TOCARA PROCESARLO? (puede que no tenga forma rectangular)

                }
                else{ //si no toca creamos un nuevo vertice (rightUpNode.position.y < peakNode.position.y )

                    m_GlobalNodeList.push(leftDownNode);
                }


            }
            else{ //estara encima del mismo ladrillo que el anterior
                leftDownNode = rightDownNode; //our last rightDownNode
            }

                        
            //leftup (1)

            if(crash){
                position = new Position(rightDownNode.position.x, peakNode.position.y + brickHeight);

            }
            else{ //si no ha chocado
                position = new Position(leftDownNode.position.x, brickHeight + leftDownNode.position.y);
                
            }
            leftUpNode = new WallNode(position, null, null, null, null);
            
            

            if(leftUpNode.position.y < rightUpNode.position.y){ //caso menor (sirve para el caso extraño de crash tambien)

                rightUpNode.upper = null;
                rightUpNode.lower = leftUpNode;
                leftUpNode.upper = rightUpNode;
                leftUpNode.lower = leftDownNode;
                leftDownNode.upper = leftUpNode;

            }
            else if(leftUpNode.position.y > rightUpNode.position.y && rightUpNode.position.y > leftDownNode.position.y){ //  caso rightUpNode entre leftup y leftdown

                leftDownNode.upper = rightUpNode;
                rightUpNode.lower = leftDownNode; //Puede que no lo sea
                rightUpNode.upper = leftUpNode;
                leftUpNode.lower = rightUpNode;
                //leftUpNode.upper = null;

            }
            else if(leftUpNode.position.y > rightUpNode.position.y && rightUpNode.position.y < leftDownNode.position.y){ //caso no se tocan los ladrillos

                leftDownNode.upper = rightUpNode;
                leftUpNode.lower = rightUpNode;
                //rightUpNode.upper = null;

            }


            if( (leftUpNode.position.y) == rightUpNode.position.y){ //si tienen la misma altura es que son el mismo nodo y no hace falta añadirlo al global list. se borra todo lo hecho anteriormente si ha llegado a colarse
                        
                leftUpNode = rightUpNode;

            }
            else{
                m_GlobalNodeList.push(leftUpNode);
            }

            nextNodeFloorList.push(leftUpNode);

        }  

        //SET RIGHT SIDE JOINTS

        //MIRAR QUE NO CHOQUE CON LADRADRILLOS ALTOS!

        //rightup (2)

        position = new Position(traveled, leftUpNode.position.y)

        rightUpNode = new WallNode(position, null, null, null, leftUpNode);
            
        //en realidad cada vez que queremos hacer push deberiamos mirar si ya hay alguno con la misma posicion que el que queremos meter...
        m_GlobalNodeList.push(rightUpNode);
        nextNodeFloorList.push(rightUpNode);

        //if da la casualidad que choca justo con uno mas alto que donde nos estamos apoyando, se comparte nodo o hay que poner unos nodos al upper and down...

        //rightdown (3)

        position = new Position(traveled, leftDownNode.position.y);

        rightDownNode = new WallNode(position, rightUpNode, null, null, leftDownNode);

         if(crash){
            if(rightDownNode.position.x > nextPeakNode.position.x){ // se pasa
                //do nothing
                m_GlobalNodeList.push(rightDownNode);
            }
            else if(rightDownNode.position.x < nextPeakNode.position.x){ // no se pasa
                
                rightUpNode.lower = rightDownNode;
                rightDownNode.right =  nextPeakNode;
                nextPeakNode.left = rightDownNode;
                peakNode.right = rightDownNode;
                rightDownNode.left = peakNode;
                // peakNode.left = leftDownNode; // se supone que ya esta puesto
                // leftDownNode.right = peakNode; 

                m_GlobalNodeList.push(rightDownNode);

            }
            else{ // es igual
                rightDownNode = nextPeakNode;
                rightDownNode.upper = rightUpNode;
                rightUpNode.lower = rightDownNode;
            }
        }
        else{

            if(rightDownNode.position.x > nextNode.position.x){ // se pasa
                //do nothing
                m_GlobalNodeList.push(rightDownNode);

            }
            else if(rightDownNode.position.x < nextNode.position.x){ //no se pasa

                rightUpNode.lower = rightDownNode;
                rightDownNode.right =  nextNode;
                nextNode.left = rightDownNode;
                currentNode.right = rightDownNode;
                rightDownNode.left = currentNode;
                // peakNode.left = leftDownNode; // se supone que ya esta puesto
                // leftDownNode.right = peakNode; 

                m_GlobalNodeList.push(rightDownNode);

            }
            else{
                rightDownNode = nextNode;
                rightDownNode.upper = rightUpNode;
                rightUpNode.lower = rightDownNode;
            }

        }

        
        if(firstBrick){
            firstBrick = false;
        }
        if(crash){
            crash = false;
        }

        TEMPORAL++;
    }

    //Actualizar m_NodeFloorList
    m_NodeFloorList = nextNodeFloorList;
    paintFloor(); // pinta el techo

    //peak = 0;

    //Rellenar huecos con teselación

    
}

function tetris(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    
    var wallWidth = wallFinal;

    var brick;
    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = wallInit;
    var firstBrick = true;

    var index = 0; //node floor list index
    var crash = false;

    var firstNode = m_NodeFloorList[index];
    var nextFirstNode =m_NodeFloorList[index + 1];

    var peak = 0;
    var peakNode = m_NodeFloorList[index];
    var nextPeakNode = m_NodeFloorList[index + 1];

    var finalNode = m_NodeFloorList[index];
    var nextFinalNode =m_NodeFloorList[index + 1];

    var lastXPosition = wallInit;


    var nextNodeFloorList = []; //list for save the next floor (while constructing we are still using the old floor) 
    
    var TEMPORAL=0;


    while(traveled < wallWidth){//traveled < wallWidth){ //TEMPORAL < 6){

        if(noise >= 1){
            noise = 0.99; //Evade invisible bricks and noise excess
        }

        //random * (max - min) + min;
        brickWidth = Math.floor(Math.random() * ((averageBrickWidth + (averageBrickWidth * noise)) - (averageBrickWidth - (averageBrickWidth * noise))) + averageBrickWidth - (averageBrickWidth * noise));
        brickHeight = Math.floor(Math.random() * ((averageBrickHeight + (averageBrickHeight * noise)) - (averageBrickHeight - (averageBrickHeight * noise))) + averageBrickHeight - (averageBrickHeight * noise));
    

        //UPDATE TRAVELED

        traveled += brickWidth;

        //CHECK RIGHT BOUNDARY

        if(traveled > wallWidth){ // if traveled is greater than the wall width, we adjust it
        
            var surplus = traveled - wallWidth;
            brickWidth -= surplus;
            traveled -= surplus;
            //traveled seria igual que wallWidth con lo que esta seria la ultima iteracion del bucle
        }

        firstNode = m_NodeFloorList[index]; //puede que de error si estamos tocando solo la puntita del floor. 
        nextFirstNode = m_NodeFloorList[index + 1];

        finalNode = m_NodeFloorList[index];
        nextfinalNode = m_NodeFloorList[index + 1];

        peak = firstNode.position.y;//reset peak
        peakNode = m_NodeFloorList[index]; 
        nextPeakNode = m_NodeFloorList[index + 1];

        //FirstNode apuntara al primer techo, peakNode apuntara al techo mas alto y finalNode apuntara al ultimo techo abarcado
        //console.log(m_NodeFloorList);
        while(traveled > nextFinalNode.position.x && index < m_NodeFloorList.length - 1){ //find the last piece of roof
    
            console.log(traveled);
            console.log(nextFinalNode.position.x);

            console.log("Iterations");

            //update current and next node
            index += 2;
    
            finalNode = m_NodeFloorList[index];
            nextFinalNode = m_NodeFloorList[index + 1];

            if(nextFinalNode.position.y > peak){ //and save the most peak altitude
    
                peak = nextFinalNode.position.y;
    
                peakNode = finalNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextFinalNode;
    
                crash = true;
                console.log("PEAKED");
    
            }
    

    
            // console.log("currentNode.position.x = " + currentNode.position.x);
            // console.log("nextNode.position.x = " +nextNode.position.x);
    
            // console.log("traveled = " + traveled);
    
    
    
    
            //Se supone que aqui no debe llegar nunca pero por si acaso
            if ( index >= m_NodeFloorList.lenght){ //if traveled is greater than last floor means that we pass the right boundary
                index = m_NodeFloorList.lenght-1;
                console.log("BREAK!");
                finalNode = m_NodeFloorList[index];
                nextFinalNode = m_NodeFloorList[index + 1];
    
                break;
            }
    
        }

        //Crear piedra
    

        position = new Position(lastXPosition, peakNode.position.y);
        leftDownNode = new WallNode(position, null, null, null, null);

        position = new Position(lastXPosition, peakNode.position.y + brickHeight)
        leftUpNode = new WallNode(position, null, leftDownNode, null, null);

        position = new Position(traveled, peakNode.position.y + brickHeight)
        rightUpNode = new WallNode(position, null, null, null, leftUpNode);

        position = new Position(traveled, peakNode.position.y)
        rightDownNode = new WallNode(position, rightUpNode, null, null, leftDownNode);

        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode, null);


        leftDownNode.right = rightDownNode;
        leftDownNode.upper = leftUpNode;
        leftUpNode.right = rightUpNode;
        rightUpNode.lower = rightDownNode;

        nextNodeFloorList.push(leftUpNode);
        nextNodeFloorList.push(rightUpNode);

        m_GlobalBrickList.push(brick);

        TEMPORAL++;
        lastXPosition = traveled;

        console.log("temporalñ");
        
    }

    m_NodeFloorList = nextNodeFloorList;
    paintFloor();

    
}

function firstRowEdges(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal;// - wallInit;

    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var edge;
    var alternativeedge;

    var firstBrick = true;;


    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = wallInit;

    while(traveled < wallWidth){

        if(noise >= 1){
            noise = 0.99; //Evade invisible bricks and noise excess
        }

        //random * (max - min) + min;
        brickWidth = Math.floor(Math.random() * ((averageBrickWidth + (averageBrickWidth * noise)) - (averageBrickWidth - (averageBrickWidth * noise))) + averageBrickWidth - (averageBrickWidth * noise));
        brickHeight = Math.floor(Math.random() * ((averageBrickHeight + (averageBrickHeight * noise)) - (averageBrickHeight - (averageBrickHeight * noise))) + averageBrickHeight - (averageBrickHeight * noise));

        //SET LEFT SIDE JOINTS

        if(firstBrick){ //If its the first brick...

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

            //create left edge
            edge = new Edge(leftDownNode, leftUpNode, null, 0);
            m_GlobalEdgeList.push(edge);
            
        }
        else{

            //leftdown (0)
            leftDownNode = m_GlobalNodeList[m_GlobalNodeList.length - 1]; //rightDownNode
            
            //leftup (1)
            position = new Position(leftDownNode.position.x, leftDownNode.position.y + brickHeight);
            leftUpNode = new WallNode(position, null, null, null, null);

            
            

            //update links
            var previousRightUpNode = m_GlobalNodeList[m_GlobalNodeList.length - 2]; //rightUpNode

            var previousBrickEdge = searchEdgeFromStartNode(rightDownNode);
            console.log(previousBrickEdge);

            
            if(previousRightUpNode.position.y == leftUpNode.position.y){ //same node (rare case)

                leftUpNode = previousRightUpNode;

                //the edge and the nodes are already in the global list

            }
            else if(isNodeWithinTheEdge(leftUpNode, previousBrickEdge)){ //previous brick bigger than current brick case

                updateVerticalNeighbors(leftDownNode,leftUpNode);
                updateVerticalNeighbors(leftUpNode, previousRightUpNode);

                insertNodeInTheEdge(leftUpNode, previousBrickEdge);

                m_GlobalNodeList.push(leftUpNode);

            }
            else{ //previous brick smaller than current brick case

                updateVerticalNeighbors(leftDownNode,previousRightUpNode);
                updateVerticalNeighbors(previousRightUpNode,leftUpNode);

                edge = new Edge(previousRightUpNode, leftUpNode, null, 0);
                m_GlobalEdgeList.push(edge);

                m_GlobalNodeList.push(leftUpNode);

            }

            //update arrays

            //leftDownNode and leftUpNode are already in the global node list
            m_NodeFloorList.push(leftUpNode); //The array accept repeted
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
        leftUpNode.right = rightUpNode;
        leftDownNode.right = rightDownNode;

        edge = new Edge(rightDownNode,rightUpNode, null, 0);
        m_GlobalEdgeList.push(edge);

        if(firstBrick){

            firstBrick = false;

        }

    }
    paintFloor(); // pinta el techo m_NodeFloorList

}

function updateVerticalNeighbors(lowerNode, upperNode){

    lowerNode.upper = upperNode;
    upperNode.lower = lowerNode;

}

function updateHorizontalNeighbors(leftNode, rightNode){

    leftNode.right = rightNode;
    rightNode.left = leftNode;

}

function insertNodeInTheEdge(node, edge){

    var firstEdge = new Edge(edge.startNode, node, null, 0);
    var secondEdge = new Edge(node, edge.endNode, null, 0);

    for (var i = m_GlobalEdgeList.length - 1 ; i >= 0 ; i--) {
        if (m_GlobalEdgeList[i] == edge) {
            m_GlobalEdgeList.splice(i, 1);
            break;       //<-- comment  if all the same elements has to be removed
        }
    }

    //m_GlobalEdgeList = m_GlobalEdgeList.filter(e => e !== edge); //quita edge pero de una forma menos eficiente?


    m_GlobalEdgeList.push(firstEdge, secondEdge);
}

function searchEdgeFromStartNode(startNode){

    var lowerNode; 
    var edge;
    
    for (let index = 0; index < m_GlobalEdgeList.length; index++) {
        lowerNode = m_GlobalEdgeList[index].startNode;

        if(startNode == lowerNode){
            edge = m_GlobalEdgeList[index];
            break;
        }
        
    }

    return edge;
}