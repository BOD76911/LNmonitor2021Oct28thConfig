var myloopVar = setInterval(myTimerPS, 2000);
var myloopVar1 = setInterval(myTimerPS1, 2000);
var res;
var slotsdata;
var slotdatasplit;
var x, slotnumber, speedinp, directioninp, text;
var slotsubscript;
var Initstopsetup; 

var Simdatasetupinitialized;

var sectioncounter;

function PageloadFunction() {
   
	Initstopsetup = 0;
	
	Simdatasetupinitialized = 0; 
	
	Simdetailsload();   
}


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

function PIReset(msg)
{
	var LREBldcode = "PICMD-";	
	
	LREBldcode = LREBldcode + "000" + "-" + msg + "-" + "000" + "-000-000-000-000-.dat";	
	
	//document.getElementById("PIBytestring").innerHTML = "PIBytes:" + LREBldcode;
	
	//document.getElementById("checkmsg").innerHTML = "PI Byte message "; 
	
	//document.getElementById("PIBytestring").innerHTML = "PIBytes reset command:" + LREBldcode;
	
	var xhttp = new XMLHttpRequest();
	
   xhttp.onreadystatechange = function() 
		{
		if (this.readyState == 4 && this.status == 200) 
			{   		 
			var res1 = this.responseText;    
			document.getElementById("checkmsg").innerHTML = res1;
			}
		};
	
	xhttp.open("PUT", LREBldcode, true);
	xhttp.send();	
	
}

function LNlococmd(loconum,cmd)
{
	var LREBldcode = "LRECMD-";	

	var LocoNumber = loconum;
	
	LREBldcode = LREBldcode + ZeroPad3Number(LocoNumber) + "-" + cmd + "-000-000-000-000-.dat";	
	
	document.getElementById("Simdatamsg").innerHTML = "Process Loco Command:" + LREBldcode;
	
	var xhttp = new XMLHttpRequest();
	
   xhttp.onreadystatechange = function() 
		{
		if (this.readyState == 4 && this.status == 200) 
			{   		 
			var res1 = this.responseText;    
			document.getElementById("checkmsg").innerHTML = res1;
			}
		};
	
	xhttp.open("GET", LREBldcode, true);
	xhttp.send();	
}

function SimRcommand(simnum,cmd)
{
	document.getElementById("checkmsg").innerHTML = "Run Sim:" + simnum;
	
	var SimBldcode = "SIMCMD-";	

	var SimNumber = simnum;
	
	SimBldcode = SimBldcode + ZeroPad3Number(SimNumber);	
	
	// "Sim1Rteselect"	
	
	var Rtecode = "Sim" + simnum + "Rteselect";	
	
	var x = document.getElementById(Rtecode).selectedIndex;
	var y = document.getElementById(Rtecode).options;

	var SimRtecode = y[x].index;	
	
	SimBldcode = SimBldcode + "-" + ZeroPad3Number(SimRtecode);
	
	// "Sim1SRselect"
	
	var SimRtemode = "Sim" + simnum + "SRselect";
	
	var x = document.getElementById(SimRtemode).selectedIndex;
	var y = document.getElementById(SimRtemode).options;

	var SimBldmode = y[x].index;	
	
	SimBldcode = SimBldcode + "-" + cmd + "-" + ZeroPad3Number(SimBldmode) + "-000-000"  + "-.dat";
	
	document.getElementById("Simdatamsg").innerHTML = "Start Simulator Command:" + SimBldcode;
	
	var xhttp = new XMLHttpRequest();
	
   xhttp.onreadystatechange = function() 
		{
		if (this.readyState == 4 && this.status == 200) 
			{   		 
			var res1 = this.responseText;    
			document.getElementById("checkmsg").innerHTML = res1;
			}
		};
	
	xhttp.open("GET", SimBldcode, true);
	xhttp.send();		
}

function Simdetailsload()
{
	var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) 
    {
		var Simheaders = this.responseText; 		
		var SimHdrsplit = Simheaders.split(";"); 
		var SimHdrlines = SimHdrsplit[1].split("-");
		var SimHdrdetails = SimHdrlines[2].split("+");		
		var Simhdrcnt = SimHdrlines[1];
		//document.getElementById("Simdatamsg").innerHTML = SimHdrdetails[0];
		
			
		var Simflc = 1;  
		
		Sim1mode = document.getElementById("Sim1SRselect");
		Sim2mode = document.getElementById("Sim2SRselect");
		Sim3mode = document.getElementById("Sim3SRselect");
		Sim4mode = document.getElementById("Sim4SRselect");
		Sim5mode = document.getElementById("Sim5SRselect");
	    Sim6mode = document.getElementById("Sim6SRselect");
	    
	    optionSR1 = document.createElement("option"); 
	    optionSR1.text = "RUN";
	    optionSR2 = document.createElement("option"); 
	    optionSR2.text = "RUN";
	    optionSR3 = document.createElement("option"); 
	    optionSR3.text = "RUN";
	    optionSR4 = document.createElement("option"); 
	    optionSR4.text = "RUN";
	    optionSR5 = document.createElement("option"); 
	    optionSR5.text = "RUN";
	    optionSR6 = document.createElement("option"); 
	    optionSR6.text = "RUN";
	    
	    Sim1mode.add(optionSR1);
	    Sim2mode.add(optionSR2);
	    Sim3mode.add(optionSR3);
	    Sim4mode.add(optionSR4);
	    Sim5mode.add(optionSR5);
	    Sim6mode.add(optionSR6);
	    
	  
	    SimRtelist = document.getElementById("SimRteselect");
	    Sim1Rtelist = document.getElementById("Sim1Rteselect");
	    Sim2Rtelist = document.getElementById("Sim2Rteselect");
	    Sim3Rtelist = document.getElementById("Sim3Rteselect");
	    SimRunlist = document.getElementById("SimtoRun");
	    SimRuntypelist = document.getElementById("SimRunType");    
	   
	    option3 = document.createElement("option"); 
	    option3.text = "01";
	   
	    option2 = document.createElement("option"); 
        option2.text = "RUN";
        
                  
	    while (Simflc <= Simhdrcnt)
		{	
			
		option = document.createElement("option"); 	
		 optionR1 = document.createElement("option"); 
		 optionR2 = document.createElement("option"); 
		 optionR3 = document.createElement("option"); 		
		 
		 optionR1.text = SimHdrdetails[Simflc-1];		 
		 Sim1Rtelist.add(optionR1);		 
		 optionR2.text = SimHdrdetails[Simflc-1];		 
		 Sim2Rtelist.add(optionR2);
		 optionR3.text = SimHdrdetails[Simflc-1];		 
		 Sim3Rtelist.add(optionR3);		
		 Simflc = Simflc + 1;
		}	
		
		Simflc = 1;
		
		Sim4Rtelist = document.getElementById("Sim4Rteselect");
	    Sim5Rtelist = document.getElementById("Sim5Rteselect");
	    Sim6Rtelist = document.getElementById("Sim6Rteselect");
		
		 while (Simflc <= Simhdrcnt)
		{		 
		 optionR4 = document.createElement("option"); 
		 optionR5 = document.createElement("option"); 
		 optionR6 = document.createElement("option"); 		 
		
		 optionR4.text = SimHdrdetails[Simflc-1];		 
		 Sim4Rtelist.add(optionR4);		 
		 
		 optionR5.text = SimHdrdetails[Simflc-1];		 
		 Sim5Rtelist.add(optionR5);
		 
		 optionR6.text = SimHdrdetails[Simflc-1];		 
		 Sim6Rtelist.add(optionR6);
		 
		 Simflc = Simflc + 1;
		}		 
    }      
  };
  xhttp.open("GET", "Simdatabuild.dat", true);
  xhttp.send();
}

function myStopFunction() {
    clearInterval(myloopVar);
}

function myStartFunction() {
    myloopVar  = setInterval(function(){ myTimerPS() }, 500);
    myloopVar1 = setInterval(function(){ myTimerPS1() }, 500);
}

function Checkmessage()
{	
	document.getElementById("checkmsg").innerHTML = "Message checked"; 
	
	
}

function ZeroPadNumber ( nValue )
{
    if ( nValue < 10 )
    {
        return ( '000' + nValue.toString () );
    }
    else if ( nValue < 100 )
    {
        return ( '00' + nValue.toString () );
    }
    else if ( nValue < 1000 )
    {
        return ( '0' + nValue.toString () );
    }
    else
    {
        return ( nValue );
    }
}

function LSset(flag)
{		
	var LSselectcode = document.getElementById("LScode").value;
	var LSselectTcode = document.getElementById("LSTcode").value;
	var LSselectTrID = document.getElementById("TrIDcode").value;
	var LScode = pad(LSselectcode, 3);
	var LSTcode = pad(LSselectTcode, 4);
    var LSmessage = "LSset-"+LScode+"-"+ LSTcode +"-" + LSselectTrID + "-" + flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set LS value " + LSmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",LSmessage , true);
  xhttp.send();  
  	
}

function SLCset(flag)
{		
	var SLCselectcode = document.getElementById("Slotcodevalue").value;
	var SLCselectspeed = document.getElementById("Slotcodespeed").value;
	var SLCselectdirection = document.getElementById("Slotcodedirection").value;
	var SLCcode = pad(SLCselectcode, 2);
	var SLCspeed = pad(SLCselectspeed,2);
	var SLCdirection = SLCselectdirection;
    var SLCmessage = "SLCset-"+ SLCcode + "-" + SLCspeed +"-" + SLCdirection + "-" + flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set SLC value " + SLCmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",SLCmessage , true);
  xhttp.send();  
  	
}

function DPCset(flag)
{		
	var DPCselectcode = document.getElementById("dvcode").value;
	var DPCdvenable = document.getElementById("dvenable").value;
	var DPCdvstatus = document.getElementById("dvstatus").value;
	var DPCdvcntarget = document.getElementById("dvcntarget").value;
	var DPCdvcnentrig = document.getElementById("dvencntrig").value;
	
	var DPCcode = pad(DPCselectcode, 2);
	var DPCenable = DPCdvenable;
	var DPCstatus = DPCdvstatus;
	var DPCcntarget = DPCdvcntarget;
	var DPCentrig = DPCdvcnentrig;
	
    var DPCmessage = "DPCset-"+ DPCcode + "-" + DPCcntarget + "-" + DPCentrig + "-" + flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set DPC value " + DPCmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",DPCmessage , true);
  xhttp.send();   
    	
}

function DPset(flag)
{		
	var DPselectcode = document.getElementById("dvcode").value;
	var DPdvenable = document.getElementById("dvenable").value;
	var DPdvstatus = document.getElementById("dvstatus").value;
	
	var DPcode = pad(DPselectcode, 2);
	var DPenable = DPdvenable;
	var DPstatus = DPdvstatus;
	
    var DPmessage = "DPset-"+ DPcode + "-" + DPenable + "-" + DPstatus + "-" + flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set DP value " + DPmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",DPmessage , true);
  xhttp.send();  
     	
}

function LDset(flag)
{		
	var LDselectcode = document.getElementById("LDid").value;
	var LDcode = pad(LDselectcode, 2);
    var LDmessage = "LDset-"+LDcode+"-"+flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set LD value " + LDmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",LDmessage , true);
  xhttp.send();    	
}

function SWset(flag)
{		
	var SWselectcode = document.getElementById("swcode").value;
	var SWcode = pad(SWselectcode, 2);
	var SWopen = document.getElementById("swopenflag").checked;
	var SWclosed = document.getElementById("swclosedflag").checked;
    var SWmessage = "SWset-" + SWcode+"-" + SWopen + "-" + SWclosed + "-" + flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set SW value " + SWmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",SWmessage , true);
  xhttp.send();    	
}

function SWsetallclosed()
{		
	var SWselectcode = document.getElementById("swcode").value;
	var SWcode = 0;
	var SWopen = 0;
	var SWclosed = 1;
    var SWmessage = "SWset-" + SWcode+"-" + SWopen + "-" + SWclosed + "-0-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Close all switches, clear Tcodes";
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",SWmessage , true);
  xhttp.send();    	
}

function PSset(flag)
{		
	var PSselectcode = document.getElementById("PScode").value;
	var PScode = pad(PSselectcode, 3);
    var PSmessage = "PSset-"+PScode+"-"+flag+"-0-.dat";
    document.getElementById("checkmsg").innerHTML = "Set PS value " + PSmessage;
	
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;    
      document.getElementById("checkmsg").innerHTML = res1;      
     }     
   };
  xhttp.open("GET",PSmessage , true);
  xhttp.send();  	
}

function UCR(rampnumber)
{
	document.getElementById("checkmsg").innerHTML = "UCR called " + rampnumber;
	
	var UCRcode = "UCR0" + rampnumber + ".dat";		
	
	var xhttp = new XMLHttpRequest();
	
    xhttp.onreadystatechange = function() 
		{
		if (this.readyState == 4 && this.status == 200) 
			{      
			res1 = this.responseText; 	
			document.getElementById("demo").innerHTML = res1;
			}	
		};
	
	xhttp.open("GET", UCRcode, true);
	xhttp.send();		
}

function myTimerPS() 
{       
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {  
      if (this.readyState == 4 && this.status == 200) 
      {   		 
      var res1 = this.responseText;         
        
      res = res1.split(";");      
      
      document.getElementById("Servertime").innerHTML = res[0];         
      document.getElementById("Ldevices").innerHTML = res[4];
      document.getElementById("PSmessage").innerHTML = res[5];
      document.getElementById("PDmessage").innerHTML = res[6];
      
      
      sectioncounter = (res[2].length)/2; 
      
      Stopflagdisplay(res[8]);
      
      Slotdatadisplay(res[2]);
      
      Psectionstatusupdate(res[1]);
      
      Lsectionstatusupdate(res[3]);
      
      DeviceDatadisplay(res[9]); 
      
      LocoDatadisplay(res[10]); //LocoDatadisplay(res[11]);  
      
      MultiSimexecdiplay(res[11]);  // MultiSimexecdiplay(res[12]);
      
      document.getElementById("LRCOS").innerHTML = res[12];
      
      LRmessages(res[13]);   
      
      Serialmsgprocess(res[14]);  
      
      if(document.getElementById("Srceflagcheck").checked) 
      {
		document.getElementById("Sourceline").innerHTML = res1; 
		document.getElementById("SourcelineHdr").innerHTML = "Source data received : "; 
		document.getElementById("Jmessage").innerHTML = "Source flag checked"; 		 
		} 
		else 
		{
		document.getElementById("SourcelineHdr").innerHTML = " "; 
		document.getElementById("Sourceline").innerHTML = " "; 
		document.getElementById("Jmessage").innerHTML = "Source flag NOT checked"; 
		}     
     }     
   };
  xhttp.open("GET", "servertime.dat", true);
  xhttp.send();   
    
};

function myTimerPS1() 
{       
	
	
	
	
}


function LRmessages(LRprocesses)
{	
	 LRvalues = LRprocesses.split("+");  
	 document.getElementById("LRC1").innerHTML = LRvalues[1];
	 document.getElementById("LRC2").innerHTML = LRvalues[2];
	 document.getElementById("LRC3").innerHTML = LRvalues[3];
	 document.getElementById("LRC4").innerHTML = LRvalues[4];
	 document.getElementById("LRC5").innerHTML = LRvalues[5];
	 document.getElementById("LRC6").innerHTML = LRvalues[6];	 
}

function Serialmsgprocess(SRmsgs)
{
	//PIBytestring
	// PIBread
	// PIEntries
	// PIExits
	
	SRMsg = SRmsgs.split(":");
	
	document.getElementById("PIBytestring").innerHTML = SRMsg[5];
	document.getElementById("PIBread").innerHTML = SRMsg[1];
	document.getElementById("PIEntries").innerHTML = SRMsg[2];
	document.getElementById("PIExits").innerHTML = SRMsg[3];
}

function MultiSimexecdiplay(Siminfo)
{
	// <td id="SMS1"> Stopped</td>	
	// "\nMSimExec+-%02d-%03d-%02d-%01d-%01d-%03d-%02d-%02d
	// "MSimExec+-00-000-00-0-0-000-00-00+-00-000-00-0-0-000-00-00"
	// id="PSMS1">
	
	var Siminfosplit = Siminfo.split("+"); 
	// <div id="Simdatamsg">	
		
	//var Simrec = Siminfosplit[2].split("-");
	
	//document.getElementById("Simdatamsg").innerHTML = Simrec[6];
	
	var i;
	var j = 1;
	var PSid;
	var TCTSid;
	var TCMSid;
	var CSMid;
	var SMSid;
	var SMSvalue;
	
	for (i = 2; i < 8; i++)
	 { 
		var Simrec = Siminfosplit[i].split("-");
		
		PSid = "PSMS" + j;
		TCTSid = "TCTS" + j;
		TCMSid = "TCMS" + j;
		CSMid = "CSMS" + j;
		SMSid = "SMS" + j;
		
		document.getElementById(CSMid).innerHTML = Simrec[3];
		
		SMSvalue = Simrec[4];
		
		if (SMSvalue == 0)
		{
			document.getElementById(SMSid).innerHTML = "Stopped";
		}
		
		if (SMSvalue == 1)
		{
			document.getElementById(SMSid).innerHTML = "Running";
		}
		
		if (SMSvalue == 2)
		{
			document.getElementById(SMSid).innerHTML = "Finished";
		}
		
		if (SMSvalue > 2)
		{
			document.getElementById(SMSid).innerHTML = "NAV";
		}
		
		
		document.getElementById(PSid).innerHTML = Simrec[6];
		document.getElementById(TCMSid).innerHTML = Simrec[7];
		document.getElementById(TCTSid).innerHTML = Simrec[8];		
		
	//	var Simrecdata = Simrec.split("-");	
		j = j + 1;
	 }
	
	
}

function CheckdataFunction() 
{   
    // Get the value of the input field with id="slcd"
    //x = document.getElementById("slcd").value;
    
     text = "Slot data input OK";

	 slotnumber = Form4.elements["slcd"].value;
	 
	 speedinp = Form4.elements["Speed"].value;
	 
	 directioninp = Form4.elements["Direction"].value;

    // If slotnumber field is Not a Number or less than one or greater than 18
    if (isNaN(slotnumber) || slotnumber < 1 || slotnumber > 18) {
        text = "Slot number input not valid";
        slotsubscript = 1;
    } else {
			slotsubscript = slotnumber;
    }
    
    // If speedinput field is Not a Number or greater than 126
    if (isNaN(speedinp) || speedinp > 126) {
        text = "Speed input value not valid";
    } else {
     //   text = "Slot data input OK";
    }
    
    // If direction input field is Not a Number or greater than 1
    if (isNaN(directioninp) || directioninp > 1 )
     {
        text = "Direction input value is not valid";
    } else {
     //   text = "Slot data input OK";
    }
    
    
    document.getElementById("checkmsg").innerHTML = text;
};

function Stopflagdisplay(Stopflagdata)
{
	var SFLGinfo = Stopflagdata.split("+");  	
	
	var SFLGsubinfo = SFLGinfo[1].split("-");		
	
	document.getElementById("Sfty1").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft1").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt1").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt1").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt1").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt1").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt1").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop 
	document.getElementById("LCTSSt1").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop 
	
	var SFLGsubinfo = SFLGinfo[2].split("-");		
	
	document.getElementById("Sfty2").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft2").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt2").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt2").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt2").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt2").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt2").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop
	document.getElementById("LCTSSt2").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop  
	
	var SFLGsubinfo = SFLGinfo[3].split("-");		
	
	document.getElementById("Sfty3").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft3").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt3").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt3").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt3").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt3").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt3").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop 
	document.getElementById("LCTSSt3").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop 
	
	var SFLGsubinfo = SFLGinfo[4].split("-");		
	
	document.getElementById("Sfty4").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft4").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt4").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt4").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt4").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt4").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt4").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop
	document.getElementById("LCTSSt4").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop  
	
	var SFLGsubinfo = SFLGinfo[5].split("-");	
	
	document.getElementById("Sfty5").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft5").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt5").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt5").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt5").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt5").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt5").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop
	document.getElementById("LCTSSt5").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop  
	
	var SFLGsubinfo = SFLGinfo[6].split("-");		
	
	document.getElementById("Sfty6").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft6").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt6").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt6").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt6").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt6").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt6").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop
	document.getElementById("LCTSSt6").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop  
	
	var SFLGsubinfo = SFLGinfo[7].split("-");		
	
	document.getElementById("Sfty7").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft7").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt7").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt7").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt7").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt7").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt7").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop 
	document.getElementById("LCTSSt7").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop 
	
	var SFLGsubinfo = SFLGinfo[8].split("-");	
	
	document.getElementById("Sfty8").innerHTML = SFLGsubinfo[0].toString(); 	// Type
	document.getElementById("Sft8").innerHTML = SFLGsubinfo[1].toString();  	// Enabled 
	document.getElementById("SfSt8").innerHTML = SFLGsubinfo[2].toString();  	// Status
	document.getElementById("SfdvSt8").innerHTML = SFLGsubinfo[3].toString(); 	// Device number
	document.getElementById("PsSt8").innerHTML = SFLGsubinfo[4].toString();		// Previous section
	document.getElementById("CSSt8").innerHTML = SFLGsubinfo[5].toString();		// Current section
	document.getElementById("LCSSt8").innerHTML = SFLGsubinfo[6].toString();	// Loco to stop
	document.getElementById("LCTSSt8").innerHTML = SFLGsubinfo[7].toString();	// Tcode of Loco to stop  
}

function Slotdatadisplay(Slotdatafeed)
{
	var Slotdatadetails = Slotdatafeed.split("#");
	
	var Slotdataelements;
	
	//console.log(Slotdatadetails[1]);
	
	var Sde; 
	
	for (Sde = 1; Sde < 20; Sde++)
	{
		Slotdataelements = Slotdatadetails[Sde].split("-");	
		
		Slotdatalines(Slotdataelements,Sde);		
	}
	
}

function Slotdatalines(Slotsubdata,Slotnum)
{
	var SN = Slotnum.toString();	
	
	//console.log(Slotsubdata);
	
	document.getElementById("slotT" + SN).innerHTML =  Slotsubdata[1].toString(); 
	document.getElementById("DCCspd" + SN).innerHTML =  Slotsubdata[2].toString(); 
	document.getElementById("DCCDir" + SN).innerHTML =  Slotsubdata[3].toString(); 	
}

function LocoDatadisplay(LocoDatafeed)
{
	var Locoinfo = LocoDatafeed.split("+");
	
	var Locosubinfo;
	
	var Lcs;
	
	for (Lcs = 1; Lcs < Locoinfo.length ; Lcs++)
	{ 	
		Locosubinfo = Locoinfo[Lcs].split("-");
		LocoDatadisplaylineV1(Locosubinfo,Lcs)
	}
}

function LocoDatadisplaylineV1(Locosubinfo,Displayloco)
{
	var LN = Displayloco.toString();
	
	document.getElementById("LcE" + LN).innerHTML =   Locosubinfo[6].toString(); // enabled
	
	if (Locosubinfo[6] > 0)
	{
		document.getElementById("LcE" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcE" + LN).style.backgroundColor = "beige";		
	}	
	
	document.getElementById("LCTcde" + LN).innerHTML =   pad(Locosubinfo[2].toString(),4); 
	document.getElementById("LcRt" + LN).innerHTML =   pad(Locosubinfo[3].toString(),3); 
	
	if (Locosubinfo[3] > 0)
	{
		document.getElementById("LcRt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcRt" + LN).style.backgroundColor = "beige";		
	}	
	
	document.getElementById("LcSt" + LN).innerHTML =   pad(Locosubinfo[4].toString(),2); 
	
	if (Locosubinfo[4] > 0)
	{
		document.getElementById("LcSt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcSt" + LN).style.backgroundColor = "beige";		
	}	
	
	document.getElementById("LcSSt" + LN).innerHTML =   pad(Locosubinfo[5].toString(),2); 	
	
	if (Locosubinfo[5] > 0)
	{
		document.getElementById("LcSSt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcSSt" + LN).style.backgroundColor = "beige";		
	}	
	
	document.getElementById("LcPsSt" + LN).innerHTML =   pad(Locosubinfo[10].toString(),3); 
	
	if (Locosubinfo[10] > 0)
	{
		document.getElementById("LcPsSt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcPsSt" + LN).style.backgroundColor = "beige";		
	}	
	
	document.getElementById("LcCsSt" + LN).innerHTML =   pad(Locosubinfo[11].toString(),3); 
	
	if (Locosubinfo[11] > 0)
	{
		document.getElementById("LcCsSt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcCsSt" + LN).style.backgroundColor = "beige";		
	}	
	
	
	document.getElementById("LcNSSt" + LN).innerHTML =  pad(Locosubinfo[12].toString(),3); 
	
	if (Locosubinfo[12] > 0)
	{
		document.getElementById("LcNSSt" + LN).style.backgroundColor = "yellow";
	}
	else
	{
		document.getElementById("LcNSSt" + LN).style.backgroundColor = "beige";		
	}		
	
	document.getElementById("LcSpd" + LN).innerHTML =   pad(Locosubinfo[14].toString(),2); 
	document.getElementById("LcPSpd" + LN).innerHTML =   pad(Locosubinfo[15].toString(),2); 
	document.getElementById("LcDSpd" + LN).innerHTML =   pad(Locosubinfo[16].toString(),2); 
	document.getElementById("LcDir" + LN).innerHTML =   Locosubinfo[13].toString(); 
	document.getElementById("LCTcde" + LN).innerHTML =  pad(Locosubinfo[21].toString(),4);
	document.getElementById("LcCom" + LN).innerHTML =   pad(Locosubinfo[17].toString(),2); 
	document.getElementById("LcMflg" + LN).innerHTML =  Locosubinfo[18].toString(); 
	
	if (Locosubinfo[18] > 0)
	{
		document.getElementById("LcMflg" + LN).style.backgroundColor = "red";		
	}
	else
	{
		document.getElementById("LcMflg" + LN).style.backgroundColor = "beige";		
	}		
		
	document.getElementById("LcSlc" + LN).innerHTML =  Locosubinfo[24].toString(); 
	document.getElementById("LsSH" + LN).innerHTML =   Locosubinfo[9].toString(); 
	
	if (Locosubinfo[9] > 0)
	{
		document.getElementById("LsSH" + LN).style.backgroundColor = "yellow";		
	}
	else
	{
		document.getElementById("LsSH" + LN).style.backgroundColor = "beige";		
	}		
	
	document.getElementById("LsSM" + LN).innerHTML =   pad(Locosubinfo[26].toString(),3); 
	document.getElementById("LsSYH" + LN).innerHTML =   Locosubinfo[27].toString(); 
	document.getElementById("LcCtt" + LN).innerHTML =   pad(Locosubinfo[28].toString(),3);
	document.getElementById("LcCta" + LN).innerHTML =   pad(Locosubinfo[29].toString(),3);
	document.getElementById("Lclstf" + LN).innerHTML =  pad(Locosubinfo[30].toString(),1);	
}

function DeviceDatadisplay(TDevicedata)
{
	var TDinfo = TDevicedata.split("+");  	
	
	var TDsubinfo = TDinfo[1].split("-");		
	
	document.getElementById("DESt1").innerHTML = TDsubinfo[1].toString(); // enabled
	document.getElementById("DSt1").innerHTML = TDsubinfo[2].toString();  // status 
	document.getElementById("Dty1").innerHTML = TDsubinfo[3].toString();  // type
	document.getElementById("DUSt1").innerHTML = TDsubinfo[0].toString(); // Device number
	document.getElementById("TgSt1").innerHTML = TDsubinfo[4].toString();	
	document.getElementById("CTEt1").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt1").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt1").innerHTML = TDsubinfo[6].toString();
	
	var TDsubinfo = TDinfo[2].split("-");	
	
	document.getElementById("DESt2").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt2").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty2").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt2").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt2").innerHTML = TDsubinfo[4].toString();	
	document.getElementById("CTEt2").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt2").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt2").innerHTML = TDsubinfo[6].toString();
	
	var TDsubinfo = TDinfo[3].split("-");		
	
	document.getElementById("DESt3").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt3").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty3").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt3").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt3").innerHTML = TDsubinfo[4].toString();
	document.getElementById("CTEt3").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt3").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt3").innerHTML = TDsubinfo[6].toString();	
	
	var TDsubinfo = TDinfo[4].split("-");	
	
	document.getElementById("DESt4").innerHTML = TDsubinfo[1].toString(); // enabled
	document.getElementById("DSt4").innerHTML = TDsubinfo[2].toString();  // status 
	document.getElementById("Dty4").innerHTML = TDsubinfo[3].toString();  // type
	document.getElementById("DUSt4").innerHTML = TDsubinfo[0].toString(); // Device number
	document.getElementById("TgSt4").innerHTML = TDsubinfo[4].toString();	
	document.getElementById("CTEt4").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt4").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt4").innerHTML = TDsubinfo[6].toString();
	
	var TDsubinfo = TDinfo[5].split("-");		
	
	document.getElementById("DESt5").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt5").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty5").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt5").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt5").innerHTML = TDsubinfo[4].toString();	
	document.getElementById("CTEt5").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt5").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt5").innerHTML = TDsubinfo[6].toString();
	
	var TDsubinfo = TDinfo[6].split("-");		
	
	document.getElementById("DESt6").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt6").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty6").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt6").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt6").innerHTML = TDsubinfo[4].toString();
	document.getElementById("CTEt6").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt6").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt6").innerHTML = TDsubinfo[6].toString();	
	
	var TDsubinfo = TDinfo[7].split("-");		
	
	document.getElementById("DESt7").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt7").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty7").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt7").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt7").innerHTML = TDsubinfo[4].toString();	
	document.getElementById("CTEt7").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt7").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt7").innerHTML = TDsubinfo[6].toString();
	
	var TDsubinfo = TDinfo[8].split("-");		
	
	document.getElementById("DESt8").innerHTML = TDsubinfo[1].toString();
	document.getElementById("DSt8").innerHTML = TDsubinfo[2].toString();	
	document.getElementById("Dty8").innerHTML = TDsubinfo[3].toString();	
	document.getElementById("DUSt8").innerHTML = TDsubinfo[0].toString();
	document.getElementById("TgSt8").innerHTML = TDsubinfo[4].toString();
	document.getElementById("CTEt8").innerHTML = TDsubinfo[7].toString();	
	document.getElementById("CTAt8").innerHTML = TDsubinfo[5].toString();
	document.getElementById("CTTt8").innerHTML = TDsubinfo[6].toString();	
	
}

function Lsectionstatusupdate(Lsectiondata)
{
	var Lsectionelement = Lsectiondata.split(":");
	
	var LScount;
	
	for (LScount = 1;LScount < Lsectionelement.length;LScount++)
	{
		Lsectionelementrefresh(Lsectionelement[LScount]);		
	}
}

function Lsectionelementrefresh(Lsection)
{
	var Lsectionlinedetail = Lsection.split("-");
	
	var LsectionInteger = parseInt(Lsectionlinedetail[0]);
	
	var LSN = LsectionInteger.toString();
	
	var LsectionTcode = parseInt(Lsectionlinedetail[1]);	
	
	if (LsectionTcode == 0)
	{
		document.getElementById("LS-LSlr" + LSN).innerHTML = Lsectionlinedetail[1];
		document.getElementById("LS-LSlr" + LSN).style.backgroundColor = "beige";
		document.getElementById("LS-LShdr" + LSN).style.backgroundColor = "lightblue";
	}
	else
	{
		if (LsectionTcode == 999)
		{
			document.getElementById("LS-LSlr" + LSN).innerHTML = Lsectionlinedetail[1];
			document.getElementById("LS-LSlr" + LSN).style.backgroundColor = "yellow";
			document.getElementById("LS-LShdr" + LSN).style.backgroundColor = "orange";					
		}
		else
		{
			document.getElementById("LS-LSlr" + LSN).innerHTML = Lsectionlinedetail[1];
			document.getElementById("LS-LSlr" + LSN).style.backgroundColor = "lightgreen";
			document.getElementById("LS-LShdr" + LSN).style.backgroundColor = "lightgreen";			
		}		
	}
	
	
	//console.log("LS:",LSN," Tcode:",LsectionTcode);
	
}

function Psectionstatusupdate(Psectiondata)
{
	var Psectionelement = Psectiondata.split(" ");  	
	
	var PScount; 	
	
	for (PScount = 0;PScount < (Psectionelement.length - 1); PScount++)
	{
		Psectionelementrefresh(Psectionelement[PScount]);		
	}	
}

function Psectionelementrefresh(section)
{
	var Psectionelementdetail;
	
	var PsectionIDstr = 
	
	//var Psectioninteger;
	
	//console.log(" Section: ",section);
	
	Psectionelementdetail = section.split("-");	
	
	Psectioninteger = parseInt(Psectionelementdetail[0]);
	Psectionvalue   = parseInt(Psectionelementdetail[1]);	
	
	var PsectionIDstr = "PS-PS" + Psectioninteger.toString();
	
	//console.log(" Section: ",PsectionIDstr," ",Psectionvalue);
	
	if (Psectionvalue > 0)
	{
		document.getElementById(PsectionIDstr).style.backgroundColor = "green";
		document.getElementById(PsectionIDstr).style.color = "white";		
	}
	else
	{
		document.getElementById(PsectionIDstr).style.backgroundColor = "beige";
		document.getElementById(PsectionIDstr).style.color = "black";
	}
}

function pad(num, size)
{
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function Resetstop()
{
	document.getElementById("Stopmsg").innerHTML = "Reset all stop requests";
	
	var Stopreqcode = "DSsreq-000-000-000-000-000-000-0000-3-0.dat";
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200)
		{
		var res1 = this.responseText;  
		
		document.getElementById("checkmsg").innerHTML = res1;		
  
		//document.getElementById("Stopmsgresp").innerHTML = res1;        
		}
	};
  xhttp.open("GET",Stopreqcode, true);  
  document.getElementById("Stopmsgresp").innerHTML = "Reset message sent->"+ Stopreqcode;  
  
  xhttp.send();		
}





