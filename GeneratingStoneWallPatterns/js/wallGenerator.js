
function makeWallJointPattern(){

    firstRow(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    nextRow(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

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







        // if(traveled > nextNode.position.x && nextNode.upper != null){ //si no es null significa que el siguiente techo esta mas arriba con lo que xocara

        //     crash = true;

        // }



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
                position = new Position(rightDownNode.position.x, nextNode.upper.position.y + brickHeight);
            }
            else{ //si no ha chocado y es mas pequeño..
                position = new Position(leftDownNode.position.x, brickHeight + leftDownNode.position.y);
            }
            
            leftUpNode = new WallNode(position, null, null, null, null);

            if(leftUpNode.position.y < rightUpNode.position.y){

                rightUpNode.upper = null;
                rightUpNode.lower = leftUpNode;
                leftUpNode.upper = rightUpNode;
                leftUpNode.lower = leftDownNode;
                leftDownNode.upper = leftUpNode;

            }
            else if(leftUpNode.position.y > rightUpNode.position.y){ // == is in the next IF

                leftDownNode.upper = rightUpNode;
                rightUpNode.lower = leftDownNode; //already done
                rightUpNode.upper = leftUpNode;
                leftUpNode.lower = rightUpNode;

            }


            if( (brickHeight + leftDownNode.position.y) == rightUpNode.position.y){ //si tienen la misma altura es que son el mismo nodo y no hace falta añadirlo al global list. se borra todo lo hecho anteriormente
                        
                leftUpNode = rightUpNode;

            }
            else{
                m_GlobalNodeList.push(leftUpNode);
            }

            nextNodeFloorList.push(leftUpNode);



                        
            // //update links (MIRAR DE TENER EN CUENTA EL CRASH)

            // if( (brickHeight + leftDownNode.position.y) > rightUpNode.position.y){ //si esta mas alto

            //     leftUpNode.lower = rightUpNode;
            //     rightUpNode.lower = leftDownNode; //rememeber we still have the last rightUpNode
            //     rightUpNode.upper = leftUpNode;
            //     leftDownNode.upper = rightUpNode;
            // }
            // else{ // si es mas bajo


            //     leftUpNode.lower = rightDownNode; // or leftdownnode
            //     leftUpNode.upper = rightUpNode; 

            //     rightUpNode.lower = leftUpNode; //rememeber we still have the last rightUpNode
            //     rightUpNode.upper = null;

            //     leftDownNode.upper = leftUpNode;

            // }


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
        nextNodeFloorList.push(rightUpNode);

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
        if(crash){
            crash = false;
        }
        // if(nextNode.position.x <= traveled ){
        //     console.log(index);
        //     index ++;
        //     index ++; //+2 porque hemos de passar al otro ladrillo techo
        // }

        TEMPORAL++;
    }

    //Actualizar m_NodeFloorList
    m_NodeFloorList = nextNodeFloorList;

    //peak = 0;

    //Rellenar huecos con teselación

    
}