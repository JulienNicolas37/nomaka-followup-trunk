<#--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->
<div id="global">
	<div class="tile-main" id="red">
		<div class="tile-left">
			<img src="../images/dashboard/FO-red.png" HEIGHT=128 WIDTH=63/>
		</div>
		<div class="tile-right">
			<div class="tile-content">
				<#list fabOrderDelayedList as fabOrderDelayed>
					<a href="/manufacturing/control/ShowProductionRun" style='display:${fabOrderDelayed.fabOrderDisplay}' title='${fabOrderDelayed.fabOrderId+' - '+fabOrderDelayed.fabOrderName}'>${fabOrderDelayed.fabOrderShortDescript}</a><br/>
				</#list>
			</div>
			<div class="tile-number">
				<p>${nbFabOrdersDelayed}</p>
			</div>
			<div class="tile-title">${uiLabelMap.FO_Delayed}</div>
			<div class="tile-more"><a href="/manufacturing/control/ShowProductionRun">${uiLabelMap.More}</a></div>
		</div>
	</div>
	<div class="tile-main" id="blue">
		<div class="tile-left">
			<img src="../images/dashboard/FO-blue.png" HEIGHT=128 WIDTH=63/>
		</div>
		<div class="tile-right">
			<div class="tile-content">
				<#list fabOrderInProdList as fabOrderInProd>
					<a href="/manufacturing/control/ShowProductionRun" style='display:${fabOrderInProd.fabOrderDisplay}' title='${fabOrderInProd.fabOrderId+' - '+fabOrderInProd.fabOrderName}'>${fabOrderInProd.fabOrderShortDescript}</a><br/>
				</#list>
			</div>
			<div class="tile-number">
				<p>${nbFabOrdersInProd}</p>
			</div>
			<div class="tile-title">${uiLabelMap.FO_InProduction}</div>
			<div class="tile-more"><a href="/manufacturing/control/ShowProductionRun">${uiLabelMap.More}</a></div>
		</div>
	</div>
	<div class="tile-main" id="purple">
		<div class="tile-left">
			<img src="../images/dashboard/FO-purple.png" HEIGHT=128 WIDTH=63/>
		</div>
		<div class="tile-right">
			<div class="tile-content">
				<#list fabOrderReadyList as fabOrderReady>
					<a href="/manufacturing/control/ShowProductionRun" style='display:${fabOrderReady.fabOrderDisplay}' title='${fabOrderReady.fabOrderId+' - '+fabOrderReady.fabOrderName}'>${fabOrderReady.fabOrderShortDescript}</a><br/>
				</#list>
			</div>
			<div class="tile-number">
				<p>${nbFabOrdersReady}</p>
			</div>
			<div class="tile-title">${uiLabelMap.FO_Ready}</div>
			<div class="tile-more"><a href="/manufacturing/control/ShowProductionRun">${uiLabelMap.More}</a></div>
		</div>
	</div>
</div>