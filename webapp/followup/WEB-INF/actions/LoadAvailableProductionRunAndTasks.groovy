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

// The only required parameter is "productionRunId".
// The "actionForm" parameter triggers actions (see "ProductionRunSimpleEvents.xml").

import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.*
import org.ofbiz.base.util.Debug;
import javolution.util.FastList;
import org.ofbiz.base.util.UtilDateTime;

List<GenericValue> prodRunList = FastList.newInstance();
List<GenericValue> taskList = FastList.newInstance();
List<GenericValue> totalTaskList = FastList.newInstance();

/****** Manage production runs ******/
prodRuns = delegator.findList("WorkEffortProdRunPrintedView", null, null, null, null, false);
for (prodRun in prodRuns) {

Debug.logInfo("##############################################################","");
    prodRunId = (String) prodRun.workEffortId;
    prodRunName = (String) prodRun.workEffortName;
    prodRunDescription = (String) prodRun.description;
    prodRunOriginalStatus = (String) prodRun.currentStatusId;
    prodRunQuantityToProduce = (BigDecimal) prodRun.quantityToProduce;
    prodRunQuantityProduced = (BigDecimal) prodRun.quantityProduced;
    prodRunEstimatedStartDate = (Timestamp) prodRun.estimatedStartDate;
    prodRunEstimatedEndDate = (Timestamp) prodRun.estimatedCompletionDate;
    prodRunActualStartDate = (Timestamp) prodRun.actualStartDate;
    prodRunActualEndDate = (Timestamp) prodRun.actualCompletionDate;
    if (UtilValidate.isEmpty(prodRunActualStartDate))
    {
        prodRunStatus = "Ready";
        prodRunClassLigneListe = "ready";
        prodRunDataFrames = "24";
    } else {
        if (UtilValidate.isEmpty(prodRunActualEndDate)) {
            prodRunStatus = "InProduction";
            prodRunClassLigneListe = "en-cours";
            prodRunDataFrames = "24";
        } else {
            prodRunStatus = "Finished";
            prodRunClassLigneListe = "fini";
            prodRunDataFrames = "47";
        }
    }
    if (UtilValidate.isEmpty(prodRunName)){
        prodRunName = "No name";
    }
    if (UtilValidate.isEmpty(prodRunDescription)){
        prodRunDescription = "No description";
    }
    if (UtilValidate.isEmpty(prodRunQuantityToProduce)){
        prodRunQuantityToProduce = "0";
    }
    if (UtilValidate.isEmpty(prodRunQuantityProduced)){
        prodRunQuantityProduced = "0";
    }

    prodRunRealMilliSeconds = 0;
    prodRunEstimatedMilliSeconds = 0;
    taskClassLigneListe = "ready";
    
Debug.logInfo("prodRunId = " + prodRunId,"");
Debug.logInfo("prodRunStatus = " + prodRunStatus,"");

taskList = FastList.newInstance();
    /****** Manage tasks ******/
    tasks = delegator.findByAnd("WorkEffortProdRunTasksView", UtilMisc.toMap("workEffortParentId", prodRunId));
    for (task in tasks) {
Debug.logInfo("**************************************************************","");
        taskId = (String) task.workEffortId;
        taskName = (String) task.workEffortName;
        taskDescription = (String) task.description;
        taskOriginalStatus = (String) task.currentStatusId;
        taskQuantityToProduce = (BigDecimal) task.quantityToProduce;
        taskQuantityProduced = (BigDecimal) prodRun.quantityProduced;
        taskEstimatedStartDate = (Timestamp) task.estimatedStartDate;
        taskEstimatedEndDate = (Timestamp) task.estimatedCompletionDate;
        taskActualStartDate = (Timestamp) task.actualStartDate;
        taskActualEndDate = (Timestamp) task.actualCompletionDate;
Debug.logInfo("taskId = " + taskId,"");
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
            taskQuantityToProduce = "0";
        }
        if (UtilValidate.isEmpty(taskQuantityProduced)){
            taskQuantityProduced = "0";
        }
        
        // Calculate planned time
        taskPlannedTime = getFormatedTime(taskEstimatedMilliSeconds);
        prodRunEstimatedMilliSeconds = prodRunEstimatedMilliSeconds + taskEstimatedMilliSeconds
        
        taskRealMilliSeconds = 0;
        taskRealTime = 0;
        if (prodRunStatus == "InProduction") {
            // Load TimeEntries linked to this task
            taskActualStartDate = (Timestamp) task.get("actualStartDate");
            taskActualEndDate = (Timestamp) task.get("actualCompletionDate");
            timeEntries = delegator.findByAnd("TimeEntry", UtilMisc.toMap("workEffortId", taskId));
            status = "InProduction";
            isInProduction = false;
            for (timeEntry in timeEntries){
                startDate = (Timestamp) timeEntry.get("fromDate");
                endDate = (Timestamp) timeEntry.get("thruDate");
Debug.logInfo("startDate = " + startDate, "");
Debug.logInfo("endDate = " + endDate, "");
                if (UtilValidate.isEmpty(endDate)){
                    endDate = (Timestamp) UtilDateTime.nowTimestamp();
                    isInProduction = true;
                }
                diffTime = (long) (endDate.getTime() - startDate.getTime());
                taskRealMilliSeconds = taskRealMilliSeconds + diffTime;
            }
            if (isInProduction) {
                status = "InProduction";
                taskClassLigneListe = "en-cours";
            } else {
                status = "Break";
                taskClassLigneListe = "pause";
            }
            
            // Give task status
            if (UtilValidate.isEmpty(taskActualStartDate)) {
                taskStatus = "Ready";
                taskClassLigneListe = "ready";
                taskDataFrames = "24";
            } else {
                if (UtilValidate.isNotEmpty(taskActualEndDate)) {
                    taskStatus = "Finished";
                    taskClassLigneListe = "fini";
                    taskDataFrames = "47";
                } else {
                    taskStatus = status;
                    taskDataFrames = "24";
                }
            }
        } else {
            taskStatus = prodRunStatus;
            taskDataFrames = prodRunDataFrames;
        }
        // Calculate real time of production
        taskRealTime = getFormatedTime(taskRealMilliSeconds);
        prodRunRealMilliSeconds = prodRunRealMilliSeconds + taskRealMilliSeconds;
        
Debug.logInfo("taskStatus = " + taskStatus,"");
        taskProgress = getPercentageProgress(taskRealMilliSeconds, taskEstimatedMilliSeconds, taskStatus);
        taskStatusPath = getStatusPath(taskStatus, taskProgress);
        taskRest = 100 - taskProgress;
        
        taskList.add(UtilMisc.toMap(
                "prodRunId", prodRunId,
                "prodRunName", prodRunName,
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
                "taskClassLigneListe", taskClassLigneListe,
                "taskDataFrames", taskDataFrames));
        
        totalTaskList.add(UtilMisc.toMap(
                "prodRunId", prodRunId,
                "prodRunName", prodRunName,
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
                "taskClassLigneListe", taskClassLigneListe,
                "taskDataFrames", taskDataFrames));
    }
    
//    taskList = sortByStatus(taskList, "task");
    
    prodRunRealTime = getFormatedTime(prodRunRealMilliSeconds);
    prodRunPlannedTime = getFormatedTime(prodRunEstimatedMilliSeconds);
    prodRunProgress = getPercentageProgress(prodRunRealMilliSeconds, prodRunEstimatedMilliSeconds, taskStatus);
    prodRunStatusPath = getStatusPath(prodRunStatus, prodRunProgress);
    prodRunRest = 100 - prodRunProgress;

    prodRunList.add(UtilMisc.toMap(
            "prodRunId", prodRunId,
            "prodRunName", prodRunName,
            "prodRunStatus", prodRunStatus,
            "prodRunOriginalStatus", prodRunOriginalStatus,
            "prodRunDescription", prodRunDescription,
            "prodRunPlannedTime", prodRunPlannedTime,
            "prodRunRealTime", prodRunRealTime,
            "prodRunStatusPath", prodRunStatusPath,
            "prodRunProgress", prodRunProgress,
            "prodRunRest", prodRunRest,
            "taskList", taskList,
            "prodRunClassLigneListe", prodRunClassLigneListe,
            "prodRunDataFrames", prodRunDataFrames)); 

}
//totalTaskList = sortByStatus(totalTaskList, "task");
//prodRunList = sortByStatus(prodRunList, "prodRun");

context.prodRunList = prodRunList;
context.taskList = totalTaskList;

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

public String getStatusPath(status, progress) {
    statusPath = "../images/followup/sprite/";

    file = "";
    if (status == "Ready"){
        statusPath = statusPath + "ready/ready";
    } else if (status == "Finished"){
        statusPath = statusPath + "fini/fini";
    } else if (status == "Break"){
        file = "pause/pause";
        
    } else if (status == "InProduction"){
        file = "en-cours/encours";
    }
    
    if (file != ""){
        if (progress < 5) {
            statusPath = statusPath + "5-pourcent/"
        } else if (progress < 12) {
            statusPath = statusPath + "12-pourcent/"
        } else if (progress < 25){
            statusPath = statusPath + "25-pourcent/"
        } else if (progress < 50) {
            statusPath = statusPath + "50-pourcent/"
        } else if (progress < 67) {
            statusPath = statusPath + "67-pourcent/"
        } else if (progress < 75) {
            statusPath = statusPath + "75-pourcent/"
        } else if (progress < 100) {
            statusPath = statusPath + "100-pourcent/"
        }
        
        statusPath = statusPath + file;
    }
    
    return statusPath;
}

public List<GenericValue> sortByStatus(elements, type) {
    List<GenericValue> listReady = FastList.newInstance();
    List<GenericValue> listInProduction = FastList.newInstance();
    List<GenericValue> listBreak = FastList.newInstance();
    List<GenericValue> listFinished = FastList.newInstance();
    List<GenericValue> sortedList = FastList.newInstance();
    if (type == "task"){
        status = "taskStatus";
    } else {
        status = "prodRunStatus";
    }
    for (element in elements){
        if (element.get(status) == "Ready"){
            listReady.add(element);
        } else {
            if (element.get(status) == "Finished"){
                listFinished.add(element);
            } else {
                if (element.get(status) == "Break"){
                    listBreak.add(element);
                } else {
                    listInProduction.add(element);
                }
            }
        }
    }
    for (inProd in listInProduction){
        sortedList.add(inProd);
    }
    for (inBreak in listBreak){
        sortedList.add(inBreak);
    }
    for (ready in listReady){
        sortedList.add(ready);
    }
    for (finished in listFinished){
        sortedList.add(finished);
    }
    
    return sortedList;
}
