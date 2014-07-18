function sendStart(urlPath,fabOrderId, taskId, taskOriginalStatus) {
    $.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {fabricationOrderId: fabOrderId, workEffortId: taskId, currentStatusId: taskOriginalStatus},
            dataType: 'json',
            success: function (data) {
                var error = getError(data);
                if (error != "") {
                    alert(error);
                } else {
//                    <!-- modify status class -->
//                    statusChangeIcon("start", taskId);
//                    spriteAnimation();
//                    <!-- Show buttons -->
//                    document.getElementById(taskId+"startButton").style.display = "none";
//                    document.getElementById(taskId+"pauseButton").style.display = "block";
//                    document.getElementById(taskId+"resumeButton").style.display = "none";
//                    document.getElementById(taskId+"stopButton").style.display = "block";
                    location.reload(true);  // Refresh data
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
                var error = getError(data);
                if (error != "") {
                    alert(error);
                } else {
//                    <!-- modify task -->
//                    statusChangeIcon("pause", taskId);
//                    spriteAnimation();
//                    <!-- Show buttons -->
//                    document.getElementById(taskId+"startButton").style.display = "none";
//                    document.getElementById(taskId+"pauseButton").style.display = "none";
//                    document.getElementById(taskId+"resumeButton").style.display = "block";
//                    document.getElementById(taskId+"stopButton").style.display = "block";
                    location.reload(true);  // Refresh data
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
                var error = getError(data);
                if (error != "") {
                    alert(error);
                } else {
//                    <!-- modify task -->
//                    statusChangeIcon("resume", taskId);
//                    spriteAnimation();
//                    <!-- Show buttons -->
//                    document.getElementById(taskId+"startButton").style.display = "none";
//                    document.getElementById(taskId+"pauseButton").style.display = "block";
//                    document.getElementById(taskId+"resumeButton").style.display = "none";
//                    document.getElementById(taskId+"stopButton").style.display = "block";
                    location.reload(true);  // Refresh data
                }
            }
    });
}
function sendStop(fabOrderId, taskId, taskOriginalStatus) {
    var result;
    var urlPath = document.getElementById("stop-task").value;
    var productsId = document.getElementById("popup-ask-productsId").value;
    var productsQuantity = document.getElementById("popup-ask-products-quantity").value;
    var productsLotId = document.getElementById("popup-ask-products-lotId").value;
    
    $.ajax({
            type: "POST",
            async:false,
            url: urlPath,
            data: {fabricationOrderId: fabOrderId, 
                    workEffortId: taskId, 
                    currentStatusId: taskOriginalStatus, 
                    productsId: productsId, 
                    productsQuantity: productsQuantity, 
                    productsLotId: productsLotId},
            dataType: 'json',
            success: function (data) {
                var error = getError(data);
                if (error != "") {
                    alert(error);
                } else {
                    if (isLastTaskInProd(taskId)) {
                        removeHashtagHistory();
                    }
                    closeAskQuantityPopup();
                    location.reload(true);  // Refresh data
                }
            }
    });
}
function sendStopLastTask(fabOrderId, taskId, taskOriginalStatus) {
    var urlPath = document.getElementById("stop-last-task").value;
    var fabOrderQuantity = document.getElementById("popup-ask-fabOrder-quantity").value;
    var fabOrderLotId = document.getElementById("popup-ask-fabOrder-lotId").value;
    var productsId = document.getElementById("popup-ask-productsId").value;
    var productsQuantity = document.getElementById("popup-ask-products-quantity").value;
    var productsLotId = document.getElementById("popup-ask-products-lotId").value;
    
    $.ajax({
        type: "POST",
        async:false,
        url: urlPath,
        data: {fabricationOrderId: fabOrderId, 
                workEffortId: taskId, 
                statusId: null, 
                fabOrderQuantity: fabOrderQuantity, 
                fabOrderLotId: fabOrderLotId,
                productsId: productsId,
                productsQuantity: productsQuantity,
                productsLotId: productsLotId},
        dataType: 'json',
        success: function (data) {
            var error = getError(data);
            if (error != "") {
                alert(error);
            } else {
                removeHashtagHistory();
                closeAskQuantityPopup();
                location.reload(true);  // Refresh data
            }
        }
    });
}
function getError(data) {
    var serverError = "";
    if (data._ERROR_MESSAGE_LIST_ != undefined) {
        serverError = data._ERROR_MESSAGE_LIST_;
    }
    if (data._ERROR_MESSAGE_ != undefined) {
        serverError = data._ERROR_MESSAGE_;
    }
    return serverError;
}

function stopTask(fabOrderId, taskId, taskOriginalStatus) {
    var putInStockFinishedGood = $('#followup-properties .put-in-stock-finished-good span').text();
    var componentTraceability = $('#followup-properties .component-traceability span').text();
    var currentComponentCount = document.getElementById("popup-ask-current-component-count").value;
    var callSendStop = false;
    
    saveTaskParameters(fabOrderId, taskId, taskOriginalStatus);
    saveHashInHrefOfButtons();
    
    if (componentTraceability == 'Y') {
        currentComponentCount ++;
        if (hasComponentToDeclare(taskId, currentComponentCount)) {
            document.getElementById("open-popup-ask").value = "Y";
            document.getElementById("validate-popup-ask").value = "Y";
            productName = document.getElementById(taskId + "-" + currentComponentCount + "-name").value;
            productId = document.getElementById(taskId + "-" + currentComponentCount + "-id").value;
            estimatedQuantity = document.getElementById(taskId + "-" + currentComponentCount + "-estimatedQuantity").value;
            document.getElementById("popup-ask-productId").value = productId;
            document.getElementById("popup-ask-quantity").value = estimatedQuantity;
            if (isLastComponentToDeclare(taskId, currentComponentCount)) {
                showNextBtn = false;
                showAddBtn = true;
            } else {
                showNextBtn = true;
                showAddBtn = false;
            }
            label = document.getElementById("of-component").innerHTML;
            text = label +  " : " + productName + " [" + productId + "]";
            document.getElementById("popup-ask-current-component-count").value = currentComponentCount;
            openAskQuantityPopup(text, "component", showNextBtn, showAddBtn);
        } else {
            document.getElementById("popup-ask-current-component-count").value = "0";
            if (putInStockFinishedGood == 'Y' && isLastTaskInProd(taskId)) {
                document.getElementById("open-popup-ask").value = "Y";
                declareFabricationOrder(fabOrderId, taskId, taskOriginalStatus);
            } else {
                document.getElementById("open-popup-ask").value = "N";
                if (hasPopupAskDataToValidate()) {
                    validatePopupAsk();
                } else {
                    callSendStop = true;
                }
            }
        }
    } else {
        if (putInStockFinishedGood == 'Y' && isLastTaskInProd(taskId)) {
            declareFabricationOrder(fabOrderId, taskId, taskOriginalStatus);
        } else {
            callSendStop = true;
        }
    }
    if (callSendStop) {
        sendStop(fabOrderId, taskId, taskOriginalStatus);
    }
}

function declareFabricationOrder(fabOrderId, taskId, taskOriginalStatus) {
    document.getElementById("validate-popup-ask").value = "Y"; // indicates that data has to be validated
    document.getElementById("popup-ask-quantity").value = $('#' + fabOrderId + 'remaining-quantity-to-produced').text();
    var finishedGoodTraceability = $('#followup-properties .finished-good-traceability span').text();
    if (finishedGoodTraceability == 'Y'){
        label = document.getElementById("of-finished-good").innerHTML;
        fabOrderName = document.getElementById(fabOrderId + "-name").innerHTML;
        text = label +  " : " + fabOrderName + " [" + fabOrderId + "]";
        document.getElementById("open-popup-ask").value = "N";  // Popup ask don't have to be open  again
        openAskQuantityPopup(text, "fab-order", false, false);
    } else {
        if (hasPopupAskDataToValidate()) {
            document.getElementById("open-popup-ask").value = "N";
            validatePopupAsk(); 
        }
    }
}


function validatePopupAsk() {
    // Record input data 
    addPopupAskQuantityAndLotId();
    
    var fabOrderId = document.getElementById("popup-ask-fabOrderId").value;
    var taskId = document.getElementById("popup-ask-taskId").value;
    var taskOriginalStatus = document.getElementById("popup-ask-taskOriginalStatus").value;
    if (hasPopupAskToBeOpen()) {
        document.getElementById("popup-ask-lotId").value = "";
        stopTask(fabOrderId, taskId, taskOriginalStatus);
    } else {
        if (isLastTaskInProd(taskId)) {
            sendStopLastTask(fabOrderId, taskId, taskOriginalStatus);
        } else {
            sendStop(fabOrderId, taskId, taskOriginalStatus);
        }
    }
}

function addPopupAskQuantityAndLotId() {
    var qty = document.getElementById("popup-ask-quantity").value;
    var lotId = document.getElementById("popup-ask-lotId").value;
    var productId = document.getElementById("popup-ask-productId").value;
    if (lotId == "") {
        lotId = "_NA_";
    }
    
    if (productId != "") {  // Data is for component
        var productsQty = document.getElementById("popup-ask-products-quantity").value;
        if (productsQty != "") {
            productsQty += ";"
        }
        productsQty += qty;
        
        var productsLotId = document.getElementById("popup-ask-products-lotId").value;
        if (productsLotId != "") {
            productsLotId += ";"
        }
        productsLotId += lotId
        
        var productsId = document.getElementById("popup-ask-productsId").value;
        if (productsId != "") {
            productsId += ";"
        }
        productsId += productId;
        
        document.getElementById("popup-ask-products-quantity").value = productsQty;
        document.getElementById("popup-ask-products-lotId").value = productsLotId;
        document.getElementById("popup-ask-productsId").value = productsId;
        
        document.getElementById("popup-ask-productId").value = "";
    } else {    // Data is for fabrication order
        document.getElementById("popup-ask-fabOrder-quantity").value = qty;
        document.getElementById("popup-ask-fabOrder-lotId").value = lotId;
    }
    
}

function saveTaskParameters(fabOrderId, taskId, taskOriginalStatus) {
    document.getElementById("popup-ask-fabOrderId").value = fabOrderId;
    document.getElementById("popup-ask-taskId").value = taskId;
    document.getElementById("popup-ask-taskOriginalStatus").value = taskOriginalStatus;
}

function saveHashInHrefOfButtons() {
    document.getElementById("btn-validate-ask-for-quantity-popup").href = location.hash;
    document.getElementById("btn-next-component-popup").href = location.hash;
//    Disable add button until development is done
//    document.getElementById("btn-add-component-popup").href = location.hash;
}
function hasComponentToDeclare(taskId, currentComponentCount) {
    var componentsQty = document.getElementById(taskId + "-components-qty").value;
    if (componentsQty == 0) {
        return false;
    }
    if (currentComponentCount > componentsQty) {
        return false;
    }
    return true;
}

function isLastComponentToDeclare(taskId, currentComponentCount) {
    var componentsQty = document.getElementById(taskId + "-components-qty").value;
    if (currentComponentCount == componentsQty) {
        return true;
    }
    return false;
}

function hasPopupAskDataToValidate() {
    if (document.getElementById("validate-popup-ask").value == "Y") {
        return true;
    }
    return false;
}

function hasPopupAskToBeOpen() {
    if (document.getElementById("open-popup-ask").value == "Y") {
        return true;
    }
    return false;
}

function isLastTaskInProd(taskId) {
    if ($('#' + taskId + 'last-task-in-prod').text() == "Y") {
        return true;
    }
    return false;
}


///////////////////////////////////////////////////////////////////
// Change icons when clicking on production buttons (Start, pause, resume, stop)
// Unused
///////////////////////////////////////////////////////////////////

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
