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
        <div id="bloc-content">
            <div id="popup-mentions-legales-fond">
                <div id="popup-mentions-legales">
                    <div class="ombre-ligne"></div>
                    <div id="content-popup">
                        <h3>Mentions légales</h3>
                        <a href="#" id="btn-fermer-popup"></a>
                        <p>Droit d'auteur (c) 2001-2014 The Apache Software Foundation - www.apache.org</p>
                        <p>Fonctionne grâce à Apache OFBiz </p>
                    </div>
                </div>
            </div>
            <div id="content">
                <#if prodRunList?has_content>
                    <ul class="liste-elements active" id="liste-of">
                        <#list prodRunList as prodRun>
                            <li class="ligne-liste ${prodRun.prodRunClassLigneListe}">
                                <div class="ligne-clic">
                                    <div class="ombre-ligne"></div>
                                    <div class="case id"><div class="case-content"><span class="titre-masque">${prodRun.prodRunName}<br/></span><span class="num-id">${prodRun.prodRunId}</span><a href="#" class="btn-fermer"></a></div><div class="fleche-detail"></div></div>
                                    <div class="case nom"><div class="case-content">${prodRun.prodRunName}</div></div>
                                    <div class="case statut"><div class="case-content"><span class="picto-statut" data-baseurl='${prodRun.prodRunStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${prodRun.prodRunDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                    <div class="case description"><div class="case-content">${prodRun.prodRunDescription}</div></div>
                                    <div class="case avancement"><div class="case-content"><span class="ombre-pourcent"></span><span class="pie">${prodRun.prodRunProgress}, ${prodRun.prodRunRest}</span><span class="pourcent"><strong>${prodRun.prodRunProgress}</strong>%</span></div></div>
                                    <div class="case avancement-open"><div class="case-content"><div class="temps passe"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${prodRun.prodRunRealTime}</span></div><div class="temps prevu"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${prodRun.prodRunPlannedTime}</span></div><span class="ombre-pourcent"></span><span class="pie">${prodRun.prodRunProgress}, ${prodRun.prodRunRest}</span><span class="pourcent"><strong>${prodRun.prodRunProgress}</strong>%</span></div></div>
                                    <a href="#" class="btn-ligne up  btn-ligne-masque"><span class="ombre-btn-ligne"></span></a>
                                    <a href="#" class="btn-ligne down  btn-ligne-masque"><span class="ombre-btn-ligne"></span></a>
                                </div>
                                <div class="bloc-bottom">
                                    <div class="bloc-description">
                                        <div class="bloc-description-content">
                                            <h2>Description</h2>
                                            <p>${prodRun.prodRunDescription}</p>
                                            <h2 class="top-plus">${uiLabelMap.FollowupTaskListInProdRun}</h2>
                                        </div>
                                        <ul class="liste-elements-inte">
                                            <#list prodRun.taskList as task>
                                                <li id="${task.taskId}list-task-in-of" class="ligne-liste-inte ${task.taskClassLigneListe}">
                                                    <div class="ligne-clic">
                                                        <div class="ombre-ligne"></div>
                                                        <div class="case id"><div class="case-content"><span class="titre-masque">${task.prodRunName}<br/></span><span class="num-id">${task.taskId}</span><a href="#" class="btn-fermer"></a></div><div class="fleche-detail"></div></div>
                                                        <div class="case nom"><div class="case-content">${task.taskName}</div></div>
                                                        <div class="case statut"><div id="${task.taskId}status-task-in-of" class="case-content"><span class="picto-statut" data-baseurl='${task.taskStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${task.taskDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                                        <div class="case description"><div class="case-content">${task.taskDescription}</div></div>
                                                        <div class="case avancement"><div class="case-content"><span class="ombre-pourcent"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="pourcent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                                        <div class="case avancement-open"><div class="case-content"><div class="temps passe"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${task.taskRealTime}</span></div><div class="temps prevu"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${task.taskPlannedTime}</span></div><span class="ombre-pourcent"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="pourcent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                                    </div>
                                                </li>
                                            </#list>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </#list>
                    <li class="ligne-liste retour-haut">
                        <div class="ombre-ligne"></div>
                        <a href="#" class="btn-retour-haut"><span class="triangle"></span>${uiLabelMap.FollowupReturnTopList}</a>
                    </li>
                    </ul>
                
                    <ul class="liste-elements" id="liste-t">
                        <#list taskList as task>
                            <li id="${task.taskId}list-task" class="ligne-liste ${task.taskClassLigneListe}">
                                <div class="ligne-clic">
                                    <div class="of-correspondant">
                                        <a class="lien-of-correspondant" href="#"><div class="ombre-btn"></div><div class="content-lien-of-correspondant">› ${uiLabelMap.FollowupSeeProductionRun}</div></a><div class="nom-ordre-correspondant">› Ordre N° <span class="num-of-corres">${task.prodRunId}</span> : ${task.prodRunName} </div>
                                    </div>
                                    <div class="ombre-ligne"></div>
                                    <div class="case id"><div class="case-content"><span class="titre-masque">${task.taskName}<br/></span><span class="num-id">${task.taskId}</span><a href="#" class="btn-fermer"></a></div><div class="fleche-detail"></div></div>
                                    <div class="case nom"><div class="case-content">${task.taskName}</div></div>
                                    <div class="case statut"><div id="${task.taskId}status" class="case-content"><span class="picto-statut" data-baseurl='${task.taskStatusPath}' data-grid='29x29' data-blocksize='70x70' data-frames='${task.taskDataFrames}' data-fps='12' data-autoplay='true' data-autoload='true' data-retina='false'></span></div></div>
                                    <div class="case description"><div class="case-content">${task.taskDescription}</div></div>
                                    <div class="case avancement"><div class="case-content"><span class="ombre-pourcent"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="pourcent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                    <div class="case avancement-open"><div class="case-content"><div class="temps passe"><strong>${uiLabelMap.FollowupRealTime}</strong><span class="time">${task.taskRealTime}</span></div><div class="temps prevu"><strong>${uiLabelMap.FollowupPlannedTime}</strong><span class="time">${task.taskPlannedTime}</span></div><span class="ombre-pourcent"></span><span class="pie">${task.taskProgress}, ${task.taskRest}</span><span class="pourcent"><strong>${task.taskProgress}</strong>%</span></div></div>
                                    <a href="#" class="btn-ligne up  btn-ligne-masque"><span class="ombre-btn-ligne"></span></a>
                                    <a href="#" class="btn-ligne down  btn-ligne-masque"><span class="ombre-btn-ligne"></span></a>
                                </div>
                                <div class="bloc-bottom">
                                    <div class="bloc-btn">
                                    <#if task.taskStatus == "Ready">
                                        <a id="${task.taskId}startButton" style="display:block" href="#" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:none" href="#" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:none" href="#" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:none" href="#" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-terminer"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    <#else>
                                    <#if task.taskStatus == "Break">
                                        <a id="${task.taskId}startButton" style="display:none" href="#" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:block" href="#" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:none" href="#" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:block" href="#" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-terminer"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    <#else>
                                    <#if task.taskStatus == "InProduction">
                                        <a id="${task.taskId}startButton" style="display:none" href="#" onClick="sendStart('<@ofbizUrl>startProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskStart}</span></a>
                                        <a id="${task.taskId}resumeButton" style="display:none" href="#" onClick="sendResume('<@ofbizUrl>resumeProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-demarrer"><span class="txt-btn">${uiLabelMap.FollowupTaskResume}</span></a>
                                        <a id="${task.taskId}pauseButton" style="display:block" href="#" onClick="sendPause('<@ofbizUrl>pauseProductionTask</@ofbizUrl>','${task.taskId}');" class="btn-pause"><span class="txt-btn">${uiLabelMap.FollowupTaskBreak}</span></a>
                                        <a id="${task.taskId}stopButton" style="display:block" href="#" onClick="sendStop('<@ofbizUrl>stopProductionTask</@ofbizUrl>','${task.prodRunId}', '${task.taskId}', '${task.taskOriginalStatus}');" class="btn-terminer"><span class="txt-btn">${uiLabelMap.FollowupTaskEnd}</span></a>
                                    </#if></#if></#if>
                                    </div><div class="bloc-description">
                                        <div class="bloc-description-content">
                                            <h2>Description</h2>
                                            <p>${task.taskDescription}</p>
                                    </div></div>
                                </div>
                            </li>
                        </#list>
                        <li class="ligne-liste retour-haut">
                            <div class="ombre-ligne"></div>
                            <a href="#" class="btn-retour-haut"><span class="triangle"></span>${uiLabelMap.FollowupReturnTopList}</a>
                        </li>
                    </ul>
                </#if>
                
            </div>
        </div>
        