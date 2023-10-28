//******************************************************************************************************
//
//  T23NG.js - javascript file to draw new style graphics based on Displayconfiguration file accessed 
//                     via LNwebmon server 
//
//						October 2023 
//  
//  Version 1.0
//******************************************************************************************************

// ----- globally scoped variables ----------------------------------	

/*----------------- section drawing details -------------------------*/

var canvastop 		= 100; //480;
var canvasleft      = 15;

var MC 				= document.getElementById("maincanvas");
var MCctx	 		= MC.getContext("2d");

var CanvasIwidth 					= 1200;
var CanvasIheight 					= 500;
var MouseOncanvasX 					= 0;
var MouseOncanvasY 					= 0;
var MousemovestartoncanvasX 		= 0;
var MousemovestartoncanvasY 		= 0;

var DrawpositionXcurrvalue			= 0;
var DrawpositionYcurrvalue			= 0;

var DrawpositionXstartvalue			= 0;
var DrawpositionYstartvalue			= 0;

var MouseStartclickdownOncanvasX 	= 0;
var MouseStartclickdownOncanvasY 	= 0;

var MousemovedeltaX 				= 0;
var MousemovedeltaY 				= 0;

var zoomdirection 					= 0;
var drawingscale 					= 1;

var canvascenterX					= 0;

var canvascenterY					= 0;

isClickdown							= false;


/*----------------- Refresh display timer details -------------------*/

var myloopVar = setInterval(myTimerPS, 2000);

/*----------------- track section details ---------------------------*/

const Tracksections 				= [];

var Tsectionspainted			    = 0;

/*----------------- section classes ---------------------------------*/

class Tsection {
	constructor(x,y,xposoffset,yposoffset,arcradius,objectID,startangle,endangle,Tsectiontype,Tcolor) 
	{
		this.Xpos 				= x;
		this.Ypos				= y;
		this.Xpos_start			= x;
		this.Ypos_start			= y;
		this.Xpos_offsetX		= xposoffset;
		this.Ypos_offsetY		= yposoffset;
		
		this.baseradius 		= arcradius;
		this.radius 			= arcradius;
		this.baselength 		= arcradius;
		this.length				= arcradius;
		
		this.objectIDnumber		= objectID;
		this.startangleradian	= startangle * Math.PI/180;
		this.endangleradian		= endangle * Math.PI/180;
		this.sectiontype		= Tsectiontype;
		this.color				= Tcolor;
		this.deltascaling 		= 1;
		
		this.pointangle			= startangle;
		
	//	console.log("\n95 startangle:" + startangle);
	//	console.log("\n96 endangle:" + endangle);
	//	console.log("\n97 section type:" + this.sectiontype);
	//	console.log("\n98 section color:" + this.color);
	}
	
updatecenterpoint(x,y)
	{
		this.Xpos 		= x;
		this.Ypos		= y;	
	}
	
updateradius(deltaradius)
	{
		this.radius 		= this.baseradius * deltaradius;
		this.deltascaling 	= deltaradius;
	}	
	
updatedrawingcolor(Tcolor)
	{
		this.color 		= Tcolor;	
	}
	
checksectionclick(ctx,x,y)
	{		
		if (this.sectiontype == 'C')
		{
			ctx.beginPath();   
			ctx.arc(this.Xpos + (this.Xpos_offsetX * this.deltascaling), this.Ypos + (this.Ypos_offsetY * this.deltascaling), this.radius, this.startangleradian, this.endangleradian, false);
			ctx.lineWidth = 5; 
	 
			if (this.color == 1)
			{
				ctx.strokeStyle = 'black';
			}	
	
			if (this.color == 2)
			{
				ctx.strokeStyle = 'red';
			}
	
			if (this.color == 3)
			{
				ctx.strokeStyle = 'green';
			}   
   
			ctx.stroke();	
		
			if (ctx.isPointInStroke(x,y))
			{
				return this.objectIDnumber;
			}
			else
			{
				return 0;
			}	
		}
		
		if (this.sectiontype == 'V')
		{
			ctx.beginPath(); 
			ctx.lineWidth = 5; 
	 
			if (this.color == 1)
				{
					ctx.strokeStyle = 'black';
				}	
	
			if (this.color == 2)
				{
					ctx.strokeStyle = 'red';
				}	
	
			if (this.color == 3)
				{
					ctx.strokeStyle = 'green';
				}   
			
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) - (this.length * this.deltascaling)); 
			ctx.stroke();	
			
			if (ctx.isPointInStroke(x,y))
			{
				return this.objectIDnumber;
			}
			else
			{
				return 0;
			}			
		}	
		
		if (this.sectiontype == 'H')    // Draw horizontal straight section 
		{
			ctx.beginPath(); 
			ctx.lineWidth = 5; 
	 
			if (this.color == 1)
				{
					ctx.strokeStyle = 'black';
				}	
	
			if (this.color == 2)
				{
					ctx.strokeStyle = 'red';
				}	
	
			if (this.color == 3)
				{
					ctx.strokeStyle = 'green';
				}   
			
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) + (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling)); 
			ctx.stroke();	
			
			if (ctx.isPointInStroke(x,y))
			{
				return this.objectIDnumber;
			}
			else
			{
				return 0;
			}			
		}				
		
		if (this.sectiontype == 'B')
		{	
			ctx.beginPath();
			ctx.arc(this.Xpos, this.Ypos, this.radius, 0, 2 * Math.PI, false);
      
			if (this.color == 1)
			{
				ctx.fillStyle = 'black';
			}	  
			if (this.color == 2)	  
			{
				ctx.fillStyle = 'red';
			}
			if (this.color == 3)	  
			{
				ctx.fillStyle = 'green';
			}
	  
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#003300';
			ctx.stroke();  		
			
			if (ctx.isPointInPath(x,y))
			{
				return this.objectIDnumber;
			}
			else
			{
				return 0;
			}			
		}
	}
	
drawcurve(ctx)
	{
	ctx.beginPath();   
    ctx.arc(this.Xpos + (this.Xpos_offsetX * this.deltascaling), this.Ypos + (this.Ypos_offsetY * this.deltascaling), this.radius, this.startangleradian, this.endangleradian, false);
	ctx.lineWidth = 5; 
	 
    if (this.color == 1)
    {
		ctx.strokeStyle = 'black';
	}	
	
	if (this.color == 2)
    {
		ctx.strokeStyle = 'green';
	}	
	
	if (this.color == 3)
    {
		ctx.strokeStyle = 'yellow';
	}   
	
	if (this.color == 4)
    {
		ctx.strokeStyle = 'red';
	}   
   
		ctx.stroke();		
	}
	
drawstraight(ctx)
	{
		if (this.sectiontype == '1')    // Draw vertical straight section 
		{
			ctx.beginPath(); 
			ctx.lineWidth = 5; 
	 
			if (this.color == 1)
				{
					ctx.strokeStyle = 'black';
				}	
	
			if (this.color == 2)
				{
					ctx.strokeStyle = 'green';
				}	
	
			if (this.color == 3)
				{
					ctx.strokeStyle = 'yellow';
				} 
				
			if (this.color == 4)
				{
					ctx.strokeStyle = 'red';
				}     
			
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) - (this.length * this.deltascaling)); 
			ctx.stroke();	
		}
		
		if (this.sectiontype == '2')    // Draw horizontal straight section 
		{
			ctx.beginPath(); 
			ctx.lineWidth = 5; 
	 
			if (this.color == 1)
				{
					ctx.strokeStyle = 'black';
				}	
	
			if (this.color == 2)
				{
					ctx.strokeStyle = 'red';
				}	
	
			if (this.color == 3)
				{
					ctx.strokeStyle = 'green';
				}   
			
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) + (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling)); 
			ctx.stroke();	
		}				
	}

drawdot(ctx)
    {
	  // draw a filled circle 	  
	  ctx.beginPath();
      ctx.arc(this.Xpos, this.Ypos, this.radius, 0, 2 * Math.PI, false);
      
      if (this.color == 1)
      {
		ctx.fillStyle = 'black';
	  }	  
	  if (this.color == 2)	  
      {
		ctx.fillStyle = 'red';
	  }
	  if (this.color == 3)	  
      {
		ctx.fillStyle = 'green';
	  }
	  
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#003300';
      ctx.stroke();  
	} 	

drawpoint(ctx)
	{
				
		ctx.beginPath(); 
		ctx.lineWidth = 5; 
	 
		if (this.color == 1)
		{
			ctx.strokeStyle = 'black';
		}	
	
		if (this.color == 2)
		{
			ctx.strokeStyle = 'red';
		}	
	
		if (this.color == 3)
		{
			ctx.strokeStyle = 'green';
		}   
		
		if (this.pointangle == 45)
		{
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) + (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) + (this.length * this.deltascaling)); 
			ctx.stroke();	
		}	
		
		if (this.pointangle == 135)
		{
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) - (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) + (this.length * this.deltascaling)); 
			ctx.stroke();	
		}
		
		if (this.pointangle == 225)
		{
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) - (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) - (this.length * this.deltascaling)); 
			ctx.stroke();	
		}
		
		if (this.pointangle == 315)
		{
			ctx.moveTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling));
			ctx.lineTo(this.Xpos + (this.Xpos_offsetX * this.deltascaling) + (this.length * this.deltascaling),this.Ypos + (this.Ypos_offsetY * this.deltascaling) - (this.length * this.deltascaling)); 
			ctx.stroke();	
		}			
	
	}


drawobject(ctx)
	{
	    if (this.sectiontype == 'B')
	    {
			this.drawdot(ctx);
		}
		if (this.sectiontype == 'X')
	    {
			this.drawdot(ctx);
		}
		if (this.sectiontype == '3')	// draw curve
	    {
			this.drawcurve(ctx);
		}
		
		if (this.sectiontype == '1')    // draw vertical straight
	    {
			this.drawstraight(ctx);
		}
		
		if (this.sectiontype == '2')    // draw horizontal straight
	    {
			this.drawstraight(ctx);
		}		
		
		if (this.sectiontype == 'P')    // draw point / switch
	    {
			this.drawpoint(ctx);
		}
	}
}

/* ------------------------------------------------------------------ */

function handleMouseDown(e)
{		
	MouseStartclickdownOncanvasX  = e.clientX - canvasleft;
	MouseStartclickdownOncanvasY  = e.clientY - canvastop;
	Checkclickallsections(MCctx,MouseStartclickdownOncanvasX,MouseStartclickdownOncanvasY)
	RepaintMC();
	//Refreshmetrics();
	isClickdown=true;
}

function handleMouseMove(e)
{	
	//console.log("\n77 Mouse moved");
	MouseOncanvasX  = e.clientX - canvasleft;
	MouseOncanvasY  = e.clientY - canvastop;
	
	MousemovedeltaX = MouseOncanvasX - MouseStartclickdownOncanvasX;
	MousemovedeltaY = MouseOncanvasY - MouseStartclickdownOncanvasY;	
	
	RepaintMC();
	//Refreshmetrics();
	
	if(isClickdown)
	{
		DrawpositionXcurrvalue = DrawpositionXstartvalue + MousemovedeltaX;
		DrawpositionYcurrvalue = DrawpositionYstartvalue + MousemovedeltaY;
	}
	
}


function handleMouseUp(e)
{	
	//console.log("\n83 Mouse Up");
	DrawpositionXstartvalue = DrawpositionXcurrvalue;
	DrawpositionYstartvalue = DrawpositionYcurrvalue;	
	
	RepaintMC();
	//Refreshmetrics();
	isClickdown=false;
}

function handleMouseOut(e)
{	
	//console.log("\n89 Mouse Out");
	isClickdown=false;
}


function mseclickcoords(event) 
{	
	console.log("\n84 Mouse clicked ");
	
}

// ----------------- wheel scrolling for Zoom in / out -----------------

function wheelscrolling(event)
{
	console.log("\n92 Mouse scrolled ");
	let wheel = event.wheelDelta/120;
	
	if (wheel > 0)
	{	
		zoomdirection = 1;
	}
	else
	{	
		zoomdirection = 0;
	}
	
	if (zoomdirection == 1)
	{
	  drawingscale = drawingscale * 1.05;
	}
  
	if (zoomdirection == 0)
	{
	  drawingscale = drawingscale * 0.95;
	}    
  
    if (drawingscale < 1)		// check to see drawing scale does not 
    {							// go below the value 1
		drawingscale = 1;		
	}		
	
	Updateallscaling(drawingscale);
	
	RepaintMC();
  
	//Refreshmetrics();
}

function RepaintMC()
{
	Updateallcenterpoints(DrawpositionXcurrvalue,DrawpositionYcurrvalue);
	
	maincanvas.width = maincanvas.width;	
	
	Drawallsections();	
}

function Displaysectiondetail(section) 
{
  //var sectionwindow = window.open("file:///home/brian/LNmonitor/ConfigandDatafiles/sectiondetail.html", "Config Info", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
  //sectionwindow.document.write("<p>This is 'section window'. I am 400px wide and 400px tall!</p>");
  //sectionwindow.document.getElementById("message1").innerHTML = "Message 1 received";
  
  //sectionwindow.testfunction();
}

function Refreshmetrics()
{	
	document.getElementById("MouselocationXvalue").innerHTML = "Mouse coord X:value " + MouseOncanvasX;
	document.getElementById("MouselocationYvalue").innerHTML = "Mouse coord Y:value " + MouseOncanvasY;
	
	document.getElementById("MouseclickdownlocationXvalue").innerHTML = "Mouse clickdown coord X:value " + MouseStartclickdownOncanvasX;
	document.getElementById("MouseclickdownlocationYvalue").innerHTML = "Mouse clickdown coord Y:value " + MouseStartclickdownOncanvasY; 
	
	document.getElementById("MousemovedeltaXvalue").innerHTML = "Mouse move delta v X clickdown value: " + MousemovedeltaX;
	document.getElementById("MousemovedeltaYvalue").innerHTML = "Mouse move delta v Y clickdown value: " + MousemovedeltaY; 
	
	document.getElementById("DrawpositionXvalue").innerHTML = "Draw position X value: " + DrawpositionXcurrvalue;
	document.getElementById("DrawpositionYvalue").innerHTML = "Draw position Y value: " + DrawpositionYcurrvalue; 	
	
	document.getElementById("DrawpositionXstartvalue").innerHTML = "Draw start position X value: " + DrawpositionXstartvalue;
	document.getElementById("DrawpositionYstartvalue").innerHTML = "Draw start position Y value: " + DrawpositionYstartvalue; 	
	
	document.getElementById("Zoom").innerHTML = "Scale " + drawingscale;	
}

function Checkclickallsections(MCctx,MouseStartclickdownOncanvasX,MouseStartclickdownOncanvasY)
{
	for (let sc = 1; sc < Tracksections.length; sc++)
	{
		let objID = Tracksections[sc].checksectionclick(MCctx,MouseStartclickdownOncanvasX,MouseStartclickdownOncanvasY);
		
		if (objID > 0)
		{
			console.log("\nClicked Object ID:" + objID);
			Displaysectiondetail(objID);
			return;
		}	
	}	
}

function Drawallsections()
{
	for (let sc = 0; sc < Tracksections.length; sc++)
	{
		Tracksections[sc].drawobject(MCctx);		
	}	
}

function Updateallcenterpoints(DrawpositionXcurrvalue,DrawpositionYcurrvalue)
{
	for (let sc = 0; sc < Tracksections.length; sc++)
	{
		Tracksections[sc].updatecenterpoint(DrawpositionXcurrvalue,DrawpositionYcurrvalue);		
	}	
}

function Updateallscaling(drawingscale)
{
	for (let sc = 0; sc < Tracksections.length; sc++)
	{
		Tracksections[sc].updateradius(drawingscale);		
	}	
}

// fetch display configuration data

/*------------------------------------ Functions ------------------------------------------------------------------ */

function myStopFunction() {
    clearInterval(myloopVar);
}

function myStartFunction() {
    myloopVar = setInterval(function(){ myTimerPS() }, 1000);  // 500
}

function myTimerPS() 
{   		
	Fetchdisplaydata();	
}

/* -------------------- Fetch config data from LNmonitor ------------ */
 
function Fetchdisplaydata() 	// fetch the static configuration data
{       
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var configdataread = this.responseText;  
        
      var configdatacompslength = 0;      
         
      configdatacomps = configdataread.split("+");
      configdatacompslength = configdataread.split("+").length;     
     
     if(document.getElementById("Srceflagcheck").checked) 
      { 	   
		document.getElementById("Sourceline").innerHTML = configdataread; 
	  }
	  else
	  {		
		document.getElementById("Sourceline").innerHTML = ""; 	     
	  }      
    
      document.getElementById("servertimestamp").innerHTML  = configdatacomps[0];   
      
      // for each section loaded, paint the section 
      
      var ddsc = 0;
      
      //SectionDisplayArray[0] = 0;      
      
      for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
		{   		
			Sectionpainter(configdatacomps[ddsc]);		
	    }   
	  };
     } 
 xhttp.open("GET", "displayconfig.dat", true);
 xhttp.send();   
    
};



// ---------------------- Initialization run through ----------------------------------

maincanvas.width 	= CanvasIwidth;
maincanvas.height 	= CanvasIheight;


$("#maincanvas").mousedown(function(e){handleMouseDown(e);});
$("#maincanvas").mousemove(function(e){handleMouseMove(e);});
$("#maincanvas").mouseup(function(e){handleMouseUp(e);});
$("#maincanvas").mouseout(function(e){handleMouseOut(e);});


maincanvas.addEventListener('dblclick', function(){ 

 
  console.log("\n94 double click");  
  //Focusitem(); 

});






function Sectionpainter(componentdata)
{
	sectionelements = componentdata.split(";");
	
	sectionelementscount = componentdata.split(";").length;	
	
	Tsectionspainted = Tsectionspainted	+ 1;
	
	/*
	 * sectionelement[0] 		= display section number
	 * sectionelement[1]		= X position offset 
	 * sectionelement[2]		= Y position offset
	 * sectionelement[7]		= radius or length
	 * sectionelement[5]		= arc - start angle in degrees
	 * sectionelement[6]		= arc - end angle in degrees
	 * sectionelement[4]		= section type (3 = arc, 1 = straight) 
	 * sectionelement[30]		= section display colour 
	 */
	console.log("\nPsection:" + sectionelements[3]);
	console.log("\nsectionelements [1]:" + sectionelements[1] + " sectionelements [2]:" + sectionelements[2] );
	console.log("\nsectiontype:" + sectionelements[4] + " startangle:" + sectionelements[5] + " " + sectionelements[6] );
	console.log("\nradius:" + sectionelements[7] + " startangle:" + sectionelements[5] + " " + sectionelements[6] );
	console.log("\ncolor:" + sectionelements[30]);
	Tracksections[Tsectionspainted] = new Tsection(canvascenterX,canvascenterY,sectionelements[1],sectionelements[2],sectionelements[7],sectionelements[0],sectionelements[5],sectionelements[6],sectionelements[4],sectionelements[30]);
	
	
	
	//Tracksections[2]	= new Tsection(canvascenterX,canvascenterY,0,0,50,3,90,180,'C',2);
}


/* ------------------------------------------------------------------ */

canvascenterX 		= CanvasIwidth/2;

canvascenterY 		= CanvasIheight/2;

//--- constructor(x,y,xposoffset,yposoffset,arcradius,objectID,startangle,endangle,Tsectiontype,Tcolor) ----
/*
Tracksections[0] 	= new Tsection(canvascenterX,canvascenterY,0,0,2,1,0,0,'X',1);

Tracksections[1]	= new Tsection(canvascenterX,canvascenterY,0,0,5,2,0,0,'B',3);

Tracksections[2]	= new Tsection(canvascenterX,canvascenterY,0,0,50,3,90,180,'C',2);

Tracksections[3]	= new Tsection(canvascenterX,canvascenterY,0,-50,50,4,180,270,'C',3);

Tracksections[4]	= new Tsection(canvascenterX,canvascenterY,-50,0,50,5,0,0,'V',2);

Tracksections[5]	= new Tsection(canvascenterX,canvascenterY,0,50,150,6,0,0,'H',1);

Tracksections[6]	= new Tsection(canvascenterX,canvascenterY,150,0,50,7,0,90,'C',3);

Tracksections[7]	= new Tsection(canvascenterX,canvascenterY,200,0,50,8,0,0,'V',1);

Tracksections[8]	= new Tsection(canvascenterX,canvascenterY,150,-50,50,9,270,0,'C',3);

Tracksections[9]	= new Tsection(canvascenterX,canvascenterY,0,-100,150,10,270,0,'H',1);

Tracksections[10]	= new Tsection(canvascenterX,canvascenterY,0,0,15,11,315,0,'P',1);

Tracksections[3]	= new Tsection(canvascenterX,canvascenterY,0,-50,50,4,180,270,'C',3);

Tracksections[4]	= new Tsection(canvascenterX,canvascenterY,-50,0,50,5,0,0,'V',2);

Tracksections[5]	= new Tsection(canvascenterX,canvascenterY,0,50,150,6,0,0,'H',1);

Tracksections[6]	= new Tsection(canvascenterX,canvascenterY,150,0,50,7,0,90,'C',3);

Tracksections[7]	= new Tsection(canvascenterX,canvascenterY,200,0,50,8,0,0,'V',1);

Tracksections[8]	= new Tsection(canvascenterX,canvascenterY,150,-50,50,9,270,0,'C',3);

Tracksections[9]	= new Tsection(canvascenterX,canvascenterY,0,-100,150,10,270,0,'H',1);

Tracksections[10]	= new Tsection(canvascenterX,canvascenterY,0,0,15,11,315,0,'P',1);
*/

Tracksections[Tsectionspainted] 	= new Tsection(canvascenterX,canvascenterY,0,0,2,1,0,0,'X',1);

//Tracksections[1]	= new Tsection(canvascenterX,canvascenterY,0,0,5,2,0,0,'B',3);

//Tracksections[2]	= new Tsection(canvascenterX,canvascenterY,0,0,50,3,90,180,'C',2);






MouseStartclickdownOncanvasX 	= CanvasIwidth/2;
MouseStartclickdownOncanvasY 	= CanvasIheight/2;

DrawpositionXcurrvalue = CanvasIwidth/2;
DrawpositionYcurrvalue = CanvasIheight/2;

DrawpositionXstartvalue = DrawpositionXcurrvalue;
DrawpositionYstartvalue = DrawpositionYcurrvalue;

Drawallsections();

console.log("\n340 Track sections count:" + Tracksections.length);


