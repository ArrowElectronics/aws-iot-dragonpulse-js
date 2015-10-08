//init some globals
var chartNetwork;
var nInterval;
var dInterval;
var pInterval;
var gInterval;

//Create some consts
const DB_API = '';

const PROCESS_ENDPOINT = '/monitor/process';
const NETWORK_ENDPOINT = '/monitor/network';
const DISK_ENDPOINT = '/monitor/disk';
const GENERAL_ENDPOINT = '/monitor/general';

const LOCAL_PROCESS_ENDPOINT = 'process.json';
const LOCAL_NETWORK_ENDPOINT = 'network.json';
const LOCAL_DISK_ENDPOINT = 'disk.json';
const LOCAL_GENERAL_ENDPOINT = 'general.json';

const DEBUG=false;

//---------------------------------------

// replace string placeholders with values
// 'this is a value of {1}'.apply(100) ===> 'this is a value of 100'
String.prototype.apply = function() {
    var a = arguments;

    return this.replace(/\{(\d+)\}/g, function(m, i) {
        return a[i - 1];
    });
};

//---------------------------------------

Array.prototype.has = function(v) {
    return $.inArray(v, this) > -1;
};

//---------------------------------------
// UI LIB
//---------------------------------------

(function (uilib, $, undefined){

    uilib.refreshData = function(thingId, dType){

      var params={};
  	 	//params.limit=10;

      var baseUrl='';
      if(DEBUG){
        baseUrl='{1}/{2}';
      }
      else{
        baseUrl='{1}/things/{2}{3}';
      }

      var actionUrl='';
      var readFn;
      var alwaysFn;
      var validParams = false;

      if(thingId){
        if(dType){
          if(dType==='process'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(thingId, LOCAL_PROCESS_ENDPOINT);
            }
            else{
                 actionUrl = baseUrl.apply(DB_API, thingId, PROCESS_ENDPOINT);
            }
            readFn = uilib.readProcessData;
            alwaysFn = uilib.alwaysProcess;
            validParams = true;
          }
          else if(dType==='network'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(thingId, LOCAL_NETWORK_ENDPOINT);
            }
            else{
                actionUrl = baseUrl.apply(DB_API, thingId, NETWORK_ENDPOINT);
            }
            readFn = uilib.readNetworkData;
            alwaysFn = uilib.alwaysNetwork;
            validParams = true;
          }
          else if(dType==='disk'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(thingId, LOCAL_DISK_ENDPOINT);
            }
            else{
                  actionUrl = baseUrl.apply(DB_API, thingId, DISK_ENDPOINT);
            }
            readFn = uilib.readDiskData;
            alwaysFn = uilib.alwaysDisk;
            validParams = true;
          }
          else if(dType==='general'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(thingId, LOCAL_GENERAL_ENDPOINT);
            }
            else{
                actionUrl = baseUrl.apply(DB_API, thingId, GENERAL_ENDPOINT);
            }
            readFn = uilib.readGeneralData;
            alwaysFn = uilib.alwaysGeneral;
            validParams = true;
          }
          else{
            //invalid data type
            console.log('invalid data type');
          }
        }
        else{
          //must contain type
          console.log('no data type');
        }
      }
      else{
        //must have thing id
        console.log('no thing id');
      }

      //if valid params then make the ajax call
      if(validParams){
        var jqxhr = $.ajax({
          url: actionUrl,
          crossDomain: true,
          jsonp: false,
          cache: false,
          data: params
        })
        .done(readFn)
        .fail(function(data,txtStatus,jqXHR){
            console.log('fail get' + data + txtStatus);
        })
        .always(alwaysFn);
      }

    return false;

    };

    //---------------------------------------

    uilib.readProcessData = function (data, txtStatus, jqXHR){
        //fill #process_summary-table-rows
        //fill #process-table-rows
        var processSummaryElement = $('#process_summary-table-rows');
        var processElement = $('#process-table-rows');
        var pUpdate=$('#process-update');

        var memoryUnits=['K','M','B'];

        var processObject;
        if (DEBUG) {
            processObject = JSON.parse(data);
        } else {
            processObject = data;
        }

        if(processObject){

            var psmatrix=[];

            var processRow=[];
            processRow.push('Processes');
            var processStr = '{1} total, {2} running, {3} sleeping, {4} zombie';
            if(processObject.tasks.length==4){
                processRow.push( processStr.apply(processObject.tasks[0]
                                                ,processObject.tasks[1]
                                                ,processObject.tasks[2]
                                                ,processObject.tasks[3]));
            }
            psmatrix.push(processRow);

            var memoryRow=[];
            memoryRow.push('Memory');
            var memoryStr = '{1} total, {2} used, {3} free, {4} buffers';
            if(processObject.memory.length==4){
                memoryRow.push( memoryStr.apply(prettyPrintSizeMetric(processObject.memory[0],memoryUnits,'')
                                                ,prettyPrintSizeMetric(processObject.memory[1],memoryUnits,'')
                                                ,prettyPrintSizeMetric(processObject.memory[2],memoryUnits,'')
                                                ,prettyPrintSizeMetric(processObject.memory[3],memoryUnits,'')));
            }
            psmatrix.push(memoryRow);

            var loadRow=[];
            loadRow.push('Load Avg');
            var loadStr='{1}, {2}, {3}';
            if(processObject.loadAvg.length==3){
                loadRow.push(loadStr.apply(processObject.loadAvg[0]
                                            ,processObject.loadAvg[1]
                                            ,processObject.loadAvg[2] ));
            }
            psmatrix.push(loadRow);

            var cpuRow=[];
            cpuRow.push('CPU Usage');
            var cpuStr='{1}% user, {2}% system, {3}% idle';
            if(processObject.cpuUsage.length==3){
                cpuRow.push(cpuStr.apply(processObject.cpuUsage[0]
                                            ,processObject.cpuUsage[1]
                                            ,processObject.cpuUsage[2] ));
            }
            psmatrix.push(cpuRow);

            processSummaryElement.html(buildTableRow(psmatrix, -1));

            var plist = processObject.processList;
            var pmatrix =[];

            if(plist.length > 0){
                for(var i=0; i<plist.length; i++){
                  var process=plist[i];
                    if(process){
                        var pRow=[];
                        pRow.push(process.pid);
                        pRow.push(process.user);
                        // removed
                        //pRow.push(process.priority);
                        //pRow.push(process.nice);
                        pRow.push(process.state);
                        pRow.push(process.cpu);
                        pRow.push(prettyPrintSizeMetric(process.memory,memoryUnits,''));
                        pRow.push(process.ttime);
                        pRow.push(process.command);

                        pmatrix.push(pRow);
                    }
                }
            }

           processElement.html(buildTableRow(pmatrix, 5));

          var updateTime = moment.utc(processObject.timestamp);
          manageCallbackResult(pUpdate, updateTime.from(moment()));
        }
        else{
          manageCallbackResult(pUpdate, '<span class=\"text-warning\">invalid json</span>');
        }
    };

    //---------------------------------------


    uilib.alwaysProcess = function(data, txtStatus, jqXHR){
        var pUpdate=$('#process-update');

        if(jqXHR.status === 200){
          //manageCallbackResult(pUpdate, moment().format('YYYY-MM-DD hh:mm:ss'));
        }
        else{
          manageCallbackResult(pUpdate,'<span class=\"text-danger\">ajax error</span>');
        }
    };

    //---------------------------------------

    uilib.readNetworkData = function (data, txtStatus, jqXHR){
        //fill #network-table-rows
        var networkElement = $('#network-table-rows');
        var nUpdate=$('#network-update');

        var networkGraphData={};

        var networkObject;
        if (DEBUG) {
            networkObject = JSON.parse(data);
        } else {
            networkObject = data;
        }

        if(networkObject){
            var matrix = [];

            var interfaceRow=[];
            interfaceRow.push('Interface');
            interfaceRow.push(networkObject.nInterface);
            matrix.push(interfaceRow);

            var ipRow=[];
            ipRow.push('IP Address');
            ipRow.push(networkObject.ipAddress);
            matrix.push(ipRow);

            var macRow=[];
            macRow.push('MAC Address');
            macRow.push(networkObject.macAddress);
            matrix.push(macRow);

            networkElement.html(buildTableRow(matrix));

            //network rate is so low - we'll do it in Bytes
            //originall we send in Kb
            networkGraphData.columns=[];
            var sendCol=[];
            sendCol.push('send');
            sendCol.push(networkObject.totalSendRate * 1000);
            var recvCol=[];
            recvCol.push('recv');
            recvCol.push(networkObject.totalRecvRate * 1000);

            networkGraphData.columns.push(sendCol);
            networkGraphData.columns.push(recvCol);

            var updateTime = moment.utc(networkObject.timestamp);
            manageCallbackResult(nUpdate, updateTime.from(moment()));
        }
        else{
          manageCallbackResult(nUpdate, '<span class=\"text-warning\">invalid json</span>');
        }

        //load #network-graph
       if(networkGraphData.columns){
           chartNetwork.load(networkGraphData);
       }
    };

    //---------------------------------------

    uilib.alwaysNetwork = function(data, txtStatus, jqXHR){
        var nUpdate=$('#network-update');

        if(jqXHR.status === 200){
        }
        else{
          manageCallbackResult(nUpdate,'<span class=\"text-danger\">ajax error</span>');
        }
    };

    //---------------------------------------

    uilib.readDiskData = function (data, txtStatus, jqXHR){
        //fill #disk-list-items
        var diskElement = $('#disk-list-items');
        var dUpdate=$('#disk-update');

        var diskObject;
        if (DEBUG) {
            diskObject = JSON.parse(data);
        } else {
            diskObject = data;
        }
        var content='';

        if(diskObject){

            var dlist = diskObject.directoryList;
            if(dlist.length > 0){
                for(var i=0; i<dlist.length; i++){
                    var item = dlist[i];
                    if(item){
                        content+=buildDiskListItem(item, ['tmpfs']);
                    }
                }
            }

            diskElement.html(content);

            var updateTime = moment.utc(diskObject.timestamp);
            manageCallbackResult(dUpdate, updateTime.from(moment()));
        }
        else{
          manageCallbackResult(dUpdate, '<span class=\"text-warning\">invalid json</span>');
        }
    };

    //---------------------------------------

    uilib.alwaysDisk = function(data, txtStatus, jqXHR){
        var dUpdate=$('#disk-update');

        if(jqXHR.status === 200){
          //manageCallbackResult(dUpdate, moment().format('YYYY-MM-DD hh:mm:ss'));
        }
        else{
          manageCallbackResult(dUpdate,'<span class=\"text-danger\">ajax error</span>');
        }

    };

    //---------------------------------------

    uilib.readGeneralData = function (data, txtStatus, jqXHR){
        //fill #general-table-rows
        var generalElement = $('#general-table-rows');
        var gUpdate=$('#general-update');

        var generalObject;
        if (DEBUG) {
            generalObject = JSON.parse(data);
        } else {
            generalObject = data;
        }
        if(generalObject){
            var matrix = [];

            var osRow=[];
            osRow.push('OS');
            var osStr='{1} {2} {3}';
            osRow.push(osStr.apply(prettyPrintEmpty(generalObject.osVariant)
                                  ,prettyPrintEmpty(generalObject.osVersion)
                                  ,prettyPrintEmpty(generalObject.osCodename)));
            matrix.push(osRow);

            var buildRow=[];
            buildRow.push('Build');
            buildRow.push(generalObject.build);
            matrix.push(buildRow);

            var archRow=[];
            archRow.push('Architecture');
            var archStr=generalObject.architecture;

            if(generalObject.architecture=='aarch64'){
              archStr+=' (ARM 64-bit)';
            }
            archRow.push(archStr);
            matrix.push(archRow);

            var thingRow=[];
            thingRow.push('Machine-id');
            thingRow.push(generalObject.thingId);
            matrix.push(thingRow);

            var timeRow=[];
            timeRow.push('Time');
            timeRow.push(moment.utc(generalObject.timestamp).format('YYYY-MM-DD hh:mm:ss'));
            matrix.push(timeRow);

            generalElement.html(buildGeneralInformationTable(generalObject.deviceType, matrix));

            var updateTime = moment.utc(generalObject.timestamp);
            manageCallbackResult(gUpdate, updateTime.from(moment()));
        }
        else{
          manageCallbackResult(gUpdate, '<span class=\"text-warning\">invalid json</span>');
        }
    };

    //---------------------------------------

    uilib.alwaysGeneral = function(data, txtStatus, jqXHR){
        var gUpdate=$('#general-update');

        if(jqXHR.status === 200){
          //manageCallbackResult(gUpdate, moment().format('YYYY-MM-DD hh:mm:ss'));
        }
        else{
          manageCallbackResult(gUpdate,'<span class=\"text-danger\">ajax error</span>');
        }
    };
    
    //---------------------------------------

    function manageCallbackResult(element, message){
      if(element){
        element.html(message);
      }
    }

}(window.uilib = window.uilib || {}, $));

//---------------------------------------

$(document).ready(function() {

//db2
 var thingId='a5be1bec055448b4979aefd3fc3833e2';

 chartNetwork = c3.generate({
    bindto: '#network-graph',
    size: {
        height: 67
    },

    bar: {
        width: 15
    },

    padding: {
        top: 0
    },
    data: {
        columns: [
        ],
        types: {
            send: 'bar',
            recv: 'bar'
        },
        colors: {
            recv: '#3D9AD0',
            send: '#FF3B00'
        }
    },
    axis: {
        rotated: true,
        x: {
            show: false,
            tick: {
                rotate: 0,
                multiline: false,
                outer: false,
                color: '#f00'
            }

        },
        y: {
            tick: {
                count: 6,
                outer:false,
                format: function (y) { return Math.floor(y); },
                padding: {
                    bottom: 50
                }
            }
        }
    },
    legend: {
        show: false
    }
  });

 //---------------------------------------
 // Set refresh intervals
 //---------------------------------------

  //disk
  dInterval = setInterval(function(){
    uilib.refreshData(thingId,'disk')
  }, 5000);

  //process
  pInterval = setInterval(function(){
    uilib.refreshData(thingId,'process')
  }, 1000);

  //network
  nInterval = setInterval(function(){
    uilib.refreshData(thingId,'network')
  }, 1000);

  //general
  gInterval = setInterval(function(){
    uilib.refreshData(thingId,'general')
  }, 30000);
  
});

//---------------------------------------

/*
$(function() {
    var timeout;
    $(window).on('resize', function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
            // Adjust spacings of 0 and 20 ticks
            $($('#network-graph.c3 .c3-axis.c3-axis-y g.tick text')[0]).css('text-anchor', 'start');
            $($('#network-graph.c3 .c3-axis.c3-axis-y g.tick text')[5]).css('text-anchor', 'end');

            // Equal height on the first 3 panels
            var heights = $(".panel-eq-height").map(function () {
                        return $(this).height();
                    }).get(),
                maxHeight = Math.max.apply(null, heights);

            $(".panel-eq-height").height( $(window).width() > 974 ? maxHeight : 'auto' );
        }, 150);
    });
    setTimeout(function() {
        $(window).trigger('resize');
    }, 150);
});
*/

//---------------------------------------
// HELPER FUNCTIONS
//---------------------------------------

function setElementStatus(elem, status){
    if(elem){
        elem.html(status);
    }
}

function enableButton(elem, enable){
    if(elem){
        if(enable){
            if(elem.hasClass('disabled')){
                elem.removeClass('disabled');
            }
        }
        else{
            if(elem.hasClass('disabled')){

            }
            else{
                elem.addClass('disabled');
            }
        }
    }
}

//enable the element to off/on, if writeOff is true, then add the off class
function enableElement(elem, enable, writeOff){
    
    var OFF_STATUS='off';
    var ON_STATUS='on';
    
    //default to be off
    var desiredStatus=OFF_STATUS;
    var currentStatus=ON_STATUS;
    
    if(enable){
        desiredStatus=ON_STATUS;
        currentStatus=OFF_STATUS;
    }
    else{
        desiredStatus=OFF_STATUS;
        currentStatus=ON_STATUS;
    }
    
    if(elem){
       //remove the current status
       if(elem.hasClass(currentStatus)){
           elem.removeClass(currentStatus);
       } 
       
       //add the desired status
       if(!elem.hasClass(desiredStatus)){
           var writeState=true;
           
           if(desiredStatus===OFF_STATUS && !writeOff){
               writeState=false;
           }
           if(writeState){
               elem.addClass(desiredStatus);
           } 
       }
    }
}

function prettyPrintEmpty(input){
  if(input){
    return input;
  }

  return '';
}


function buildGeneralInformationTable(device, matrix){
    var content='';
    if(device){
        //build a custom 
        if(device=='DragonBoard'){
            content+='<tr><td>Device</td><td class=\"db-logo\"><span class=\"red\">Dragon</span><span class=\"black\">Board</span><sup>&trade;</sup>410c</td></tr>';
        }
        else{
            content+='<tr><td>Device</td><td>{1}</td></tr>'.apply(device);
        }
    }

    content+=buildTableRow(matrix, -1);
    return content;
}

//build individual disk items
function buildDiskListItem(diskObject, filterFileSystem){
    var content='';
    if(diskObject){
        //filter out some uncessary file systems
        if(!filterFileSystem.has(diskObject.filesystem)){
          var calcPercent = 100.0;
          var usedM = Number(diskObject.used);
          var totalM = Number(diskObject.fSize);
          if(usedM > 0 && totalM > 0){
             calcPercent-=((usedM/totalM)*100);
             calcPercent = roundToTwo(calcPercent);
          }

          //use default size metric at Mb
          var descrip='{1}, {2}% free'.apply(prettyPrintSizeMetric(totalM,null,'total'),calcPercent);
          content+='<li><strong><code>{1}</code></strong><br/><small>{2}</small>{3}</li>'.apply(diskObject.mounted, descrip, buildProgressBar(calcPercent));
        }
    }
    return content;
}

//pretty print the size with a default base of Megabytes
//units is in the form [base, up, down], ie [M, G, K]
function prettyPrintSizeMetric(numSize, customUnits, label){
  var defaultUnits = ['M','G','K'];
  var units = defaultUnits;

  if(customUnits){
      units = customUnits;
  }

  numSize=Number(numSize);

  var result='';
  if(numSize >= 0){
      if(numSize > 999){
          //convert to Gb
          var inG = numSize/1000;
          result+='{1}{2} {3}'.apply(inG, units[1], label);
      }
      else{
          result+='{1}{2} {3}'.apply(numSize, units[0], label);
      }
  }
  else{
      //this is less than 1M, lets downsize to Kb
      var inK = numSize*1000;
      result+='{1}{2} {3}'.apply(inK, units[2], label);
  }
  return result;
}

//build the progress bar - taking in a percent
function buildProgressBar(percent){
    var content='';
    if(percent){
        content+='<div class=\"progress bar-storage\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{1}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:{2}%;\"><span class=\"sr-only\">{3}% Free</span></div></div>'.apply(percent,percent,percent);
    }
    return content;
}

//given a matrix, which represents the table, print out all the rows
function buildTableRow(matrix, emphasisColumn){
    var hasEmphasis = false;

    if(emphasisColumn >= 0){
        hasEmphasis=true;
    }
    //matrix should be an array
    //each element will be another array
    var content='';

    if(matrix){
        if(matrix.length > 0){
            for(var i=0; i<matrix.length; i++){
                var row = matrix[i];
                if(row){
                    var rowContent='';

                    if(row.length > 0){
                        for(var j=0; j<row.length; j++){
                            var temp = row[j];
                            if(temp){

                                var rowWritten=false;

                                if(hasEmphasis){
                                    if(j==emphasisColumn){
                                        rowContent+='<td class=\"emphasis\">';
                                        rowWritten=true;
                                    }
                                }

                                if(!rowWritten){
                                     rowContent+='<td>';
                                }
                                // we should probably do some sanitizing here for items that might not adhere to html
                                // but we will leave it as a todo
                                rowContent+=temp;
                                rowContent+='</td>'
                            }
                        }
                    }

                    //make sure we have rowContent before adding to our global content stream
                    if(rowContent){
                        content+='<tr>';
                        content+=rowContent;
                        content+='</tr>';
                    }
                }
            }
        }
    }

    return content;
}

//round to 2 sig digits
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
