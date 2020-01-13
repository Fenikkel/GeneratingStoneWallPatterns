var colors = ["blue", "red", "green", "magenta", "gold"];
var colorIndex = 0;


function paintNodes(){

    m_Context.beginPath();
    var y = 0;

    for (let index = 0; index < m_GlobalNodeList.length; index++) {
        const element = m_GlobalNodeList[index];
        y = m_CanvasHeight - element.position.y;
        m_Context.moveTo(element.position.x, y);
        m_Context.arc(element.position.x, y, 2, 0, 2 * Math.PI);
        
    }
    // m_GlobalNodeList.forEach(node => {
    //     m_Context.arc(node.position.x, node.position.y, 2, 0, 2 * Math.PI);
    // });



    //m_Context.strokeStyle = "black";
    m_Context.fillStyle = "black";
    m_Context.fill();
}

function paintWall(){

    m_Context.beginPath();

    var y = 0;
    
    var currentNode;
    for(var index = 0; index < m_GlobalNodeList.length ; index ++){

        currentNode = m_GlobalNodeList[index];

        y = m_CanvasHeight - currentNode.position.y;

        m_Context.moveTo(currentNode.position.x, y);

        if(currentNode.upper != null){

            y = m_CanvasHeight - currentNode.upper.position.y;
            m_Context.lineTo(currentNode.upper.position.x , y);
        }

        y = m_CanvasHeight - currentNode.position.y;

        m_Context.moveTo(currentNode.position.x, y);

        // if(currentNode.lower != null){
        //     y = m_CanvasHeight - currentNode.lower.position.y;
        //     m_Context.lineTo(currentNode.lower.position.x ,y);
        // }

        // y = m_CanvasHeight - currentNode.position.y;

        // m_Context.moveTo(currentNode.position.x, y);

        if(currentNode.right != null){
            y = m_CanvasHeight - currentNode.right.position.y;
            m_Context.lineTo(currentNode.right.position.x , y);
        }

        y = m_CanvasHeight - currentNode.position.y;

        // m_Context.moveTo(currentNode.position.x, y);

        // if(currentNode.left != null){
        //     y = m_CanvasHeight - currentNode.left.position.y;
        //     m_Context.lineTo(currentNode.left.position.x ,y);
        // }

    }
    

    colorIndex++;
    if(colorIndex >= colors.length){
        colorIndex=0;
    }

    m_Context.lineWidth = 0.5;
    m_Context.strokeStyle = colors[colorIndex];

    m_Context.stroke();

}

function paintFloor(){

    m_Context.beginPath();
    m_Context.lineWidth = 2;

    var y;
    var currentNode;
    for(var index = 0; index < m_NodeFloorList.length ; index ++){

        currentNode = m_NodeFloorList[index];

        y = m_CanvasHeight - currentNode.position.y;
        m_Context.moveTo(currentNode.position.x, y);

        if(currentNode.right != null){
            y = m_CanvasHeight - currentNode.right.position.y;
            m_Context.lineTo(currentNode.right.position.x ,y);
        }

        y = m_CanvasHeight - currentNode.position.y;
        m_Context.moveTo(currentNode.position.x, y);

        if(currentNode.left != null){
            y = m_CanvasHeight - currentNode.left.position.y;  
            m_Context.lineTo(currentNode.left.position.x , y);
        }

    }
    
    m_Context.strokeStyle = "black";

    m_Context.stroke();

}

function paintBricks(){

    m_Context.beginPath();
    m_Context.lineWidth = 0.5; // por debajo de 1 solo baja la intensidad
    var currentNode;
    var currentBrick;
    var y;
    for(var index = 0; index < m_GlobalBrickList.length ; index ++){

        currentBrick = m_GlobalBrickList[index];

        // for (var i = 0; i < 4; i++) {

            // switch (i) {
            //     case 0:
            //         currentNode = currentBrick.leftDownNode;
            //         break;
            //     case 1:
            //         currentNode = currentBrick.leftUpNode;
            //         break;
            
            //     case 2:
            //         currentNode = currentBrick.rightDownNode;
            //         break;

            //     case 3:
            //         currentNode = currentBrick.rightUpNode;
            //         break;
                
            //     default:
            //         break;
            // }
                    
            currentNode = currentBrick.leftDownNode;
            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x,y);

            if(currentNode.right != null){
                y = m_CanvasHeight - currentNode.right.position.y;
                m_Context.lineTo(currentNode.right.position.x ,y);
            }

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x, y);

            if(currentNode.upper != null){
                y = m_CanvasHeight - currentNode.upper.position.y;
                m_Context.lineTo(currentNode.upper.position.x ,y);
            }

            currentNode = currentBrick.rightUpNode;

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x,y);

            if(currentNode.left != null){
                y = m_CanvasHeight - currentNode.left.position.y;
                m_Context.lineTo(currentNode.left.position.x ,y);
            }

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x, y);

            if(currentNode.lower != null){
                y = m_CanvasHeight - currentNode.lower.position.y;
                m_Context.lineTo(currentNode.lower.position.x ,y);
            }
            
        //}

    }
    
    m_Context.strokeStyle = "green";

    m_Context.stroke();

}
    
function fillBricks(){

    m_Context.beginPath();
    m_Context.lineWidth = 0.5; // por debajo de 1 solo baja la intensidad
    var currentNode;
    var currentBrick;
    var y;
    var width;
    var height;
    for(let index = 0; index < m_GlobalBrickList.length ; index ++){

        currentBrick = m_GlobalBrickList[index];

        width = currentBrick.rightDownNode.position.x - currentBrick.leftDownNode.position.x;

        height = currentBrick.rightUpNode.position.y - currentBrick.rightDownNode.position.y;

        //m_Context.rect(currentBrick.leftUpNode.position.x + 2, m_CanvasHeight - currentBrick.leftUpNode.position.y + 2 , width - 4, height - 4);
        m_Context.rect(currentBrick.leftUpNode.position.x, m_CanvasHeight - currentBrick.leftUpNode.position.y, width, height);
        

    }
    
    m_Context.fillStyle = "white";

    m_Context.fill();
}


function paintBrickRow(temporalBrickList){

    m_Context.beginPath();
    m_Context.lineWidth = 0.8; // por debajo de 1 solo baja la intensidad
    var currentNode;
    var currentBrick;
    var y;
    for(var index = 0; index < temporalBrickList.length ; index ++){

        currentBrick = temporalBrickList[index];

                    
            currentNode = currentBrick.leftDownNode;
            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x,y);

            if(currentNode.right != null){
                y = m_CanvasHeight - currentNode.right.position.y;
                m_Context.lineTo(currentNode.right.position.x ,y);
            }

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x, y);

            if(currentNode.upper != null){
                y = m_CanvasHeight - currentNode.upper.position.y;
                m_Context.lineTo(currentNode.upper.position.x ,y);
            }

            currentNode = currentBrick.rightUpNode;

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x,y);

            if(currentNode.left != null){
                y = m_CanvasHeight - currentNode.left.position.y;
                m_Context.lineTo(currentNode.left.position.x ,y);
            }

            y = m_CanvasHeight - currentNode.position.y;
            m_Context.moveTo(currentNode.position.x, y);

            if(currentNode.lower != null){
                y = m_CanvasHeight - currentNode.lower.position.y;
                m_Context.lineTo(currentNode.lower.position.x ,y);
            }
            

    }

    colorIndex++;
    if(colorIndex >= colors.length){
        colorIndex=0;
    }

    m_Context.strokeStyle = colors[colorIndex];

    m_Context.stroke();

}


function paintEdges(){

    //m_Context.beginPath();
    m_Context.lineWidth = 2; // por debajo de 1 solo baja la intensidad

    var currentEdge;
    var currentStartNode;
    var currentEndNode;

    var y;

    for(var index = 0; index < m_GlobalEdgeList.length ; index ++){


        m_Context.beginPath();    
        currentEdge = m_GlobalEdgeList[index];
        currentStartNode = currentEdge.startNode;
        currentEndNode = currentEdge.endNode;

        y = m_CanvasHeight - currentStartNode.position.y;
        m_Context.moveTo(currentStartNode.position.x, y);

        y = m_CanvasHeight - currentEndNode.position.y;
        m_Context.lineTo(currentEndNode.position.x ,y);


        colorIndex++;
        if(colorIndex >= colors.length){
            colorIndex=0;
        }
       
        m_Context.strokeStyle = colors[colorIndex];
    
        m_Context.stroke();

    }
}


function debugPaintEdges(){

    //m_Context.beginPath();
    m_Context.lineWidth = 2; // por debajo de 1 solo baja la intensidad
    m_Context.strokeStyle = "black";

    var currentEdge;
    var currentStartNode;
    var currentEndNode;

    var y;

    for(var index = 0; index < m_GlobalEdgeList.length ; index ++){

        currentEdge = m_GlobalEdgeList[index];

        if(currentEdge.rightSide && currentEdge.leftSide){ // pintem els que si tenen true

            m_Context.beginPath();    
            currentEdge = m_GlobalEdgeList[index];
            currentStartNode = currentEdge.startNode;
            currentEndNode = currentEdge.endNode;

            y = m_CanvasHeight - currentStartNode.position.y;
            m_Context.moveTo(currentStartNode.position.x, y);

            y = m_CanvasHeight - currentEndNode.position.y;
            m_Context.lineTo(currentEndNode.position.x ,y);


        
            m_Context.stroke();
        }
    }
}

function pointPaintEdges(){

    //dibuixar perpendicular segons si te rightSide o left
    //m_Context.beginPath();
    m_Context.lineWidth = 2; // por debajo de 1 solo baja la intensidad
    m_Context.strokeStyle = "black";

    var currentEdge;
    var currentStartNode;
    var currentEndNode;

    var y;

    for(var index = 0; index < m_GlobalEdgeList.length ; index ++){

        currentEdge = m_GlobalEdgeList[index];

        if(currentEdge.rightSide && currentEdge.leftSide){ // pintem els que si tenen true

            m_Context.beginPath();    
            currentEdge = m_GlobalEdgeList[index];
            currentStartNode = currentEdge.startNode;
            currentEndNode = currentEdge.endNode;

            y = m_CanvasHeight - currentStartNode.position.y;
            m_Context.moveTo(currentStartNode.position.x, y);

            y = m_CanvasHeight - currentEndNode.position.y;
            m_Context.lineTo(currentEndNode.position.x ,y);


        
            m_Context.stroke();
        }
    }
}

function paintDebugSides(){ // Paints a line for the side or sides with a brick

    m_Context.lineWidth = 2; 
    m_Context.strokeStyle = "black";

    var currentEdge;
    var currentStartNode;
    var currentEndNode;

    var y;

    for(var index = 0; index < m_GlobalEdgeList.length ; index ++){

        currentEdge = m_GlobalEdgeList[index];

        var horizontal = false;
        var vertical = false;

        var middle = 0;

        if(currentEdge.startNode.position.x == currentEdge.endNode.position.x){
            vertical = true;
        }
        else{
            horizontal = true;
        }

        if(horizontal){
            middle = (currentEdge.startNode.position.x + currentEdge.endNode.position.x)/2;    
        }
        else{
            middle = (currentEdge.startNode.position.y + currentEdge.endNode.position.y)/2;
        }

        if(currentEdge.rightSide){ // pintem els que si tenen true

            m_Context.beginPath();

            if(horizontal){
                y = m_CanvasHeight - currentEdge.startNode.position.y;
                m_Context.moveTo(middle , y);
                m_Context.lineTo(middle , (y + 10) );
                //console.log("PAINTED: " + middle + ", " + (y + 10));
            }
            else{// vertical
                
                m_Context.moveTo(currentEdge.startNode.position.x, middle);
                m_Context.lineTo((currentEdge.startNode.position.x + 10), middle);

            }
        
            m_Context.stroke();
        }
    }


}

