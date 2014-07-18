/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// The only required parameter is "fabricationOrderId".
// The "actionForm" parameter triggers actions (see "FabricationOrderSimpleEvents.xml").

import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.*
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilDateTime;
import org.ofbiz.entity.util.EntityUtil;
import java.util.StringTokenizer;
import org.ofbiz.manufacturing.jobshopmgt.ProductionRun;
import java.util.ArrayList;
import java.util.HashMap;

List<GenericValue> fabOrderList = new ArrayList<GenericValue>();
List<Map<String, Object>> taskInFabOrderList = new ArrayList<Map<String, Object>>();
List<Map<String, Object>> taskList = new ArrayList<Map<String, Object>>();
Map<String, Object> shapedTask = new HashMap<String, Object>();

/****** Manage Fabrication orders ******/
fabOrderCount = 0;
taskCount = 0;
fabOrders = delegator.findList("WorkEffortFabOrderPrintedView", null, null, null, null, false);
for (fabOrder in fabOrders) {
    ProductionRun productionRun = new ProductionRun(fabOrder.workEffortId, delegator, dispatcher);
    // Filter fabrication orders which have for component at least on fabrication order which is not in production or finished 
    isFaOrderValid = true;
    List<GenericValue> mandatoryWorkEffortAssocs = EntityUtil.filterByDate(delegator.findByAnd("WorkEffortAssoc", UtilMisc.toMap("workEffortIdTo", fabOrder.workEffortId, "workEffortAssocTypeId", "WORK_EFF_PRECEDENCY")));
    for (GenericValue mandatoryWorkEffortAssoc : mandatoryWorkEffortAssocs) {
        GenericValue mandatoryWorkEffort = mandatoryWorkEffortAssoc.getRelatedOne("FromWorkEffort");
        if (!(mandatoryWorkEffort.getString("currentStatusId").equals("PRUN_COMPLETED") ||
             mandatoryWorkEffort.getString("currentStatusId").equals("PRUN_RUNNING") ||
             mandatoryWorkEffort.getString("currentStatusId").equals("PRUN_CLOSED"))) {
            isFaOrderValid = false;
        }
    }
    
    if (isFaOrderValid && productionRun.exist()) {
        fabOrderCount ++;
        fabOrderId = (String) fabOrder.workEffortId;
        fabOrderName = (String) fabOrder.workEffortName;
        fabOrderName = getMaxLengthName(fabOrderName);
        fabOrderDescription = (String) fabOrder.description;
        fabOrderOriginalStatus = (String) fabOrder.currentStatusId;
        fabOrderQuantityToProduce = (BigDecimal) fabOrder.quantityToProduce;
        fabOrderQuantityProduced = (BigDecimal) fabOrder.quantityProduced;
        fabOrderEstimatedStartDate = (Timestamp) fabOrder.estimatedStartDate;
        fabOrderEstimatedEndDate = (Timestamp) fabOrder.estimatedCompletionDate;
        fabOrderActualStartDate = (Timestamp) fabOrder.actualStartDate;
        fabOrderActualEndDate = (Timestamp) fabOrder.actualCompletionDate;
        if (UtilValidate.isEmpty(fabOrderActualStartDate))
        {
            fabOrderStatus = "Ready";
            fabOrderClassListLine = "ready";
            fabOrderDataFrames = "24";
        } else {
            if (UtilValidate.isEmpty(fabOrderActualEndDate)) {
                fabOrderStatus = "InProduction";
                fabOrderClassListLine = "in-progress";
                fabOrderDataFrames = "24";
            } else {
                fabOrderStatus = "Finished";
                fabOrderClassListLine = "finished";
                fabOrderDataFrames = "47";
            }
        }
        if (UtilValidate.isEmpty(fabOrderName)){
            fabOrderName = "No name";
        }
        if (UtilValidate.isEmpty(fabOrderDescription)){
            fabOrderDescription = "No description";
        }
        if (UtilValidate.isEmpty(fabOrderQuantityToProduce)){
            fabOrderQuantityToProduce = BigDecimal.ZERO;
        }
        if (UtilValidate.isEmpty(fabOrderQuantityProduced)){
            fabOrderQuantityProduced = BigDecimal.ZERO;
        }
        remainingQuantityToProduce = fabOrderQuantityToProduce.subtract(fabOrderQuantityProduced);
    
        fabOrderRealMilliSeconds = 0;
        fabOrderEstimatedMilliSeconds = 0;
        taskClassListLine = "ready";
        
        List productionRunRoutingTasks = productionRun.getProductionRunRoutingTasks();
        productionRunComponents = productionRun.getProductionRunComponents();

        taskInFabOrderList = new ArrayList<GenericValue>();
        /****** Manage tasks ******/
        taskInFabOrderCount = 0;
//        tasks = delegator.findByAnd("WorkEffortFabOrderTasksView", UtilMisc.toMap("workEffortParentId", fabOrderId));
        for (task in productionRunRoutingTasks) {
            taskCount ++;
            taskInFabOrderCount ++;
            taskId = (String) task.workEffortId;
            taskName = (String) task.workEffortName;
            taskName = getMaxLengthName(taskName);
            taskDescription = (String) task.description;
            taskOriginalStatus = (String) task.currentStatusId;
            taskQuantityToProduce = (BigDecimal) task.quantityToProduce;
            taskQuantityProduced = (BigDecimal) fabOrder.quantityProduced;
            taskEstimatedStartDate = (Timestamp) task.estimatedStartDate;
            taskEstimatedEndDate = (Timestamp) task.estimatedCompletionDate;
            taskActualStartDate = (Timestamp) task.actualStartDate;
            taskActualEndDate = (Timestamp) task.actualCompletionDate;
            if (UtilValidate.isEmpty(task.estimatedMilliSeconds)){
                taskEstimatedMilliSeconds = (long) 0;
            } else {
                taskEstimatedMilliSeconds = (long) task.estimatedMilliSeconds
            }
            
            if (UtilValidate.isEmpty(taskName)){
                taskName = "No name";
            }
            if (UtilValidate.isEmpty(taskDescription)){
                taskDescription = "No description";
            }
            if (UtilValidate.isEmpty(taskQuantityToProduce)){
                taskQuantityToProduce = BigDecimal.ZERO;
            }
            if (UtilValidate.isEmpty(taskQuantityProduced)){
                taskQuantityProduced = BigDecimal.ZERO;
            }
            
            // Calculate planned time
            taskPlannedTime = getFormatedTime(taskEstimatedMilliSeconds);
            fabOrderEstimatedMilliSeconds = fabOrderEstimatedMilliSeconds + taskEstimatedMilliSeconds
            
            taskRealMilliSeconds = 0;
            taskRealTime = 0;
            if (fabOrderStatus == "InProduction") {
                // Load TimeEntries linked to this task
                taskActualStartDate = (Timestamp) task.get("actualStartDate");
                taskActualEndDate = (Timestamp) task.get("actualCompletionDate");
                timeEntries = delegator.findByAnd("TimeEntry", UtilMisc.toMap("workEffortId", taskId));
                status = "InProduction";
                isInProduction = false;
                for (timeEntry in timeEntries){
                    startDate = (Timestamp) timeEntry.get("fromDate");
                    endDate = (Timestamp) timeEntry.get("thruDate");
                    if (UtilValidate.isEmpty(endDate)){
                        endDate = (Timestamp) UtilDateTime.nowTimestamp();
                        isInProduction = true;
                    }
                    diffTime = (long) (endDate.getTime() - startDate.getTime());
                    taskRealMilliSeconds = taskRealMilliSeconds + diffTime;
                }
                if (isInProduction) {
                    status = "InProduction";
                    taskClassListLine = "in-progress";
                } else {
                    status = "Break";
                    taskClassListLine = "pause";
                }
                
                // Give task status
                if (UtilValidate.isEmpty(taskActualStartDate)) {
                    taskStatus = "Ready";
                    taskClassListLine = "ready";
                    taskDataFrames = "24";
                } else {
                    if (UtilValidate.isNotEmpty(taskActualEndDate)) {
                        taskStatus = "Finished";
                        taskClassListLine = "finished";
                        taskDataFrames = "47";
                    } else {
                        taskStatus = status;
                        taskDataFrames = "24";
                    }
                }
            } else {
                taskStatus = fabOrderStatus;
                taskDataFrames = fabOrderDataFrames;
            }
            // Calculate real time of production
            taskRealTime = getFormatedTime(taskRealMilliSeconds);
            fabOrderRealMilliSeconds = fabOrderRealMilliSeconds + taskRealMilliSeconds;
            
            taskProgress = getPercentageProgress(taskRealMilliSeconds, taskEstimatedMilliSeconds, taskStatus);
            taskStatusPath = getStatusPath(taskStatus, taskProgress, taskInFabOrderCount);
            taskRest = 100 - taskProgress;
            
            taskInFabOrderList.add(UtilMisc.toMap(
                    "fabOrderId", fabOrderId,
                    "fabOrderName", fabOrderName,
                    "taskId", taskId,
                    "taskName", taskName,
                    "taskStatus", taskStatus,
                    "taskOriginalStatus", taskOriginalStatus,
                    "taskDescription", taskDescription,
                    "taskPlannedTime", taskPlannedTime,
                    "taskRealTime", taskRealTime,
                    "taskStatusPath", taskStatusPath,
                    "taskProgress", taskProgress,
                    "taskRest", taskRest,
                    "taskClassListLine", taskClassListLine,
                    "taskDataFrames", taskDataFrames));
    
            // Second time for white or black icon when task is in ready status
            taskStatusPath = getStatusPath(taskStatus, taskProgress, taskCount);
            // Look for components linked to the task
            List components = new ArrayList<GenericValue>();
            components = getTaskComponents(productionRunComponents, taskId);
            
            taskList.add(UtilMisc.toMap(
                    "fabOrderId", fabOrderId,
                    "fabOrderName", fabOrderName,
                    "taskId", taskId,
                    "taskName", taskName,
                    "taskStatus", taskStatus,
                    "taskOriginalStatus", taskOriginalStatus,
                    "taskDescription", taskDescription,
                    "taskPlannedTime", taskPlannedTime,
                    "taskRealTime", taskRealTime,
                    "taskStatusPath", taskStatusPath,
                    "taskProgress", taskProgress,
                    "taskRest", taskRest,
                    "taskClassListLine", taskClassListLine,
                    "taskDataFrames", taskDataFrames,
                    "isLastTaskInProd", "N",
                    "components", components));
        }
        
    //    taskInFabOrderList = sortByStatus(taskInFabOrderList, "task");
        checkLastTaskInProduction(taskInFabOrderList, taskList);
        fabOrderRealTime = getFormatedTime(fabOrderRealMilliSeconds);
        fabOrderPlannedTime = getFormatedTime(fabOrderEstimatedMilliSeconds);
        fabOrderProgress = getPercentageProgress(fabOrderRealMilliSeconds, fabOrderEstimatedMilliSeconds, taskStatus);
        fabOrderStatusPath = getStatusPath(fabOrderStatus, fabOrderProgress, fabOrderCount);
        fabOrderRest = 100 - fabOrderProgress;
    
        fabOrderList.add(UtilMisc.toMap(
                "fabOrderId", fabOrderId,
                "fabOrderName", fabOrderName,
                "fabOrderStatus", fabOrderStatus,
                "fabOrderOriginalStatus", fabOrderOriginalStatus,
                "fabOrderDescription", fabOrderDescription,
                "fabOrderPlannedTime", fabOrderPlannedTime,
                "fabOrderRealTime", fabOrderRealTime,
                "fabOrderStatusPath", fabOrderStatusPath,
                "fabOrderProgress", fabOrderProgress,
                "fabOrderRest", fabOrderRest,
                "taskList", taskInFabOrderList,
                "fabOrderClassListLine", fabOrderClassListLine,
                "fabOrderDataFrames", fabOrderDataFrames, 
                "remainingQuantityToProduce", remainingQuantityToProduce)); 
    }
}
//taskList = sortByStatus(taskList, "task");
//fabOrderList = sortByStatus(fabOrderList, "fabOrder");

context.fabOrderList = fabOrderList;
context.taskList = taskList;

public String getFormatedTime(long milliSeconds) {

    formatedTime = "";
    hoursDouble = (double) milliSeconds / (1000*60*60);
    hours = (long) Math.floor(hoursDouble);
    if (hours > 24) {
        daysDouble = (double) hoursDouble / 24;
        days = (long) Math.floor(daysDouble);
        hours = (long) Math.floor((daysDouble - days) * 24);
        formatedTime = days + "j" + hours + "h";
    } else {
        minutes = (long) Math.floor((hoursDouble - hours) * 60);
        if (hours < 10) {
            formatedTime = (String) "0"
        }
        formatedTime = formatedTime + hours + ":" 
        if (minutes < 10) {
            formatedTime = formatedTime + "0"
        }
        formatedTime = formatedTime + minutes;
    }
    
    return formatedTime;
}

public int getPercentageProgress(realMilliSeconds, plannedMilliSeconds, taskStatus) {
    if (plannedMilliSeconds == 0) {
        progress = 0;
    } else {
        progress = (int) Math.floor((realMilliSeconds * 100) / plannedMilliSeconds);
    }
    if (progress > 100){
        progress = 99;
    }
    if (taskStatus == "Finished"){
        progress = 100;
    }
    return progress;
}

public String getStatusPath(status, progress, count) {
    statusPath = "../images/followup/sprite/";
    file = "";
    if (status == "Ready"){
        if (count % 2 == 1) {   // Odd line needs black picto on white line
            statusPath = statusPath + "ready/ready";
        } else {    // Even line needs white picto on black line
            statusPath = statusPath + "ready/readyt";
        }
    } else if (status == "Finished"){
        statusPath = statusPath + "finished/finished";
    } else if (status == "Break"){
        file = "pause/pause";
        
    } else if (status == "InProduction"){
        file = "in-progress/inprogress";
    }
    
    if (file != ""){
        if (progress < 5) {
            statusPath = statusPath + "5-percent/"
        } else if (progress < 12) {
            statusPath = statusPath + "12-percent/"
        } else if (progress < 25){
            statusPath = statusPath + "25-percent/"
        } else if (progress < 50) {
            statusPath = statusPath + "50-percent/"
        } else if (progress < 67) {
            statusPath = statusPath + "67-percent/"
        } else if (progress < 75) {
            statusPath = statusPath + "75-percent/"
        } else if (progress < 100) {
            statusPath = statusPath + "100-percent/"
        }
        
        statusPath = statusPath + file;
    }
    
    return statusPath;
}

public String getMaxLengthName(originalName) {
    newName = originalName;
    
    // Each word must not be longer than a line : Maximum chars = 22
    String tmpName = "";
    StringTokenizer st = new StringTokenizer(newName, " ");
    while (st.hasMoreTokens()) {
        word = st.nextToken();
        if (word.length() > 22) {
            secondPart = word.substring(22);
            firstPart = word.substring(0, 22);
            tmpName += " " + firstPart + " " + secondPart;
        } else {
            tmpName += " " + word;
        }
    }
    if (! tmpName.isEmpty()) {
        newName = tmpName;
    }
    
    // Maximum length = 44 chars
    if (newName.length() > 40) {
        newName = newName.substring(0, 36) + "[...]";
    }
    
    return newName;
}

public checkLastTaskInProduction(taskInFabOrderList, taskList) {
    lastTaskInProd = null;
    for (task in taskInFabOrderList) {
        if (! "Finished".equals(task.get("taskStatus"))) {
            if (! UtilValidate.isEmpty(lastTaskInProd)) {
                lastTaskInProd = null;
                break;
            }
            lastTaskInProd = task;
        }
    }
    if (! UtilValidate.isEmpty(lastTaskInProd)) {
        for (task in taskList) {
            if (lastTaskInProd.get("taskId").equals(task.get("taskId"))) {
                task.put("isLastTaskInProd", "Y");
            }
        }
    }
}

public getTaskComponents(productionRunComponents, taskId) {
    int componentCount = 0;
    List products = new ArrayList<HashMap<String, Object>>();
    
    componentTraceability = UtilProperties.getPropertyValue("followup.properties", "component.traceability", "N");
    if ("N".equals(componentTraceability)) {
        return products;
    }
    
    for (component in productionRunComponents) {
        if (taskId.equals(component.get("workEffortId"))) {
            componentCount ++;
            product = component.getRelatedOne("Product");
            componentProduct = new HashMap<String, Object>();
            componentProduct.put("productId", component.get("productId"));
            componentProduct.put("internalName", product.get("internalName"));
            componentProduct.put("estimatedQuantity", component.get("estimatedQuantity"));
            componentProduct.put("componentCount", componentCount);
            products.add(componentProduct);
        }
    }
    return products;
}
//
//public List<GenericValue> sortByStatus(elements, type) {
//    List<GenericValue> listReady = new ArrayList<GenericValue>()
//    List<GenericValue> listInProduction = new ArrayList<GenericValue>()
//    List<GenericValue> listBreak = new ArrayList<GenericValue>()
//    List<GenericValue> listFinished = new ArrayList<GenericValue>()
//    List<GenericValue> sortedList = new ArrayList<GenericValue>()
//    if (type == "task"){
//        status = "taskStatus";
//    } else {
//        status = "fabOrderStatus";
//    }
//    for (element in elements){
//        if (element.get(status) == "Ready"){
//            listReady.add(element);
//        } else {
//            if (element.get(status) == "Finished"){
//                listFinished.add(element);
//            } else {
//                if (element.get(status) == "Break"){
//                    listBreak.add(element);
//                } else {
//                    listInProduction.add(element);
//                }
//            }
//        }
//    }
//    for (inProd in listInProduction){
//        sortedList.add(inProd);
//    }
//    for (inBreak in listBreak){
//        sortedList.add(inBreak);
//    }
//    for (ready in listReady){
//        sortedList.add(ready);
//    }
//    for (finished in listFinished){
//        sortedList.add(finished);
//    }
//    
//    return sortedList;
//}
