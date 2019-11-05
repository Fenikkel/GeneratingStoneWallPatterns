

(function () {

  
  try {

    processWall();

  }
  catch(error) {
    console.error(error);
  }

  //FUNCTIONS

  function processWall(){

    m_Context.clearRect(0, 0, m_Canvas.width, m_Canvas.height);

    m_GlobalNodeList.length = 0; //clear the array
    m_NodeFloorList.length = 0;
    
    firstRow(0, m_CanvasWidth, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
      
    paintWall();
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
