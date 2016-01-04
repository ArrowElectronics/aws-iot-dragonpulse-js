//init some globals
var chartNetwork;
var nInterval;
var dInterval;
var pInterval;

//moved to config.js
//const DB_API = '';

const THINGS_ENDPOINT='/things';
const PROCESS_ENDPOINT = '/monitor/process';
const NETWORK_ENDPOINT = '/monitor/network';
const DISK_ENDPOINT = '/monitor/disk';
const GENERAL_ENDPOINT = '/monitor/general';

const LOCAL_PROCESS_ENDPOINT = 'process.json';
const LOCAL_NETWORK_ENDPOINT = 'network.json';
const LOCAL_DISK_ENDPOINT = 'disk.json';
const LOCAL_GENERAL_ENDPOINT = 'general.json';
const LOCAL_THINGS_ENDPOINT= 'things.json';

//---------------------------------------

/**
 * add an apply to string
 * replace string placeholders with values
 * 'this is a value of {1}'.apply(100) ===> 'this is a value of 100'
 */
String.prototype.apply = function() {
    var a = arguments;

    return this.replace(/\{(\d+)\}/g, function(m, i) {
        return a[i - 1];
    });
};

//---------------------------------------

/**
 * add a has to array
 * returns true if array contains the string
 * @param {string} v - value to search for
 */
Array.prototype.has = function(v) {
    return $.inArray(v, this) > -1;
};

//---------------------------------------

/**
 * extract the key, we assume the key to be constructed using -
 * @param {string} input - original string
 * @param {number} idx - index to return, starts at 0
 */
function extractKey(input, idx){
  // console.log('extracting: ' + input);
  if(input){
    var sp= input.split('-');
    if(idx){
      // console.log('extracted: ' + sp[idx]);
      return sp[idx];
    }
    else{
      // console.log('extracted: ' + sp[1]);
      return sp[1];
    }
  }
  return '';
}

//---------------------------------------
// UI LIB
//---------------------------------------

(function (uilib, $, undefined){
    
    /**
     * generic function to make ajax calls
     * @param {string} thingId - the thingId to get data about
     * @param {string} dType - the type of data to query for
     */
    uilib.refreshData = function(thingId, dType){

      var params={};
  	 	//params.limit=10;

      var baseUrl=''+DB_API;

      if(DEBUG){
        baseUrl='{1}{2}/{3}';
      }
      else{
        baseUrl+='{1}/{2}{3}';
      }

      var actionUrl='';
      var readFn;
      var alwaysFn;
      var validParams = false;

      if(thingId){
        if(dType){
          if(dType==='process'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, LOCAL_PROCESS_ENDPOINT);
            }
            else{
                 actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, PROCESS_ENDPOINT);
            }
            readFn = uilib.readProcessData;
            alwaysFn = uilib.alwaysProcess;
            validParams = true;
          }
          else if(dType==='network'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, LOCAL_NETWORK_ENDPOINT);
            }
            else{
                actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, NETWORK_ENDPOINT);
            }
            readFn = uilib.readNetworkData;
            alwaysFn = uilib.alwaysNetwork;
            validParams = true;
          }
          else if(dType==='disk'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, LOCAL_DISK_ENDPOINT);
            }
            else{
                  actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, DISK_ENDPOINT);
            }
            readFn = uilib.readDiskData;
            alwaysFn = uilib.alwaysDisk;
            validParams = true;
          }
          else if(dType==='general'){
            if(DEBUG){
                 actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, LOCAL_GENERAL_ENDPOINT);
            }
            else{
                actionUrl = baseUrl.apply(THINGS_ENDPOINT, thingId, GENERAL_ENDPOINT);
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
          contentType: 'application/json',
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
    // PROCESS
    //---------------------------------------
    
    /**
     * read the successful data for process topic
     * @param {object} data - topic should return a JSON object
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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

    /**
     * on the return of the ajax call, a catch-all to display error message for the user
     * @param {object} data - returned data from ajax call
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
    // NETWORK
    //---------------------------------------
    
    /**
     * read the successful data for network topic
     * @param {object} data - topic should return a JSON object
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
    
    /**
     * on the return of the ajax call, a catch-all to display error message for the user
     * @param {object} data - returned data from ajax call
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
    uilib.alwaysNetwork = function(data, txtStatus, jqXHR){
        var nUpdate=$('#network-update');

        if(jqXHR.status === 200){
        }
        else{
          manageCallbackResult(nUpdate,'<span class=\"text-danger\">ajax error</span>');
        }
    };

    //---------------------------------------
    // DISK
    //---------------------------------------
    
    /**
     * read the successful data for disk topic
     * @param {object} data - topic should return a JSON object
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
   
    /**
     * on the return of the ajax call, a catch-all to display error message for the user
     * @param {object} data - returned data from ajax call
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
    // GENERAL
    //---------------------------------------
    
    /**
     * read the successful data for general topic
     * @param {object} data - topic should return a JSON object
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
    
    /**
     * on the return of the ajax call, a catch-all to display error message for the user
     * @param {object} data - returned data from ajax call
     * @param {string} txtStatus - standard return from jquery ajax
     * @param {object} jqXHR - jquery handle
     */
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
    // THINGS
    //---------------------------------------
    
    uilib.getThings = function(){
        
        var baseUrl='';
        var actionUrl='';
        
        if(DEBUG){
            baseUrl='{1}/{2}';
            actionUrl = baseUrl.apply(THINGS_ENDPOINT, LOCAL_THINGS_ENDPOINT);
        }
        else{
            baseUrl='{1}/{2}';
            actionUrl = baseUrl.apply(DB_API, THINGS_ENDPOINT);
        }

        $('#menu-select-device').html('<li><a href=\"#\"><img src=\"gfxs/ajax-loader.gif\"/> getting things...</a></li>');

        var jqxhr = $.ajax({
          url: actionUrl,
          crossDomain: true,
          jsonp: false,
          cache: false,
          contentType: 'application/json'
        })
        .done(uilib.readThingsData)
        .fail(uilib.alwaysThings);
    }

    //---------------------------------------
    
    uilib.readThingsData = function (data, txtStatus, jqXHR){
        //fill #menu-select-device
        var sAlert=$('#status-alert');

        var thingsObj;
        if (DEBUG) {
            thingsObj = JSON.parse(data);
        } else {
            thingsObj = data;
        }
        if(thingsObj){
          var menuDevices = $('#menu-select-device');
          var menuContent='';
          var menuListTemplate='<li><a href=\"#\" id=\"device-{1}\" class=\"btn-device\">{2}</a></li>';

          if(thingsObj.length > 0){
            for(var i in thingsObj){
              var aThing = thingsObj[i];
              var dId = aThing.thingId;
              if(dId){
                var aStr = menuListTemplate.apply(dId, dId);
                menuContent+=aStr;
              }
            }
          }

          menuDevices.html(menuContent);

          manageStatusAlert(sAlert, false, '');
        }
        else{
          manageStatusAlert(sAlert, true, '<span class=\"text-warning\">invalid json</span>');
        }
    };

    //---------------------------------------

    uilib.alwaysThings = function(data, txtStatus, jqXHR){

        var sAlert=$('#status-alert');

        if(jqXHR.status === 200){
          //manageCallbackResult(gUpdate, moment().format('YYYY-MM-DD hh:mm:ss'));
        }
        else{
          manageStatusAlert(sAlert, true, '<span class=\"text-danger\">ajax error : could not get list of devices</span>');
        }
    };

    //---------------------------------------
    // STATUS / CALLBACKS
    //---------------------------------------

    /**
     * write the status into an element
     * @param {object} element - jquery handle to the element
     * @param {string} message - string to paint into html dom
     */
    function manageCallbackResult(element, message){
      if(element){
        element.html(message);
      }
    }

    //---------------------------------------

    function manageStatusAlert(element, enable, message){
      if(element){
        if(enable){
          element.show();
        }
        else{
          element.hide();
        }

        if(message){
          element.html(message);
        }
      }
    }

}(window.uilib = window.uilib || {}, $));

//---------------------------------------
// DOCUMENT READY
//---------------------------------------

$(document).ready(function() {
   
 //chart for network, using the c3 library
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

  $(document).on('click', '#btn-select-device', function(e){
    //execute ajax to pull in device data
    uilib.getThings();
    return false;
  });

  //---------------------------------------

  $(document).on('click', '.btn-device', function(e){
     // console.log('btn-device entered');
     var deviceAgg = $(this).attr('id');
     //extract the device id and put it into THING_ID
     var deviceId = extractKey(deviceAgg, 1);
     if(deviceId){
        THING_ID = deviceId;
        //all the other events have to cascade off this choice
       
        //reset the intervals
        clearInterval(dInterval);
        clearInterval(pInterval);
        clearInterval(nInterval);

        dInterval = setInterval(function(){
          uilib.refreshData(THING_ID,'disk')
        }, DISK_REFRESH_INTERVAL);

        //process
        pInterval = setInterval(function(){
          uilib.refreshData(THING_ID,'process')
        }, PROCESS_REFRESH_INTERVAL);

        //network
        nInterval = setInterval(function(){
          uilib.refreshData(THING_ID,'network')
        }, NETWORK_REFRESH_INTERVAL);

        //we only need to call general once
        uilib.refreshData(THING_ID,'general');

        $('#current-thing').html(THING_ID);
        //reset the menu when we select something
        $('#btn-select-device').dropdown('toggle');
     }
     return false;
  });
  
}); //end document ready

//---------------------------------------
// HELPER FUNCTIONS
//---------------------------------------

/**
 * set the html of an element
 * @param {object} elem - a jquery handle to the element
 * @param {string} status - the html to paint
 */
function setElementStatus(elem, status){
    if(elem){
        elem.html(status);
    }
}

//---------------------------------------

/**
 * check to see if it's null or empty, if it is print nothing
 * @param {object} input - could be string or object
 */
function prettyPrintEmpty(input){
  if(input){
    return input;
  }

  return '';
}

//---------------------------------------

/**
 * build general information, we make a specific case for dragonboard so we can display the logo
 * @param {string} device - the device type
 * @param {array} matrix - 2d array that represents a table
 */
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

//---------------------------------------

/**
 * build individual disk items
 * @param {object} diskObject - a custom object representing disk
 * @param {array} filterFileSystem - filter some of the disk data based on the filesystem
 */
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

//---------------------------------------

/**
 * pretty print the size with a default base of Megabytes
 * units is in the form [base, up, down], ie [M, G, K]
 * @param {number} numSize - the original number
 * @param {char} customUnits - the unit to convert to
 * @param {string} label - the label to be appended to the display string
 */
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

//---------------------------------------

/**
 * build a bootstrap progress bar - taking in a percent
 * @param {number} percent - the percent bar complete
 */
function buildProgressBar(percent){
    var content='';
    if(percent){
        content+='<div class=\"progress bar-storage\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{1}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:{2}%;\"><span class=\"sr-only\">{3}% Free</span></div></div>'.apply(percent,percent,percent);
    }
    return content;
}

//---------------------------------------

/**
 * given a matrix, which represents the table, print out all the rows
 * @param {array} matrix - 2 dimensional array, representing a table
 * @param {boolean} emphasisColumn - flag to control adding emphasis class
 */ 
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

//---------------------------------------

/**
 * round to 2 significant digits
 * @param {number} num - float to be rounded
 */
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
