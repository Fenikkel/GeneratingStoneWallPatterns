

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


  m_OkButton.addEventListener("click", function() {
    //makeWallJointPattern();
    displaceNodes(2);

    //limpiamos canvas
    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);
    m_Context.fillStyle = "gray";//"#f5f0f0";
    m_Context.fillRect(0, 0, m_Canvas.width, m_Canvas.height);

    //paintWall();

    paintEdges();
    paintNodes();
  })


}());
