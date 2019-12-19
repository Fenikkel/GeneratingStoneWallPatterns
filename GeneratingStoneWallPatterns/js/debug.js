function debugTetris(){
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
    var startFloorNode = createNode(10, 0);
    var endFloorNode = createNode(m_CanvasWidth-10, 0);
    m_NodeFloorList.push(startFloorNode,endFloorNode);

    //create the edge of the first floor
    createEdge(startFloorNode, endFloorNode);

    //paintFloor(); //paint the first floor

    //firstRowEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    
    // tetrisBruteForceEdges(10, m_CanvasWidth-10, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);

    // console.log("Node floor list: " + m_NodeFloorList);
    // console.log("Global node list: "+ m_GlobalNodeList);
    // console.log("Global brick list: "+ m_GlobalBrickList);
    //console.log("Global edge list: "+ m_GlobalEdgeList);
    console.log("Global node list LENGTH: "+ m_GlobalNodeList.length);
    console.log("Global brick list LENGTH: "+ m_GlobalBrickList.length);
    console.log("Global edge list LENGTH: "+ m_GlobalEdgeList.length);

    paintWall();
    
    //paintEdges();
    //paintNodes();




}