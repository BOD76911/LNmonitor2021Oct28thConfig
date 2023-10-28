//******************************************************************************************************
//
//  T23.js - javascript file to draw graphics based on Displayconfiguration file accessed 
//                     via LNwebmon server 
//
//						September 2023
//  Converted to work with relative position references rather than absolute values to enable scaling
//
//******************************************************************************************************

//
/*
 * 
 * Sections are painted in function:   PaintSectionStraight
 * 
 * New function PaintSectionCodeInfo(parameters) introduced to paint all codes for each section. 
 * 
 * Code formats  
 * 
 * 		Tr: 0000    - Train code     shown when there is a train in the section - will be highlighted in RED if not connected to a loco
 * 		Lc: 0000 	- the loco code  shown when there is a locomotive in the section. Will show 0999 when unknown loco is detected
 *      Ps: 0000	- the Physical section number for a section. Will be linked to two or more logical sections
 * 
 * 
 * 	parameters passed 
 * 
 * 	ctx - the pointer to the canvas where the section is to be painted
 * 
 *  mlcptr - pointer to the Mainlayout canvas  - MLcanvas1
 * 
 * 	stx - X coordinate of section 
 * 	sty - Y coordinate of section  
 * 	width - section width in pixels
 *  height - section height in pixels
 *  textposition - text position relative to section  values  1 - 8
 * 	Lcode	- the loco code 
 *  Tcode1  - train code for Train 1 
 * 	Tcode2 	- train code for Train 2
 *  Tcode3  - train code for Train 3 
 *  Tcode4 	- train code for Train 4
 *  TrainID1conflag - flag to show if Train 1 is connected to a loco 
 * 	TrainID2conflag - flag to show if Train 2 is connected to a loco 
 *	TrainID3conflag - flag to show if Train 3 is connected to a loco 
 *  TrainID4conflag - flag to show if Train 4 is connected to a loco 
 *  Psection  - Physical section code
 * 
 * 
 *  Textposition codes
 * 
 * 	1 	directly above straight section mid-point
 * 	2	Directly below straight section mid-point or outside left hand arc 
 * 	3	Top left of right arc centre
 * 	4   Below right of right arc centre
 * 	5   Above right of right arc centre
 * 	6 	Below left of right arc centre
 *	7	Top left of left arc centre
 * 	8   Inside Right hand arc 
 * 	9   Outside Right hand arc centre
 * 	10 	Below left of left arc centre  
 * 
 * 
 *  Key functions
 * 
 * 	PaintSectionStraight 		- displays straight sections with details
 *  PaintSectionArc 			- displays curved sections
 * 	PaintSwitchpointsections 	- displays switches / points 
 * 	PaintSectionCodeInfo		- displays all numeric details for section  - Physical section details, Train & Loco codes 
 * 
 * 
 */
 
 // ============================= Global variables ==============================================
 
 var maincanvas;			 // main canvas - used for MC1 
 
 //var Layoutmaincanvas;		 // main layout canvas - used for ML1
 
 //var mlcptr; 				 // pointer for main layout canvas 
 
 var maincanvasheight 		= 550;
 var maincanvaswidth		= 1375;
 
 const SectionDisplayArray = [];
	
 const SectionDetectorArray = [];	
    
 const UncouplerArray = [];
 
 // ============================== Display variables ============================================
 
 
const fillgrey = 'rgb(230, 230, 230)';
const fillgreen = 'rgb(73, 235, 52)';
const filllightgreen = 'rgb(73, 235, 52)';
const fillyellow = 'rgb(235, 183, 52)';                   //'rgb(255, 255, 0)';
const fillred = 'rgb(255, 0, 0)';
const fillblue = 'rgb(52, 70, 235)';
const fillbeige = 'rgb(255,247,230)'; //rgb(255,247,230) =  'rgb(255,239,213)';
const lineblack = 'rgb(64, 64, 64)';

 const MCcanvasbackgroundcolour = 'rgb(255,247,230)';
 
 const ctxfontmaster = "bold 22px Arial"; 
 
 const sourcedatadisplayoffset = 600; 
 
 const MC1topinitnum = 310;		// Initial position of canvas MC1

 const sourcedisplaytopoffset = 610;
 
 // ============================= Functions =====================================================
 
 function drawGUI()
 {
	 // controls update of GUI
	 
	 maincanvas = document.getElementById('canvas1');		// initialize the main canvas object 	
	 
	 var cctx = maincanvas.getContext('2d');	
	 
	// document.getElementById("canvas1").style.width = maincanvaswidth + "px"; 
	 
	// document.getElementById("canvas1").style.height = maincanvasheight  + "px"; 
	 
	// document.getElementById("MC1").style.top = (MC1topinitnum + sourcedatadisplayoffset).toString() + "px"; 
	
	//cctx.fillStyle = fillblue;
	
	cctx.beginPath();    
	
	cctx.lineWidth=5;
	
	cctx.strokeStyle = "green";
	//straightlength = (length/10000) * maincanvaswidth * 1;
	
	//console.log("\n545 New straight stx:",stx," sty:",sty,"length:",length," strlength:",straightlength);
	//console.log("\n546 Dimensions width:",maincanvaswidth," height:",maincanvasheight);
	
	// Define start Point
	cctx.moveTo(50,100);
	
	// horizontal line 	
	cctx.lineTo(250,100);
	
	cctx.stroke();	
	 
	// Fetchstaticconfigdata(ctx);		// fetch the static configuration data		 
 }
 
 
function Fetchstaticconfigdata(ctx) 	// fetch the static configuration data
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
      
     // document.getElementById("MC1").style.top = MC1topinitnum.toString() + "px";
     
     if(document.getElementById("Srceflagcheck").checked) 
      { 
	    document.getElementById("MC1").style.top = (MC1topinitnum + sourcedatadisplayoffset).toString() + "px"; 	   
	    document.getElementById("Sourceline").style.top = sourcedisplaytopoffset;	    
		document.getElementById("Sourceline").innerHTML = configdataread; 
	  }
	  else
	  {
	//	document.getElementById("MC1").style.top = MC1topinitnum.toString() + "px";
	//	document.getElementById("Sourceline").innerHTML = ""; 	     
	  }      
    
      document.getElementById("servertimestamp").innerHTML  = configdatacomps[0];
      
      // for each section loaded, paint the section and store the static details on the array 
      
      var ddsc = 0;
      
      SectionDisplayArray[0] = 0;      
      
      for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
		{   		
			Sectionpainter(ctx,configdatacomps[ddsc]);
		//	Savesectiondetails(configdatacomps[ddsc]);		
	    }
	    
	    var Sectionloadcounter = Fetchnumberofsectionsloaded();
	    
	    //Buildetectorlookuptable(Sectionloadcounter);			// build lookup table of detectors physical locations	   
      
	  };
     }
 xhttp.open("GET", "displayconfig.dat", true);
 xhttp.send();   
    
};
 
function Savesectiondetails(compdataelements)
{
	// store section details on the Static data array 	
	
	Dsectionelements = compdataelements.split(";");
	
	Dsectionelementscount = compdataelements.split(";").length;
	
	//console.log("181 Number of section elements:" + Dsectionelementscount);
	
	var offset = 0;
	
	sectionnumber = Dsectionelements[0];	
	
	if (sectionnumber  > 1)
	{	
		for (slc = 1; slc < sectionnumber;slc++)
		{
			offset = offset + elementsinsectiondata;
		}
	}
	else
	{
		offset = 0;
	}
	
	//console.log("Elements in Section:" + elementsinsectiondata + " Dsectionelementcount:" + Dsectionelementscount);
	
	for (dsc = 1; dsc < elementsinsectiondata; dsc++)
	{
		if (dsc < Dsectionelementscount)
		{		
			SectionDisplayArray[dsc + offset] = Dsectionelements[dsc] * 1;	// multiply by 1 to convert to integers from strings	
		}
		else
		{
			SectionDisplayArray[dsc + offset] = 0;
		}		
	}	
	
	SectionDisplayArray[0] = SectionDisplayArray[0] + 1;	
}


// ====================================== Retired code ==========================================================================


var myloopVar = setInterval(myTimerPS, 1500);

//var Magdetectorstopselected = 0;
//var Devicecountertarget = 0;
//var detectorsize = 12;
var Counternunmax = 10;

var sectbordercolour = "#0000ff";

var elementsinsectiondata = 60;

var numberofdetectors 	= 16;

var elementsindetectordata = 4;  // detector, physical section, status, detector number within Psection 

var HFmaster;


/*------------------------------------ Functions ------------------------------------------------------------------ */

function myStopFunction() {
    clearInterval(myloopVar);
}

function myStartFunction() {
    myloopVar = setInterval(function(){ myTimerPS() }, 1500);  // 500
}

function ResizeFunction()
{
	console.log("\n259 Resize canvas");
	
	maincanvaswidth = maincanvaswidth * 1.1;
	
	document.getElementById("canvas1").style.width = 1000 + "px"; 
}

function testFunction()
{
	Displaydetectorlookuptable(); 
}

function myTimerPS() 
{   	
	ctx = maincanvas.getContext('2d');	 
	
	//ctx.fillStyle = fillbeige;	
	
	//ctx.fillRect = (0,0,maincanvaswidth,maincanvasheight);
	
	//Fetchstaticconfigdata(ctx);	
}

function Sectionpainter(ctx,componentdata)
{
	sectionelements = componentdata.split(";");
	
	sectionelementscount = componentdata.split(";").length;	
	
	ctx = maincanvas.getContext('2d');	 
	
	ctx.font = ctxfontmaster; //"20px Arial";
	
	//console.log("\n945 P:",sectionelements[3],"X:",sectionelements[1]," Y:",sectionelements[2]);
	
	// convert strings to numerics
	
	Dsection 				= sectionelements[0] * 1;
	//stx 					= (maincanvasheight/10000) * sectionelements[1] * 1;  // convert relative X position value to absolute locations on canvas 
	//sty 					= (maincanvaswidth/10000) * sectionelements[2] * 1;	// convert relative Y position value to absolute locations on canvas
	
	stx 					= (maincanvaswidth/10000) * sectionelements[1] * 1;  // convert relative X position value to absolute locations on canvas 
	sty 					= (maincanvasheight/10000) * sectionelements[2] * 1;	// convert relative Y position value to absolute locations on canvas
	
	
	PSection 				= sectionelements[3] * 1;
	Displaysectiontype		= sectionelements[4] * 1;
	Startangle				= sectionelements[5] * 1;
	Sweepangle				= sectionelements[6] * 1;
	
	Radius					= sectionelements[7] * 1;	
	CDirection 				= sectionelements[8] * 1;
	Sctheight 				= sectionelements[9] * 1;
	Pointtype				= sectionelements[10] * 1;
	
	Sctwidth 				= sectionelements[11] * 1;
	PRotateangle			= sectionelements[12] * 1;
	Pointnumber				= sectionelements[13] * 1;
	
	Mdectnum1				= sectionelements[15] * 1;
	
	Logicalsection1			= sectionelements[16] * 1;
	
	Logicalsection2			= sectionelements[17] * 1;
	
	Logicalsection3			= sectionelements[18] * 1;
	
	Logicalsection4			= sectionelements[19] * 1;
	
	
	Logicalsection1Tcode	= sectionelements[20] * 1;
	Logicalsection1dir		= sectionelements[21] * 1;
	Logicalsection2Tcode	= sectionelements[22] * 1;
	Logicalsection2dir		= sectionelements[23] * 1;
	Logicalsection3Tcode	= sectionelements[24] * 1;
	Logicalsection3dir		= sectionelements[25] * 1;
	Logicalsection4Tcode	= sectionelements[26] * 1;
	Logicalsection4dir		= sectionelements[27] * 1;
	
	Tcode					= sectionelements[28] * 1;	// Tcode to be shown in the Displaysection 
	
	PtOCstatus				= sectionelements[29] * 1;	// point open closed status flag 
		
	Ncolour 				= sectionelements[30] * 1;	// Colour code for section 	
	
	Logicalsection5Tcode	= sectionelements[31] * 1;
	Logicalsection5dir		= sectionelements[32] * 1;
	Logicalsection6Tcode	= sectionelements[33] * 1;
	Logicalsection6dir		= sectionelements[34] * 1;
	Logicalsection7Tcode	= sectionelements[35] * 1;
	Logicalsection7dir		= sectionelements[36] * 1;
	Logicalsection8Tcode	= sectionelements[37] * 1;
	Logicalsection8dir		= sectionelements[38] * 1;
	
	Mdectnum2				= sectionelements[39] * 1;
	Mdectnum3				= sectionelements[40] * 1;
	Mdectnum4				= sectionelements[41] * 1;
	
	Uncoupler1				= sectionelements[42] * 1;
	Uncoupler2				= sectionelements[43] * 1;
	
	Textposition 			= sectionelements[44] * 1;
	
	TrainID1				= sectionelements[45] * 1;
	TrainID2				= sectionelements[46] * 1;
	TrainID3				= sectionelements[47] * 1;
	TrainID4				= sectionelements[48] * 1;
	
	TrainID2conflag			= sectionelements[49] * 1;		
	TrainID3conflag			= sectionelements[50] * 1;		
	TrainID4conflag			= sectionelements[51] * 1;		
	TrainID5conflag			= sectionelements[52] * 1;	
	
	Signalnumber			= sectionelements[53] * 1;
	Signalposition 			= sectionelements[54] * 1; 
	SignalpositionArcangle 	= sectionelements[55] * 1;
	
	Signaltype				= sectionelements[56] * 1; 
	Signal1numberofaspects 	= sectionelements[57] * 1; 	
	Signal2numberofaspects	= sectionelements[58] * 1; 	
	SignalPhysicalsection	= sectionelements[59] * 1; 	 // physical section covered by the signal
	
	Signalsparefield1		= sectionelements[60] * 1; 	
	Signalsparefield2		= sectionelements[61] * 1; 	
	Signalsparefield3		= sectionelements[62] * 1; 	
	Signalsparefield4		= sectionelements[63] * 1; 	
	
	Signal1value			= sectionelements[64] * 1;
	Signal2value			= sectionelements[65] * 1; 		
	
	//Mdetectcolor			= sectionelements[31] * 1;	// Colour code for section 	
	
	// colour decode 1 = grey, 2 = yellow, 3 = green , 4 = red	
	
	if (Ncolour == 1)
	{
		colour = fillblue;
	}
	
	if (Ncolour == 2)
	{
		colour = fillyellow;
	}
	
	if (Ncolour == 3)
	{
		colour = fillgreen;
	}
	
	if (Ncolour == 4)
	{
		colour = fillred;
	}	
	
	//console.log("\n394 Dsection:",Dsection," colourcode:", Ncolour);
	
	var highlightedflag = 0;	
	
	if ((Displaysectiontype == 1) || (Displaysectiontype == 2))  // test for hhorizontal straight section or vertical straight section
	{			
		PaintSectionStraight(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,Displaysectiontype,Startangle,Sweepangle,PRotateangle,Mdectnum1,
		Mdectnum2,Mdectnum3,Mdectnum4,Uncoupler1,Uncoupler2,Textposition,TrainID1,TrainID2,TrainID3,TrainID4,TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,Logicalsection1,Logicalsection2);
	}
	
	if ((Displaysectiontype == 3) || (Displaysectiontype == 6)) // test for regular curve or a rotated curve 
	{			
		PaintSectionArc(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Textposition,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2);
	}
	
	if ((Displaysectiontype > 3) && (Displaysectiontype < 8))  // test for regular point ladder
	{			
		PaintSwitchpointsection(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,
		Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Pointtype,PtOCstatus,Textposition,TrainID1,TrainID2,TrainID3,TrainID4,
		TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,Logicalsection1,Logicalsection2);
	}	
	
	if (Displaysectiontype == 10)   // test for new type of straight
	{
		PaintSectionStraightNG(Dsection,ctx,stx,sty,Sctwidth,colour);
	}
	
}
function Gethighlightflag(sectionnumber)
{
	var offset;
	
	if (sectionnumber  > 1)
	{	
		for (slc = 1; slc < sectionnumber;slc++)
		{
			offset = offset + elementsinsectiondata;
		}
	}
	else
	{
		offset = 0;
	}
	
	return SectionDisplayArray[31 + offset];
	
	
}

function Savehighlightedflag(sectionnumber, highlightedflag)
{
	// Highlighted flag is stored at element 31 in the section array
	
	var offset;
	
	if (sectionnumber  > 1)
	{	
		for (slc = 1; slc < sectionnumber;slc++)
		{
			offset = offset + elementsinsectiondata;
		}
	}
	else
	{
		offset = 0;
	}
	
	SectionDisplayArray[(sectionnumber * elementsinsectiondata)-(elementsinsectiondata - 31)] = highlightedflag * 1;
	
	//SectionDisplayArray[31 + offset] = highlightedflag * 1;
	
	//console.log("\n1072 Section:" + sectionnumber + " highlightflagupdated:" + SectionDisplayArray[(sectionnumber * elementsinsectiondata)-(elementsinsectiondata - 31)]);
	
}



function Fetchnumberofsectionsloaded()
{
	return SectionDisplayArray[0]; 
}

function Calcsectioncolour(code,ps)
{
	return fillgrey;
}

function GetMagdetectnum(section,detectornum)
{
	var elements = elementsinsectiondata;	
	
	if (detectornum == 1)
	{	
		return SectionDisplayArray[(section * elements)-(elements - 15)];  	
	}
	
	if (detectornum == 2)
	{	
		return SectionDisplayArray[(section * elements)-(elements - 39)];  	
	}
	
	if (detectornum == 3)
	{	
		return SectionDisplayArray[(section * elements)-(elements - 40)];  	
	}
	
	if (detectornum == 4)
	{	
		return SectionDisplayArray[(section * elements)-(elements - 41)];  	
	}
}

function GetPsectiondata(section)
{
	var elements = elementsinsectiondata;	 
	
	return SectionDisplayArray[(section * elements)-(elements - 3)];  
	
}

function PaintSectionStraightNG(Dsection,ctx,stx,sty,length,colour)
{
	//console.log("\n535 New straight stx:",stx," sty:",sty,"length:",length);
	
	ctx.fillStyle = colour;
	
	ctx.beginPath();    
	
	ctx.lineWidth=5;
	
	straightlength = (length/10000) * maincanvaswidth * 1;
	
	console.log("\n545 New straight stx:",stx," sty:",sty,"length:",length," strlength:",straightlength);
	console.log("\n546 Dimensions width:",maincanvaswidth," height:",maincanvasheight);
	
	// Define start Point
	ctx.moveTo(stx, sty);
	
	// horizontal line 	
	ctx.lineTo(stx + straightlength, sty);
	
	ctx.stroke();	
}



function PaintSectionStraight(Dsection,ctx,stx,sty,width,height,colour,Phynum,highlightflag,traincode,sectiontype,startangle,
		sweepangle,rotateangle,mdectnum1,mdectnum2,mdectnum3,mdectnum4,uncoupler1,uncoupler2,textposition,
		TrainID1,TrainID2,TrainID3,TrainID4,TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,Logicalsection1,Logicalsection2)   // sty,code,hf,PS,type)   // hf = highlight flag - to show section in blue if selected for update 
{	
        
    if (highlightflag == 1) // highlight section in blue if selected for display 
    {		   				
		ctx.fillStyle = fillblue;
	}    
	else
	{      
        ctx.fillStyle = colour;
	} 		 	
	
	
	// Clear any existing Loco and Train code details before painting the section.		
		
	if (highlightflag == 1)
	{
		ctx.strokeStyle = fillblue;   // highlight section in blue if selected for display 
	}          
	else
	{
		ctx.strokeStyle = colour; 
	}     
		
		ctx.beginPath();    
	
		ctx.lineWidth=5;
	
		// Define start Point
		ctx.moveTo(stx, sty);

		// Define end Point
		
		if (sectiontype == 1)		// horizontal straight section 
		{		
			ctx.lineTo(stx + width, sty);
		}
		
		if (sectiontype == 2)		// vertical straight section 
		{
			ctx.lineTo(stx,sty + width);
		}		
		
		ctx.stroke();
	
		ctx.font = ctxfontmaster;//"18px Arial black";
	
		ctx.fillStyle = "black";	
	
		sectheight = (sty * 1.0) + height * 0.7;	
		
		PaintSectionCodeInfo(Dsection,ctx,stx,sty,width,height,colour,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,1,0,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
		
		
		if (mdectnum1 > 0)
		{
		//	console.log("\n1154 - drawing detector details:" + mdectnum + " stx:" + stx + " sty:" + sty);
			mdectnumtxt = mdectnum1;
			Drawcircle(maincanvas,stx + (width * 0.34),sty + (height * 0.5),detectorsize,fillbeige,mdectnumtxt);			
		}
		
		if (mdectnum2 > 0)
		{
		//	console.log("\n1154 - drawing detector details:" + mdectnum + " stx:" + stx + " sty:" + sty);
			mdectnumtxt = mdectnum2;
			Drawcircle(maincanvas,stx + (width * 0.75),sty + (height * 0.5),detectorsize,fillbeige,mdectnumtxt);			
		}
		
		if (uncoupler1 > 0)
		{
			ctx.clearRect((stx * 1.0) +(width * 0.45), (sty * 1.0) + (height * 0.1),25,20);
			ctx.strokeRect((stx * 1.0) +(width * 0.45), (sty * 1.0) + (height * 0.1),25,20);
			ctx.fillText(uncoupler1, (0.50 * width) + (stx * 1.0), (sty * 1.0) + (height * 0.7)); 				
		}	
		
}


// ---------------- Section click processing -------------------------------------------------
/*

	
 */

function Getrotateangledetails(section)
{
	var elements = elementsinsectiondata;
	
	return {
		startangle:SectionDisplayArray[(section * elements)-(elements - 5)],
		sweepangle:SectionDisplayArray[(section * elements)-(elements - 6)],
		radius:SectionDisplayArray[(section * elements)-(elements - 7)],
		rotateangle:SectionDisplayArray[(section * elements)-(elements - 12)]
	};
	
}

function GetDisplayLSdetails(section)
{
	var elements = elementsinsectiondata;
	
	return {
        ls1: SectionDisplayArray[(section * elements)-(elements - 16)],
        ls2: SectionDisplayArray[(section * elements)-(elements - 17)],
		ls3: SectionDisplayArray[(section * elements)-(elements - 18)],
        ls4: SectionDisplayArray[(section * elements)-(elements - 19)]
    };
	
}

function GetsectionvariabledataTcodes(section)
{
	var elements = elementsinsectiondata;
	
	return {
        ls1: SectionDisplayArray[(section * elements)-(elements - 20)],
        ls2: SectionDisplayArray[(section * elements)-(elements - 22)],
		ls3: SectionDisplayArray[(section * elements)-(elements - 24)],
        ls4: SectionDisplayArray[(section * elements)-(elements - 26)]
    };	
}
/*

*/
function Getcurvedetails(section)
{
	var elements = elementsinsectiondata;
	
	return {
		startangle:SectionDisplayArray[(section * elements)-(elements - 5)],
		sweepangle:SectionDisplayArray[(section * elements)-(elements - 6)],
		radius:SectionDisplayArray[(section * elements)-(elements - 7)],
		rotateangle:SectionDisplayArray[(section * elements)-(elements - 12)]
	};	
}


function Getpointconfig(section)
{
	var elements = elementsinsectiondata;
	
	return {
		startangle: SectionDisplayArray[(section * elements)-(elements - 5)],
		sweepangle: SectionDisplayArray[(section * elements)-(elements - 6)],		
        height: SectionDisplayArray[(section * elements)-(elements - 9)],
        pointtype: SectionDisplayArray[(section * elements)-(elements - 10)],
       // pointcurvearcYcoord: SectionDisplayArray[(section * elements)-(elements - 12)],
        pointcurveradius: SectionDisplayArray[(section * elements)-(elements - 7)]
    };	
}
/*
*/

function Showsectiondetails(detailcanvas,headingtext,locX,locY)
{
	ctdh 			= detailcanvas.getContext('2d');
	ctdh.font 		= "20px Arial black";
	ctdh.fillStyle 	= "black";
	ctdh.fillText(headingtext,locX,locY - 20);		// x = height, y = across 
	Showdetailsbuttons(detailcanvas,locX,locY);	
}
/*

*/
function Updatedetails(detailcanvas)
{
	cte = detailcanvas.getContext('2d');
	cte.fillStyle = "red";
	cte.fillRect(100,100,25,25);

}
/*
*/
/*
   */
function Drawcircle(canvasin, stx, sty, radius, colour,textin)
{	
	var context = canvasin.getContext('2d');
  
	
	context.fillStyle = colour; //'#FF0000';
	context.fill();	
	
	if (textin != ' ')
	{
	context.font = "16px Arial black";	
	context.fillStyle = "black";		
	context.fillText(textin,stx-6, sty+5);
	}
}

function Magneticdetectorclickcheck(scx,scy,dotradius)
{
	// check to see if a magnetic detector has been clicked 
	
	var sectionfound = 0;
	var sectiontype = 0;
	var DispCoord;
	var sectiontype;
	var Magdetectnum = 0;
	
	var detectorX; 
	
	var detectorY;
	
	// Drawcircle(maincanvas,stx + (width * 0.75),sty + (height * 0.5),15,fillbeige,mdectnumtxt);	
	
	//console.log("\ndetector .... Mouse clicked X:" + scx + " Y:" + 	scy);	
		
		for (let i = 1; i < (GetDisplayconfigcount() + 1);i++)		// loop to initialize section display on the screen
		{			
			Magdetectnum = GetMagdetectnum(i,1);
			
			if (Magdetectnum > 0)
			{
				//console.log("\nMag detectclick check - detector found in section:" + i);
				RBdata = RBselectiondata(i);
				stx = RBdata.stx;
				sty = RBdata.sty;
				width = RBdata.width;
				height = RBdata.height;	
				
				detectorX = stx + (width * 0.75);
				detectorY = sty + (height * 0.5);		
				//console.log("\ndetector XY ... dect X:" + detectorX + "scx:" + 	scx + "dect Y:" + detectorY + "scy:" + 	scy);	
				
				// calculate distance of mouse click from detector centre XY 
				
				var xMdeltaSQ = (detectorX - scx) * (detectorX - scx);		
				
				//console.log("\ndetector XY ...  X:" + detectorX + " Y:" + 	detectorY);		
						
				var yMdeltaSQ = (detectorY - scy) * (detectorY - scy);
				
				var Magvectorlen = Math.sqrt(xMdeltaSQ + yMdeltaSQ);
				
				//console.log("\ndetector XY ...  X:" + detectorX + " Y:" + 	detectorY + " Magvectorlength:" + Magvectorlen);	
				
				if (Magvectorlen <= dotradius)
				{
					//console.log("Detector:" + Magdetectnum + " selected");
					
					mdectnumtxt = "D" + Magdetectnum;
					
					// redraw the selected detector
					
					//Drawcircle(maincanvas,stx + (width * 0.34),sty + (height * 0.5),detectorsize,fillgreen,mdectnumtxt);					
					
					return Magdetectnum;
				}			
			}
		}	
	
	return 0;	
}

function DisplayandGetcountervalue(countcanvas,cctx,ccty,DisplayorGet,mpx,mpy)
{
	ctcv 			= countcanvas.getContext('2d');
	ctcv.font 		= "20px Arial black";
	ctcv.fillStyle 	= "black";
	ctcv.fillText("Select counter value - default is 1 ",cctx,ccty);		// x = height, y = across 
	
	var xspacing = 30;	
	var ypositionofcounterchars = 15;
	var counternumheight = 27;
	var counternumwidth = 27;
	
	// setup counter display 	
	
	var xnumpos = cctx - xspacing;
	var numcolour;
	
	if (DisplayorGet == 1)
	{	
		for (ccn = 1; ccn < Counternunmax; ccn++)
		{	
			if (ccn == 1)
			{
			numcolour = filllightgreen;
			}
			else
			{
			numcolour = fillbeige;
			}
			Drawnumber(countcanvas, xnumpos + (ccn * xspacing),ccty + ypositionofcounterchars,counternumheight,counternumwidth,ccn,numcolour);
		}	
	}	
	if (DisplayorGet == 2)
	{
		var Clickvaluematched = 0;
		
		for(gcc = 1;gcc < Counternunmax;gcc++)
		{				
			
			Clickvaluematched = Getcounternumclick(countcanvas,mpx,mpy,xnumpos + (gcc * xspacing),ccty + ypositionofcounterchars,counternumheight,counternumwidth,gcc);	
			
			if (Clickvaluematched > 0)
			{
				Drawnumber(countcanvas, xnumpos + (gcc * xspacing),ccty + ypositionofcounterchars,counternumheight,counternumwidth,gcc,fillgreen);	
				
				if (gcc != 1)
				{
					Drawnumber(countcanvas, xnumpos + (1 * xspacing),ccty + ypositionofcounterchars,counternumheight,counternumwidth,1,fillbeige);	
				}				
				
				break;			
			}				
			
		}	
		
		return 	Clickvaluematched;		
	}	
}

function Drawnumber(numcanvas,ntx,nty,nwidth,nheight,numtext,colour)
{
	nnv = numcanvas.getContext('2d');
	
	nnv.fillStyle = colour;
	
	nnv.fillRect(ntx,nty,nwidth,nheight);	
	
	nnv.strokeStyle = "black";
	
	nnv.lineWidth   = 2;		
			
	nnv.strokeRect(ntx,nty,nwidth,nheight);	
	
	nnv.font 		= "20px Arial black";
	nnv.fillStyle 	= "black";
	nnv.fillText(numtext,ntx + 8,nty + 20);	
}
/*
 */
/*
*/
function ZeroPad3Number(nValue )
{
    if ( nValue < 10 )
    {
        return ( '00' + nValue.toString () );
    }
    else if ( nValue < 100 )
    {
        return ( '0' + nValue.toString () );
    }
    else if ( nValue < 1000 )
    {
        return (nValue.toString () );
    }
    else
    {
        return ( nValue );
    }
}

function Displaysectiondata(section)
{
	console.log("\nDisplay data for section:" + section);
	
	
}

function PaintSectionCodeInfo(Dsection,Sctctx,Sctstx,Sctsty,Sctwidth, Sctheight, Sctcolour, Scttextposition, SctLcode, SctTcode1, SctTcode2, SctTcode3, SctTcode4,
	SctTrainID1conflag, SctTrainID2conflag, ScTrainID3conflag, SctTrainID4conflag, SctPsection, SctType,
	Sctradius,Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
	Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2)
{
	// SctType - section type describes if straight, curve or switch point
	// Scttextposition - describes location of codes 
	
	/*
	 * Code formats  
	 
		Tr: 0000    - Train code     shown when there is a train in the section - will be highlighted in RED if not connected to a loco
		Lc: 0000 	- the loco code  shown when there is a locomotive in the section. Will show 0999 when unknown loco is detected
		Ps: 0000	- the Physical section number for a section. Will be linked to two or more logical sections
	 
	*/
	/*  Textposition codes
	* 
	* 	1 	directly above straight section mid-point
	* 	2	Directly below straight section mid-point 
	* 	3	Top left of right arc centre
	* 	4   Below right of right arc centre
	* 	5   Above right of right arc centre
	* 	6 	Below left of right arc centre
	*	7	Top left of left arc centre
	* 	8   Below right of left arc centre
	* 	9   Above right of left arc centre
	* 	10 	Below left of left arc centre  * */
	
	//console.log("\nPsectioninfo 2740: Dsection:",Dsection," Psection:",SctPsection," Type:",SctType);
	
	const PsctYoffset 				  = 0.0; // was 0.5
	const widthposoffset			  = 0.5;
	const LcYoffset 				  = 1.5;
	const Tr1offset 				  = 2.5;
	const PsOutsideArcRadiusfactor 	  = 1.1;
	const PsOutsideArcRadiusfactorLLH = 1.2;
	const PsOutsideArcRadiusfactorLRH = 0.85;
	const PsInsideArcRadiusfactor 	  = 0.35;
	const PsInsideArcRadiusfactorLLH  = 0.5;
	
	const BlankLc					  = "Lc:0000";
	
	var Degreeangle;
	var radiusfactor;
	
	var Messageflag = 0;
	var Messagestr	= "";
	
	Lococodestr = String(SctLcode).padStart(4, '0');
	//Lococodestr = "Lc:" + String(SctLcode).padStart(4, '0');
	Psectionstr = "Ps:" + String(SctPsection).padStart(4, '0');
	Sigcodestr  = "Sg:" + String(Signalnumber).padStart(4,0);
	Traincode1str = "T1:" + String(SctTcode1).padStart(4, '0');
	Traincode2str = "T2:" + String(SctTcode2).padStart(4, '0');
	Traincode3str = "T3:" + String(SctTcode3).padStart(4, '0');
	Traincode4str = "T4:" + String(SctTcode4).padStart(4, '0');	
	Dsectionstr   = "Dc:" + String(Dsection).padStart(4, '0');	
	LSsectionstr  = "Ls:" + String(Logicalsection1).padStart(4,'0') + "/" + String(Logicalsection2).padStart(4,'0');
	
	
	if (document.getElementById("PSdataflagcheck").checked)
	{
		Messagestr = Psectionstr;
		Messageflag = 1;
	}
	else
	{
		if (document.getElementById("Locodataflagcheck").checked)
		{
			Messagestr = Lococodestr;
			Messageflag = 1;
		}
		else
		{
			if ((document.getElementById("Signaldataflagcheck").checked) && (Signalnumber > 0))
			{
				Messagestr = Sigcodestr;
				Messageflag = 1;
			}
			else
			{
				if (document.getElementById("Dsectiondataflagcheck").checked)
				{
					Messagestr = Dsectionstr;
					Messageflag = 1;
				}
				else
				{
					if (document.getElementById("LSsectionsdataflagcheck").checked)
					{
						Messagestr = LSsectionstr;
						Messageflag = 1;
					}
					else
					{
						Messageflag = 0;
					}
				}
			}
		}
	}
	
	if (Messageflag == 0)
	{	
		if (SctLcode > 0)
		{
			Messagestr = Lococodestr;
			Messageflag = 1;
		}
		else
		{
			Messageflag = 0;
		}
	}
	
	
	// if ((Dsection == 29) || (Dsection == 4))
	// {
	// console.log("\nDsection:", Dsection," Messageflag value :",Messageflag);
	// console.log("\nSctType:", SctType," Messagestr:",Messagestr);	
	// console.log("\nScttextposition:",  Scttextposition, " Width:",Sctwidth);	 
	 
	//}
		//================ straight sections - Type 1 text position ABOVE ===================================
	
	if ((Scttextposition == 1) && ((SctType == 1) || (SctType == 4))) 		// straight section,no-rotation codes location above section) 
	{		
		if (Signalnumber > 0)
		{
			ShowSignals(Sctctx,Sctstx,Sctsty,25,40,SctPsection,Scttextposition,2,Sctwidth,SctType,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
			SignalPhysicalsection,Signal1value,Signal2value,0,0);
		}	
				
		if (Messageflag == 1)
		{
			ctx.fillStyle = 'rgb(255, 234, 0)';	
			ctx.fillRect((widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 0.97),50,50);
			ctx.fillStyle = 'black';
			ctx.fillText(Messagestr, (widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.01) - (Sctheight * PsctYoffset));
		}
		else
		{
			ctx.fillStyle = 'rgb(255,247,230)';	
			ctx.fillRect((widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 0.97),90,50);
			ctx.strokeStyle = Sctcolour;
			ctx.beginPath(); 
			ctx.lineWidth=5;
			ctx.moveTo(Sctstx, Sctsty); 
			ctx.lineTo(Sctstx + Sctwidth, Sctsty);
			ctx.stroke();			
		}		
	}					
	
		/*================ straight sections - Type 2 text position - BELOW ===================================
		
	if ((Scttextposition == 2) && ((SctType == 1) || (SctType == 4)))		// straight section,no-rotation codes location below section) 
		{
			if (Signalnumber > 0)
			{
				ShowSignals(Sctctx,Sctstx,Sctsty,25,40,SctPsection,Scttextposition,1,Sctwidth,SctType,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
				SignalPhysicalsection,Signal1value,Signal2value,0,0);		
			}
			
			if (Messageflag == 1)
			{
				ctx.fillStyle = 'rgb(255, 234, 0)';	
				ctx.fillRect(Sctstx - 40, Sctsty + (0.45 * Sctwidth),80,40); 
				ctx.fillStyle = 'black';
				ctx.fillText(Messagestr, Sctstx - 40, (Sctsty * 1.0) + (Sctwidth * 0.5)); 
			}
			else
			{
				ctx.fillStyle = 'rgb(255,247,230)';	
				ctx.strokeStyle = Sctcolour;
				ctx.fillRect(Sctstx - 40, Sctsty + (0.45 * Sctwidth),80,40); 
				ctx.beginPath(); 
				ctx.lineWidth=5;
				ctx.moveTo(Sctstx, Sctsty); 
				ctx.lineTo(Sctstx,Sctsty + Sctwidth);				
				ctx.stroke();				
			}
						
		}
		*/
		//================ Arc / Curve sections  Types 3 & 6 ===================================	
		// NOTE - the angle for text positioning is provided in the 'text position field' in the config file
	/*		
	if ((Scttextposition > 0) && (SctType == 6)) 	// arc section,codes displayed outside arc 
	{
		Degreeangle 	=  Scttextposition;
		
		//console.log("\n2829 Type 6 ARC for Psection:",SctPsection," Arc angle:",SignalpositionArcangle);
		
		if (Signalnumber > 0)
		{
		ShowSignals(Sctctx,Sctstx,Sctsty,25,40,SctPsection,Scttextposition,1,Sctwidth,SctType,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
			SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Sctradius);
		}		
	}
	*/
	/*
	if ((Scttextposition > 0 ) && (SctType == 3)) 	// arc section,codes displayed inside arc 
	{
		Degreeangle 	= Scttextposition; 
		
		//console.log("\n2829 Type 3 ARC for Psection:",SctPsection);
		
		if ((Degreeangle > 0) && (Degreeangle < 180))
		{
			radiusfactor    = 0.3;	
		}
		else
		{
			radiusfactor    = 0.6;
		}		
		
		if (Signalnumber > 0)
		{
			ShowSignals(Sctctx,Sctstx,Sctsty,25,40,SctPsection,Scttextposition,1,Sctwidth,SctType,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
			SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Sctradius);
		}		
	}	
	*/
	return Messageflag;
}

function ShowSignals(ctx,stx,sty,width,height,PScode,Pcodeposition,Sigposition,sectwidth,sectiontype,
	Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Sctradius)
{
	var size = 4;
	var offset = 2;
	var PosOffset = height * 1.5;
	var sstx = stx + 25;
	var ssty = sty + 45;
	
	var sig1currentcolour = Signal1value;
	var aspectcount = 3;
	
	var Degreeangle = SignalpositionArcangle;	
	
	if (sectiontype == 6)
	{	
		if ((Degreeangle > 0) && (Degreeangle < 180))
		{
			radiusfactor    = 1.3;	
		}
		else
		{
			radiusfactor    = 1.6;
		}
	}
	
	if (sectiontype == 3)
	{
		
		if ((Degreeangle > 0) && (Degreeangle < 180))
		{
			radiusfactor    = 0.5;	
		}
		else
		{
			radiusfactor    = 0.75;
		}
	}
		
	//console.log("\n2945 stx:",stx," sty:",sty," Sctradius:",Sctradius," Degreeangle:",Degreeangle," Sectiontype:",sectiontype," Radfact:",radiusfactor);
	//console.log("\nSig coords X:",stx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor)," PSdata Y:",sty + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor));
		
	
	if ((Pcodeposition == 1) && ((sectiontype == 1) || (sectiontype == 4)))
	{
		ssty = ssty - PosOffset;
	}
	
	if ((Pcodeposition == 2) && ((sectiontype == 1) || (sectiontype == 4)))
	{
		ssty = ssty * 1.05;
	}
	
	if ((Sigposition == 0) && ((sectiontype == 1) || (sectiontype == 4)))
	{
		sstx = sstx + (sectwidth * 0.5);
	}
	
	if ((Sigposition == 2) && ((sectiontype == 1) || (sectiontype == 4)))
	{
		sstx = sstx + (sectwidth * 0.8);
	}
	
	if ((Sigposition == 1) && ((sectiontype == 1) || (sectiontype == 4)))
	{
		sstx = sstx + (sectwidth * 0.0);
	}
	
	if ((sectiontype == 6) || (sectiontype == 3)) 
	{	
		sstx = stx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor);
		ssty = sty + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor);
			
	//	console.log("\nSig pos data X:",stx + (SctArcradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor)," Sig pos Y data:",sty + (SctArcradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor));	
	}
	
	
	ctx.fillStyle = "silver";	
	
	ctx.fillRect(sstx - 12, (ssty - 2*(size)), width,height);
	
	if (sig1currentcolour == 4 )
	{
		ctx.beginPath();
		ctx.arc(sstx,ssty,size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "green";
		ctx.fill();
	}
	
	if (sig1currentcolour == 3)
	{
		ctx.beginPath();
		ctx.arc(sstx,ssty + (2 * size) + offset,size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();
	}
	
	if (sig1currentcolour == 1)
	{
		ctx.beginPath();
		ctx.arc(sstx,ssty + 2 * ((2 * size) + offset),size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();		
	}
	
	if ((sig1currentcolour == 0) && (aspectcount == 3))
	{
		ctx.beginPath();
		ctx.arc(sstx,ssty,size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "green";
		ctx.fill();
		
		ctx.beginPath();		
		ctx.arc(sstx,ssty + (2 * size) + offset,size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();
		
		
		ctx.beginPath();	
		ctx.arc(sstx,ssty + 2 * ((2 * size) + offset),size,0,2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "red";
		ctx.fill();		
	}	
	
}

function PaintSectionArc(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,Phynum,highlightedflag,traincode,Displaysectiontype,startangle,sweepofcurve,pointrotateangle,curvedirection,radius,textposition,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2)
{
	/*  context.arc(x, y, r, sAngle, eAngle, counterclockwise)   */
	/*	startx	The x-coordinate of the center of the circle	
		starty	The y-coordinate of the center of the circle	
		r	The radius of the circle	
		sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)	
		eAngle	The ending angle, in radians	
		counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is 
		 the default, and indicates clockwise, while true indicates counter-clockwise.  */
	
	let startangleradians = startangle * Math.PI/180
    
    let sweepofcurveradians = sweepofcurve * Math.PI/180; 
    
    let curveheight = radius + Sctheight;      
    
    if (highlightedflag == 1)
    {
		ctx.strokeStyle = fillblue;   // highlight section in blue if selected for display 
	}          
    else
    {
		ctx.strokeStyle = colour; 
	}     
		
	ctx.beginPath();    
	
	ctx.lineWidth=5;
	//ctx.strokeStyle="blue";    
  
	ctx.arc(stx,sty, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
	
    ctx.stroke();
    
    ctx.font = ctxfontmaster;//"18px Arial black";
	
	//ctx.fillStyle = "black";	
	
//	PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,Displaysectiontype,radius,
//	Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
//		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2);	
}

function PaintSwitchpointsection(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,Phynum,highlightedflag,traincode,Displaysectiontype,Startangle,Sweepangle,
PRotateangle,CDirection,Radius,Pointbranchcount,OCstatus,textposition,TrainID1,TrainID2,TrainID3,TrainID4,TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,SignalPhysicalsection,
Signal1value,Signal2value,Logicalsection1,Logicalsection2)
{
	//	console.log("\n1310 Point section:",Dsection,"PointType:",Pointtype,"Pointlegcount:",Pointbranchcount);	
	//	console.log("\n1311 Displaysectiontype:",Displaysectiontype);
	//	DrawPointladder(Lx, Ly, branchsize, colour,linewidth)
	
		Xbranchquadrant = 0;
		
		Ybranchquadrant = 0;
		
		if(Displaysectiontype == 4)
		{
			Xbranchquadrant = 1;
			Ybranchquadrant = -1;
		}
		
		if(Displaysectiontype == 5)
		{
			Xbranchquadrant = 1;
			Ybranchquadrant = 1;
		}
		
		if(Displaysectiontype == 6)
		{
			Xbranchquadrant = -1;
			Ybranchquadrant = 1;
		}
		
		if(Displaysectiontype == 7)
		{
			Xbranchquadrant = -1;
			Ybranchquadrant = -1;
		}
		
	
		branchsize  = 30;
		
		linewidth 	= 5;
	
		branchdrawn = 0;
		
		branchsubscript = 0;
		
		Xbranchoffset = 0;
		
		Ybranchoffset = 0;
		
		Lx = stx;
		
		Ly = sty;
		
		// Draw the base line to cover all branches
		
		DrawPointbaseline(Lx,Ly, branchsize * Pointbranchcount, colour,linewidth,Xbranchquadrant,Ybranchquadrant);
		
		while (branchdrawn < Pointbranchcount)
		{	
			DrawPointladder(Lx + Xbranchoffset,Ly + Ybranchoffset , branchsize, colour,linewidth,Xbranchquadrant,Ybranchquadrant);		
			branchdrawn++;
			branchsubscript++;
			Xbranchoffset = (branchsize + branchdrawn) * Xbranchquadrant;
			Ybranchoffset = (branchsize + branchdrawn) * Ybranchquadrant;
		}	
		
	//PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
	//Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
	//SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);					
}

function DrawPointladder(Lx, Ly, branchsize, colour,linewidth,Xq,Yq)
{	
		ctx.strokeStyle = colour; 
		ctx.lineWidth=5;
		ctx.beginPath(); 
		
		// Draw base line 	//console.log("\n1414 Xq:",Xq," Yq:",Yq);
		
		// move to start point
		
		ctx.moveTo(Lx, Ly);
		ctx.lineTo(Lx + (branchsize * Xq) , Ly);	
		ctx.stroke();
		
		// Draw branch line
		
		ctx.moveTo(Lx, Ly);
		ctx.lineTo(Lx + (branchsize * Xq), Ly + (branchsize * Yq));
		ctx.stroke();
		
		return;		
}

function DrawPointbaseline(Lx, Ly, branchsize, colour,linewidth,Xq,Yq)
{	
		ctx.strokeStyle = colour; 
		ctx.lineWidth=5;
		ctx.beginPath(); 			
		
		// move to start point
		
		ctx.moveTo(Lx, Ly);
		ctx.lineTo(Lx + (branchsize * Xq), Ly);	
		ctx.stroke();
}
