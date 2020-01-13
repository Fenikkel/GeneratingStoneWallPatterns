//DOM
var m_Canvas = document.getElementById("wallCanvas");
var m_Context = m_Canvas.getContext("2d");

var m_RowsInput = document.getElementById("rows");

var m_BrickWidthInput = document.getElementById("brickWidth");
var m_BrickHeightInput = document.getElementById("brickHeight");

var m_LeftOffsetInput = document.getElementById("leftOffset");
var m_RightOffsetInput = document.getElementById("rightOffset");

var m_NoiseInput = document.getElementById("iNoisePc");

var m_DisplaceButton = document.getElementById("displaceBtn");
var m_DebugButton = document.getElementById("debugBtn");

//Global variables
var m_GlobalNodeList = []; //Orden insercion ladrillo. 1: DonwLeft, 2: UpLeft, 3: UpRight, 4: DownRight
var m_NodeFloorList = []; //The two upper nodes of the brick. If two bricks have the same size and  are below, they are sharing a node in the m_GlobalNodeList, but here NOT. Because indexing. We advance in the m_NodeFloorList in pairs
var m_GlobalEdgeList = [];
var m_GlobalBrickList = []; 


var m_Index = 0;

var m_Rows = parseInt(m_RowsInput.value); //si no lo convertimos a numero nos dara valores raros

var m_AverageBrickWidth = parseInt(m_BrickWidthInput.value); //si no lo convertimos a numero nos dara valores raros
var m_AverageBrickHeight = parseInt(m_BrickHeightInput.value); 

var m_LeftOffset = parseInt(m_LeftOffsetInput.value); //si no lo convertimos a numero nos dara valores raros
var m_RightOffset = parseInt(m_RightOffsetInput.value); 

var m_Noise = parseInt(m_NoiseInput.value)/100; //the noise for length (0 means without noise, 1 maximum noise)


var m_CanvasWidth = m_Canvas.width;
var m_CanvasHeight = m_Canvas.height;





