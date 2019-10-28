(function () {


  var m_Canvas = document.getElementById("wallCanvas");
  var m_Context = m_Canvas.getContext("2d");
  m_Context.moveTo(0,0);
  m_Context.lineTo(200,100);
  m_Context.stroke();


}());
