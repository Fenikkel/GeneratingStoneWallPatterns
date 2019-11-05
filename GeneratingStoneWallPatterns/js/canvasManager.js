function paintWall(){

    var currentNode;
    for(var index = 0; index < m_GlobalNodeList.length ; index ++){

        currentNode = m_GlobalNodeList[index];
        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.upper != null){
            m_Context.lineTo(currentNode.upper.position.x ,currentNode.upper.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.lower != null){
            m_Context.lineTo(currentNode.lower.position.x ,currentNode.lower.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.right != null){
            m_Context.lineTo(currentNode.right.position.x ,currentNode.right.position.y);
        }

        m_Context.moveTo(currentNode.position.x,currentNode.position.y);

        if(currentNode.left != null){
            m_Context.lineTo(currentNode.left.position.x ,currentNode.left.position.y);
        }

    }
    m_Context.strokeStyle = "red";
    m_Context.stroke();

}