

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
    
    makeWallJointPattern();
  })

  m_BrickHeightInput.addEventListener('change', function() {

    m_AverageBrickHeight = parseInt(m_BrickHeightInput.value);

    makeWallJointPattern();
  })

  m_NoiseInput.addEventListener('change', function() {

    m_Noise = parseInt(m_NoiseInput.value)/100;
    
    makeWallJointPattern();
  })


  m_OkButton.addEventListener("click", function() {
    makeWallJointPattern();
  })


}());
