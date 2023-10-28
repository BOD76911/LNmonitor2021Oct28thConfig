//******************************************************************************************************
//
//  TTT.js - javascript file to draw graphics based on Displayconfiguration file accessed 
//                     via LNwebmon server 
//
//						November 2022
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
 
 var maincanvas;
 var maincanvasheight 		= 850;
 var maincanvaswidth		= 1100;
 
 const SectionDisplayArray = [];
	
 const SectionDetectorArray = [];	
    
 const UncouplerArray = [];
 
 // ============================== Display variables ============================================
 
 
const fillgrey = 'rgb(230, 230, 230)';
const fillgreen = 'rgb(0, 175, 0)';
const filllightgreen = 'rgb(152,251,152)';
const fillyellow = 'rgb(255, 255, 0)';
const fillred = 'rgb(255, 0, 0)';
const fillblue = 'rgb(153, 204, 255)';
const fillbeige = 'rgb(255,247,230)'; //rgb(255,247,230) =  'rgb(255,239,213)';
const lineblack = 'rgb(64, 64, 64)';

const MCcanvasbackgroundcolour = 'rgb(255,247,230)';
 
 const ctxfontmaster = "normal 16px Arial";
 
 var MC1topinitposition = 350;
 
 const sourcedatadisplayoffset = 200;
 
 // ============================= Functions =====================================================
 
 function drawGUI()
 {
	 // controls update of GUI
	 
	 maincanvas = document.getElementById('canvas1');		// initialize the main canvas object 
	 
	 document.getElementById("canvas1").style.width = maincanvaswidth + "px"; 
	 
	 document.getElementById("canvas1").style.height = maincanvasheight  + "px"; 
	 
	 document.getElementById("MC1").style.top = (MC1topinitposition + sourcedatadisplayoffset).toString() + "px"; 
	 
	 Fetchstaticconfigdata();		// fetch the static configuration data
	 
 }
 
 
function Fetchstaticconfigdata() 	// fetch the static configuration data
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
		document.getElementById("MC1").style.top = MC1topinitnum.toString() + "px";
		document.getElementById("Sourceline").innerHTML = ""; 	     
	  }      
    
      document.getElementById("servertimestamp").innerHTML  = configdatacomps[0];
      
      // for each section loaded, paint the section and store the static details on the array 
      
      var ddsc = 0;
      
      SectionDisplayArray[0] = 0;
      
      for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
		{   		
			Sectionpainter(configdatacomps[ddsc]);
			Savesectiondetails(configdatacomps[ddsc]);		
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

const MC1topinitnum = 350;

const sourcedisplaytopoffset = 310;

/*------------------------------------ Functions ------------------------------------------------------------------ */

function myStopFunction() {
    clearInterval(myloopVar);
}

function myStartFunction() {
    myloopVar = setInterval(function(){ myTimerPS() }, 1500);  // 500
}

function testFunction()
{
	Displaydetectorlookuptable();
}

function myTimerPS() 
{   	
	Fetchstaticconfigdata();	
	//DynamicdataUpdatetimer();
	
}
  /*
function FetchSchedRte()
{	
	Detailcanvas1.style.display = "none";	
	Detailcanvas2.style.display = "none";	
	Detailcanvas3.style.display = "none";	
	     
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var SchedRteread = this.responseText;  
      
      //document.getElementById("Sourceline").innerHTML = SchedRteread; 
      
      document.getElementById("Sourcelinesched").innerHTML = SchedRteread; 
	
	  };
    }
 xhttp.open("GET", "SchedRte-101-402-301-.dat", true);
 xhttp.send();  	
}


function FetchRtedata()
{	
	Detailcanvas1.style.display = "none";	
	Detailcanvas2.style.display = "none";	
	Detailcanvas3.style.display = "none";	
	     
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var SchedRteread = this.responseText;  
      
      //document.getElementById("MC1").innerHTML = SchedRteread; 
      
      document.getElementById("Sourcelinesched").innerHTML = SchedRteread; 
	
	  };
    }
 xhttp.open("GET", "SchedRte-201-102-103-.dat", true);
 xhttp.send();  	
}
*/
function DynamicdataUpdatetimer() 
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
      
		console.log("\n324 Dynamic data call");
     
		if(document.getElementById("Srceflagcheck").checked) 
		{ 
			document.getElementById("MC1").style.top = (MC1topinitnum + sourcedatadisplayoffset).toString() + "px"; 	   
			document.getElementById("Sourceline").style.top = sourcedisplaytopoffset;	    
			document.getElementById("Sourceline").innerHTML = configdataread; 
		}
		else
		{
			document.getElementById("MC1").style.top = MC1topinitnum.toString() + "px";
			document.getElementById("Sourceline").innerHTML = ""; 	     
		}      
    
		document.getElementById("servertimestamp").innerHTML  = configdatacomps[0];
      
      // for each section loaded, paint the section and store the static details on the array 
		
		var ddsc = 0;
      
		SectionDisplayArray[0] = 0;
      
		for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
		{   		
		//	Sectionpainter(configdatacomps[ddsc]);
			Savesectiondetails(configdatacomps[ddsc]);		
	    }
	    
	    var Sectionloadcounter = Fetchnumberofsectionsloaded();
	    
	    //Buildetectorlookuptable(Sectionloadcounter);			// build lookup table of detectors physical locations	   
      
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	
   //   var configdatacompslength = 0;   
   //   var schedulerdatalength = 0;
    //  
    //  dyndatacomps = configdataread.split("#");
         
   //   configdatacomps = dyndatacomps[0].split("+");
    //  configdatacompslength = dyndatacomps[0].split("+").length;
      
   //   schedulerdata = dyndatacomps[1].split("+");
   //   schedulerdatalength = dyndatacomps[1].split("+").length;
      
      //Schedmaindata = dyndatacomps[2];      
      
      //Detectordata = dyndatacomps[3];   
      
      //document.getElementById("Sourceline").innerHTML = Detectordata; 
      
      //document.getElementById("Sourceline").innerHTML = dyndatacomps;
      
      // for each section loaded, repaint the dynamic detail for the section  
      
    //  var ddsc = 0;    
     
     // document.getElementById("Sourceline").innerHTML = configdatacomps[18];
      
     // for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
	//	{      
	//	 	Dynamicdatasectionpainter(configdatacomps[ddsc]);	
	//    } 	
	    
	  // update scheduler details   	  
	  
	  /*
	  for (ddsc = 1; ddsc <schedulerdatalength;ddsc++)
		{						
			Schedulerdatarefresh(schedulerdata[ddsc-1],ddsc);	
		}
		
		Schedmainupdate(Schedmaindata);	  
	  
		Updatedetectorstatus(Detectordata); 
      */
    //  document.getElementById("servertimestamp").innerHTML  = configdatacomps[0];
      
      // for each section loaded, paint the section and store the static details on the array 
      
    //  var ddsc = 0;
      
    //  SectionDisplayArray[0] = 0;
      
     // for (ddsc = 1;ddsc <(configdatacompslength -1);ddsc++)
	//	{   		
	//		Sectionpainter(configdatacomps[ddsc]);
	//		Savesectiondetails(configdatacomps[ddsc]);		
	 //   }
	    
	 //   var Sectionloadcounter = Fetchnumberofsectionsloaded();     
      
	  };
     }
 xhttp.open("GET", "displayconfig.dat", true);
 xhttp.send();   
   
}



/*
function Updatedetectorstatus(Detectorinfo)
{
	
	detectorcurrentstatus = Detectorinfo.split(":");
	
	ddccmax = SectionDetectorArray.length / elementsindetectordata;		
	
	for (ddcc = 1;ddcc <= ddccmax;ddcc++)
	{   	
		detectornumberandvalue = detectorcurrentstatus[ddcc].split("-");		
		
		detectornumber = detectornumberandvalue[0];
		detectorvalue = detectornumberandvalue[1];	
		
		Updatedetectorarray(detectornumber,detectorvalue);	
		
		Detectorupdate(detectornumber,detectorvalue);			
	}	
	
	
}

function Updatedetectorarray(detector,value)
{
	// calculate the offsetvalue for the array and update the status value
	
	offset = (detector - 1) * elementsindetectordata;
	
	SectionDetectorArray[offset + 2] = value;
}

function GetdetectorPS(detectornumber)
{
	Sectiondetectorarraycount = SectionDetectorArray.length / elementsindetectordata;
	
	ipstb = 0;
	
	for (let ips = 1;ips <= Sectiondetectorarraycount; ips++)
	{
		if (SectionDetectorArray[ipstb] == detectornumber)
		{
			return SectionDetectorArray[ipstb + 1];
			
		}	
		
		ipstb = ipstb + elementsindetectordata;			
	}	
	
	return 0;	
}

function GetdetectorPSpos(detectornumber)
{
	Sectiondetectorarraycount = SectionDetectorArray.length / elementsindetectordata;
	
	ipstb = 0;
	
	for (let ips = 1;ips <= Sectiondetectorarraycount; ips++)
	{
		if (SectionDetectorArray[ipstb] == detectornumber)
		{
			return SectionDetectorArray[ipstb + 3];
			
		}	
		
		ipstb = ipstb + elementsindetectordata;			
	}	
	
	return 0;	
}

function Buildetectorlookuptable(Numberofsections)
{
	//console.log("\n247 Building detector tables ");
	
	var Delements = elementsindetectordata;
	
	for (let icc = 0; icc < (elementsindetectordata * numberofdetectors); icc++)
	{
		SectionDetectorArray[icc] = 0;
	}	
	
	numberofdetectors = 0;
	
	var detectornumber;
	
	var tablesubscript = 0;	
	
	for (let isc = 1; isc <= Numberofsections;isc++)
	{
		detectornumber1 = GetMagdetectnum(isc,1);	
		detectornumber2 = GetMagdetectnum(isc,2);	
		detectornumber3 = GetMagdetectnum(isc,3);	
		detectornumber4 = GetMagdetectnum(isc,4);		
		
		if (detectornumber1 > 0)
		{
			numberofdetectors++;			
			
			SectionDetectorArray[tablesubscript] = detectornumber1;
			
			tablesubscript++;
			
			SectionDetectorArray[tablesubscript] = isc;
			
			tablesubscript++;		
			
			SectionDetectorArray[tablesubscript] = 0;  // clear status 
			
			tablesubscript++;
			
			SectionDetectorArray[tablesubscript] = 1;  // detector number within physical section
			
			tablesubscript++;
			
			console.log("\n416 Section:" + isc + " detector1:" + detectornumber1);
		}	
		
		if (detectornumber2 > 0)
		{
			numberofdetectors++;			
			
			SectionDetectorArray[tablesubscript] = detectornumber2;
			
			tablesubscript++;
			
			SectionDetectorArray[tablesubscript] = isc;
			
			tablesubscript++;		
			
			SectionDetectorArray[tablesubscript] = 0;  // clear status 
			
			tablesubscript++;
			
			SectionDetectorArray[tablesubscript] = 2;  // detector number within physical section
			
			tablesubscript++;
			
			console.log("\n439 Section:" + isc + " detector2:" + detectornumber2);
		}	
		
	}	
}

function Getmdetectorflag(section)
{
	var elements = elementsinsectiondata;	 
	
	return SectionDisplayArray[(section * elements)-(elements - 15)];  	
}

function Displaydetectorlookuptable()
{
	
	// Detector number - element 0
	// Physical section - element 1 
    // status - element 2 
    
    var detectorcount = 0;
    var Recordcount  = 0;
    
    //console.log("\n\nDisplaying detector table\n ");
	
	
	for (let icd = 0; icd < (elementsindetectordata * numberofdetectors); icd++)
	{			
		if (Recordcount == 3)
		{
			detectorcount++;
			Recordcount = 0;
		}
		
		//console.log("\nRecord--->:" + icd + " detectorrecord:" + SectionDetectorArray[icd]);
		
		Recordcount++;
	}
	
}

function Detectorupdate(detector,status)
{	
	// Find detector physical section and coordinates
	
	var PSection  = GetdetectorPS(detector);
	
	var Psectionpos = GetdetectorPSpos(detector);
	
	Coords = RBselectiondata(PSection);
	
	var fillcolour; 
	
	if (status > 0)
	{
		fillcolour = fillyellow;
	}
	else
	{
		fillcolour = fillbeige;
	}	
	
	DDstx 		= Coords.stx;
	DDsty 		= Coords.sty;
	DDwidth 	= Coords.width;
	DDheight 	= Coords.height;
	
	widthoffset = 0.34;
	
	//console.log("\n386 Detector update D:" + detector + " in Psection:" + PSection + " stx:" + DDstx + " sty:" + DDsty + " txt:" + mdectnumtxt);
	
	mdectnumtxt = detector;
	
	if (Psectionpos == 1)
	{
		widthoffset = 0.34;
	}
	
	if (Psectionpos == 2)
	{
		widthoffset = 0.75;
	}	
	
  	Drawcircle(maincanvas,DDstx + (DDwidth * widthoffset),DDsty + (DDheight * 0.5),detectorsize,fillcolour,mdectnumtxt);	
		
}

function Schedulerdatarefresh(schedinfo,ddcount)
{
	schedulerelements = schedinfo.split(";");
	
	if (ddcount > 6) 
	{
		return;
	}
	
	if (schedulerelements[13] == 1)
	{
	document.getElementById("Statusrow"+ ddcount).style.backgroundColor = "lightgreen";
	}
	else
	{
	document.getElementById("Statusrow"+ ddcount).style.backgroundColor = "yellow";	
	}	
	
	document.getElementById("Execrow" + ddcount).innerHTML = schedulerelements[1];
	document.getElementById("Schedrow" + ddcount).innerHTML = schedulerelements[2];
	document.getElementById("Steprow" + ddcount).innerHTML = schedulerelements[3];
	document.getElementById("TotalstepsinJnyrow" + ddcount).innerHTML = schedulerelements[8];
	document.getElementById("Journeyrow" + ddcount).innerHTML = schedulerelements[4];
	document.getElementById("HHrow" + ddcount).innerHTML = schedulerelements[10];
	document.getElementById("MMrow" + ddcount).innerHTML = schedulerelements[11];
	document.getElementById("SSrow" + ddcount).innerHTML = schedulerelements[12];
	document.getElementById("Statusrow"+ ddcount).innerHTML = schedulerelements[14];
}

function Schedmainupdate(Schedmaindatareceived)
{
	scheddatacomps = Schedmaindatareceived.split(';');
	
	
	if (scheddatacomps[0] == 1)
	{
	document.getElementById("SchedOp").style.backgroundColor = "lightgreen";
	}
	else
	{
	document.getElementById("SchedOp").style.backgroundColor = "yellow";	
	}	
	
	document.getElementById("SchedOp").innerHTML = scheddatacomps[1];
	document.getElementById("SchedHH").innerHTML = scheddatacomps[2];
	document.getElementById("SchedMM").innerHTML = scheddatacomps[3];
	document.getElementById("SchedSS").innerHTML = scheddatacomps[4];
	document.getElementById("Scheduleticks").innerHTML = scheddatacomps[5];
}

*/

function Timerloop() 
{     
	
	
}  
/*

*/
/*
function Dynamicdatasectionpainter(dcompdata)
{	
	sectiondynelements = dcompdata.split(";");
	
	sectiondynelementscount = dcompdata.split(";").length;		
	
	// convert strings to numerics	
	
	DDsection 				= sectiondynelements[1] * 1;
	Logicalsection1Tcode	= sectiondynelements[2] * 1;
	Logicalsection1dir		= sectiondynelements[3] * 1;
	Logicalsection2Tcode	= sectiondynelements[4] * 1;
	Logicalsection2dir		= sectiondynelements[5] * 1;
	Logicalsection3Tcode	= sectiondynelements[6] * 1;
	Logicalsection3dir		= sectiondynelements[7] * 1;
	Logicalsection4Tcode	= sectiondynelements[8] * 1;
	Logicalsection4dir		= sectiondynelements[9] * 1;
	
	Tcode					= sectiondynelements[10] * 1;	// Tcode to be shown in the Displaysection 
	
	PtOCstatus				= sectiondynelements[11] * 1;	// point open closed status flag 
		
	DNcolour 				= sectiondynelements[12] * 1;	// Colour code for section  	
	
	Logicalsection5Tcode	= sectiondynelements[13] * 1;
	Logicalsection5dir		= sectiondynelements[14] * 1;
	Logicalsection6Tcode	= sectiondynelements[15] * 1;
	Logicalsection6dir		= sectiondynelements[16] * 1;
	Logicalsection7Tcode	= sectiondynelements[17] * 1;
	Logicalsection7dir		= sectiondynelements[18] * 1;
	Logicalsection8Tcode	= sectiondynelements[19] * 1;
	Logicalsection8dir		= sectiondynelements[20] * 1;
	
	TrainID1				= sectiondynelements[21] * 1;		
	TrainID2				= sectiondynelements[22] * 1;		
	TrainID3				= sectiondynelements[23] * 1;		
	TrainID4				= sectiondynelements[24] * 1;		
	//TrainID5				= sectiondynelements[25] * 1;		
		
	TrainID2conflag			= sectiondynelements[26] * 1;		
	TrainID3conflag			= sectiondynelements[27] * 1;		
	TrainID4conflag			= sectiondynelements[28] * 1;		
	TrainID5conflag			= sectiondynelements[29] * 1;		
	
	var offset = 0;
	
	Dsectionnumber = DDsection;	
	
	//console.log("\n918 Dynamic GUI data for section:" + DDsection + "\n");
	
	var elements = elementsinsectiondata;		
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 20)] = Logicalsection1Tcode;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 21)] = Logicalsection1dir;
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 28)] = Tcode;
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 29)] = PtOCstatus;
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 30)] = DNcolour;
	
	HFmaster = SectionDisplayArray[(Dsectionnumber * elements)-(elements - 31)];	
	
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 45)] = TrainID1;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 46)] = TrainID2;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 47)] = TrainID3;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 48)] = TrainID4;
	//SectionDisplayArray[(Dsectionnumber * elements)-(elements - 49)] = TrainID5;
	
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 49)] = TrainID2conflag;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 50)] = TrainID3conflag;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 51)] = TrainID4conflag;
	SectionDisplayArray[(Dsectionnumber * elements)-(elements - 52)] = TrainID5conflag;
	
	SectionRepaint(Dsectionnumber,0);
	
}
*/
function Sectionpainter(componentdata)
{
	sectionelements = componentdata.split(";");
	
	sectionelementscount = componentdata.split(";").length;	
	
	ctx = maincanvas.getContext('2d');
	
	ctx.font = ctxfontmaster; //"20px Arial";
	
	//console.log("\n945 P:",sectionelements[3],"X:",sectionelements[1]," Y:",sectionelements[2]);
	
	// convert strings to numerics
	
	Dsection 				= sectionelements[0] * 1;
	stx 					= (maincanvasheight/10000) * sectionelements[1] * 1;  // convert relative X position value to absolute locations on canvas 
	sty 					= (maincanvaswidth/10000) * sectionelements[2] * 1;	// convert relative Y position value to absolute locations on canvas
	
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
	
	//console.log("\n862 Signal number:",Signalnumber);
	//console.log("\n862 Sig1value:",Signal1value);
	//console.log("\n862 Signaltype:",Signaltype);
	//console.log("\n862 Signal1numberofaspects",Signal1numberofaspects);
	//console.log("\n862 Sigsparefield1:",Signalsparefield1);
	//console.log("\n863 Sigsparefield2:",Signalsparefield2);
	//console.log("\n864 Sigsparefield3:",Signalsparefield3);
	//console.log("\n865 Sigsparefield4:",Signalsparefield4);	
	//console.log("\n865 Signal1value:",Signal1value);	
	//console.log("\n869 Signal2value:",Signal2value);
	
	//Mdetectcolor			= sectionelements[31] * 1;	// Colour code for section 	
	
	// colour decode 1 = grey, 2 = yellow, 3 = green , 4 = red	
	
	if (Ncolour == 1)
	{
		colour = fillgrey;
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
	
	var highlightedflag = 0;	
	
	if ((Displaysectiontype == 1) || (Displaysectiontype == 2))  // test for regular straight section or rotated straight section
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
	
	if ((Displaysectiontype == 4) || (Displaysectiontype == 5))  // test for regular point or rotated point 
	{			
		PaintSwitchpointsection(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,
		Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Pointtype,PtOCstatus,Textposition,TrainID1,TrainID2,TrainID3,TrainID4,
		TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,Logicalsection1,Logicalsection2);
	}	
	
}

function SectionRepaint(section,highlightedflag)
{
	// repaints a single section 
	
	ctx = maincanvas.getContext('2d');
	
	var elements = elementsinsectiondata;	
	
	Dsection 				= section;
	stx 					= SectionDisplayArray[(section * elements)-(elements - 1)];
	sty 					= SectionDisplayArray[(section * elements)-(elements - 2)];
	
	PSection 				= SectionDisplayArray[(section * elements)-(elements - 3)];
	Displaysectiontype		= SectionDisplayArray[(section * elements)-(elements - 4)];
	Startangle				= SectionDisplayArray[(section * elements)-(elements - 5)];
	Sweepangle				= SectionDisplayArray[(section * elements)-(elements - 6)];
	
	Radius					= SectionDisplayArray[(section * elements)-(elements - 7)];
	CDirection 				= SectionDisplayArray[(section * elements)-(elements - 8)];
	Sctheight 				= SectionDisplayArray[(section * elements)-(elements - 9)];
	Pointtype				= SectionDisplayArray[(section * elements)-(elements - 10)];
	
	Sctwidth 				= SectionDisplayArray[(section * elements)-(elements - 11)];
	PRotateangle			= SectionDisplayArray[(section * elements)-(elements - 12)];
	Pointnumber				= SectionDisplayArray[(section * elements)-(elements - 13)];
	
	Mdectnum				= SectionDisplayArray[(section * elements)-(elements - 15)];
	Mdectnum1				= SectionDisplayArray[(section * elements)-(elements - 15)];
	
	Logicalsection1			= SectionDisplayArray[(section * elements)-(elements - 16)];
	
	Logicalsection2			= SectionDisplayArray[(section * elements)-(elements - 17)];
	
	Logicalsection3			= SectionDisplayArray[(section * elements)-(elements - 18)];
	
	Logicalsection4			= SectionDisplayArray[(section * elements)-(elements - 19)];
	
	
	Logicalsection1Tcode	= SectionDisplayArray[(section * elements)-(elements - 20)];
	Logicalsection1dir		= SectionDisplayArray[(section * elements)-(elements - 21)];
	Logicalsection2Tcode	= SectionDisplayArray[(section * elements)-(elements - 22)];
	Logicalsection1dir		= SectionDisplayArray[(section * elements)-(elements - 23)];
	Logicalsection3Tcode	= SectionDisplayArray[(section * elements)-(elements - 24)];
	Logicalsection1dir		= SectionDisplayArray[(section * elements)-(elements - 25)];
	Logicalsection4Tcode	= SectionDisplayArray[(section * elements)-(elements - 26)];
	Logicalsection1dir		= SectionDisplayArray[(section * elements)-(elements - 27)];
	
	Tcode					= SectionDisplayArray[(section * elements)-(elements - 28)];// Tcode to be shown in the Displaysection 
	
	PtOCstatus				= SectionDisplayArray[(section * elements)-(elements - 29)];	// point open closed status flag 
		
	Ncolour 		   		= SectionDisplayArray[(section * elements)-(elements - 30)];	// Colour code for section  
	
	//Highlightedflag 		= SectionDisplayArray[(section * elements)-(elements - 31)];	// Colour code for section  
	
	Highlightedflag 		= 0;
	
	Logicalsection5Tcode	= SectionDisplayArray[(section * elements)-(elements - 31)];
	Logicalsection5dir		= SectionDisplayArray[(section * elements)-(elements - 32)];
	Logicalsection6Tcode	= SectionDisplayArray[(section * elements)-(elements - 33)];
	Logicalsection6dir		= SectionDisplayArray[(section * elements)-(elements - 34)];
	Logicalsection7Tcode	= SectionDisplayArray[(section * elements)-(elements - 35)];
	Logicalsection7dir		= SectionDisplayArray[(section * elements)-(elements - 36)];
	Logicalsection8Tcode	= SectionDisplayArray[(section * elements)-(elements - 37)];
	Logicalsection8dir		= SectionDisplayArray[(section * elements)-(elements - 38)];
	
	Mdectnum2				= SectionDisplayArray[(section * elements)-(elements - 39)];
	Mdectnum3				= SectionDisplayArray[(section * elements)-(elements - 40)];
	Mdectnum4				= SectionDisplayArray[(section * elements)-(elements - 41)];
	
	Uncoupler1				= SectionDisplayArray[(section * elements)-(elements - 42)];
	Uncoupler2				= SectionDisplayArray[(section * elements)-(elements - 43)];
	
	Textposition 			= SectionDisplayArray[(section * elements)-(elements - 44)];
	TrainID1				= SectionDisplayArray[(section * elements)-(elements - 45)];
	TrainID2				= SectionDisplayArray[(section * elements)-(elements - 46)];
	TrainID3				= SectionDisplayArray[(section * elements)-(elements - 47)];
	TrainID4				= SectionDisplayArray[(section * elements)-(elements - 48)];
	TrainID5				= SectionDisplayArray[(section * elements)-(elements - 49)];
	
	TrainID2conflag			= SectionDisplayArray[(section * elements)-(elements - 49)];	
	TrainID3conflag			= SectionDisplayArray[(section * elements)-(elements - 50)];
	TrainID4conflag			= SectionDisplayArray[(section * elements)-(elements - 51)];		
	TrainID5conflag			= SectionDisplayArray[(section * elements)-(elements - 52)];
		
	if (Ncolour == 1)
	{
		colour = fillgrey;
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
	
	if (Ncolour == 5)
	{
		colour = fillblue;
	}			
	
	if (Highlightedflag > 0)
	{
		colour = fillblue;
		highlightedflag = 1;
	}
	
	//if (PSection == 1)
	//{
	//console.log("\n1305 PSTcodeNG Tcode:" + Tcode + " Tcode1:" + TrainID1 + " Tcode2:" + TrainID2 + " Tcode3:" + TrainID3 + " Tcode4:" + TrainID4 + " textposition:" + Textposition);
	//console.log("\n1305 PSTcodeNG Tcode:" + Tcode + " Tcode2flag:" + TrainID2conflag + " Tcode3flag:" + TrainID3conflag + " Tcode4flag:" + TrainID4conflag);
	//}
	
	
	if ((Displaysectiontype == 1) || (Displaysectiontype == 2))  // test for regular straight section or rotated straight section
	{			
		PaintSectionStraight(ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,Displaysectiontype,Startangle,Sweepangle,PRotateangle,
		Mdectnum1,Mdectnum2,Mdectnum3,Mdectnum4,Uncoupler1,Uncoupler2,Textposition,TrainID1,TrainID2,TrainID3,TrainID4,TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag);
	}
	
	if (Displaysectiontype == 3) // test for regular curve or a rotated curve 
	{			
		PaintSectionArc(ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Textposition);
	}
	
	if ((Displaysectiontype == 4) || (Displaysectiontype == 5))  // test for regular point or rotated point 
	{			
		PaintSwitchpointsection(ctx,stx,sty,Sctwidth,Sctheight,colour,PSection,highlightedflag,Tcode,
		Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Pointtype,PtOCstatus,Textposition,TrainID1,TrainID2,TrainID3,TrainID4,
		TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,Logicalsection1,Logicalsection2);
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
	
	// The stroke and fill determines how the shape is drawn. The stroke is the outline of a shape. The fill is the contents inside the shape.
	// context.fillStyle='rgb(red,green,blue)' - sets colour details (rgb(230, 230, 230) for light grey 	
	
	if (sectiontype == 1)		// regular straight section 
	{
		// Clear any existing Loco and Train code details before painting the section.		
		
		if (highlightflag == 1) // highlight section in blue if selected for display 
		{		   				
			ctx.fillStyle = fillblue;
		}    
		else
		{      
			ctx.fillStyle = colour;
		} 			
	
		ctx.fillRect(stx, sty, width,height);	
	
		ctx.strokeStyle = sectbordercolour;
	
		ctx.lineWidth   = 2;		
			
		ctx.strokeRect(stx, sty, width,height);	
	
		ctx.font = ctxfontmaster;//"18px Arial black";
	
		ctx.fillStyle = "black";	
	
		sectheight = (sty * 1.0) + height * 0.7;	
		
		PaintSectionCodeInfo(Dsection,ctx,stx,sty,width,height,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,1,0,
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
}

function PaintSectionArc(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,Phynum,highlightedflag,traincode,Displaysectiontype,startangle,sweepofcurve,pointrotateangle,curvedirection,radius,textposition,
		Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2)
{
	//console.log("\n1237 ARC Psection:",Phynum," Startangle:",startangle," Curvesweep:",sweepofcurve, " Radius:",radius," Sigposarc:",SignalpositionArcangle," Sig1val:",Signal1value);
	
	let startangleradians = startangle * Math.PI/180
    
    let sweepofcurveradians = sweepofcurve * Math.PI/180; 
    
    let curveheight = radius + Sctheight;      
    
    if (highlightedflag == 1)
    {
		ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
	}          
    else
    {
		ctx.fillStyle = colour; 
	}     
		
	ctx.beginPath();    
    
    if (curvedirection == 0)
    {    
		ctx.arc(stx,sty, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
		ctx.arc(stx,sty, radius, (startangleradians + sweepofcurveradians), startangleradians, true);
	}
	else
	{
		ctx.arc(stx,sty, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
		ctx.arc(stx,sty, radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
	}
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.font = ctxfontmaster;//"18px Arial black";
	
	ctx.fillStyle = "black";	
	
	PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,Displaysectiontype,radius,
	Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
		SignalPhysicalsection,Signal1value,Signal2value,SignalpositionArcangle,Logicalsection1,Logicalsection2);	
}

function PaintSwitchpointsection(Dsection,ctx,stx,sty,Sctwidth,Sctheight,colour,Phynum,highlightedflag,traincode,Displaysectiontype,Startangle,Sweepangle,
PRotateangle,CDirection,Radius,Pointtype,OCstatus,textposition,TrainID1,TrainID2,TrainID3,TrainID4,TrainID2conflag,TrainID3conflag,TrainID4conflag,TrainID5conflag,
Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,SignalPhysicalsection,
Signal1value,Signal2value,Logicalsection1,Logicalsection2)
{	
	
	 if (highlightedflag == 1) // highlight section in blue if selected for display 
    {		   				
		ctx.fillStyle = fillblue;
	}    
	else
	{      
        ctx.fillStyle = colour;
	} 		
	
	var styaArc = sty;
	
	var stxaArc = stx;	
	
	if ((PRotateangle == 0) && (Displaysectiontype == 4)) // test to see if regular or rotated point 
	{
		// regular point 
		
		// check to see what type of point it is e.g point type -->  1 = Facing left , 2 = Facing right, 3 = Trailing left, 4 = Trailing right
		
		// Calculate the centre of the arc for drawing the curve component of the point 
		
		if (Pointtype == 1)	// facing left		adjust y only
		{			
			styaArc = sty - Radius;
		
			DStartangle = Startangle - 180 - Sweepangle;						
		}
		
		if (Pointtype == 2)  // facing right adjust y only 
		{
			//console.log("376 - Right facing Point type 2");
			
			styaArc = sty + Radius + Sctheight; 
		
			DStartangle = Startangle; 	
			
			//styaArc = sty - Radius;
		
			//DStartangle = Startangle - 180 - Sweepangle;			
		}
		
		if (Pointtype == 3)  // trailing left adjust x and y 	
		{
			//console.log("385 - Left training Point type 3");
			
			styaArc = sty + Radius + Sctheight;
		
			DStartangle = Startangle - Sweepangle;
		
			stxaArc = stx + Sctwidth;			
		}
		
		if (Pointtype == 4)  // trailing right adjust x and y 	
		{
			//console.log("396 - Right trailing Point type 4");
			
			styaArc = sty - Radius;
		
			DStartangle = Startangle - 180;
		
			stxaArc = stx + Sctwidth;							// adjust x coordinate 			
		}	
		
		
		if (Pointtype == 5)  // crossover point with facing Left and trailing Right
		{
			//console.log("1262 - Right trailing Crossover Point type 5");
			
			styaArc = sty - Radius;
		
			DStartangle = Startangle - 180;
		
			stxaArc = stx + Sctwidth;	
			
		//	console.log("\n1984 Point type 5  - Phynum:" + Phynum);
			
			
			if (OCstatus == 0)
			{		
			// point is closed so draw the curved section first then the straight  - set traincode to zero for curve	
			
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  
    
				if (highlightedflag == 1)
				{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
				}          
				else
				{
				ctx.fillStyle = colour; 
				}     
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
				//console.log("417 Non rotated closed point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
			// now draw the straight section 	
			
				//ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";					
		
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
				SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);				
					
			}
			
			
			if (OCstatus == 1)  // point is open so draw straight first then curve
			{		
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
		
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  
				
				//ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
    		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
					console.log("504 Non rotated OPen point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";	
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
				SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);		
			}			
			
			// End of point type 5 - Part 1 
			
			// Reset the values 
			
			styaArc = sty;
	
			stxaArc = stx;
			
			styaArc = sty - Radius;
		
			DStartangle = Startangle - 180 - Sweepangle;			
			
			// Start of Part 2 ==================================			
			
			if (OCstatus == 0)
			{		
			// point is closed so draw the curved section first then the straight  - set traincode to zero for curve	
			
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  
    
				if (highlightedflag == 1)
				{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
				}          
				else
				{
				ctx.fillStyle = colour; 
				}     
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
				//console.log("417 Non rotated closed point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
			// now draw the straight section 	
			
				//ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";	
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
				SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
					
			}
			
			
			if (OCstatus == 1)  // point is open so draw straight first then curve
			{		
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
		
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  				
				
			//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
					console.log("504 Non rotated OPen point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";	
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,Signal2numberofaspects,
				SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
				
			}		
			
			// End of part 2 ================================================================	
			
			
			return;
		} 	
		
		// Start of Crossoverpoint type 6
		
		if (Pointtype == 6)  // crossover point with facing Left and trailing Right
		{
			//console.log("1262 - Left trailing Crossover Point type 6");
			
			styaArc = sty + Radius + Sctheight; 
		
			DStartangle = Startangle; 				
			
			if (OCstatus == 0)
			{		
			// point is closed so draw the curved section first then the straight  - set traincode to zero for curve	
			
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  
    
				if (highlightedflag == 1)
				{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
				}          
				else
				{
				ctx.fillStyle = colour; 
				}     
				
			//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
				//console.log("417 Non rotated closed point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
			// now draw the straight section 	
			
				//console.log("\n2347 Point type 6  - Phynum:" + Phynum + "Tcode:" + traincode + " TR1:" + TrainID1 + " TR2:" + TrainID2 + " Tr3" + TrainID3);
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";	
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
				Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);	
				
			}
			
			
			if (OCstatus == 1)  // point is open so draw straight first then curve
			{		
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
		
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  				
				
			//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
					console.log("504 Non rotated OPen point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";	
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
				Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
				
			}			
			
			// End of point type 6 - Part 1 
			
			// Reset the values 
			
			styaArc = sty;
	
			stxaArc = stx;
			
			styaArc = sty + Radius + Sctheight;
		
			DStartangle = Startangle - Sweepangle;
		
			stxaArc = stx + Sctwidth;			
			
			// Start of Part 2 ==================================			
			
			if (OCstatus == 0)
			{		
			// point is closed so draw the curved section first then the straight  - set traincode to zero for curve	
			
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;				
				
			//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
				//console.log("417 Non rotated closed point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
			// now draw the straight section 	
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
				Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
						
			}
			
			
			if (OCstatus == 1)  // point is open so draw straight first then curve
			{		
		
				ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
				ctx.strokeStyle = sectbordercolour;
	
				ctx.lineWidth   = 2;		
			
				ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
		
				let startangleradians = DStartangle * Math.PI/180
    
				let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
				let curveheight = Radius + Sctheight;  
    
				if (highlightedflag == 1)
				{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
				}
				else
				{
					ctx.fillStyle = colour; 
				}    
				
			//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
				if (highlightedflag == 1) // highlight section in blue if selected for display 
				{		   				
					ctx.fillStyle = fillblue;
				}    
				else
				{      
					ctx.fillStyle = colour;
				} 			 
		
				ctx.beginPath();    
    
				if (CDirection == 0)
				{   
					console.log("504 Non rotated OPen point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
				}
				else
				{
					ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
					ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
				}
    
				ctx.closePath();
				ctx.fill();
				ctx.stroke();	
		
				ctx.font = ctxfontmaster;//"18px Arial black";
	
				ctx.fillStyle = "black";
				
				PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
				Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
				Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);	
				
			}		
			
			// End of part 2 ================================================================	
			
			
			return;
		} 			
		
				
		// End of Crossoverpoint type 6 
	
	// The stroke and fill determines how the shape is drawn. The stroke is the outline of a shape. The fill is the contents inside the shape.
	// context.fillStyle='rgb(red,green,blue)' - sets colour details (rgb(230, 230, 230) for light grey 
	
		if (OCstatus == 0)
		{		
			// point is closed so draw the curved section first then the straight  - set traincode to zero for curve	
			
			let startangleradians = DStartangle * Math.PI/180
    
			let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
			let curveheight = Radius + Sctheight;  
    
			if (highlightedflag == 1)
			{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
			}          
			else
			{
				ctx.fillStyle = colour; 
			}     
			
		//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
			if (highlightedflag == 1) // highlight section in blue if selected for display 
			{		   				
				ctx.fillStyle = fillblue;
			}    
			else
			{      
				ctx.fillStyle = colour;
			} 			
		
			ctx.beginPath();    
    
			if (CDirection == 0)
			{   
				//console.log("417 Non rotated closed point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
				ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
				ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
			}
			else
			{
				ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
				ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
			}
    
			ctx.closePath();
			ctx.fill();
			ctx.stroke();	
		
			// now draw the straight section 	
		
			ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
			ctx.strokeStyle = sectbordercolour;
	
			ctx.lineWidth   = 2;		
			
			ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
	
			ctx.font = ctxfontmaster;// "18px Arial black";
	
			ctx.fillStyle = "black";	
			
			PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
			Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
					
		}	
	
		if (OCstatus == 1)  // point is open so draw straight first then curve
		{		
		
			ctx.fillRect(stx, sty, Sctwidth,Sctheight);	
	
			ctx.strokeStyle = sectbordercolour;
	
			ctx.lineWidth   = 2;		
			
			ctx.strokeRect(stx, sty, Sctwidth,Sctheight);	
		
			let startangleradians = DStartangle * Math.PI/180
    
			let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
			let curveheight = Radius + Sctheight;  
    
			if (highlightedflag == 1)
			{
				ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
			}          
			else
			{
				ctx.fillStyle = colour; 
			}     
			
		//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
			if (highlightedflag == 1) // highlight section in blue if selected for display 
			{		   				
				ctx.fillStyle = fillblue;
			}    
			else
			{      
				ctx.fillStyle = colour;
			} 			
		
			ctx.beginPath();    
    
			if (CDirection == 0)
			{   
				console.log("504 Non rotated OPen point curve -> stxaArc:" + stxaArc + " styaArc:" + styaArc); 
				ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
				ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
			}
			else
			{
				ctx.arc(stxaArc,styaArc, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
				ctx.arc(stxaArc,styaArc, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
			}
    
			ctx.closePath();
			ctx.fill();
			ctx.stroke();	
		
			ctx.font = ctxfontmaster;//"18px Arial black";
	
			ctx.fillStyle = "black";
			
			PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
			Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);	
			
		}
	}
	
	if ((PRotateangle != 0) && (Displaysectiontype == 5)) // test to see if regular or rotated point 
	{
		// point has been rotated. 
		
		// Steps to be followed to process the rotation 
		
		// Step 1 - calculate the length and angle of the vector from the middle of the section to centre of the arc for the non-rotated curve 
		
		// 			Use pythagorus theorem for a right angle triange
		
		//          var Adjacentaxis = section width * 0.5
		
		//          var Oppositeaxis = (radius + section height * 0.5)
		
		// check to see what type of point it is e.g point type -->  1 = Facing left , 2 = Facing right, 3 = Trailing left, 4 = Trailing right
		
		// Calculate the centre of the arc for drawing the curve component of the point 
		
		var AjacentaxisSQRD = (Sctwidth * 0.5) * (Sctwidth * 0.5);
		
		var OppositeaxisSQRD = (Radius + (Sctheight * 0.5)) * (Radius + (Sctheight * 0.5));		
		
		var arcaxisvectorlength = Math.sqrt(AjacentaxisSQRD + OppositeaxisSQRD);
		
		var arcaxisvectorangle = Math.atan2((Radius + (Sctheight * 0.5)), (Sctwidth * 0.5)) * 180 / Math.PI;
		
		//console.log("583 Rotated point - Vector length:" + arcaxisvectorlength + " OppositeaxisSQRD:" + OppositeaxisSQRD + " AjacentaxisSQRD:" + AjacentaxisSQRD + " Initial Vector Angle:" + arcaxisvectorangle);	
		
		//var Rpointdetails = GetDisplaypointrotationangle(DS);
		
		//PaintSwitchpointsection(ctx,stx,sty,Sctwidth,Sctheight,colour,Phynum,highlightedflag,traincode,Displaysectiontype,Startangle,Sweepangle,PRotateangle,CDirection,Radius,Pointtype,OCstatus)
		
		var Calculatedrotationangle = 0;
		
		if (PRotateangle > 90)
		{
			Calculatedrotationangle = PRotateangle - 360;
		}
		else
		{
			if (PRotateangle > 0)
			{
				Calculatedrotationangle = PRotateangle;
			}
			else
			{
				Calculatedrotationangle = PRotateangle;
				//console.log("1593 rotation angle:" + Rpointdetails.PRotateangle);
			}
		}
		
		// Calculate the original axis of the arc before it is rotated 
		
		
		if (Pointtype == 1)  // facing left			
		{
			styaArc = sty - Radius + (Sctheight * 0.5) ; // - pointdetails.thickness;
		
			DStartangle = Startangle - 180 +  Calculatedrotationangle - Sweepangle;		// calculate the new start angle
			
			//console.log("617 Type 1 facing left - rotation Start angle:" + Startangle + " Calc'dRotate angle:" + Calculatedrotationangle + " DStartangle:" + DStartangle);
		}
		
		if (Pointtype == 2)  // facing right			
		{
			styaArc = sty + Radius + Sctheight;
		
			DStartangle = Startangle  +  Calculatedrotationangle;		// calculate the new start angle
			
			console.log("628 Type 2 facing right - rotation Start angle:" + Startangle + " Calc'dRotate angle:" + Calculatedrotationangle + " DStartangle:" + DStartangle);
		}
	
		if (Pointtype == 3)  // trailing left			
		{
			styaArc = sty + Radius + Sctheight;// - pointdetails.thickness;
		
			DStartangle = Startangle - Sweepangle - (Calculatedrotationangle * -1);
		
			stxaArc = stxaArc + Sctwidth;
			
			console.log("639 Type 3 Trailing left - rotation Start angle:" + Startangle + " Calc'dRotate angle:" + Calculatedrotationangle + " DStartangle:" + DStartangle);
		}
	
		if (Pointtype == 4)  // trailing right			// adjust x and y 
		{
			styaArc = sty - Radius;          
		
			DStartangle = Startangle - 180  + Calculatedrotationangle;
		
			stxaArc = stxaArc + Sctheight;							// adjust x coordinate 
			
			console.log("650 Type 4 Trailing right - rotation Start angle:" + Startangle + " Calc'dRotate angle:" + Calculatedrotationangle + " DStartangle:" + DStartangle);
		}
		
		// Step 2 - calculate the new angle for the vector after the rotation has been applied.
		
		// convert new angle to radians 
		
		var Rotatedarcaxisvectorangle = 0;
		
		if (Pointtype == 1)
		{
			Rotatedarcaxisvectorangle = arcaxisvectorangle + Calculatedrotationangle;
		}
		
		if (Pointtype == 2)
		{
			Rotatedarcaxisvectorangle = arcaxisvectorangle - Calculatedrotationangle;
		}
		
		if (Pointtype == 3)
		{
			Rotatedarcaxisvectorangle = arcaxisvectorangle + Calculatedrotationangle;
		}
		
		if (Pointtype == 4)
		{
			Rotatedarcaxisvectorangle = arcaxisvectorangle - Calculatedrotationangle;
		}
		
		// 
		
		var  RotatedarcaxisvectorangleRadians = Rotatedarcaxisvectorangle * (Math.PI/180);			
		
		// Next calculate the new axis point of the arc vector. 
		
		// calculate the y axis value 
		
		var RotatedOppaxis  = Math.sin(RotatedarcaxisvectorangleRadians ) * arcaxisvectorlength;
		
		// calculate the x axis value 		
		
		var RotatedAdjaxis = Math.cos(RotatedarcaxisvectorangleRadians) * arcaxisvectorlength;		
			
		 // Calculate new arc axis midpoint depending on the type of point 
		
		
		if ((Pointtype == 1) && (Rotatedarcaxisvectorangle < arcaxisvectorangle))  // Left facing point with negative rotation from horizontal - adjust stx and sty to calculate new axis coordinates 
		{		
			var stxaArcRotated = stx + (Sctwidth * 0.5) - RotatedAdjaxis;
		
			var styaArcRotated = sty - RotatedOppaxis + (Sctheight * 0.5);			
		
		//	console.log("705 Left Facing point - Negative Rotation  Orig stxaArc:" + stxaArc + " New stxaArcRotated:" + stxaArcRotated + " Orig styaArc:" + styaArc + " New styaArcRotated:" + styaArcRotated);		
		}
		
		if ((Pointtype == 1) && (Rotatedarcaxisvectorangle > arcaxisvectorangle))  // Left facing point with postive rotation from horizontal - adjust stx and sty to calculate new axis coordinates 
		{		
			var stxaArcRotated = stx + (Sctwidth * 0.5) - RotatedAdjaxis;
		
			var styaArcRotated = sty - RotatedOppaxis + (Sctheight * 0.5);			
		
		//	console.log("714 Left Facing point - Positive  Rotation  Orig stxaArc:" + stxaArc + " New stxaArcRotated:" + stxaArcRotated + " Orig styaArc:" + styaArc + " New styaArcRotated:" + styaArcRotated);		
		}		
		
		
		if (Pointtype == 2)  // facing right			// adjust x and y 
		{		
			var stxaArcRotated = stx + (Sctwidth * 0.5) - RotatedAdjaxis;
		
			var styaArcRotated = sty + (Sctheight * 0.5) + RotatedOppaxis;
		
		//	console.log("724 Right Facing point Orig stxaArc:" + stxaArc + " New stxaArcRotated:" + stxaArcRotated + " Orig styaArc:" + styaArc + " New styaArcRotated:" + styaArcRotated);		
		}	
		
		if (Pointtype == 3)  // trailing left			// adjust x and y 
		{		
			var stxaArcRotated = stx + (Sctwidth * 0.5) + RotatedAdjaxis;
		
			var styaArcRotated = sty + (Sctheight * 0.5) + RotatedOppaxis;
		
		//	console.log("733 Left trailing point Orig stxaArc:" + stxaArc + " New stxaArcRotated:" + stxaArcRotated + " Orig styaArc:" + styaArc + " New styaArcRotated:" + styaArcRotated);		
		}	
		
		if (Pointtype == 4)  // trailing right			// adjust x and y 
		{		
			var stxaArcRotated = stx + (Sctwidth * 0.5) + RotatedAdjaxis;
		
			var styaArcRotated = sty + (Sctheight * 0.5) - RotatedOppaxis;
		
		//	console.log("742 Right trailing point Orig stxaArc:" + stxaArc + " New stxaArcRotated:" + stxaArcRotated + " Orig styaArc:" + styaArc + " New styaArcRotated:" + styaArcRotated);		
		}	
		
		// Draw the rotated rectangle 		
			
			// Now draw the arc using the new axis centre and angle without the traincode
			
		let startangleradians = DStartangle * Math.PI/180
    
		let sweepofcurveradians = Sweepangle * Math.PI/180; 
    
		let curveheight = Radius + Sctheight;  
    
		if (highlightedflag == 1)
		{
			ctx.fillStyle = fillblue;   // highlight section in blue if selected for display 
		}          
		else
		{
			ctx.fillStyle = colour; 
		}   
		
	//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
		if (highlightedflag == 1) // highlight section in blue if selected for display 
		{		   				
			ctx.fillStyle = fillblue;
		}    
		else
		{      
			ctx.fillStyle = colour;
		} 			
			
		if (OCstatus == 0)			// point is closed so draw curve first then straight section 
			{	  
		
			ctx.beginPath();    
    
			if (CDirection == 0)
			{   
			//	console.log("771 Rotated closed point curve -> stxaArc:" + stxaArcRotated + " styaArc:" + styaArcRotated); 
				ctx.arc(stxaArcRotated,styaArcRotated, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
				ctx.arc(stxaArcRotated,styaArcRotated, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
			}
			else
			{
			//	console.log("777 Rotated closed point curve -> stxaArc:" + stxaArcRotated + " styaArc:" + styaArcRotated); 
				ctx.arc(stxaArcRotated,styaArcRotated, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
				ctx.arc(stxaArcRotated,styaArcRotated, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
			}
    
			ctx.closePath();
			ctx.fill();
			ctx.stroke();	
		
			// now draw the straight section					
		
			ctx.save();				// save the canvas		
		
			//ctx.fillStyle = displaycolour;		
		
			ctx.font = ctxfontmaster; //"20px Arial black";
			ctx.fillStyle = "black";	
			
			// move the rotation point to the center of the rectangle for the straight section
			
			var PRx;
			var PRy;			
			
			PRx = stx+Sctwidth/2;
			PRy = sty+Sctheight/2;		
		
			// move axis to centre of the section		
			
			ctx.translate(PRx,PRy);					

			// rotate the rectangle for the straight section			
			
			//console.log("809 point rotate angle:" + PRotateangle);
			
			ctx.rotate(PRotateangle*Math.PI/180);			
			
			ctx.fillStyle = colour; 
		
		// draw the rectangle using the midpoint as a reference 
			
			ctx.fillRect(-Sctwidth/2, -Sctheight/2, Sctwidth,Sctheight);
			ctx.strokeStyle = sectbordercolour;
			ctx.lineWidth   = 2;	
		
			ctx.strokeRect(-Sctwidth/2, -Sctheight/2, Sctwidth,Sctheight);
		
			ctx.font = ctxfontmaster;// "18px Arial black";
	
			ctx.fillStyle = "black";
			
			PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
			Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
			
			ctx.restore();		// restore the canvas 		
		}	
		
		if (OCstatus == 1)			// point is open so draw the straight section then the curve
		{	
			ctx.save();				// save the canvas		
		
			//ctx.fillStyle = displaycolour;		
		
			ctx.font = ctxfontmaster;// "20px Arial black";
			ctx.fillStyle = "black";	
			
			// move the rotation point to the center of the rectangle for the straight section
			
			var PRx;
			var PRy;			
			
			PRx = stx+Sctwidth/2;
			PRy = sty+Sctheight/2;		
		
			// move axis to centre of the section		
			
			ctx.translate(PRx,PRy);					

			// rotate the rectangle for the straight section			
			
			//console.log("809 point rotate angle:" + PRotateangle);
			
			ctx.rotate(PRotateangle*Math.PI/180);			
			
			ctx.fillStyle = colour; 
			
		//	ClearTraincodedata(ctx,stx,sty,Sctwidth,Sctheight);	
		
			if (highlightedflag == 1) // highlight section in blue if selected for display 
			{		   				
				ctx.fillStyle = fillblue;
			}    
			else
			{      
				ctx.fillStyle = colour;
			} 			
		
		// draw the rectangle using the midpoint as a reference 
			
			ctx.fillRect(-Sctwidth/2, -Sctheight/2, Sctwidth,Sctheight);
			ctx.strokeStyle = sectbordercolour;
			ctx.lineWidth   = 2;	
		
			ctx.strokeRect(-Sctwidth/2, -Sctheight/2, Sctwidth,Sctheight);
		
			ctx.font = ctxfontmaster;//"18px Arial black";
	
			ctx.fillStyle = "black";
			
			PaintSectionCodeInfo(Dsection,ctx,stx,sty,Sctwidth,Sctheight,textposition,traincode,TrainID1,TrainID2,TrainID3,TrainID4,0,0,0,0,Phynum,4,0,
			Signalnumber,Signalposition,Signaltype,Signal1numberofaspects,
			Signal2numberofaspects,SignalPhysicalsection,Signal1value,Signal2value,0,Logicalsection1,Logicalsection2);
			
			ctx.restore();		// restore the canvas and draw the curve		
			
			ctx.beginPath();    
    
			if (CDirection == 0)
			{   
			//	console.log("771 Rotated closed point curve -> stxaArc:" + stxaArcRotated + " styaArc:" + styaArcRotated); 
				ctx.arc(stxaArcRotated,styaArcRotated, curveheight, startangleradians, (startangleradians + sweepofcurveradians),false);
				ctx.arc(stxaArcRotated,styaArcRotated, Radius, (startangleradians + sweepofcurveradians), startangleradians, true);
			}
			else
			{
			//	console.log("777 Rotated closed point curve -> stxaArc:" + stxaArcRotated + " styaArc:" + styaArcRotated); 
				ctx.arc(stxaArcRotated,styaArcRotated, curveheight, startangleradians, (startangleradians + sweepofcurveradians),true);
				ctx.arc(stxaArcRotated,styaArcRotated, Radius, (startangleradians + sweepofcurveradians), startangleradians, false);			
			}
    
			ctx.closePath();
			ctx.fill();
			ctx.stroke();		
			
		}		
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
  
	context.beginPath();
	context.arc(stx,sty,radius, 0, 2*Math.PI);
	context.strokeStyle = '#000000';
	context.stroke();
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

function PaintSectionCodeInfo(Dsection,Sctctx,Sctstx,Sctsty,Sctwidth, Sctheight, Scttextposition, SctLcode, SctTcode1, SctTcode2, SctTcode3, SctTcode4,
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
	
	const PsctYoffset 				  = 0.5;
	const widthposoffset			  = 0.4;
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
	
	Lococodestr = "Lc:" + String(SctLcode).padStart(4, '0');
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
	 //console.log("\nMessageflag value :",Messageflag);
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
			ctx.fillStyle = 'rgb(255,247,230)';	
			ctx.fillRect((widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) - 30 - (Sctheight * PsctYoffset),80,40);
			ctx.fillStyle = 'black';
			ctx.fillText(Messagestr, (widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) - (Sctheight * PsctYoffset));
		}
		else
		{
			ctx.fillStyle = 'rgb(255,247,230)';	
			//ctx.fillRect((widthposoffset * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) - 30 - (Sctheight * PsctYoffset),80,40);
		}
		
	}					
	
		//================ straight sections - Type 2 text position - BELOW ===================================
		
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
				ctx.fillStyle = 'rgb(255,247,230)';	
				ctx.fillRect((0.4 * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) - 20 + (Sctheight * 4 * PsctYoffset),80,40); 
				ctx.fillStyle = 'black';
				ctx.fillText(Messagestr, (0.4 * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) + (Sctheight * 4 * PsctYoffset)); 
			}
			else
			{
				ctx.fillStyle = 'rgb(255,247,230)';	
			//	ctx.fillRect((0.4 * Sctwidth) + (Sctstx * 1.0), (Sctsty * 1.0) - 20 + (Sctheight * 4 * PsctYoffset),80,40); 
			}
						
		}
		
		//================ Arc / Curve sections  Types 3 & 6 ===================================	
		// NOTE - the angle for text positioning is provided in the 'text position field' in the config file
			
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
		
		if ((Degreeangle > 0) && (Degreeangle < 180))
		{
			radiusfactor    = 1.3;	
		}
		else
		{
			radiusfactor    = 1.6;	
		}
		
		if (Messageflag == 1)
		{
			ctx.fillStyle = 'rgb(255,247,230)';	
			ctx.fillRect(Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty - 20 + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor),80,40);
			ctx.fillStyle = 'black';	
			ctx.fillText(Messagestr,Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor));	
		}
		else
		{
			ctx.fillStyle = 'rgb(255,247,230)';				
			//ctx.fillRect(Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty - 20 + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor),80,40);
		}		
	}
	
	
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
		
		if (Messageflag == 1) 
		{
			console.log("\nShowing text for Dsection:",Dsection," Message is ",Messagestr);
			ctx.fillStyle = 'rgb(255,247,230)';	
			ctx.fillRect(Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty -20 + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor),80,40);
			ctx.fillStyle = 'black';	
			ctx.fillText(Messagestr,Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor));
		}
		else
		{
			ctx.fillStyle = 'rgb(255,247,230)';	
		//	ctx.fillRect(Sctstx + (Sctradius * Math.sin(Degreeangle*(Math.PI/180)) * radiusfactor),Sctsty - 20 + (Sctradius * Math.cos(Degreeangle*(Math.PI/180)) * radiusfactor),80,40);
		}
		
	}	
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





