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

import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.*
import org.ofbiz.base.util.Debug;
import javolution.util.FastList;
import org.ofbiz.base.util.UtilDateTime;

List<GenericValue> fabOrderDelayedList = FastList.newInstance();
List<GenericValue> fabOrderInProdList = FastList.newInstance();
List<GenericValue> fabOrderReadyList = FastList.newInstance();

OFNameMax = 18 ;

/****** Manage Fabrication Orders ******/

nowDate = UtilDateTime.nowTimestamp();

nbFabOrdersInProd = 0;
nbFabOrdersDelayed = 0;
nbFabOrdersReady = 0;

fabOrders = delegator.findList("WorkEffortFabOrdersView", null, null, UtilMisc.toList("estimatedCompletionDate ASC"), null, false);

for (fabOrder in fabOrders) {
	fabOrderShortDescript=(String) fabOrder.workEffortName;
	if (fabOrderShortDescript.length()>(OFNameMax)) {
		fabOrderShortDescript=fabOrderShortDescript.substring(0,OFNameMax);
		fabOrderShortDescript+="...";
	}
	fabOrderShortDescript=(String) fabOrder.workEffortId+" - "+fabOrderShortDescript;

	if (nowDate.after(fabOrder.estimatedCompletionDate)) {
		nbFabOrdersDelayed++;
		
		if (nbFabOrdersDelayed > 5) {
			fabOrderDisplay = "false";
		} else {
			fabOrderDisplay = "true";
		}
		
		fabOrderDelayedList.add(UtilMisc.toMap(
		    "fabOrderId", (String) fabOrder.workEffortId
		    ,"fabOrderName", (String) fabOrder.workEffortName
		    ,"fabOrderShortDescript", fabOrderShortDescript
		    ,"fabOrderDisplay", fabOrderDisplay
		)); 
	}
	
	if ("PRUN_RUNNING".equals(fabOrder.currentStatusId)) {
		nbFabOrdersInProd++;

		if (nbFabOrdersInProd > 5) {
			fabOrderDisplay = "false";
		} else {
			fabOrderDisplay = "true";
		}
		
		fabOrderInProdList.add(UtilMisc.toMap(
		    "fabOrderId", (String) fabOrder.workEffortId
		    ,"fabOrderName", (String) fabOrder.workEffortName
		    ,"fabOrderShortDescript", fabOrderShortDescript
		    ,"fabOrderDisplay", fabOrderDisplay
		)); 
	} else {
		nbFabOrdersReady++;

		if (nbFabOrdersReady > 5) {
			fabOrderDisplay = "false";
		} else {
			fabOrderDisplay = "true";
		}
		
		fabOrderReadyList.add(UtilMisc.toMap(
		    "fabOrderId", (String) fabOrder.workEffortId
		    ,"fabOrderName", (String) fabOrder.workEffortName
		    ,"fabOrderShortDescript", fabOrderShortDescript
		    ,"fabOrderDisplay", fabOrderDisplay
		)); 
	}

}
context.fabOrderDelayedList = fabOrderDelayedList ;
context.fabOrderInProdList = fabOrderInProdList ;
context.fabOrderReadyList = fabOrderReadyList ;

context.nbFabOrdersInProd = nbFabOrdersInProd;
context.nbFabOrdersDelayed = nbFabOrdersDelayed;
context.nbFabOrdersReady = nbFabOrdersReady;