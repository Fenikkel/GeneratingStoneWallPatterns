(function () {

  
  try {
    /*
    console.log(m_AverageBrickWidth);
    console.log(m_AverageBrickHeight);
    console.log(m_Noise);
    console.log(m_Canvas);
    console.log(m_Context);
    */

    //console.log(m_GlobalNodeList);



    //var nodeFloor = firstRow(0, 512, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    firstRow(0, 512, m_AverageBrickWidth, m_AverageBrickHeight, m_Noise);
    
    paintWall();
    //console.log(nodeFloor);


  }
  catch(error) {
    console.error(error);
  }


}());
