//https://www.mathworks.com/matlabcentral/answers/351581-points-lying-within-line

function isPointWithinTheLine(startLineX, startLineY, endLineX, endLineY, pointX, pointY){

    if( (pointX == startLineX && pointY == startLineY) || (pointX == endLineX && pointY == endLineY) ){ // if it's the same point...

        console.error("This point already exist in the edge list.");
        return true; //The point lies on the line

    }

    if(startLineY > endLineY){

        console.error("The edge isn't sorted by Y. The first node (start) must be the lower Y than the second node (end)");
        return false;
    }
    else if(startLineX > endLineX){

        console.error("The edge isn't sorted by X. The first node (start) must be the lower Y than the second node (end)");

        // We don't care if the X isn't sorted because the result is good. But that must be fixed for other functions.
    }

    if(endLineX != startLineX){

        // Line equation: y = m*x + b;
        var m =  Math.abs( endLineY - startLineY )  / Math.abs( endLineX - startLineX ); //lo de baix no pot ser 0
        var b = startLineY - m * startLineX;
        
        var calculatedY = m * pointX + b;

        console.log("CalculatedY: " + calculatedY);
        console.log("PointY: " + pointY);

        if (pointY == calculatedY){

            return true; //The point lies on the line
        }  
        else{
            return false;
        }
    }
    else{
        if(startLineX == pointX && endLineX == pointX && 
            startLineY < pointY && endLineY > pointY){

                return true; //The point lies on the line

        }
        else{
            return false;
        }
    }


}



function isNodeWithinTheEdge(node, edge){

    if( (node.position.x == edge.startNode.position.x && node.position.y == edge.startNode.position.y) || (node.position.x == edge.endNode.position.x  && node.position.y == edge.endNode.position.y) ){ // if it's the same point...

        console.error("This point already exist in the edge list.");
        return true; //The point lies on the line

    }

    if(edge.startNode.position.y > edge.endNode.position.y){

        console.error("The edge isn't sorted by Y. The first node (start) must be the lower Y than the second node (end)");
        return false;
    }
    else if(edge.startNode.position.x > edge.endNode.position.x){

        console.error("The edge isn't sorted by X. The first node (start) must be the lower Y than the second node (end)");

        // We don't care if the X isn't sorted because the result is good. But that must be fixed for other functions.
    }

    if(edge.endNode.position.x != edge.startNode.position.x){
        
        // Line equation: y = m*x + b;
        var m =  Math.abs( edge.endNode.position.y - edge.startNode.position.y )  / Math.abs( edge.endNode.position.x - edge.startNode.position.x ); //lo de baix no pot ser 0
        var b = edge.startNode.position.y - m * edge.startNode.position.x;
        
        var calculatedY = m * node.position.x + b;

        console.log("CalculatedY: " + calculatedY);
        console.log("PointY: " + node.position.y);

        if (node.position.y == calculatedY){

            return true; //The point lies on the line
        }  
        else{
            return false;
        }
    }
    else{
        if(edge.startNode.position.x == node.position.x && edge.endNode.position.x == node.position.x && 
            edge.startNode.position.y < node.position.y && edge.endNode.position.y > node.position.y){

                return true; //The point lies on the line

        }
        else{
            return false;
        }
    }


}