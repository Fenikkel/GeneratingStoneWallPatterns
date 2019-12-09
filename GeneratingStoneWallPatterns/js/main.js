

(function () {


  
  try {


    
    processWall();

    // var bolea = isPointWithinTheLine(9, 1, 4, 1, 6, 1);
    // console.log("Resultat: " + bolea);

    /*
    var position = new Position(5, 1);
    var node = new WallNode(position, null, null, null, null);

    var position2 = new Position(10, 1);

    var startNode = new WallNode(position2, null, null, null, null);

    var position3 = new Position(1, 1);

    var endNode = new WallNode(position3, null, null, null, null);

    var edge = new Edge(startNode, endNode, null, null);

    var bolea = isNodeWithinTheEdge(node, edge);
    console.log("Resultat: " + bolea);

    */


    /*
    //Debug global list
    console.log("Total number of nodes = " + m_GlobalNodeList.length);
    var edges = 0;
    for(var i =0; i< m_GlobalNodeList.length ; i++){

      if(m_GlobalNodeList[i].lower != null){
        edges++;
      }
      if(m_GlobalNodeList[i].upper != null){
        edges++;
      }
      if(m_GlobalNodeList[i].right != null){
        edges++;
      }
      if(m_GlobalNodeList[i].left != null){
        edges++;
      }

    }

    console.log("Total number of edges = " + edges);

    //Debug floorlist

    console.log("Total number of floor nodes = " + m_NodeFloorList.length);
    var floorEdges = 0;
    for(var i =0; i< m_NodeFloorList.length ; i++){

      if(m_NodeFloorList[i].lower != null){
        floorEdges++;
      }
      if(m_NodeFloorList[i].upper != null){
        floorEdges++;
      }
      if(m_NodeFloorList[i].right != null){
        floorEdges++;
      }
      if(m_NodeFloorList[i].left != null){
        floorEdges++;
      }

    }

    console.log("Total number of floor edges = " + floorEdges);
  */

  }
  catch(error) {
    console.error(error);
  }

  //FUNCTIONS

  function processWall(){

    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    unifyNodesDemostration();
    //createJoint();
    console.log(m_GlobalEdgeList);
    //paintWall();
    paintEdges();
    //makeWallJointPattern();
    

    

    //paintEdges();
      
    //paintWall();

    // paintFloor();
    // paintBricks();
    // paintFloor();
  }

  //LISTENERS

  m_BrickWidthInput.addEventListener('change', function() {

    m_AverageBrickWidth = parseInt(m_BrickWidthInput.value);

    processWall();
    

  })

  m_BrickHeightInput.addEventListener('change', function() {

    m_AverageBrickHeight = parseInt(m_BrickHeightInput.value);

    processWall();

  })

  m_NoiseInput.addEventListener('change', function() {

    m_Noise = parseInt(m_NoiseInput.value)/100;

    processWall();

  })


  m_OkButton.addEventListener("click", function() {

  })


}());
