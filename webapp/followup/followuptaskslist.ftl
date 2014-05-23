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

    <div id="container">
        <div id="block-content">
            <div id="popup-legal-notices-background">
                <div id="popup-legal-notices">
                    <div class="line-shadow"></div>
                    <div id="content-popup">
                        <h3>${uiLabelMap.FollowupLegalNotices}</h3>
                        <a href="#" id="btn-close-popup"></a>
                        <p>${uiLabelMap.CommonCopyright} (c) 2001-${nowTimestamp?string("yyyy")} The Apache Software Foundation - http://www.apache.org</p>
                        <p>${uiLabelMap.CommonPoweredBy} Apache OFBiz</p>
                    </div>
                </div>
            </div>
            <div id="content">
                <#if fabOrderList?has_content>
                    <ul class="elements-list active" id="faborder-list">
                        <#list fabOrderList as fabOrder>
                            <li class="list-line ${fabOrder.fabOrderClassListLine}">
                                <div class="line-clic">
                                    <div class="line-shadow"></div>
                                    <div class="case id"><div class="case-content"><span class="mask-title">${fabOrder.fabOrderName}<br/></span><span class="num-id">${fabOrder.fabOrderId}</span><a href="#" class="btn-close"></a></div><div class="arrow-detail"></div></div>
                                    <div class="case name"><div class="case-content">${fabOrder.fabOrderName}</div></div>
                                    <div class="case status"><div class="case-content"><span class="picto-status" data-baseurl='${fabOrder.fabOrderStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${fabOrder.fabOrderDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                    <div class="case description"><div class="case-content">${fabOrder.fabOrderDescription}</div></div>
                                    <div class="case progress"><div class="case-content"><span class="percent-shadow"></span><span class="pie">${fabOrder.fabOrderProgress}, ${fabOrder.fabOrderRest}</span><span class="percent"><strong>${fabOrder.fabOrderProgress}</strong>%</span></div></div>
                                    <div class="case progress-open"><div class="case-content"><div class="prod-time real"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${fabOrder.fabOrderRealTime}</span></div><div class="prod-time estimated"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${fabOrder.fabOrderPlannedTime}</span></div><span class="percent-shadow"></span><span class="pie">${fabOrder.fabOrderProgress}, ${fabOrder.fabOrderRest}</span><span class="percent"><strong>${fabOrder.fabOrderProgress}</strong>%</span></div></div>
                                    <a href="#" class="btn-line up  btn-line-mask"><span class="shadow-btn-line"></span></a>
                                    <a href="#" class="btn-line down  btn-line-mask"><span class="shadow-btn-line"></span></a>
                                </div>
                                <div class="block-bottom">
                                    <div class="block-description">
                                        <div class="block-description-content">
                                            <h2>${uiLabelMap.FollowupDescription}</h2>
                                            <p>${fabOrder.fabOrderDescription}</p>
                                            <h2 class="top-plus">${uiLabelMap.FollowupTaskListInFabOrder}</h2>
                                        </div>
                                        <ul class="elements-list-cont">
                                            <#list fabOrder.taskList as task>
                                                <li id="${task.taskId}list-task-in-faborder" class="list-line-cont ${task.taskClassListLine}">
                                                    <div class="line-clic">
                                                        <div class="line-shadow"></div>
                                                        <div class="case id"><div class="case-content"><span class="mask-title">${task.fabOrderName}<br/></span><span class="num-id">${task.taskId}</span><a href="#" class="btn-close"></a></div><div class="arrow-detail"></div></div>
                                                        <div class="case name"><div class="case-content">${task.taskName}</div></div>
                                                        <div class="case status"><div id="${task.taskId}status-task-in-faborder" class="case-content"><span class="picto-status" data-baseurl='${task.taskStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${task.taskDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                                        <div class="case description"><div class="case-content">${task.taskDescription}</div></div>
                                                        <div class="case progress"><div class="case-content"><span class="percent-shadow"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="percent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                                        <div class="case progress-open"><div class="case-content"><div class="prod-time real"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${task.taskRealTime}</span></div><div class="prod-time estimated"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${task.taskPlannedTime}</span></div><span class="percent-shadow"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="percent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                                    </div>
                                                </li>
                                            </#list>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </#list>
                    <li class="list-line back-to-top">
                        <div class="line-shadow"></div>
                        <a href="#" class="btn-back-to-top"><span class="triangle"></span>${uiLabelMap.FollowupReturnTopList}</a>
                    </li>
                    </ul>
                
                    <ul class="elements-list" id="task-list">
                        <#list taskList as task>
                            <li id="${task.taskId}list-task" class="list-line ${task.taskClassListLine}">
                                <div class="line-clic">
                                    <div class="parent-faborder">
                                        <a class="parent-faborder-link" href="#"><div class="shadow-btn"></div><div class="content-parent-faborder-link">› ${uiLabelMap.FollowupSeeFabricationOrder}</div></a><div class="parent-faborder-name">› Ordre N° <span class="parent-faborder-id">${task.fabOrderId}</span> : ${task.fabOrderName} </div>
                                    </div>
                                    <div class="line-shadow"></div>
                                    <div class="case id"><div class="case-content"><span class="mask-title">${task.taskName}<br/></span><span class="num-id">${task.taskId}</span><a href="#" class="btn-close"></a></div><div class="arrow-detail"></div></div>
                                    <div class="case name"><div class="case-content">${task.taskName}</div></div>
                                    <div class="case status"><div id="${task.taskId}status" class="case-content"><span class="picto-status" data-baseurl='${task.taskStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${task.taskDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                    <div class="case description"><div class="case-content">${task.taskDescription}</div></div>
                                    <div class="case progress"><div class="case-content"><span class="percent-shadow"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="percent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                    <div class="case progress-open"><div class="case-content"><div class="prod-time real"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${task.taskRealTime}</span></div><div class="prod-time estimated"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${task.taskPlannedTime}</span></div><span class="percent-shadow"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="percent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                    <a href="#" class="btn-line up  btn-line-mask"><span class="shadow-btn-line"></span></a>
                                    <a href="#" class="btn-line down  btn-line-mask"><span class="shadow-btn-line"></span></a>
                                </div>
                                <div class="block-bottom">
                                    <div class="block-btn">
                                    <#if task.taskStatus == "Ready">
                                        <a id="${task.taskId}startButton" style="display:block" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:none" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:none" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:none" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-stop"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    <#else>
                                    <#if task.taskStatus == "Break">
                                        <a id="${task.taskId}startButton" style="display:none" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:block" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:none" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:block" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-stop"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    <#else>
                                    <#if task.taskStatus == "InProduction">
                                        <a id="${task.taskId}startButton" style="display:none" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:none" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-start"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:block" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:block" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.fabOrderId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-stop"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    </#if></#if></#if>
                                    </div><div class="block-description">
                                        <div class="block-description-content">
                                            <h2>${uiLabelMap.FollowupDescription}</h2>
                                            <p>${task.taskDescription}</p>
                                    </div></div>
                                </div>
                            </li>
                        </#list>
                        <li class="list-line back-to-top">
                            <div class="line-shadow"></div>
                            <a href="#" class="btn-back-to-top"><span class="triangle"></span>${uiLabelMap.FollowupReturnTopList}</a>
                        </li>
                    </ul>
                </#if>
                
            </div>
        </div>
        