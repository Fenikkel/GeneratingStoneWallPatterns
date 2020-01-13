
function makeWallJointPattern(){

    //limpiamos canvas
    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "gray";//"#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    // clear the array
    m_GlobalNodeList.length = 0; //clear the array
    m_NodeFloorList.length = 0;
    m_GlobalEdgeList.length = 0;
    m_GlobalBrickList.length = 0;

    //create first floor nodes
    var startFloorNode = createNode(m_LeftOffset, 0);
    var endFloorNode = createNode(m_CanvasWidth - m_RightOffset, 0);
    m_NodeFloorList.push(startFloorNode,endFloorNode);

    //create the edge of the first floor
    createEdge(startFloorNode, endFloorNode);

    //build rows
    for (let index = 0; index < m_Rows; index++) {

        tetrisBruteForceEdges(m_LeftOffset, m_CanvasWidth - m_RightOffset, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);   
    
    }


    console.log("Global node list LENGTH: " + m_GlobalNodeList.length);
    console.log("Global brick list LENGTH: " + m_GlobalBrickList.length);
    console.log("Global edge list LENGTH: " + m_GlobalEdgeList.length);

    //paintWall();

    paintEdges();
    paintNodes();
    //debugPaintEdges();

}

function tetrisBruteForceEdges(wallInit, wallFinal, averageBrickWidth, averageBrickHeight, noise){

    
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


    var TEMPORAL = 0;
    while(traveled < wallWidth){//traveled < wallWidth){ //TEMPORAL < 3){

        console.log("Brick nº"+ TEMPORAL + "\n\n");

        if(noise >= 0.9){
            noise = 0.9; //Evade invisible bricks and noise excess
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

            if ( index >= m_NodeFloorList.length -1){ //if traveled is greater than last floor means that we pass the right boundary
                index = m_NodeFloorList.length-2;
                console.log("BREAK!");
                finalNode = m_NodeFloorList[index]; //The last floor. This makes a visual bug
                nextFinalNode = m_NodeFloorList[index + 1];
    
                break;
            }


    
            finalNode = m_NodeFloorList[index];
            nextFinalNode = m_NodeFloorList[index + 1];

            console.log("INDEX: " + index);
            console.log("listLENGTH: " + m_NodeFloorList.length);


            console.log(m_NodeFloorList[index-1]);
            console.log(finalNode);
            console.log(nextFinalNode);

            if(nextFinalNode.position.y > peak){ //and save the most peak altitude //ERROR POCO FRECUENTE DE CUANDO NEXTFINALNODE IS UNDEFINED
    
                peak = nextFinalNode.position.y;
    
                peakNode = finalNode; //guardamos los nodos que representan el techo mas alto 
                nextPeakNode = nextFinalNode;
    
                crash = true;

    
            }
    

    
        }

        //Crear piedra

        leftDownNode = createNode(lastXPosition, peakNode.position.y);

        leftUpNode = createNode(lastXPosition, peakNode.position.y + brickHeight);

        rightUpNode = createNode(traveled, peakNode.position.y + brickHeight);

        rightDownNode = createNode(traveled, peakNode.position.y);

        brick = new Brick( leftDownNode, leftUpNode, rightUpNode, rightDownNode);

        //Update
        // updateHorizontalNeighbors(leftDownNode, rightDownNode);
        // updateHorizontalNeighbors(leftUpNode, rightUpNode);
        // updateVerticalNeighbors(leftDownNode, leftUpNode);
        // updateVerticalNeighbors(rightDownNode, rightUpNode);

        console.log("HORIZONTAL DOWN");
        createHorizontalBrickEdge(leftDownNode, rightDownNode, "lower");
        console.log("\n\n");

        //HORIZONTAL UP
        createEdge(leftUpNode, rightUpNode);
        
        // var tempEdge = createEdge(leftUpNode, rightUpNode);
        // tempEdge.rightSide = true; 


        console.log("VERTICAL LEFT");
        createVerticalBrickEdge(leftDownNode, leftUpNode);
        console.log("\n\n");

        console.log("VERTICAL RIGHT");
        createVerticalBrickEdge(rightDownNode, rightUpNode);
        console.log("\n\n");



        // createBrickEdge(leftDownNode, rightDownNode);
        // // // createBrickEdge(leftDownNode, leftUpNode); //leftdownnode should be updated already
        // // // createBrickEdge(rightDownNode, rightUpNode); //rightdownnode shoud be updated already
        // createBrickEdge(leftUpNode, rightUpNode); //both updated, it should be like do a createEdge(leftUpNode, rightUpNode)

        //The neightbours should be updated already
        

        //Push
        // console.log("LEFT UP NODE" + leftUpNode);
        // console.log("RIGHT UP NODE" + rightUpNode);

        nextNodeFloorList.push(leftUpNode, rightUpNode);
        m_GlobalBrickList.push(brick);
        temporalBrickList.push(brick);

        lastXPosition = traveled;
        TEMPORAL++;
        
    }

    m_NodeFloorList = nextNodeFloorList;
    // paintFloor(); // no pinta si no tiene las referencias a los vecinos
    // paintBrickRow(temporalBrickList);
    fillBricks();

    
}

function createHorizontalBrickEdge(startNode, endNode, orientation){ //create correctly the edge (or the edges) of the brick


    //Check and insert nodes in the edges if it is the case
    checkNodeInterference(startNode);
    checkNodeInterference(endNode);

    var startEdge = getTheHorizontalEdge(startNode, "start"); // get the vertical edge of the start node if have one

    var endEdge = getTheHorizontalEdge(endNode, "end");

    var tempEdge;


    if(startEdge == null && endEdge == null){ //CASE 1: Both out
        console.log ("Caso 1");
        //CHECK IF THERE IS more than a one FLOATING EDGE BETWEEN THIS SPACE
        var edgeBetween = getEdgeBetweenTwoNodes(startNode, endNode);

        if(edgeBetween != null){

        	createEdge(startNode, edgeBetween.startNode);
        	createEdge(edgeBetween.endNode, endNode);
        	/*
			if(orientation == "lower"){
            
				tempEdge = createEdge(startNode, edgeBetween.startNode);

				tempEdge.leftSide = true;

				tempEdge = createEdge(edgeBetween.endNode, endNode);

				tempEdge.leftSide = true;

			}
			else if(orientation == "upper"){
            
				tempEdge = createEdge(startNode, edgeBetween.startNode);

				tempEdge.rightSide = true;

				tempEdge = createEdge(edgeBetween.endNode, endNode);

				tempEdge.rightSide = true;

			}
			*/

            
        }
        else{ //never arrives...

			createEdge(startNode, endNode);
			/*
            tempEdge = createEdge(startNode, endNode);

        	if(orientation == "lower"){

            	tempEdge.leftSide = true;
            }
            else if(orientation == "upper"){

            	tempEdge.rightSide = true;
            }
            */
        }


    }
    else if(startEdge == endEdge){ // CASE 2: The edge is already created.
        console.log ("Caso 2");
        /*
		if(orientation == "lower"){
        	startEdge.leftSide = true;
        }
        else if(orientation == "upper"){
        	startEdge.rightSide = true;
        }
        */

        return; //do nothing

    }
    else if(startEdge == null){ //CASE 3: Start node is out
        console.log ("Caso 3");
        //Advance end node
        var newEndNode = endEdge.startNode;

        var newEndEdge = getTheHorizontalEdge(newEndNode, "end");

        while(newEndEdge != null){ //Put the newStartNodeinTheExtreme
            console.log(" != null");
            newEndNode = newEndEdge.startNode;

            newEndEdge = getTheHorizontalEdge(newEndNode, "end");
        }

        createEdge(startNode, newEndNode);

        /*
        tempEdge = createEdge(startNode, newEndNode);

        if(orientation == "lower"){

			tempEdge.leftSide = true;

		}
		else if(orientation == "upper"){

			tempEdge.rightSide = true;

		}
		*/

    }
    else if(endEdge == null){ //CASE 4: End node is out
        console.log ("Caso 4");
        //Advance start node
        var newStartNode = startEdge.endNode;

        var newStartEdge = getTheHorizontalEdge(newStartNode, "start");

        while(newStartEdge != null){ //Put the newStartNodeinTheExtreme

            newStartNode = newStartEdge.endNode;

            newStartEdge = getTheHorizontalEdge(newStartNode, "start");
        }

        createEdge(newStartNode, endNode);
        /*
        tempEdge = createEdge(newStartNode, endNode);

        if(orientation == "lower"){

			tempEdge.leftSide = true;

		}
		else if(orientation == "upper"){

			tempEdge.rightSide = true;

		}
		*/

    }
    else{ //Case 5: Search if there is a gap between startEdge and endEdge. Both in, but not in the same edge
        console.log ("CASOOOO 5");
        var newStartNode = startNode;
        var newEndNode = endNode;

        var newStartEdge = startEdge;
        var newEndEdge = endEdge;

        var startExtreme = false;
        var endExtreme = false;


        while(!startExtreme || !endExtreme){ // while the pointers don't reached the extreme

            if(!startExtreme){

                //Avanzamos startEdge y si no es null comparamos
                newStartNode = newStartEdge.endNode;

                newStartEdge = getTheHorizontalEdge(newStartNode, "start");

                if(newStartEdge != null){
                    
                    if(newStartEdge == newEndEdge){ //there is no gap
                        return; //cuidado con este return por si hay cosas debajo de estos if else
                    }

                }
                else{
                    //newStartNode is in the extreme
                    startExtreme = true;
                }
            }

            if(!endExtreme){

                //Avanzamos startEdge y si no es null comparamos
                newEndNode = newEndEdge.startNode;

                newEndEdge = getTheHorizontalEdge(newEndNode, "end");

                if(newEndEdge != null){
                    
                    if(newStartEdge == newEndEdge){ //there is no gap
                        return; //cuidado con este return por si hay cosas debajo de estos if else
                    }

                }
                else{
                    //newEndNode is in the extreme
                    endExtreme = true;
                }
            }
        }

		createEdge(newStartNode, newEndNode);
		/*
        tempEdge = createEdge(newStartNode, newEndNode);

        if(orientation == "lower"){

			tempEdge.leftSide = true;

		}
		else if(orientation == "upper"){

			tempEdge.rightSide = true;

		}
		*/

    }

}

function createVerticalBrickEdge(startNode, endNode){

    //Check and insert nodes in the edges if it is the case
    checkNodeInterference(startNode);
    checkNodeInterference(endNode);
    
    var startEdge = getTheVerticalEdge(startNode, "start"); // get the vertical edge of the start node if have one

    var endEdge = getTheVerticalEdge(endNode, "end");

    if(startEdge == null && endEdge == null){ //CASE 1: Both out
        console.log ("Caso 1");
        //CHECK IF THERE IS AN FLOATING EDGE BETWEEN THIS SPACE
        var edgeBetween = getEdgeBetweenTwoNodes(startNode, endNode);

        if(edgeBetween != null){
            createEdge(startNode, edgeBetween.startNode);
            createEdge(edgeBetween.endNode, endNode);
        }
        else{
            createEdge(startNode, endNode);
        }


    }
    else if(startEdge == endEdge){ // CASE 2: The edge is already created.
        console.log ("Caso 2");
        return; //do nothing

    }
    else if(startEdge == null){ //CASE 3: Start node is out
        console.log ("Caso 3");
        //Advance end node
        var newEndNode = endEdge.startNode;

        var newEndEdge = getTheVerticalEdge(newEndNode, "end");

        while(newEndEdge != null){ //Put the newStartNodeinTheExtreme
            console.log(" != null");
            newEndNode = newEndEdge.startNode;

            newEndEdge = getTheVerticalEdge(newEndNode, "end");
        }

        createEdge(startNode, newEndNode);

    }
    else if(endEdge == null){ //CASE 4: End node is out
        console.log ("Caso 4");
        //Advance start node
        var newStartNode = startEdge.endNode;

        var newStartEdge = getTheVerticalEdge(newStartNode, "start");

        while(newStartEdge != null){ //Put the newStartNodeinTheExtreme

            newStartNode = newStartEdge.endNode;

            newStartEdge = getTheVerticalEdge(newStartNode, "start");
        }

        createEdge(newStartNode, endNode);

    }
    else{ //Case 5: Search if there is a gap between startEdge and endEdge


        console.log ("CaSSSOoo 5");
        var newStartNode = startNode;
        var newEndNode = endNode;

        var newStartEdge = startEdge;
        var newEndEdge = endEdge;

        var startExtreme = false;
        var endExtreme = false;


        while(!startExtreme || !endExtreme){ // while the pointers don't reached the extreme //BUG DE QUE A VECES HACE BUBLE INFINITO

            //console.log("iteracion");
            if(!startExtreme){
                console.log("startExtreme");
                //Avanzamos startEdge y si no es null comparamos
                newStartNode = newStartEdge.endNode;

                newStartEdge = getTheVerticalEdge(newStartNode, "start");

                if(newStartEdge != null){
                    
                    if(newStartEdge == newEndEdge){ //there is no gap
                        return; //cuidado con este return por si hay cosas debajo de estos if else
                    }

                }
                else{
                    //newStartNode is in the extreme
                    startExtreme = true;
                }
            }

            if(!endExtreme){
                console.log("endExtreme");

                //Avanzamos startEdge y si no es null comparamos
                newEndNode = newEndEdge.startNode;

                newEndEdge = getTheVerticalEdge(newEndNode, "end");

                if(newEndEdge != null){
                    
                    if(newStartEdge == newEndEdge){ //there is no gap
                        return; //cuidado con este return por si hay cosas debajo de estos if else
                    }

                }
                else{
                    //newEndNode is in the extreme
                    endExtreme = true;
                }
            }
        }

        createEdge(newStartNode, newEndNode);

    }

}

function checkNodeInterference(node){ //Insert the node if is in the middle of an edge (not in the corners)

        var edgeInterfered = isWithinAEdge(node); // get the edge where the start node is within. Null if not.

        if(edgeInterfered != null){ //check if it's within a edge
            
            insertNodeInTheEdge(node, edgeInterfered);
    
            console.log("...INSERTED...");    
        }
}

function getEdgeBetweenTwoNodes(startNode, endNode){
    m_GlobalEdgeList.forEach(edge => {

        if(isHorizontalEdge(edge)){
            if(edge.startNode.position.y == startNode.position.y && edge.startNode.position.x > startNode.position.x && edge.endNode.position.x < endNode.position.x){
                console.log("HORIZONTAL edge found between");
                return edge;
            }
        }
        else if(isVerticalEdge(edge)){
            if(edge.startNode.position.x == startNode.position.x && edge.startNode.position.y > startNode.position.y && edge.endNode.position.y < endNode.position.y){
                console.log("VERTICAL edge found between");
                return edge;
            }
        }
        else{
            console.error("this edge is perpendicular");
        }


    });

    return null;
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

    var firstEdge = createEdge(edge.startNode, node); //new Edge(edge.startNode, node, null, 0);
    var secondEdge = createEdge(node, edge.endNode); //new Edge(node, edge.endNode, null, 0);

    for (var i = m_GlobalEdgeList.length - 1 ; i >= 0 ; i--) {
        if (m_GlobalEdgeList[i] == edge) {
            m_GlobalEdgeList.splice(i, 1);
            break;       //<-- comment  if all the same elements has to be removed
        }
    }

    //m_GlobalEdgeList = m_GlobalEdgeList.filter(e => e !== edge); //quita edge pero de una forma menos eficiente?

/*
    //Update links
    if(firstEdge.startNode.position.x == firstEdge.endNode.position.x){ // is a vertical edge. secondEdge should be too
        updateVerticalNeighbors(firstEdge.startNode, firstEdge.endNode);
        updateVerticalNeighbors(secondEdge.startNode, secondEdge.endNode);
    }
    else{ // is a horizontal edge
        updateHorizontalNeighbors(firstEdge.startNode, firstEdge.endNode);
        updateHorizontalNeighbors(secondEdge.startNode, secondEdge.endNode);
    }
    */

    //m_GlobalEdgeList.push(firstEdge, secondEdge);


}

function searchEdgeFromStartNode(startNode){ //return a list of edges where the startNode is involved

    var currentStartNode; 
    var edge = [];
    
    for (let index = 0; index < m_GlobalEdgeList.length; index++) {
        currentStartNode = m_GlobalEdgeList[index].startNode;

        if(startNode == currentStartNode){
            edge.push(m_GlobalEdgeList[index]);
            //break; //No, because we need the horizontal and vertical edge
        }
        
    }

    //console.log("Searchedgefromstart node = " + edge);

    if(edge.length > 0){
        return edge;
    }
    else{
        return null;
    }
}

function searchEdgeFromEndNode(endNode){

    var currentEndNode; 
    var edge = [];
    //var edge = null;
    
    for (let index = 0; index < m_GlobalEdgeList.length; index++) {
        currentEndNode = m_GlobalEdgeList[index].endNode;

        if(endNode == currentEndNode){
            edge.push(m_GlobalEdgeList[index]);
            //break;
        }
        
    }

    if(edge.length > 0){
        return edge;
    }
    else{
        //console.log("End node don't have edge")
        return null;
    }
}

function unifyNodes(){

    var nodeIndex;
    var compareNodeIndex;
    var nodeListLenght = m_GlobalNodeList.length;

    var currentNode;
    var compareNode;


    for ( nodeIndex = 0; nodeIndex < nodeListLenght; nodeIndex++) {

        currentNode = m_GlobalNodeList[nodeIndex];
        
        for (compareNodeIndex = nodeIndex + 1; compareNodeIndex < nodeListLenght; compareNodeIndex++) {

            compareNode = m_GlobalNodeList[compareNodeIndex];

            if(currentNode.position.x == compareNode.position.x && currentNode.position.y == compareNode.position.y){
                m_GlobalNodeList.splice(compareNodeIndex, 1);
                nodeListLenght--;
            }
            
        }

        
    }
}

function createEdge(startNode, endNode){ //startNode is always less value than endNode in "x" and in "y"

    if(startNode.position.x == endNode.position.x){ // is a vertical edge
        updateVerticalNeighbors(startNode, endNode);
    }
    else{ // is a horizontal edge
        updateHorizontalNeighbors(startNode, endNode);
    }

    var edge = new Edge(startNode,endNode, null, false, false);
    m_GlobalEdgeList.push(edge);

    return edge;

}

function createNode(posX, posY){ //search if the node is already in the list, push it if not, and then return the reference of the node

    var position = new Position(posX, posY);
    node = new WallNode(position, null, null, null, null);

    var isNew = true;
    var currentNode;

    for (var i = 0 ; i < m_GlobalNodeList.length ; i++){
        
        currentNode = m_GlobalNodeList[i];

        if(node.position.x == currentNode.position.x && node.position.y == currentNode.position.y){
            node = currentNode;
            isNew = false;
            break; // there is no repeted elements in the list
        }

    }

    if(isNew){
        m_GlobalNodeList.push(node);
    }

    return node;
}

function isWithinAEdge(node){

    var currentEdge;
    for(var i = 0 ; i < m_GlobalEdgeList.length ; i++){
        currentEdge = m_GlobalEdgeList[i];

        if(currentEdge.startNode.position.x == currentEdge.endNode.position.x && currentEdge.endNode.position.x == node.position.x ){ //vertical case
            if( currentEdge.startNode.position.y < node.position.y && node.position.y < currentEdge.endNode.position.y){
                return currentEdge;
            }
        }

        else if(currentEdge.startNode.position.y == currentEdge.endNode.position.y && currentEdge.endNode.position.y == node.position.y){ // horizontal case
            if(currentEdge.startNode.position.x < node.position.x && node.position.x < currentEdge.endNode.position.x){
                return currentEdge;
            }
        }
        
    }
    return null;

}

function isHorizontalEdge(edge){

    if(edge == null){
        console.warn("the edge is a null");
        return false;
    }

    if(edge.startNode.position.y == edge.endNode.position.y){
        return true;
    }
    else{
        return false;
    }
}

function isVerticalEdge(edge){

    if(edge == null){
        console.warn("the edge is a null");
        return false;
    }

    if(edge.startNode.position.x == edge.endNode.position.x){
        return true;
    }
    else{
        return false;
    }
}

function getTheVerticalEdge(node, mode){ //mode: "start" or "end" for get the vertical edge of start node or end node

        var edgeList = null; // can be the start node or end node list

        //Get the corresponding edges involved
        if(mode == "start"){
            edgeList = searchEdgeFromStartNode(node); // search if the start node is in the cortner instead of within (this can only be 2 edges max and 0 min)
        }
        else if(mode == "end"){
            edgeList = searchEdgeFromEndNode(node);
        }
        else{
            console.error("Misspelling on mode");
        }

    
        if(edgeList != null){
    
            for (let index = 0; index < edgeList.length; index++) { //for every edge of the node (2 max)
                const currentEdge = edgeList[index];
                if(isVerticalEdge(currentEdge)){ //the node only have one vertical edge where it is the start node or the end node.

                    return currentEdge;
                }
                
            }
    
        }

        return null; // there is no vertical edge

}

function getTheHorizontalEdge(node, mode){ //mode: "start" or "end" for get the vertical edge of start node or end node

        var edgeList = null; // can be the start node or end node list

        //Get the corresponding edges involved
        if(mode == "start"){
            edgeList = searchEdgeFromStartNode(node); // search if the start node is in the cortner instead of within (this can only be 2 edges max and 0 min)
        }
        else if(mode == "end"){
            edgeList = searchEdgeFromEndNode(node);
        }
        else{
            console.error("Misspelling on mode");
        }

    
        if(edgeList != null){
    
            for (let index = 0; index < edgeList.length; index++) { //for every edge of the node (2 max)
                const currentEdge = edgeList[index];
                if(isHorizontalEdge(currentEdge)){ //the node only have one horizontal edge where it is the start node or the end node.

                    return currentEdge;
                }
                
            }
    
        }



        return null; // there is no horizontal edge
}

//millorar
function displaceNodes(displace){

	for(let index = 0; index < m_GlobalNodeList.length; index++){
		var currentNode = m_GlobalNodeList[index];

		if(currentNode.right != null && currentNode.left == null){

			currentNode.position.x += displace;

		}
		else if(currentNode.right == null && currentNode.left != null){

			currentNode.position.x -= displace;

		}
		else if(currentNode.upper != null && currentNode.lower == null){

			currentNode.position.y += displace;

		}
		else if(currentNode.upper == null && currentNode.lower != null){

			currentNode.position.y -= displace;

		}
		else{
			//do nothing.
		}

	}


}


function checkCandidate(node, candidate){

	var candidates = [];

	switch(candidate){

		case "upper":

			if(node.upper != null){


				//Set edge side
				var edge = getTheVerticalEdge(node, "start");

				if(edge != null){

					edge.rightSide = true;

				}
				else{ 
					console.error("Something goes wrong. The node or the edge is missing");
				}

				//Update
				node = node.upper;
				candidates.push("right", "upper");

			}
			return candidates; //length = 0 if the candidate fails

		case "lower":

			if(node.lower != null){


				//Set edge side
				var edge = getTheVerticalEdge(node, "end");

				if(edge != null){

					edge.leftSide = true;

				}
				else{ 
					console.error("Something goes wrong. The node or the edge is missing");
				}

				//Update
				node = node.lower;
				candidates.push("left", "lower");

			}
			return candidates; //length = 0 if the candidate fails

		case "right":

			if(node.right != null){


				//Set edge side
				var edge = getTheHorizontalEdge(node, "start");

				if(edge != null){

					edge.rightSide = true;

				}
				else{
					console.error("Something goes wrong. The node or the edge is missing");
				}

				//Update
				node = node.right;
				candidates.push("lower", "right");

			}
			return candidates; //length = 0 if the candidate fails

		case "left":

			if(node.left != null){


				//Set edge side
				var edge = getTheHorizontalEdge(node, "end");

				if(edge != null){

					edge.leftSide = true;

				}
				else{ 
					console.error("Something goes wrong. The node or the edge is missing");
				}

				//Update
				node = node.left;
				candidates.push("upper", "left");

			}
			return candidates; //length = 0 if the candidate fails

		default:

			console.error("Candidate misspelled: " + candidate);

	}

	return candidates;
}

//mal
function updateSides(){


	var currentNode;
	var neightbourNode;
	var firstCandidate;
	var secondCandidate;

	var ground = false;
	var leftBorder = false;
	var rightBorder = false;


	for(let index = 0; index < m_GlobalNodeList.length; index++){

		currentNode = m_GlobalNodeList[index];
		neightbourNode = m_GlobalNodeList[index];

		//Check the border nodes (we don't process them, they can do errors)
		if(currentNode.position.y == 0){
			ground = true;
		}
		if(currentNode.position.x == m_LeftOffset){
			leftBorder = true;
		}
		if(currentNode.position.x == m_CanvasWidth - m_RightOffset){
			rightBorder = true;
		}


		if(ground || leftBorder || rightBorder){ //do nothing, can do errors
			//neightbour and currend node will be equals
			//console.warn("BORDER");
		}
		else{

			
			//Inizialice the loop
            
            //pillamos el siguiente el el ciclo del ladrillo
			var candidates = initializeStoneArea(neightbourNode); //clockwise, decide the neightbour and return the candidates. Probably the neightbour is the right or the lower
			
			firstCandidate = candidates[0];
			secondCandidate = candidates[1];
			//console.log("First: " + firstCandidate);
			//console.log("Second: " + secondCandidate);

		}




		do{
            console.log("iteracion");
			if(ground || leftBorder || rightBorder){ //do nothing, can do errors
                //console.warn("BROKE");
                //pillaremos el siguiente nodo
				break;
			}

			
			var candidates = checkCandidate(neightbourNode, firstCandidate); //Check first candidate

			if(candidates.length == 2){

				firstCandidate = candidates[0];
				secondCandidate = candidates[1];

			}
			else{
				candidates = checkCandidate(neightbourNode, secondCandidate); //Check second candidate

				if(candidates.length == 2){

					firstCandidate = candidates[0];
					secondCandidate = candidates[1];

				}
				else{
					console.error("Candidates lost. Maybe there is no loop in the brick?")
				}
			}

		}
		while(currentNode != neightbourNode);

		//Reset

		ground = false;
		leftBorder = false;
		rightBorder = false;
	}
}

//mal
function initializeStoneArea(node){

	var neightbours = ["right", "lower", "left", "upper"]; //The order it's important. There is enought with right and lower.
	var candidates = [];

	var index = 0;


	do{
		candidates = checkCandidate(node, neightbours[index]); //check if this neightbour is disponible, if not, we get an empty array so we check the next. checkCandidate also uptades the side that we start
		index++;

		if(index > 3){
			console.error("Node without neightbours");
			return;

		}

	}
	while(candidates.length != 2);


	return candidates;

}




