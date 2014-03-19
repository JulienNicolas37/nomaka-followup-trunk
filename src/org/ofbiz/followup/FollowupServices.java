package org.ofbiz.followup;

import java.sql.Timestamp;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilDateTime;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilProperties;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.GenericServiceException;
import org.ofbiz.service.LocalDispatcher;
import org.ofbiz.service.ServiceUtil;

public class FollowupServices {
    
    public static final String module = FollowupServices.class.getName();
    public static final String resource = "FollowupUiLabels";

    public static Map<String, Object> startProductionTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Locale locale = (Locale) context.get("locale");
        LocalDispatcher dispatcher = dctx.getDispatcher();
        Map<String, Object> result = null;
        
        try {
            dispatcher.runSync("changeProductionRunTaskStatus", context);
        } catch (GenericServiceException e) {
            Debug.logError(e, "Problem calling the changeProductionRunTaskStatus service", module);
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStart", locale));
        }
        String workEffortId = (String) context.get("workEffortId");
        if (! isTaskInProduction(dctx, workEffortId)) {
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStart", locale));
        }
        
        result = startWorkEffortTimeEntry(dctx, context);
        return result;
    }

    private static boolean isTaskInProduction(DispatchContext dctx, String workEffortId) {
        Delegator delegator = dctx.getDelegator();

        GenericValue workEffort = null;
        try {
            workEffort = delegator.findOne("WorkEffort", UtilMisc.toMap("workEffortId", workEffortId), false);
        } catch (GenericEntityException e) {
            String msg = "Can not check production task status due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return false;
        }
        if (UtilValidate.isEmpty(workEffort)){
            return false;
        }
        String currentStatus = (String) workEffort.get("currentStatusId");
        
        if (currentStatus.equals("PRUN_RUNNING")) {
            return true;
        }
        return false;
    }

    private static Map<String, Object> startWorkEffortTimeEntry(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        Locale locale = (Locale) context.get("locale");
        
        checkAndCloseAlreadyBegunTimeEntry(dctx, context);
        
        GenericValue timeEntry = delegator.makeValidValue("TimeEntry", context);
        if (UtilValidate.isEmpty(timeEntry)) {
            String msg = "Can not start TimeEntry for WorkEffort due to an error in delegator.makeValidValue(TimeEntry, context)";
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }

        String workEffortId = (String) context.get("workEffortId");
        GenericValue workEffort = null;
        try {
            workEffort = delegator.findOne("WorkEffort", UtilMisc.toMap("workEffortId", workEffortId), false);
            if (UtilValidate.isEmpty(workEffort)){
                return ServiceUtil.returnError(UtilProperties.getMessage(resource, "WorkEffortDoesNotExist", locale));
            }
            Timestamp fromDate = (Timestamp) workEffort.get("actualStartDate");
            GenericValue userLogin = (GenericValue) context.get("userLogin");
            String partyId = (String) userLogin.get("partyId");
            String timeEntryId = delegator.getNextSeqId("TimeEntry");
            
            timeEntry.set("timeEntryId", timeEntryId);
            timeEntry.set("workEffortId", workEffortId);
            timeEntry.set("partyId", partyId);
            timeEntry.set("fromDate", fromDate);
            timeEntry.create();
            
        } catch (GenericEntityException e) {
            String msg = "Can not start production task due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        
        return ServiceUtil.returnSuccess();
    }
    
    private static void checkAndCloseAlreadyBegunTimeEntry(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        String workEffortId = (String) context.get("workEffortId");
        Timestamp thruDate = UtilDateTime.nowTimestamp();
        try {
            List<GenericValue> timeEntries = delegator.findByAnd("TimeEntry", UtilMisc.toMap("workEffortId", workEffortId));
            for (GenericValue oneTimeEntry : timeEntries){
                if (UtilValidate.isEmpty(oneTimeEntry.get("thruDate"))) {
                    oneTimeEntry.put("thruDate", thruDate);
                    oneTimeEntry.store();
                }
            }
        } catch (GenericEntityException e) {
            String msg = "Can not check if a begun Time Entry already exists due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
        }
    }

    public static Map<String, Object> stopProductionTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Locale locale = (Locale) context.get("locale");
        LocalDispatcher dispatcher = dctx.getDispatcher();
        Map<String, Object> result = null;
        
        try {
            dispatcher.runSync("changeProductionRunTaskStatus", context);
        } catch (GenericServiceException e) {
            Debug.logError(e, "Problem calling the changeProductionRunTaskStatus service", module);
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStart", locale));
        }
        
        String workEffortId = (String) context.get("workEffortId");
        if (! isTaskComplete(dctx, workEffortId)) {
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStart", locale));
        }

        result = stopWorkEffortTimeEntry(dctx, context);
        return result;
    }
    
    private static boolean isTaskComplete(DispatchContext dctx, String workEffortId) {
        Delegator delegator = dctx.getDelegator();

        GenericValue workEffort = null;
        try {
            workEffort = delegator.findOne("WorkEffort", UtilMisc.toMap("workEffortId", workEffortId), false);
        } catch (GenericEntityException e) {
            String msg = "Can not check production task status due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return false;
        }
        if (UtilValidate.isEmpty(workEffort)){
            return false;
        }
        String currentStatus = (String) workEffort.get("currentStatusId");
        
        if (currentStatus.equals("PRUN_COMPLETED")) {
            return true;
        }
        return false;
    }

    private static Map<String, Object> stopWorkEffortTimeEntry(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        Locale locale = (Locale) context.get("locale");
        
        String workEffortId = (String) context.get("workEffortId");
        GenericValue workEffort = null;
        GenericValue timeEntry = null;
        try {
            List<GenericValue> timeEntries = delegator.findByAnd("TimeEntry", UtilMisc.toMap("workEffortId", workEffortId));
            for (GenericValue oneTimeEntry : timeEntries){
                if (UtilValidate.isEmpty(oneTimeEntry.get("thruDate"))) {
                    timeEntry = oneTimeEntry;
                }
            }
            if (UtilValidate.isEmpty(timeEntry)) {
                return ServiceUtil.returnSuccess();
            }
            
            workEffort = delegator.findOne("WorkEffort", UtilMisc.toMap("workEffortId", workEffortId), false);
            if (UtilValidate.isEmpty(workEffort)){
                return ServiceUtil.returnError(UtilProperties.getMessage(resource, "WorkEffortDoesNotExist", locale));
            }
            Timestamp thruDate = (Timestamp) workEffort.get("actualCompletionDate");
            timeEntry.set("thruDate", thruDate);
            timeEntry.store();
            
        } catch (GenericEntityException e) {
            String msg = "Can not stop production task due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        
        return ServiceUtil.returnSuccess();
    }
    
    public static Map<String, Object> pauseProductionTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        
        String workEffortId = (String) context.get("workEffortId");
        GenericValue timeEntry = null;
        
        try {
            List<GenericValue> timeEntries = delegator.findByAnd("TimeEntry", UtilMisc.toMap("workEffortId", workEffortId));
            for (GenericValue oneTimeEntry : timeEntries){
                if (UtilValidate.isEmpty(oneTimeEntry.get("thruDate"))) {
                    timeEntry = oneTimeEntry;
                }
            }
            if (UtilValidate.isEmpty(timeEntry)) {
                String msg = "No TimeEntry began for WorkEffort was found";
                Debug.logError(msg, module);
                return ServiceUtil.returnError(msg);
            }
            
            Timestamp thruDate = UtilDateTime.nowTimestamp();
            timeEntry.set("thruDate", thruDate);
            timeEntry.store();
            
        } catch (GenericEntityException e) {
            String msg = "Can not pause production task due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        
        return ServiceUtil.returnSuccess();
    }
    
    public static Map<String, Object> resumeProductionTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Delegator delegator = dctx.getDelegator();
        
        checkAndCloseAlreadyBegunTimeEntry(dctx, context);
        
        GenericValue timeEntry = delegator.makeValidValue("TimeEntry", context);
        if (UtilValidate.isEmpty(timeEntry)) {
            String msg = "Can not start TimeEntry for WorkEffort due to an error in delegator.makeValidValue(TimeEntry, context)";
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        String workEffortId = (String) context.get("workEffortId");
        Timestamp fromDate = UtilDateTime.nowTimestamp();
        GenericValue userLogin = (GenericValue) context.get("userLogin");
        String partyId = (String) userLogin.get("partyId");
        String timeEntryId = delegator.getNextSeqId("TimeEntry");
        
        timeEntry.set("timeEntryId", timeEntryId);
        timeEntry.set("workEffortId", workEffortId);
        timeEntry.set("partyId", partyId);
        timeEntry.set("fromDate", fromDate);
        try {
            timeEntry.create();
            
        } catch (GenericEntityException e) {
            String msg = "Can not resume production task due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        
        return ServiceUtil.returnSuccess();
    }
    
}
