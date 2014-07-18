package org.ofbiz.followup;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
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
import org.ofbiz.service.ModelService;
import org.ofbiz.service.ServiceUtil;

public class FollowupServices {
    
    public static final String module = FollowupServices.class.getName();
    public static final String resource = "FollowupUiLabels";

    public static Map<String, Object> startProductionTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Locale locale = (Locale) context.get("locale");
        LocalDispatcher dispatcher = dctx.getDispatcher();
        Map<String, Object> result = null;
        
        try {
            String fabricationOrderId = (String) context.get("fabricationOrderId");
            ModelService createService = dctx.getModelService("changeProductionRunTaskStatus");
            Map<String, Object> inContext = createService.makeValid(context, ModelService.IN_PARAM);
            inContext.put("productionRunId", fabricationOrderId);
            dispatcher.runSync("changeProductionRunTaskStatus", inContext);
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
        Boolean issueAllComponents = true;
        
        try {
            String productsId = (String) context.get("productsId");
            if (! UtilValidate.isEmpty(productsId)) {
                result = issueComponents(dctx, context);
                if (ServiceUtil.isError(result)) {
                    return result;
                }
                issueAllComponents = false;
            }
            String fabricationOrderId = (String) context.get("fabricationOrderId");
            ModelService createService = dctx.getModelService("changeProductionRunTaskStatus");
            Map<String, Object> inContext = createService.makeValid(context, ModelService.IN_PARAM);
            inContext.put("productionRunId", fabricationOrderId);
            inContext.put("issueAllComponents", issueAllComponents);
            result = dispatcher.runSync("changeProductionRunTaskStatus", inContext);
        } catch (GenericServiceException e) {
            Debug.logError(e, "Problem calling the changeProductionRunTaskStatus service", module);
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStop", locale));
        }
        if (ServiceUtil.isError(result)) {
            return result;
        }
        
        String workEffortId = (String) context.get("workEffortId");
        if (! isTaskComplete(dctx, workEffortId)) {
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStop", locale));
        }
        
        result = stopWorkEffortTimeEntry(dctx, context);
        return result;
    }
    
    private static Map<String, Object> issueComponents(DispatchContext dctx, Map<String, ? extends Object> context) {
        Locale locale = (Locale) context.get("locale");
        LocalDispatcher dispatcher = dctx.getDispatcher();
        Map<String, Object> result = ServiceUtil.returnSuccess();
        String separator = ";";
        
        try {
            ModelService createService = dctx.getModelService("issueProductionRunTaskComponent");
            Map<String, Object> inContext = createService.makeValid(context, ModelService.IN_PARAM);
            String workEffortId = (String) context.get("workEffortId");
            String productsId = (String) context.get("productsId");
            String[] products = productsId.split(separator);
            String productsQuantity = (String) context.get("productsQuantity");
            String[] quantities = productsQuantity.split(separator);
            String productsLotId = (String) context.get("productsLotId");
            String[] lotIds = productsLotId.split(separator);
            
            if (products.length != quantities.length || products.length != lotIds.length) {
                String msg = "Unable to issue components because number of productID, quantity and lotId are differents";
                Debug.logError(msg, module);
                return ServiceUtil.returnError(msg);
            }
            
            for (int i = 0 ; i < products.length ; i ++) {
                String strQuantity = quantities[i];
                BigDecimal quantity = new BigDecimal(strQuantity);
                String productId = products[i];
                String lotId = lotIds[i];
                if ("_NA_".equals(lotId)) {
                    lotId = "";
                }
                inContext.put("productId", productId);
                inContext.put("workEffortId", workEffortId);
                inContext.put("quantity", quantity);
                inContext.put("lotId", lotId);
                result = dispatcher.runSync("issueProductionRunTaskComponent", inContext);
            }
        } catch (GenericServiceException e) {
            Debug.logError(e, "Problem calling the issueProductionRunTaskComponent service", module);
            return ServiceUtil.returnError(UtilProperties.getMessage(resource, "FollowupTaskUnableToStop", locale));
        }

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

    public static Map<String, Object> stopLastTask(DispatchContext dctx, Map<String, ? extends Object> context) {
        Map<String, Object> result = null;
        LocalDispatcher dispatcher = dctx.getDispatcher();
        
        result = stopProductionTask(dctx, context);
        if (ServiceUtil.isError(result)) {
            return result;
        }
        
        // Création context pour appelé le service ProductionRunProduce
        ModelService produceService;
        try {
            BigDecimal quantity = (BigDecimal) context.get("fabOrderQuantity");
            if (quantity.compareTo(BigDecimal.ZERO) > 0) {
                String workEffortId = (String) context.get("fabricationOrderId");
                String lotId = (String) context.get("fabOrderLotId");
                produceService = dctx.getModelService("productionRunProduce");
                Map<String, Object> inContext = produceService.makeValid(context, ModelService.IN_PARAM);
                if (UtilValidate.isEmpty(lotId) || lotId == "_NA_") {
                    lotId = "";
                }
                inContext.put("workEffortId", workEffortId);
                inContext.put("quantity", quantity);
                inContext.put("lotId", lotId);
                result = dispatcher.runSync("productionRunProduce", inContext);
                if (ServiceUtil.isError(result)) {
                    return result;
                }
            }
        } catch (GenericServiceException e) {
            String msg = "Can not indicate fabrication order quantity due to following error: " + e.getLocalizedMessage();
            Debug.logError(msg, module);
            return ServiceUtil.returnError(msg);
        }
        
        result.remove("inventoryItemIds");
        result.remove("quantity");
        return result;
    }
}
