(function () {


  var m_Canvas = document.getElementById("wallCanvas");
  var m_Context = m_Canvas.getContext("2d");
  m_Context.moveTo(0,0);
  m_Context.lineTo(200,100);
  m_Context.stroke();
  console.log("HOLA CARACOLA");

  var posicion = {
    x: 10,
    y: 20
  }

  var m_Node = new WallNode(posicion, null, null, null, null);

  console.log(m_Node.position);
  console.log(m_Node.upper);
  console.log(m_Node.lower);
  console.log(m_Node.right);
  console.log(m_Node.left);


  var posicion2 = {
    x: 30,
    y: 40
  }


  var m_Node2 = new WallNode(posicion2, null, null, m_Node, null);

  console.log(m_Node2.position);
  console.log(m_Node2.upper);
  console.log(m_Node2.lower);
  console.log(m_Node2.right);
  console.log(m_Node2.left);




}());
