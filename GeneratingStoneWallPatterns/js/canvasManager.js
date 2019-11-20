var colors = ["blue", "red", "green", "magenta", "yellow"];
var colorIndex = 0;


function paintWall(){



    m_Context.beginPath();
    
    var currentNode;
    for(var index = 0; index < m_GlobalNodeList.length ; index ++){

        currentNode = m_GlobalNodeList[index];

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.upper != null){
            m_Context.lineTo(currentNode.upper.position.x ,currentNode.upper.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.lower != null){
            m_Context.lineTo(currentNode.lower.position.x ,currentNode.lower.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.right != null){
            m_Context.lineTo(currentNode.right.position.x ,currentNode.right.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.left != null){
            m_Context.lineTo(currentNode.left.position.x ,currentNode.left.position.y);
        }

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

    var currentNode;
    for(var index = 0; index < m_NodeFloorList.length ; index ++){

        currentNode = m_NodeFloorList[index];

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.right != null){
            m_Context.lineTo(currentNode.right.position.x ,currentNode.right.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.left != null){
            m_Context.lineTo(currentNode.left.position.x ,currentNode.left.position.y);
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
    for(var index = 0; index < m_GlobalBrickList.length ; index ++){

        currentBrick = m_GlobalBrickList[index];

        for (var i = 0; i < 4; i++) {

            switch (i) {
                case 0:
                    currentNode = currentBrick.leftDownNode;
                    break;
                case 1:
                    currentNode = currentBrick.leftUpNode;
                    break;
            
                case 2:
                    currentNode = currentBrick.rightDownNode;
                    break;

                case 3:
                    currentNode = currentBrick.rightUpNode;
                    break;
                
                default:
                    break;
            }
                    

            m_Context.moveTo(currentNode.position.x,currentNode.position.y);

            if(currentNode.right != null){
                m_Context.lineTo(currentNode.right.position.x ,currentNode.right.position.y);
            }

            m_Context.moveTo(currentNode.position.x,currentNode.position.y);

            if(currentNode.left != null){
                m_Context.lineTo(currentNode.left.position.x ,currentNode.left.position.y);
            }

            m_Context.moveTo(currentNode.position.x,currentNode.position.y);

            if(currentNode.upper != null){
                m_Context.lineTo(currentNode.upper.position.x ,currentNode.upper.position.y);
            }

            m_Context.moveTo(currentNode.position.x,currentNode.position.y);

            if(currentNode.lower != null){
                m_Context.lineTo(currentNode.lower.position.x ,currentNode.lower.position.y);
            }
            
        }

    }
    
    m_Context.strokeStyle = "green";

    m_Context.stroke();

}
