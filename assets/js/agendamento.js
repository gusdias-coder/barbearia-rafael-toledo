(() => {
"use strict";
const CONFIG={
  diasAntecedencia:45,intervaloMinutos:30,
  servicos:[
    {id:"corte",nome:"Corte masculino",duracao:30,descricao:"Degradê, social, flat top e outros estilos."},
    {id:"barba",nome:"Barba",duracao:30,descricao:"Aparar, desenhar e alinhar."},
    {id:"combo",nome:"Corte e barba",duracao:60,descricao:"Os dois serviços na mesma visita."},
    {id:"infantil",nome:"Corte infantil",duracao:30,descricao:"Atendimento com paciência para os pequenos."}
  ],
  unidades:[
    {id:"mangueira",nome:"Passo da Mangueira",endereco:"Av. Eng. Francisco Rodolfo Simch, 207",whatsapp:"5551999438562",funcionamento:{1:["09:00","20:00"],2:["09:00","20:00"],3:["09:00","20:00"],4:["09:00","20:00"],5:["09:00","20:00"],6:["09:00","20:00"]}},
    {id:"pedras",nome:"Matriz · Passo das Pedras",endereco:"Rua Ana Aurora do Amaral Lisboa, 343",whatsapp:"5551999438562",funcionamento:{1:["09:00","20:00"],2:["09:00","20:00"],3:["09:00","20:00"],4:["09:00","20:00"],5:["09:00","20:00"],6:["09:00","20:00"]}}
  ]
};
const state={step:0,servico:null,unidade:null,data:null,horario:null,month:null};
const steps=[
 ["SERVIÇO","O que vamos fazer?","Selecione uma opção."],
 ["UNIDADE","Onde será o atendimento?","Escolha uma unidade."],
 ["DATA","Escolha uma data","Selecione um dia disponível."],
 ["HORÁRIO","Escolha um horário","Selecione uma opção."],
 ["RESUMO","Confira os detalhes","Revise antes de enviar."]
];
const $=s=>document.querySelector(s),content=$("#stepContent");
const pad=n=>String(n).padStart(2,"0");
const key=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const mins=t=>{const p=t.split(":").map(Number);return p[0]*60+p[1]};
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function prettyDate(value){const [y,m,d]=value.split("-").map(Number);return new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(new Date(y,m-1,d))}
function go(step){state.step=step;render();$("#stepTitle").focus({preventScroll:true})}
function render(){
 const s=steps[state.step];$("#stepKicker").textContent=s[0];$("#stepTitle").textContent=s[1];$("#stepDescription").textContent=s[2];
 $("#stepNumber").textContent="0"+(state.step+1);$("#progressFill").style.width=((state.step+1)/5*100)+"%";
 $("#backButton").hidden=state.step===0;$("#restartButton").hidden=state.step===0;content.innerHTML="";
 [renderServices,renderUnits,renderCalendar,renderTimes,renderSummary][state.step]();
}
function renderServices(){
 const grid=document.createElement("div");grid.className="option-grid";
 CONFIG.servicos.forEach(item=>{const b=document.createElement("button");b.type="button";b.className="option-card";b.innerHTML='<span class="option-title">'+safe(item.nome)+'</span><span class="option-meta">'+'Aprox. '+item.duracao+' min</span><span class="option-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M12 5l7 7-7 7"/></svg></span>';b.addEventListener("click",()=>{state.servico=item;go(1)});grid.append(b)});content.append(grid);
}
function renderUnits(){
 const grid=document.createElement("div");grid.className="option-grid";
 CONFIG.unidades.forEach(item=>{const b=document.createElement("button");b.type="button";b.className="option-card unit-card";const schedule=item.funcionamento?"Segunda a sábado · 9h às 20h":"Horários sob consulta com a equipe";b.innerHTML='<span class="option-title">'+safe(item.nome)+'</span><span class="unit-address">'+safe(item.endereco)+'<br>'+schedule+'</span><span class="option-check">↗</span>';b.addEventListener("click",()=>{state.unidade=item;state.data=null;state.horario=null;go(2)});grid.append(b)});content.append(grid);
}
function renderCalendar(){
 if(!state.unidade.funcionamento){
  const note=document.createElement("div");note.className="manual-note";note.innerHTML="<strong>Agenda sob consulta.</strong><br>O horário de funcionamento desta unidade ainda não está cadastrado no site. Escolha uma data de preferência; a equipe informa os horários disponíveis pelo WhatsApp.";
  const label=document.createElement("label");label.className="date-label";label.htmlFor="preferredDate";label.textContent="Sua data de preferência";
  const input=document.createElement("input");input.type="date";input.id="preferredDate";const now=new Date(),max=new Date();max.setDate(max.getDate()+CONFIG.diasAntecedencia);input.min=key(now);input.max=key(max);input.value=state.data||"";
  const next=document.createElement("button");next.type="button";next.className="primary-button";next.textContent="Continuar";next.disabled=!state.data;
  input.addEventListener("change",()=>{state.data=input.value;state.horario="A combinar";next.disabled=!state.data});
  next.addEventListener("click",()=>go(4));const row=document.createElement("div");row.className="action-row";row.append(next);content.append(note,label,input,row);return;
 }
 if(!state.month)state.month=new Date(new Date().getFullYear(),new Date().getMonth(),1);
 const month=state.month,heading=document.createElement("div");heading.className="calendar-head";
 const label=document.createElement("div");label.className="month-label";label.textContent=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(month);
 const controls=document.createElement("div");controls.className="month-controls";
 const prev=document.createElement("button");prev.type="button";prev.className="icon-button";prev.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';prev.setAttribute("aria-label","Mês anterior");
 const next=document.createElement("button");next.type="button";next.className="icon-button";next.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';next.setAttribute("aria-label","Próximo mês");
 const today=new Date(),first=new Date(today.getFullYear(),today.getMonth(),1),last=new Date(today);last.setDate(last.getDate()+CONFIG.diasAntecedencia);
 prev.disabled=month<=first;next.disabled=month.getFullYear()>last.getFullYear()||(month.getFullYear()===last.getFullYear()&&month.getMonth()>=last.getMonth());
 prev.addEventListener("click",()=>{state.month=new Date(month.getFullYear(),month.getMonth()-1,1);renderCalendar()});
 next.addEventListener("click",()=>{state.month=new Date(month.getFullYear(),month.getMonth()+1,1);renderCalendar()});
 controls.append(prev,next);heading.append(label,controls);
 const grid=document.createElement("div");grid.className="calendar-grid";
 ["D","S","T","Q","Q","S","S"].forEach(day=>{const el=document.createElement("span");el.className="weekday";el.textContent=day;grid.append(el)});
 for(let i=0;i<month.getDay();i++){const blank=document.createElement("span");grid.append(blank)}
 const total=new Date(month.getFullYear(),month.getMonth()+1,0).getDate(),min=new Date(today.getFullYear(),today.getMonth(),today.getDate()),max=new Date(min);max.setDate(max.getDate()+CONFIG.diasAntecedencia);
 for(let d=1;d<=total;d++){const date=new Date(month.getFullYear(),month.getMonth(),d),value=key(date),working=Boolean(state.unidade.funcionamento[date.getDay()]),disabled=date<min||date>max||!working,b=document.createElement("button");b.type="button";b.className="day-button";if(value===key(today))b.classList.add("is-today");if(value===state.data)b.classList.add("is-selected");b.disabled=disabled;b.textContent=d;b.setAttribute("aria-label",prettyDate(value));b.setAttribute("aria-pressed",String(value===state.data));b.addEventListener("click",()=>{state.data=value;state.horario=null;go(3)});grid.append(b)}
 const legend=document.createElement("div");legend.className="calendar-legend";legend.innerHTML='<span><i class="legend-dot"></i>Dia de funcionamento</span><span><i class="legend-dot muted"></i>Indisponível</span>';content.append(heading,grid,legend);
}
function renderTimes(){
 const [start,end]=state.unidade.funcionamento[new Date(state.data+"T12:00:00").getDay()],duration=state.servico.duracao,now=new Date(),grid=document.createElement("div");grid.className="time-grid";let count=0;
 for(let t=mins(start);t+duration<=mins(end);t+=CONFIG.intervaloMinutos){const label=pad(Math.floor(t/60))+":"+pad(t%60),dt=new Date(state.data+"T"+label+":00");if(key(dt)===key(now)&&dt<=now)continue;const b=document.createElement("button");b.type="button";b.className="time-button";b.textContent=label;b.addEventListener("click",()=>{state.horario=label;go(4)});grid.append(b);count++}
 if(!count){const empty=document.createElement("div");empty.className="empty-state";empty.textContent="Não há horários compatíveis para este serviço nesta data. Volte e escolha outro dia.";content.append(empty);return}
 const note=document.createElement("p");note.className="availability-note";note.textContent="Opções geradas pelo horário de funcionamento cadastrado. A disponibilidade real será confirmada pela equipe no WhatsApp.";content.append(grid,note);
}
function renderSummary(){
 const rows=[["Serviço",state.servico.nome],["Unidade",state.unidade.nome],["Endereço",state.unidade.endereco],["Data",prettyDate(state.data)],["Horário",state.horario||"A combinar"],["Duração estimada","Aproximadamente "+state.servico.duracao+" minutos"]];
 const box=document.createElement("div");box.className="summary";rows.forEach(([k,v])=>{const row=document.createElement("div");row.className="summary-row";row.innerHTML="<span>"+safe(k)+"</span><strong>"+safe(v)+"</strong>";box.append(row)});
 const note=document.createElement("p");note.className="summary-footnote";note.textContent="Este envio é uma solicitação, não uma confirmação automática. Seu horário só estará confirmado depois da resposta da equipe.";
 const link=document.createElement("a");link.className="whatsapp-button";link.href=whatsUrl();link.target="_blank";link.rel="noopener noreferrer";link.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.2 1.6 6L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.1 4.6Zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.2-.6-.4Z"/></svg>Enviar pelo WhatsApp <span class="button-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M12 5l7 7-7 7"/></svg></span>';
 content.append(box,note,link);
}
function whatsUrl(){
 const message=["Olá! Gostaria de solicitar um agendamento na Barbearia Rafael Toledo.","","*Detalhes da solicitação:*","Serviço: "+state.servico.nome,"Unidade: "+state.unidade.nome,"Endereço: "+state.unidade.endereco,"Data desejada: "+prettyDate(state.data),"Horário: "+(state.horario||"A combinar"),"","Podem confirmar a disponibilidade? Obrigado!"].join("\n");
 return "https://wa.me/"+(state.unidade.whatsapp||"5551999438562")+"?text="+encodeURIComponent(message);
}
$("#backButton").addEventListener("click",()=>{if(state.step>0)go(state.step-1)});
$("#restartButton").addEventListener("click",()=>{Object.assign(state,{step:0,servico:null,unidade:null,data:null,horario:null,month:null});render()});
render();
})();