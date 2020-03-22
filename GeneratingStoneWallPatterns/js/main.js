

(function () {


  
  try {

    makeWallJointPattern();

  }
  catch(error) {
    console.error(error);
  }

  //FUNCTIONS



  //LISTENERS

  m_BrickWidthInput.addEventListener('change', function() {

    m_AverageBrickWidth = parseInt(m_BrickWidthInput.value);

    if(m_AverageBrickWidth < 10){
      m_AverageBrickWidth = 10;
      m_BrickWidthInput.value = m_AverageBrickWidth;
    }
    
    makeWallJointPattern();
  })

  m_BrickHeightInput.addEventListener('change', function() {

    m_AverageBrickHeight = parseInt(m_BrickHeightInput.value);

    if(m_AverageBrickHeight < 10){
      m_AverageBrickHeight = 10;
      m_BrickHeightInput.value = m_AverageBrickHeight;
    }

    makeWallJointPattern();
  })

  m_NoiseInput.addEventListener('change', function() {

    m_Noise = parseInt(m_NoiseInput.value)/100;

    if(m_Noise > 100){
      m_Noise = 100;
      m_NoiseInput.value = m_Noise;
    }

    
    makeWallJointPattern();
  })

  m_LeftOffsetInput.addEventListener('change', function() {

    m_LeftOffset = parseInt(m_LeftOffsetInput.value);

    if(m_LeftOffset >= m_CanvasWidth){
      m_LeftOffset = m_CanvasWidth - 1;
      m_LeftOffsetInput.value = m_LeftOffset;
    }

    makeWallJointPattern();
  })

  m_RightOffsetInput.addEventListener('change', function() {

    m_RightOffset = parseInt(m_RightOffsetInput.value);

    if(m_RightOffset >= m_CanvasWidth){
      m_RightOffset = m_CanvasWidth - 1;
      m_RightOffsetInput.value = m_RightOffset;
    }

    makeWallJointPattern();
  })

  m_RowsInput.addEventListener('change', function() {

    m_Rows = parseInt(m_RowsInput.value);

    makeWallJointPattern();
  })


  m_DisplaceButton.addEventListener("click", function() {
    //makeWallJointPattern();
    displaceNodes(2);
    //updateSides();

    //limpiamos canvas
    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "gray";//"#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    paintWall();

    // paintEdges();
    // paintNodes();

    //debugPaintEdges();
  })

  m_DebugButton.addEventListener("click", function() {

    updateSides();

    //limpiamos canvas
    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "gray";//"#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    //paintWall();

    paintEdges();
    paintNodes();
    paintDebugSides();

    //debugPaintEdges();
  })


}());
