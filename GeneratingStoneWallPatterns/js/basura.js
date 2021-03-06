function firstRow(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    var wallWidth = wallFinal;// - wallInit;

    var position;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var brick;
    var temporalBrickList = [];


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

        //Create brick
        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode, null);
        m_GlobalBrickList.push(brick);
        temporalBrickList.push(brick);


    }
    //paintBrickRow(temporalBrickList);


    //paintFloor(); // pinta el techo m_NodeFloorList

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

            if(nextNode.position.y > peak){ //and save the most peak altitude

                peak = nextNode.position.y;

                peakNode = currentNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextNode;

                crash = true;

            }

            //update current and next node
            index += 2;

            currentNode = m_NodeFloorList[index];
            nextNode = m_NodeFloorList[index + 1];

            // console.log("currentNode.position.x = " + currentNode.position.x);
            // console.log("nextNode.position.x = " +nextNode.position.x);

            // console.log("traveled = " + traveled);




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
    
            // console.log(traveled);
            // console.log(nextFinalNode.position.x);


            //update current and next node
            index += 2;
    
            finalNode = m_NodeFloorList[index];
            nextFinalNode = m_NodeFloorList[index + 1];

            if(nextFinalNode.position.y > peak){ //and save the most peak altitude
    
                peak = nextFinalNode.position.y;
    
                peakNode = finalNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextFinalNode;
    
                crash = true;

    
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

        //TEMPORAL++;
        lastXPosition = traveled;
        
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

    var firstBrick = true;

    var temporalBrickList = [];


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
            //console.log(previousBrickEdge);

            
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
        rightUpNode = new WallNode(position, null, null, null, null);
        m_GlobalNodeList.push(rightUpNode);
        m_NodeFloorList.push(rightUpNode);

        //rightdown (3)
        position = new Position(traveled, 0);
        rightDownNode = new WallNode(position, null, null, null, null);
        m_GlobalNodeList.push(rightDownNode);

        //update links
        updateVerticalNeighbors(rightDownNode,rightUpNode);
        updateHorizontalNeighbors(leftDownNode, rightDownNode);
        updateHorizontalNeighbors(leftUpNode, rightUpNode);

        edge = new Edge(rightDownNode, rightUpNode, null, 0);
        m_GlobalEdgeList.push(edge);

        edge = new Edge(leftDownNode, rightDownNode, null, 0);
        m_GlobalEdgeList.push(edge);

        edge = new Edge(leftUpNode, rightUpNode, null, 0);
        m_GlobalEdgeList.push(edge);

        if(firstBrick){

            firstBrick = false;

        }

        //Create brick
        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode, null);
        m_GlobalBrickList.push(brick);
        temporalBrickList.push(brick);

    }

    paintBrickRow(temporalBrickList);
    paintFloor(); // pinta el techo m_NodeFloorList

}

function tetrisEdges(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    
    var wallWidth = wallFinal;

    var brick;
    var position;
    var edge;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = wallInit;
    

    var index = 0; //node floor list index
    

    var firstNode = m_NodeFloorList[index];
    var nextFirstNode =m_NodeFloorList[index + 1];
    var firstNodeIndex = 0;

    var peak = 0;
    var peakNode = m_NodeFloorList[index];
    var nextPeakNode = m_NodeFloorList[index + 1];
    var peakNodeIndex = 0;


    var finalNode = m_NodeFloorList[index];
    var nextFinalNode =m_NodeFloorList[index + 1];
    var finalNodeIndex = 0;

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
        firstNodeIndex = index;

        finalNode = m_NodeFloorList[index];
        nextfinalNode = m_NodeFloorList[index + 1];
        finalNodeIndex = index;

        peak = firstNode.position.y;//reset peak
        peakNode = m_NodeFloorList[index]; 
        nextPeakNode = m_NodeFloorList[index + 1];
        peakNodeIndex = index;

        //FirstNode apuntara al primer techo, peakNode apuntara al techo mas alto y finalNode apuntara al ultimo techo abarcado
        //console.log(m_NodeFloorList);
        while(traveled > nextFinalNode.position.x && index < m_NodeFloorList.length - 1){ //find the last piece of roof
    
            // console.log(traveled);
            // console.log(nextFinalNode.position.x);


            //update current and next node
            index += 2;
    
            finalNode = m_NodeFloorList[index];
            nextFinalNode = m_NodeFloorList[index + 1];
            finalNodeIndex = index;

            if(nextFinalNode.position.y > peak){ //and save the most peak altitude
    
                peak = nextFinalNode.position.y;
    
                peakNode = finalNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextFinalNode;
                peakNodeIndex = index; //index in the floorlist 

                crash = true;
    
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
                finalNodeIndex = index;
    
                break;
            }
    
        }

        //Crear piedra
    

        position = new Position(lastXPosition, peakNode.position.y);
        leftDownNode = new WallNode(position, null, null, null, null);

        position = new Position(lastXPosition, peakNode.position.y + brickHeight)
        leftUpNode = new WallNode(position, null, null, null, null);

        position = new Position(traveled, peakNode.position.y + brickHeight)
        rightUpNode = new WallNode(position, null, null, null, null);

        position = new Position(traveled, peakNode.position.y)
        rightDownNode = new WallNode(position, null, null, null, null);

        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode, null);


        //Left Down Node

        if(firstNode == peakNode){ //if the left part of the brick is touching the first floor

            if(leftDownNode.position.x == firstNode.position.x){ //same node case

                leftDownNode = firstNode;
    
            }
            else if(leftDownNode.position.x == nextFirstNode.position.x){ //same node case
    
                console.warn("Mal asunt, el brick quedara flotant en res que el aguante");
                leftDownNode = nextFirstNode;
    
            }
            else{ //the node is in the middle
    
                edge = searchEdgeFromStartNode(firstNode); //get the edge from floor
                insertNodeInTheEdge(leftDownNode, edge); //divide the edge in two

                //Update m_NodeFloorList
                m_NodeFloorList.splice( (firstNodeIndex +1), 0, leftDownNode, leftDownNode);
                console.log("Ueee");
                
                //Update links
                updateHorizontalNeighbors(firstNode, leftDownNode);
                updateHorizontalNeighbors(leftDownNode, nextFirstNode);

                //Push
                m_GlobalNodeList.push(leftDownNode);
                //the new edges are already pushed

            }
        }
        else{ //the left part of the brick isn't touching the floor

            edge = new Edge(leftDownNode, peakNode, null, 0);

            //links
            updateHorizontalNeighbors(leftDownNode, peakNode);

            //push
            m_GlobalNodeList.push(leftDownNode);
            m_GlobalEdgeList.push(edge);
        }


        //Left Up Node

        edge = new Edge(leftDownNode, leftUpNode, null, 0);

        //Update links
        updateVerticalNeighbors(leftDownNode, leftUpNode);

        //Push
        m_GlobalNodeList.push(leftUpNode);
        m_GlobalEdgeList.push(edge);
        nextNodeFloorList.push(leftUpNode);

        
       
        //Right down node
        if(finalNode == peakNode){ //if the right part of the brick is touching the last floor
        
            if(rightDownNode.position.x == finalNode.position.x){ //same node case

                console.warn("Mal asunt, el brick quedara flotant en res que el aguante");
                rightDownNode = finalNode;
    
            }
            else if(rightDownNode.position.x == nextFinalNode.position.x){ //same node case
    
                rightDownNode = nextFinalNode;
    
            }
            else{ //the node is in the middle
    
                edge = searchEdgeFromStartNode(finalNode); //get the edge from floor
                insertNodeInTheEdge(rightDownNode, edge); //divide the edge in two

                //Update m_NodeFloorList
                m_NodeFloorList.splice( (finalNode +1), 0, rightDownNode, rightDownNode);
                console.log("UAAA");

                //Update links
                updateHorizontalNeighbors(finalNode, rightDownNode);
                updateHorizontalNeighbors(rightDownNode, nextFinalNode);

                //Push
                m_GlobalNodeList.push(rightDownNode);
                //the new edges are already pushed

            }
        }
        else{ //the right part of the brick isn't touching the floor

            edge = new Edge(peakNode, rightDownNode, null, 0);

            //links
            updateHorizontalNeighbors(peakNode, rightDownNode);

            //push
            m_GlobalNodeList.push(rightDownNode);
            m_GlobalEdgeList.push(edge);
        }

        //el caso flotando se cubre con los dos else? SI

        //Right Up Node

        edge = new Edge(rightDownNode, rightUpNode, null, 0);

        //Update links
        updateVerticalNeighbors(rightDownNode, rightUpNode);

        //Push
        m_GlobalNodeList.push(rightUpNode);
        m_GlobalEdgeList.push(edge);
        nextNodeFloorList.push(rightUpNode);

        //Global Update
        updateHorizontalNeighbors(leftUpNode, rightUpNode);

        //Global Push
        m_GlobalBrickList.push(brick);

        //TEMPORAL++;
        lastXPosition = traveled;

        
    }

    m_NodeFloorList = nextNodeFloorList;
    paintFloor();

    
}

function tetrisBruteForce(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    
    var wallWidth = wallFinal;

    var brick;
    var position;
    var upperEdge;
    var lowerEdge;
    var leftEdge;
    var rightEdge;
    var leftDownNode;
    var leftUpNode;
    var rightDownNode;
    var rightUpNode;

    var brickWidth = 0;
    var brickHeight = 0;

    var traveled = wallInit;
    var firstBrick = true;

    var index = 0; //node floor list index

    var firstNode = m_NodeFloorList[index];
    var nextFirstNode =m_NodeFloorList[index + 1];

    var peak = 0;
    var peakNode = m_NodeFloorList[index];
    var nextPeakNode = m_NodeFloorList[index + 1];

    var finalNode = m_NodeFloorList[index];
    var nextFinalNode =m_NodeFloorList[index + 1];

    var lastXPosition = wallInit;


    var nextNodeFloorList = []; //list for save the next floor (while constructing we are still using the old floor) 
    var temporalBrickList = [];

    while(traveled < wallWidth){

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

            //update current and next node
            index += 2;
    
            finalNode = m_NodeFloorList[index];
            nextFinalNode = m_NodeFloorList[index + 1];

            if(nextFinalNode.position.y > peak){ //and save the most peak altitude
    
                peak = nextFinalNode.position.y;
    
                peakNode = finalNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextFinalNode;
    
                crash = true;

    
            }
    
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
        leftUpNode = new WallNode(position, null, null, null, null);

        position = new Position(traveled, peakNode.position.y + brickHeight)
        rightUpNode = new WallNode(position, null, null, null, null);

        position = new Position(traveled, peakNode.position.y)
        rightDownNode = new WallNode(position, null, null, null, null);

        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode, null);

        //Update
        updateHorizontalNeighbors(leftDownNode, rightDownNode);
        updateHorizontalNeighbors(leftUpNode, rightUpNode);
        updateVerticalNeighbors(leftDownNode, leftUpNode);
        updateVerticalNeighbors(rightDownNode, rightUpNode);

        //Edges
        upperEdge = new Edge(leftUpNode, rightUpNode, null, 0);
        lowerEdge = new Edge(leftDownNode, rightDownNode, null, 0);
        leftEdge = new Edge(leftDownNode, leftUpNode, null, 0);
        rightEdge = new Edge(rightDownNode, rightUpNode, null, 0);
        

        //Push
        nextNodeFloorList.push(leftUpNode, rightUpNode);
        //m_GlobalEdgeList.push(upperEdge, lowerEdge, leftEdge, rightEdge);
        m_GlobalNodeList.push(leftDownNode, leftUpNode, rightUpNode, leftDownNode);
        m_GlobalBrickList.push(brick);
        temporalBrickList.push(brick);

        lastXPosition = traveled;
        
    }

    m_NodeFloorList = nextNodeFloorList;
    // paintFloor();
    // paintBrickRow(temporalBrickList);

    
}


function createHorizontalBrickEdgeCopy(startNode, endNode){ //create correctly the edge (or the edges) of the brick

    var start = startNode;
    var end = endNode;

    var startOut = false;
    var endOut = false;


    //START NODE
    var startWithinEdge = isWithinAEdge(startNode); // get the edge where the start node is within. Null if not.

    var startEdgeList = searchEdgeFromStartNode(startNode); // search if the start node is in the cortner instead of within

    var startEdge = null;

    var horizontal = false;

    if(startEdgeList != null){

        for (let index = 0; index < startEdgeList.length; index++) {
            const currentEdge = startEdgeList[index];
            if(isHorizontalEdge(currentEdge)){
                horizontal = true;
                startEdge = currentEdge;
                break;
            }
            
        }

    }

    // console.log("Start within the edge = " + startWithinEdge);
    // console.log("Start edge list = " + startEdgeList);
    // console.log("Start edge = " + startEdge);
    // console.log("Horizontal = " + horizontal);


    
    if(startWithinEdge != null){ //check if it's within a edge
        
        start = startWithinEdge.endNode;
        insertNodeInTheEdge(startNode, startWithinEdge);

        console.log("start INSERTED");    
    }//faltan casos como EN EL DE VERTICAL
    else if(startEdge == null){ // check if it's floating (and not in a corner)

        startOut = true;

    }


    //END NODE
    var endWithinEdge = isWithinAEdge(endNode); //aci esta updated
    var endEdgeList = searchEdgeFromEndNode(endNode);
    var endEdge = null;
    horizontal = false;

    if(endEdgeList != null){

        for (let index = 0; index < endEdgeList.length; index++) {
            const currentEdge = endEdgeList[index];
            if(isHorizontalEdge(currentEdge)){
                horizontal = true;
                endEdge = currentEdge;
                break;
            }
            
        }

    }

    if(endWithinEdge != null){ //is within a edge

        end = endWithinEdge.startNode;
        insertNodeInTheEdge(endNode, endWithinEdge);
        console.log("end INSERTED");

    } //faltan casos como EN EL DE VERTICAL
    else if(endEdge == null){ // it's floating

        endOut = true;

    }

    //UNIFY FLOATING NODES

    if(startOut && endOut){ //both out. So have and edge between them

        searchTheEdgeBetweenTwoNodes(startNode, endNode);

    }
    else if(startOut){ // just start is out

        createEdge(start, end);
         console.log("start out");

    }
    else if(endOut){ // just end is out

        createEdge(start, end);
        console.log("end out");

    }
    else{ // both are in

        //all already done
        console.log("BOTH IN (or in the corners)");
    }

}

function createVerticalBrickEdgeCopy(startNode, endNode){



    var start = startNode;
    var end = endNode;

    var startOut = false;
    var endOut = false;

    


    //START NODE
    var startWithinEdge = isWithinAEdge(startNode); // get the edge where the start node is within. Null if not.

    var startEdgeList = searchEdgeFromStartNode(startNode); // search if the start node is in the cortner instead of within
    
    var startEdge = null;

    var vertical = false;

    if(startEdgeList != null){

        for (let index = 0; index < startEdgeList.length; index++) {
            const currentEdge = startEdgeList[index];
            if(isVerticalEdge(currentEdge)){
                vertical = true;
                startEdge = currentEdge;
                break;
            }
            
        }

    }


    console.log("start within edge = " + startWithinEdge);
    console.log("Start edge list = " + startEdgeList);
    console.log("start edge = " + startEdge);

    console.log("start vertical = " + vertical);

    
    if(startWithinEdge != null){ //check if it's within a edge
        
        start = startWithinEdge.endNode;
        insertNodeInTheEdge(startNode, startWithinEdge);

        console.log("start INSERTED");    
    }
    else if(startEdge != null && vertical){ // startEdge is getted by his startNode, so if its vertical, the edge is between the two nodes

        start = startEdge.endNode;
        startOut = true;
    }
    else if(startEdge == null){ // check if it's floating (and not in a corner)

        startOut = true;

    }else if(startEdge != null){ // and not vertical
        startOut = true;
    }


    //END NODE
    var endWithinEdge = isWithinAEdge(endNode); //aci esta updated
    var endEdgeList = searchEdgeFromEndNode(endNode);
    var endEdge = null;
    vertical = false;
    
    if(endEdgeList != null){

        for (let index = 0; index < endEdgeList.length; index++) {
            const currentEdge = endEdgeList[index];
            if(isVerticalEdge(currentEdge)){
                vertical = true;
                endEdge = currentEdge;
                break;
            }
            
        }

    }

    console.log("END within the edge = " + endWithinEdge);
    console.log("end edge list = " + endEdgeList);
    console.log("end edge = " + endEdge);
    console.log("end vertical = " + vertical);


    if(endWithinEdge != null){ //is within a edge

        end = endWithinEdge.startNode;
        insertNodeInTheEdge(endNode, endWithinEdge);
        start = startNode; //CUIDADIN EN AÇOOO
        console.log("end INSERTED");

    }
    else if(endEdge != null && vertical){ // startEdge is getted by his startNode, so if its vertical, the edge is between the two nodes

        end = endEdge.startNode;
        endOut = true;
    }
    else if(endEdge == null){ // it's floating

        endOut = true;

    }else if(endEdge != null){ // and not vertical
        endOut = true;
    }

    console.log("Start out = " + startOut + "\nEnd out = " + endOut);
    //UNIFY FLOATING NODES

    if(startOut && endOut){ //both out. So have and edge between them

        console.log("both out");
        if(searchTheEdgeBetweenTwoNodes(startNode, endNode)){
            //nada, ya lo ha hehco el metodo
        }
        else{
            //hay que juntarlos
            createEdge(start, end);
        }


    }
    else if(startOut){ // just start is out

        if(start == end){
            console.log("point edge not created");
        }else{
            createEdge(start, end);
            console.log("end out: \n\t startpos = (" + start.position.x +"," + start.position.y+")\n\t endpos = (" + end.position.x +"," + end.position.y+")");
        }


    }
    else if(endOut){ // just end is out

        if(start == end){
            console.log("point edge not created");
        }else{
            createEdge(start, end);
            console.log("end out: \n\t startpos = (" + start.position.x +"," + start.position.y+")\n\t endpos = (" + end.position.x +"," + end.position.y+")");
        }

    }
    else{ // both are in

        //all already done
        console.log("BOTH IN , or in the corners, or conected with an inner edge");
    }

}

function createBrickEdge(startNode, endNode){ //create correctly the edge (or the edges) of the brick

    var start = startNode;
    var end = endNode;
    var temporalEdge;
    var startOut = false;
    var endOut = false;
    //var bothWithin = true;

    
    if(isTheNodeInAEdge(startNode)){ //is within a edge
        temporalEdge = searchEdgeFromStartNode(startNode);
        start = temporalEdge.endNode;
    }
    else{ // it's floating
        startOut = true;
    }

    if(isTheNodeInAEdge(endNode)){ //is within a edge
        temporalEdge = searchEdgeFromEndNode(endNode);
        end = temporalEdge.startNode;
    }
    else{ // it's floating
        endOut = true;
    }

    if(startOut && endOut){ //both out. So have and edge between them
        searchTheEdgeBetweenTwoNodes(startNode, endNode);
    }
    else if(startOut){ // just start is out
        createEdge(start, end);
    }
    else if(endOut){ // just end is out
        createEdge(start, end);
    }
    else{ // both are in
        //all already done
    }

}

function searchTheEdgeBetweenTwoNodes( startNode, endNode ){

    //Hay que valorar el caso en que este lado del brick sea mas grande que dos bricks juntos que lo aguantan o estan a su lado
    var temporalEdge = new Edge(startNode, endNode, null, 0);
    var currentEdge;
    
    for(var i = 0 ; i < m_GlobalEdgeList ; i++){
        currentEdge = m_GlobalEdgeList[i];

        if(isNodeWithinTheEdge(currentEdge.startNode, temporalEdge)){ // no compruebo el end node porque no puede estar fuera conforme lo he hecho
            
            createEdge(startNode, currentEdge.startNode);
            createEdge(currentEdge.endNode, endNode);

            return true;
        }


    }
    console.warn("No ha encontrado un edge dentro del edge. Cagada");
    return false;

}

//No vale, se une con otros que no son si no tiene vecino
function findVerticalNodes( node ){ // finds the upper and lower neightbours and create their respective edges

    var upperClosestNode = null;
    var upperClosestDistance = Infinity;

    // var lowerClosestNode = null;
    // var lowerClosestDistance = -Infinity;

    var distance = 0;

    m_GlobalNodeList.forEach(currentNode => {

        if(currentNode != node && currentNode.position.x == node.position.x){

            distance = currentNode.position.y - node.position.y;
            
            if( distance > 0 && distance < upperClosestDistance){ //node is above

                upperClosestDistance = distance;
                upperClosestNode = currentNode;

            }
            // else if(distance < 0 && distance > lowerClosestDistance){ //node is down
                
            //     lowerClosestDistance = distance;
            //     lowerClosestNode = currentNode;

            // }

        }

        
    });

    if(upperClosestNode != null){
        updateVerticalNeighbors(node, upperClosestNode);
        createEdge(node,upperClosestNode);
    }
    
    // if(lowerClosestNode != null){
    //     updateVerticalNeighbors(lowerClosestNode, node);
    //     createEdge(lowerClosestNode, node);    
    // }


}

function findHorizontalNodes( node ){ // finds the left and right neightbours and create their respective edges

    var rightClosestNode = null;
    var rightClosestDistance = Infinity;

    // var leftClosestNode = null;
    // var leftClosestDistance = -Infinity;

    var distance = 0;

    m_GlobalNodeList.forEach(currentNode => {

        if(currentNode != node && currentNode.position.y == node.position.y){

            distance = currentNode.position.x - node.position.x;
            
            if( distance > 0 && distance < rightClosestDistance){ //node is above

                rightClosestDistance = distance;
                rightClosestNode = currentNode;

            }
            // else if(distance < 0 && distance > leftClosestDistance){ //node is down
                
            //     leftClosestDistance = distance;
            //     leftClosestNode = currentNode;

            // }

        }

        
    });

    if(rightClosestNode != null){
        updateHorizontalNeighbors(node, rightClosestNode);
        createEdge(node,rightClosestNode);
    }
    
    // if(leftClosestNode != null){
    //     updateHorizontalNeighbors(leftClosestNode, node);
    //     createEdge(leftClosestNode, node);    
    // }



}

function createJoint(){

    m_GlobalNodeList.forEach(node => {

        findVerticalNodes(node);
        findHorizontalNodes(node);
        
    });
}

function isTheNodeInAEdge(node){

    var currentedge;
    var isWithin = false;
    for (var i = 0 ; i < m_GlobalEdgeList.length ; i++){
        
        currentedge = m_GlobalEdgeList[i];

        if(isNodeWithinTheEdge(node, currentedge)){ //in the case is within and not in the border
            isWithin = true;
            insertNodeInTheEdge(node, currentedge);
            break;

        }
    }
    return isWithin;

    //return...? findEdge by his first node or by his end node en el metode cidador

}

function unifyNodesDemostration(){

    m_GlobalNodeList.length = 0; //clear the array
    m_NodeFloorList.length = 0;
    m_GlobalEdgeList.length = 0;
    m_GlobalBrickList.length = 0;

    firstRowEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    //firstRow(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForce(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    var lengthBefore = m_GlobalNodeList.length;
    console.log("Nodes before =" + lengthBefore);

    unifyNodes();

    console.log("Nodes after =" + m_GlobalNodeList.length);



}
