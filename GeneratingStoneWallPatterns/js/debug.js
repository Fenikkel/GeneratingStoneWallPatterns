function debugTetris(){
    //limpiamos canvas
    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    // clear the array
    m_GlobalNodeList.length = 0; //clear the array
    m_NodeFloorList.length = 0;
    m_GlobalEdgeList.length = 0;
    m_GlobalBrickList.length = 0;

    var position = new Position(10, 0);
    startFloorNode = new WallNode(position, null, null, null, null);

    var position = new Position(m_CanvasWidth-10, 0);
    endFloorNode = new WallNode(position, null, null, null, null);

    //updateHorizontalNeighbors(startFloorNode, endFloorNode);
    createEdge(startFloorNode, endFloorNode);
    m_NodeFloorList.push(startFloorNode, endFloorNode);

    //paintFloor(); //paint the first floor


    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    // console.log("Node floor list: " + m_NodeFloorList);
    // console.log("Global node list: "+ m_GlobalNodeList);
    console.log("Global brick list: "+ m_GlobalBrickList);
    console.log("Global edge list: "+ m_GlobalEdgeList);

    paintEdges();




}