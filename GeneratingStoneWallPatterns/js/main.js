

(function () {

  
  try {

    processWall();

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

  }
  catch(error) {
    console.error(error);
  }

  //FUNCTIONS

  function processWall(){

    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);

    m_GlobalNodeList.length = 0; //clear the array
    m_NodeFloorList.length = 0;
    
    makeWallJointPattern();
      
    paintWall();

    paintFloor();
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
