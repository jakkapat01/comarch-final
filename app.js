const $=s=>document.querySelector(s);
let current=0,completed=[];
try{const stored=JSON.parse(localStorage.getItem('comarch-completed-v1')||'[]');if(Array.isArray(stored))completed=[...new Set(stored.filter(n=>Number.isInteger(n)&&n>=0&&n<chapters.length))];}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function navigation(){
 $('#nav').innerHTML=chapters.map((c,i)=>`<a href="#chapter-${i}" ${i===current?'aria-current="page"':''} class="${i===current?'active':''}"><span class="number">${String(i).padStart(2,'0')}</span><span>${c.title}</span><span class="tick">${completed.includes(i)?'✓':''}</span></a>`).join('');
 $('#progress').value=completed.length;$('#progressText').textContent=`เรียนจบแล้ว ${completed.length} / ${chapters.length} บท`;
}
function render(scroll=false){
 const match=location.hash.match(/^#chapter-(\d+)$/);current=match?Math.min(chapters.length-1,Number(match[1])):0;
 const c=chapters[current];$('#tag').textContent=c.tag;$('#lessonTitle').textContent=c.title;$('#intro').textContent=c.intro;$('#content').innerHTML=c.body;$('#complete').checked=completed.includes(current);$('#prev').disabled=current===0;$('#next').disabled=current===chapters.length-1;
 navigation();$('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');document.title=`${c.title} • ComArch`;
 if(current===1){['#binA','#binB','#signed'].forEach(s=>$(s).addEventListener('input',binary));binary();}
 if(current===4){['#shiftData','#shiftAmount'].forEach(s=>$(s).addEventListener('input',shift));shift();}
 if(current===5){['#pipeMode','#pipeClock'].forEach(s=>$(s).addEventListener('input',pipeline));pipeline();}
 if(current===7)setupQuiz();
 if(scroll){$('#lesson').scrollIntoView({behavior:'auto'});$('#lesson').focus({preventScroll:true});}
}
function binary(){
 const a=$('#binA').value,b=$('#binB').value,o=$('#binaryResult');
 if(!/^[01]{4}$/.test(a)||!/^[01]{4}$/.test(b)){o.textContent='กรุณากรอก 0 หรือ 1 ให้ครบ 4 บิตทั้งสองช่อง';return;}
 const ua=parseInt(a,2),ub=parseInt(b,2),signed=$('#signed').value==='signed',av=signed&&ua>7?ua-16:ua,bv=signed&&ub>7?ub-16:ub,sum=av+bv,bits=((ua+ub)&15).toString(2).padStart(4,'0'),overflow=signed?(sum < -8||sum >7):sum>15;
 o.innerHTML=`<strong>${a} + ${b} = ${bits}</strong><br>ผลจริง: ${av} + (${bv}) = ${sum}<br>Overflow: <b>${overflow?'True — ผลจริงอยู่นอกช่วง':'False — ผลจริงยังอยู่ในช่วง'}</b> ${signed?'−8 ถึง 7':'0 ถึง 15'}<small>Carry out = ${ua+ub>15?1:0} · เก็บเฉพาะ 4 บิตท้ายของผลบวก</small>`;
}
function shift(){const value=$('#shiftData').value,o=$('#shiftResult'),n=Number($('#shiftAmount').value);if(!/^[0-9a-fA-F]{1,8}$/.test(value)){o.textContent='กรุณากรอกเลขฐานสิบหก 1–8 หลัก (0–9, A–F)';return;}const a=parseInt(value,16),r=a>>>n;o.innerHTML=`เลื่อนขวา <b>${n} บิต</b> · shamt = ${n.toString(2).padStart(5,'0')}<br><strong>0x${r.toString(16).toUpperCase().padStart(8,'0')}</strong><br><code>${r.toString(2).padStart(32,'0')}</code><small>ค่าฐานสิบแบบ unsigned: ${r.toLocaleString('en-US')} · เติม 0 ด้านซ้าย</small>`;}
function pipeline(){
 const mode=$('#pipeMode').value,clock=Number($('#pipeClock').value),st=['IF','ID','EX','MEM','WB'];
 let rows=Array.from({length:4},(_,i)=>({name:`คำสั่ง ${i+1}`,cells:[...Array(i).fill(''),...st]}));
 if(mode==='forward')rows=[{name:'addi → $s0',cells:st},{name:'ori ← $s0',cells:['',...st]}];
 if(mode==='load')rows=[{name:'lw → $s0',cells:st},{name:'addi ← $s0',cells:['','IF','ID','STALL','EX','MEM','WB']}];
 $('#pipeCaption').textContent=`Clock ${clock} · ${mode==='ideal'?'แต่ละคำสั่งเริ่มห่างกัน 1 รอบ':mode==='forward'?'ผล addi พร้อมหลัง EX รอบ 3 ส่งต่อให้ ori ใช้ EX รอบ 4':'รอบ 4: addi ค้างใน ID และ EX เป็น bubble; รอบ 5 จึงเข้า EX ได้'}`;
 $('#pipeGrid').innerHTML=`<table class="pipe-table"><thead><tr><th>คำสั่ง / clock</th>${Array.from({length:9},(_,i)=>`<th>${i+1}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${r.name}</th>${Array.from({length:9},(_,i)=>`<td class="${r.cells[i]==='STALL'?'pipe-stall ':''}${i+1===clock?'pipe-active':i+1<clock?'pipe-past':''}">${r.cells[i]||'·'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function setupQuiz(){
 $('#quiz').innerHTML=questions.map((q,i)=>`<fieldset class="q"><legend>${i+1}. ${esc(q[0])}</legend>${q[1].map((x,j)=>`<label><input type="radio" name="q${i}" value="${j}">${esc(x)}</label>`).join('')}<div id="feedback-${i}" hidden></div></fieldset>`).join('');
 $('#grade').onclick=()=>{let score=0,answered=0;questions.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`),ok=a&&Number(a.value)===q[2];if(a)answered++;if(ok)score++;const f=$(`#feedback-${i}`);f.hidden=false;f.className=`feedback ${ok?'':'wrong'}`;f.innerHTML=`<b>${ok?'✓ ถูกต้อง':a?'ยังไม่ถูก':'ยังไม่ได้ตอบ'}</b> · ${esc(q[3])} <a href="#chapter-${q[4]}">ทบทวนบท ${q[4]}</a>`;});$('#quizScore').textContent=`ได้ ${score} / ${questions.length} คะแนน · ตอบแล้ว ${answered} ข้อ`;};
 $('#retry').onclick=()=>{setupQuiz();$('#quizScore').textContent='';$('#quiz').scrollIntoView({behavior:'smooth'});};
}
$('#complete').onchange=()=>{completed=completed.filter(i=>i!==current);if($('#complete').checked)completed.push(current);try{localStorage.setItem('comarch-completed-v1',JSON.stringify(completed));}catch{}navigation();};
$('#resetProgress').onclick=()=>{completed=[];try{localStorage.removeItem('comarch-completed-v1');}catch{}$('#complete').checked=false;navigation();};
$('#prev').onclick=()=>{if(current>0)location.hash=`chapter-${current-1}`;};$('#next').onclick=()=>{if(current<chapters.length-1)location.hash=`chapter-${current+1}`;};
$('#menu').onclick=()=>{$('#menu').setAttribute('aria-expanded',String($('#sidebar').classList.toggle('open')));};
$('#print').onclick=()=>{const closed=[...document.querySelectorAll('details:not([open])')];closed.forEach(d=>d.open=true);window.print();closed.forEach(d=>d.open=false);};
window.addEventListener('hashchange',()=>render(true));render(Boolean(location.hash));
