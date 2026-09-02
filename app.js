"use strict";

const lessons = [
  {
    group:"Java → DataWeave", stage:"Lesson 1", badge:"Variables & Boolean", title:"Quantity Rule",
    objective:"Start with a Java boolean expression, then express the same data rule in DataWeave.",
    requirement:"If quantity is greater than 1, produce a flag named MULTI_QTY. For quantity 4 the result must be true.",
    testData:"quantity = 4",
    javaHint:"Write a boolean assignment using request.quantity() > 1.",
    muleHint:"This is data logic, so use DataWeave rather than a Mule Choice router.",
    javaStarter:"boolean multiQty = false;\nSystem.out.println(\"MULTI_QTY = \" + multiQty);",
    javaSolution:"boolean multiQty = request.quantity() > 1;\nSystem.out.println(\"MULTI_QTY = \" + multiQty);",
    muleStarter:"%dw 2.0\noutput application/json\n---\n{\n    multi_qty: false\n}",
    muleSolution:"%dw 2.0\noutput application/json\n---\n{\n    multi_qty: (payload.quantity default 1) as Number > 1\n}",
    javaCheck:c=>/quantity\s*\(\s*\)\s*>\s*1/.test(c),
    muleCheck:c=>/multi_qty\s*:\s*.*quantity[\s\S]*>\s*1/i.test(c),
    javaOutput:"MULTI_QTY = true",
    comparison:["boolean multiQty = request.quantity() > 1;","multi_qty: (payload.quantity default 1) as Number > 1"],
    runtime:["Input quantity=4","Evaluate > 1","Build output","MULTI_QTY=true"]
  },
  {
    group:"Java → Mule", stage:"Lesson 2", badge:"If / Else", title:"Validate Service Code",
    objective:"Translate Java validation into Mule flow control.",
    requirement:"Reject the order when serviceCode is null or blank. Valid service codes continue to mapping.",
    testData:'serviceCode = "010004556"',
    javaHint:"Use if with null/blank validation and throw an exception for invalid input.",
    muleHint:"Validation changes execution flow. Use <choice>, <when>, and <raise-error>.",
    javaStarter:"if (request.serviceCode() == null) {\n    // TODO\n}",
    javaSolution:"if (request.serviceCode() == null || request.serviceCode().isBlank()) {\n    throw new IllegalArgumentException(\"MISSING_SERVICE_CODE\");\n}\nSystem.out.println(\"VALID\");",
    muleStarter:'<choice>\n    <!-- add validation -->\n</choice>',
    muleSolution:'<choice>\n    <when expression="#[isBlank(payload.serviceCode)]">\n        <raise-error type="APP:MISSING_SERVICE_CODE"/>\n    </when>\n    <otherwise>\n        <flow-ref name="map-order"/>\n    </otherwise>\n</choice>',
    javaCheck:c=>/serviceCode\s*\(\s*\)/.test(c)&&/(isBlank|null)/.test(c)&&/(throw|Exception)/.test(c),
    muleCheck:c=>/<choice[\s>]/i.test(c)&&/<when[\s>]/i.test(c)&&/<raise-error/i.test(c),
    javaOutput:"VALID",
    comparison:["if (...) { throw new ... }","<choice> + <when> + <raise-error>"],
    runtime:["Receive order","Check serviceCode","Valid?","Continue to mapper"]
  },
  {
    group:"Java → Mule", stage:"Lesson 3", badge:"Switch / Choice", title:"ORM Order Control Routing",
    objective:"Convert a Java switch into Mule Choice routing for NW, CA, and XO.",
    requirement:"NW routes to New Order, CA routes to Cancellation, XO routes to Adjustment. Anything else raises INVALID_ORDER_TYPE.",
    testData:'orderControl = "NW"',
    javaHint:"Use switch or switch expression with NW, CA, XO and a default branch.",
    muleHint:"This is orchestration logic. Use Mule <choice> with several <when> branches.",
    javaStarter:'switch (request.orderControl()) {\n    // TODO\n}',
    javaSolution:'switch (request.orderControl()) {\n    case "NW" -> processNewOrder();\n    case "CA" -> processCancellation();\n    case "XO" -> processAdjustment();\n    default -> throw new IllegalArgumentException("INVALID_ORDER_TYPE");\n}',
    muleStarter:'<choice>\n    <!-- NW / CA / XO -->\n</choice>',
    muleSolution:'<choice>\n    <when expression="#[vars.orderType == \'NW\']">\n        <flow-ref name="map-orders-data-nw"/>\n    </when>\n    <when expression="#[vars.orderType == \'CA\']">\n        <flow-ref name="map-orders-data-ca"/>\n    </when>\n    <when expression="#[vars.orderType == \'XO\']">\n        <flow-ref name="map-orders-data-xo"/>\n    </when>\n    <otherwise>\n        <raise-error type="APP:INVALID_ORDER_TYPE"/>\n    </otherwise>\n</choice>',
    javaCheck:c=>/switch/.test(c)&&/["']NW["']/.test(c)&&/["']CA["']/.test(c)&&/["']XO["']/.test(c)&&/default/.test(c),
    muleCheck:c=>/<choice/i.test(c)&&/NW/.test(c)&&/CA/.test(c)&&/XO/.test(c)&&/<otherwise/i.test(c),
    javaOutput:"NW → processNewOrder()",
    comparison:["switch(orderControl)","<choice> / <when> / <otherwise>"],
    runtime:["ORM_O01","Read ORC-1","NW","New Order flow"]
  },
  {
    group:"Java → DataWeave", stage:"Lesson 4", badge:"DTO Mapping", title:"Build SLB Order XML",
    objective:"Translate Java DTO construction into a DataWeave XML transformation.",
    requirement:"Map visitNo, orderId, serviceCode and quantity into an SLB order payload.",
    testData:'visitNo=1000084013 | orderId=001BYT216 | serviceCode=010004556 | quantity=1',
    javaHint:"Construct a SlbOrder using the request fields.",
    muleHint:"This is transformation logic. Build an XML object in DataWeave.",
    javaStarter:'return new SlbOrder(\n    // TODO\n);',
    javaSolution:'return new SlbOrder(\n    request.visitNo(),\n    request.orderId(),\n    request.serviceCode(),\n    request.quantity()\n);',
    muleStarter:'%dw 2.0\noutput application/xml\n---\n{\n    slbOrder: {\n        // TODO\n    }\n}',
    muleSolution:'%dw 2.0\noutput application/xml\n---\n{\n    slbOrder: {\n        visit_no: payload.visitNo,\n        ci_no: payload.orderId,\n        mservice_code: payload.serviceCode,\n        quantity: payload.quantity\n    }\n}',
    javaCheck:c=>/new\s+SlbOrder/.test(c)&&/visitNo/.test(c)&&/orderId/.test(c)&&/serviceCode/.test(c)&&/quantity/.test(c),
    muleCheck:c=>/output\s+application\/xml/i.test(c)&&/visit_no/.test(c)&&/ci_no/.test(c)&&/mservice_code/.test(c)&&/quantity/.test(c),
    javaOutput:"SlbOrder{visitNo=1000084013, ciNo=001BYT216, serviceCode=010004556, quantity=1}",
    comparison:["new SlbOrder(...)","DataWeave output application/xml"],
    runtime:["Java DTO fields","Mapper","SLB XML fields","XML payload"]
  },
  {
    group:"Messaging", stage:"Lesson 5", badge:"JMS", title:"Publish to ActiveMQ",
    objective:"Recognize the equivalent Java and Mule messaging operations.",
    requirement:"Publish the mapped SLB order to queue SLB.INTERNAL.Q.",
    testData:'destination = "SLB.INTERNAL.Q"',
    javaHint:"Use JmsTemplate.convertAndSend(destination, payload).",
    muleHint:"Use the Mule JMS publish operation. Messaging is Mule flow logic, not a DataWeave mapping.",
    javaStarter:'jmsTemplate.convertAndSend(\n    // TODO\n);',
    javaSolution:'jmsTemplate.convertAndSend("SLB.INTERNAL.Q", slbOrder);',
    muleStarter:'<jms:publish\n    config-ref="JMS_Config"\n    destination="" />',
    muleSolution:'<jms:publish\n    config-ref="JMS_Config"\n    destination="SLB.INTERNAL.Q" />',
    javaCheck:c=>/convertAndSend/.test(c)&&/SLB\.INTERNAL\.Q/.test(c),
    muleCheck:c=>/<jms:publish/i.test(c)&&/SLB\.INTERNAL\.Q/.test(c),
    javaOutput:"Published message → SLB.INTERNAL.Q",
    comparison:['jmsTemplate.convertAndSend(...)','<jms:publish destination="..."/>'],
    runtime:["Mapped XML","JMS Producer","SLB.INTERNAL.Q","Consumer"]
  },
  {
    group:"Healthcare Lab", stage:"Lesson 6", badge:"ORM → SLB", title:"Complete Order Processing Flow",
    objective:"Combine validation, routing, mapping, and messaging into one integration mental model.",
    requirement:"For ORM NW: validate service code, route to the NW flow, map the SLB XML, then publish to the internal queue.",
    testData:'messageType=ORM_O01 | ORC-1=NW | orderId=001BYT216 | serviceCode=010004556',
    javaHint:"Your Java solution should visibly include validation, NW routing, mapping, and publishing.",
    muleHint:"Your Mule answer should combine choice/flow-ref, transform or mapping flow, and JMS publish.",
    javaStarter:'public void process(OrderRequest request) {\n    // validation\n    // routing\n    // mapping\n    // JMS publish\n}',
    javaSolution:'public void process(OrderRequest request) {\n    if (request.serviceCode() == null || request.serviceCode().isBlank()) {\n        throw new IllegalArgumentException("MISSING_SERVICE_CODE");\n    }\n\n    if ("NW".equals(request.orderControl())) {\n        SlbOrder order = mapper.toSlbOrder(request);\n        jmsTemplate.convertAndSend("SLB.INTERNAL.Q", order);\n    } else {\n        throw new IllegalArgumentException("INVALID_ORDER_TYPE");\n    }\n}',
    muleStarter:'<flow name="process-orm">\n    <!-- validate -->\n    <!-- route -->\n    <!-- map -->\n    <!-- publish -->\n</flow>',
    muleSolution:'<flow name="process-orm">\n    <choice>\n        <when expression="#[isBlank(payload.serviceCode)]">\n            <raise-error type="APP:MISSING_SERVICE_CODE"/>\n        </when>\n        <when expression="#[vars.orderType == \'NW\']">\n            <flow-ref name="map-orders-data-nw"/>\n            <flow-ref name="map-order-to-slb"/>\n            <jms:publish config-ref="JMS_Config" destination="SLB.INTERNAL.Q"/>\n        </when>\n        <otherwise>\n            <raise-error type="APP:INVALID_ORDER_TYPE"/>\n        </otherwise>\n    </choice>\n</flow>',
    javaCheck:c=>/(serviceCode|isBlank)/.test(c)&&/(NW|orderControl)/.test(c)&&/(mapper|SlbOrder)/.test(c)&&/convertAndSend/.test(c),
    muleCheck:c=>/<choice/i.test(c)&&/<flow-ref/i.test(c)&&/<jms:publish/i.test(c)&&/(raise-error|MISSING_SERVICE_CODE)/.test(c),
    javaOutput:"ORM NW accepted → mapped → published to SLB.INTERNAL.Q",
    comparison:["Service method orchestrates several calls","Mule flow orchestrates components; DataWeave maps data"],
    runtime:["ORM received","Validate","NW route","DataWeave map","JMS publish","SLB.INTERNAL.Q"]
  }
];

let current=0;
const completed=new Set(JSON.parse(localStorage.getItem("hicoding-completed")||"[]"));
const $=id=>document.getElementById(id);
function renderNav(){const nav=$("lessonNav");nav.innerHTML="";[...new Set(lessons.map(l=>l.group))].forEach(group=>{const sec=document.createElement("div");sec.className="nav-section";const title=document.createElement("div");title.className="nav-section-title";title.textContent=group;sec.appendChild(title);lessons.forEach((lesson,i)=>{if(lesson.group!==group)return;const b=document.createElement("button");b.className="lesson-link"+(i===current?" active":"")+(completed.has(i)?" done":"");b.textContent=`${i+1}. ${lesson.title}`;b.onclick=()=>{current=i;render();};sec.appendChild(b);});nav.appendChild(sec);});}
function setResult(id,text,type=""){const el=$(id);el.textContent=text;el.className="result"+(type?` ${type}`:"");}
function render(){const l=lessons[current];renderNav();$("lessonStage").textContent=l.stage;$("lessonTitle").textContent=l.title;$("lessonObjective").textContent=l.objective;$("lessonBadge").textContent=l.badge;$("requirement").textContent=l.requirement;$("testData").textContent=l.testData;$("javaHint").textContent=l.javaHint;$("muleHint").textContent=l.muleHint;$("javaEditor").value=l.javaStarter;$("muleEditor").value=l.muleStarter;setResult("javaResult","Ready. Edit the Java code, then run the logic.");setResult("muleResult","Translate the same behavior into Mule/DataWeave, then check it.");$("comparison").innerHTML=`<pre class="comparison-code"></pre><div class="arrow">→</div><pre class="comparison-code"></pre>`;const codes=$("comparison").querySelectorAll("pre");codes[0].textContent=l.comparison[0];codes[1].textContent=l.comparison[1];$("runtimeFlow").innerHTML=l.runtime.map((n,i)=>`${i?'<span class="flow-arrow">→</span>':''}<span class="flow-node">${escapeHtml(n)}</span>`).join("");$("completeLesson").textContent=completed.has(current)?"✓ Completed":"Mark Lesson Complete";$("prevLesson").disabled=current===0;$("nextLesson").disabled=current===lessons.length-1;updateProgress();}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function updateProgress(){const n=completed.size;$("progressText").textContent=`${n} / ${lessons.length} completed`;$("progressBar").style.width=`${n/lessons.length*100}%`;}
$("runJava").onclick=()=>{const l=lessons[current],code=$("javaEditor").value;if(l.javaCheck(code)){setResult("javaResult",`✓ Java logic accepted.\n\nSimulated output:\n${l.javaOutput}`,'success');}else{setResult("javaResult","Not quite yet. Check the requirement and hint. The browser validates the important logic pattern; it does not compile a real JVM program.",'error');}};
$("checkMule").onclick=()=>{const l=lessons[current],code=$("muleEditor").value;if(l.muleCheck(code)){setResult("muleResult","✓ Mule/DataWeave answer accepted. Compare it with the Java version and follow the runtime flow below.",'success');}else{setResult("muleResult","The required Mule/DataWeave construct is still missing. Use the hint, then try again.",'error');}};
$("showJava").onclick=()=>{$("javaEditor").value=lessons[current].javaSolution;setResult("javaResult","Solution loaded. Read each line and compare it with the Mule/DataWeave side.",'warn');};
$("showMule").onclick=()=>{$("muleEditor").value=lessons[current].muleSolution;setResult("muleResult","Solution loaded. Identify which lines control flow and which lines transform data.",'warn');};
$("resetJava").onclick=()=>{$("javaEditor").value=lessons[current].javaStarter;setResult("javaResult","Java editor reset.");};
$("resetMule").onclick=()=>{$("muleEditor").value=lessons[current].muleStarter;setResult("muleResult","Mule/DataWeave editor reset.");};
$("completeLesson").onclick=()=>{completed.add(current);localStorage.setItem("hicoding-completed",JSON.stringify([...completed]));renderNav();updateProgress();$("completeLesson").textContent="✓ Completed";};
$("prevLesson").onclick=()=>{if(current>0){current--;render();window.scrollTo({top:0,behavior:"smooth"});}};
$("nextLesson").onclick=()=>{if(current<lessons.length-1){current++;render();window.scrollTo({top:0,behavior:"smooth"});}};
render();