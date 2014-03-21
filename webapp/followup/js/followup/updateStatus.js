function sendStart(urlPath,fabOrderId, taskId, taskOriginalStatus) {
    $.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {fabricationOrderId: fabOrderId, workEffortId: taskId, currentStatusId: taskOriginalStatus},
            dataType: 'json',
            success: function (data) {
                if (data._ERROR_MESSAGE_ ) {
                    //Error occured
                    showErrorAlert('Erreur',data._ERROR_MESSAGE_);
                    return;
                } else {
                    <!-- modify status class -->
                    statusChangeIcon("start", taskId);
                    spriteAnimation();
                    <!-- Show buttons -->
                    document.getElementById(taskId+"startButton").style.display = "none";
                    document.getElementById(taskId+"pauseButton").style.display = "block";
                    document.getElementById(taskId+"resumeButton").style.display = "none";
                    document.getElementById(taskId+"stopButton").style.display = "block";
                }
            }
    });
}
function sendPause(urlPath,taskId) {
    $.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {workEffortId: taskId},
            dataType: 'json',
            success: function (data) {
                if (data._ERROR_MESSAGE_ ) {
                    //Error occured
                    showErrorAlert('Erreur',data._ERROR_MESSAGE_);
                    return;
                } else {
                    <!-- modify task -->
                    statusChangeIcon("pause", taskId);
                    spriteAnimation();

                    <!-- Show buttons -->
                    document.getElementById(taskId+"startButton").style.display = "none";
                    document.getElementById(taskId+"pauseButton").style.display = "none";
                    document.getElementById(taskId+"resumeButton").style.display = "block";
                    document.getElementById(taskId+"stopButton").style.display = "block";
                }
            }
    });
}

function sendResume(urlPath,taskId) {
	$.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {workEffortId: taskId},
            dataType: 'json',
            success: function (data) {
                if (data._ERROR_MESSAGE_ ) {
                    //Error occured
                    showErrorAlert('Erreur',data._ERROR_MESSAGE_);
                    return;
                } else {
                    <!-- modify task -->
                    statusChangeIcon("resume", taskId);
                    spriteAnimation();
                    <!-- Show buttons -->
                    document.getElementById(taskId+"startButton").style.display = "none";
                    document.getElementById(taskId+"pauseButton").style.display = "block";
                    document.getElementById(taskId+"resumeButton").style.display = "none";
                    document.getElementById(taskId+"stopButton").style.display = "block";
                }
            }
    });
}
function sendStop(urlPath,fabOrderId, taskId, taskOriginalStatus) {
    $.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {fabricationOrderId: fabOrderId, workEffortId: taskId, currentStatusId: taskOriginalStatus},
            dataType: 'json',
            success: function (data) {
                if (data._ERROR_MESSAGE_ ) {
                    //Error occured
                    showErrorAlert('Erreur',data._ERROR_MESSAGE_);
                    return;
                } else {
//                	document.location.reload()
                    <!-- modify status class -->
                    <!--    statusChangeIcon("stop",taskId);-->
                    <!--document.getElementById(taskId+"list").className = "list-line finished" ;-->
                    statusChangeIcon("stop", taskId);
                    spriteAnimation();
                    <!-- Show buttons -->
                    document.getElementById(taskId+"startButton").style.display = "none";
                    document.getElementById(taskId+"pauseButton").style.display = "none";
                    document.getElementById(taskId+"resumeButton").style.display = "none";
                    document.getElementById(taskId+"stopButton").style.display = "none";
                
                }
            }
    });
}

function statusChangeIcon(status,taskId) {
  var baseURL;
  var path;
  var elementDescript;
  var element;
  
  element = document.getElementById(taskId+"status");
  
  elementDescript = element.innerHTML ;
  baseURL = baseIconURLFromStatus(elementDescript);
  if(status == "start") {
    path = "background-image: url(&quot;../images/followup/sprite/5-percent/in-progress/inprogress";
  }
  if(status == "pause") {
    path = getIconBasePath(baseURL)+"pause/pause" ;
  }
  if(status == "resume") {
    path = getIconBasePath(baseURL)+"in-progress/inprogress" ;
  }
  if(status == "stop"){
    path = "background-image: url(&quot;../images/followup/sprite/finished/finished";
  }
  replaceIconPath(element,baseURL,path);
  if(status == "stop"){
    element.innerHTML = element.innerHTML.replace("data-frames=\"24","data-frames=\"47");
  }
  element = document.getElementById(taskId+"status-task-in-faborder");
  replaceIconPath(element,baseURL,path);
  if(status == "stop"){
    element.innerHTML = element.innerHTML.replace("data-frames=\"24","data-frames=\"47");
  }

  element = document.getElementById(taskId+"status");
  elementDescript = element.innerHTML ;
  baseURL = baseFolderURLFromStatus(elementDescript);
  if(status == "start") {
    path = "data-baseurl=\"../images/followup/sprite/5-percent/in-progress/inprogress";
  }
  if(status == "pause") {
    path = getIconBasePath(baseURL)+"pause/pause" ;
  }
  if(status == "resume") {
    path = getIconBasePath(baseURL)+"in-progress/inprogress" ;
  }
  if(status == "stop"){
    path = "data-baseurl=\"../images/followup/sprite/finished/finished";
  }

  
  replaceFolderPath(element,baseURL,path);
  element = document.getElementById(taskId+"status-task-in-faborder");
  replaceFolderPath(element,baseURL,path);
}
function replaceIconPath(element,baseURL,newPath) {
  var oldInnerHTML;
  var newInnerHTML;
  
  oldInnerHTML = element.innerHTML ;
  newInnerHTML = oldInnerHTML.substring(0,oldInnerHTML.lastIndexOf(baseURL));
  newInnerHTML = newInnerHTML + newPath ;
  newInnerHTML = newInnerHTML + oldInnerHTML.substring(oldInnerHTML.lastIndexOf("0.png"));
  element.innerHTML = newInnerHTML ; 
}
function getIconBasePath(baseURL) {
  var path;
  if(baseURL.lastIndexOf("pause")>0){
    path = baseURL.substring(0,baseURL.lastIndexOf("pause/pause"));
  } else {
    path = baseURL.substring(0,baseURL.lastIndexOf("in-progress"));
  }
  return path ;
}
function baseIconURLFromStatus(path) {
  var startString;
  var endString;
  var basePath;
  startString = path.lastIndexOf("background-image: url(");
  endString = path.lastIndexOf(".png");
  basePath = path.substring(startString,endString);
  return basePath;
}

function replaceFolderPath(element,baseURL,newPath) {
  var oldInnerHTML;
  var newInnerHTML;
  oldInnerHTML = element.innerHTML ;
  newInnerHTML = oldInnerHTML.substring(0,oldInnerHTML.lastIndexOf(baseURL));
  newInnerHTML = newInnerHTML + newPath ;
  newInnerHTML = newInnerHTML + oldInnerHTML.substring(oldInnerHTML.lastIndexOf("\" data-grid"));
  element.innerHTML = newInnerHTML ;
}
function baseFolderURLFromStatus(path) {
  var startString;
  var endString;
  var basePath;
  startString = path.lastIndexOf("data-baseurl");
  endString = path.lastIndexOf("\" data-grid");
  basePath = path.substring(startString,endString);
  return basePath;
}
