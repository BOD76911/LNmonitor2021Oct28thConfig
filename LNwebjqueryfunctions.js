//******************************************************************************************************
//
//  LNwebjqueryfunctions.js - file of jquery functions to process graphics on LNP21NG.html 
//                     via LNwebmon server 
//
//						July 2021
//
//
//******************************************************************************************************
//

var Schedulenumber;

var Schedulecomponent;

var Schedcompvalue;

$(document).ready(function() {
 $("#Schedulertable:has(td)").mouseover(function(e) 
	{	 
		$(this).css("cursor", "pointer");
	});
 
 $("#Schedulertable td").click(function() 
	{      
       Schedulecomponent = parseInt( $(this).index() ) + 1;
       Schedulenumber  = parseInt( $(this).parent().index() );     
    });
 
  
 $("#Schedulertable:has(td)").click(function(e) 
	{
		$("#Schedulertable td").removeClass("highlight");
		var clickedCell= $(e.target).closest("td");
		clickedCell.addClass("highlight");
		Schedcompvalue = clickedCell.text();
		$("#result").html( "Clicked Scheduler:" + Schedulenumber  + "  , Component:"+ Schedulecomponent + " value:" + Schedcompvalue);  
		FetchSchedJourneyRoutedetail(Schedulenumber,Schedulecomponent,Schedcompvalue);
		});
	});

