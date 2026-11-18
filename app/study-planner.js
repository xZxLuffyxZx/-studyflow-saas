'use client';

import {useMemo,useState} from 'react';
import Icon from './ui-icons';

const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fullDate=d=>new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(d);
const shortDate=v=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(new Date(String(v).slice(0,10)+'T12:00:00'));

export default function StudyPlanner({tasks,loading,onNew,onEdit,onToggleDone}) {
  const today=new Date();today.setHours(0,0,0,0);
  const todayKey=dateKey(today);
  const [month,setMonth]=useState(()=>new Date(today.getFullYear(),today.getMonth(),1));
  const [selected,setSelected]=useState(()=>dateKey(today));
  const byDay=useMemo(()=>{
    const map=new Map();
    for(const task of tasks){
      if(!task.due_date)continue;
      const key=String(task.due_date).slice(0,10);
      if(!map.has(key))map.set(key,[]);
      map.get(key).push(task);
    }
    return map;
  },[tasks]);
  const first=new Date(month.getFullYear(),month.getMonth(),1);
  const start=new Date(first);start.setDate(1-first.getDay());
  const calendar=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
  const selectedTasks=byDay.get(selected)||[];
  const upcoming=tasks.filter(t=>t.status!=='done'&&t.due_date).sort((a,b)=>String(a.due_date).localeCompare(String(b.due_date))).slice(0,6);
  const overdue=tasks.filter(t=>t.status!=='done'&&t.due_date&&String(t.due_date).slice(0,10)<todayKey).length;
  const dueWeek=tasks.filter(t=>{
    if(t.status==='done'||!t.due_date)return false;
    const diff=Math.round((new Date(String(t.due_date).slice(0,10)+'T00:00:00')-today)/86400000);
    return diff>=0&&diff<7;
  }).length;
  const unscheduled=tasks.filter(t=>t.status!=='done'&&!t.due_date);
  const moveMonth=delta=>setMonth(d=>new Date(d.getFullYear(),d.getMonth()+delta,1));

  return <>
    <div className="page-title-row"><div><div className="eyebrow"><span className="eyebrow-line"/>PLAN AHEAD</div><h1>Study planner<span className="dot">.</span></h1><p className="page-subtitle">Give every deadline a place on your calendar.</p></div><button className="primary planner-create" onClick={onNew}><Icon name="plus" size={18}/> New assignment</button></div>
    <section className="planner-banner"><div><span className="planner-banner-kicker"><Icon name="sun" size={16}/> ONE DAY AT A TIME</span><h2>A clear plan makes space for your best work.</h2><p>Spot what's coming up, stay prepared, and make the most of your study time.</p></div><div className="planner-banner-symbol"><Icon name="calendar" size={62}/></div></section>
    <div className="planner-summary">
      <article className="planner-mini"><div className="planner-mini-icon purple"><Icon name="calendar" size={19}/></div><div><strong>{dueWeek}</strong><span>Due this week</span></div></article>
      <article className="planner-mini"><div className="planner-mini-icon coral"><Icon name="alert" size={19}/></div><div><strong>{overdue}</strong><span>Overdue tasks</span></div></article>
      <article className="planner-mini"><div className="planner-mini-icon blue"><Icon name="clipboard" size={19}/></div><div><strong>{unscheduled.length}</strong><span>To schedule</span></div></article>
    </div>
    <div className="planner-layout">
      <section className="planner-card calendar-card">
        <div className="planner-card-head"><div><div className="section-kicker">MONTHLY OVERVIEW</div><h2>{new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(month)}</h2><p>Choose a date to review your tasks.</p></div><div className="month-controls"><button type="button" aria-label="Previous month" onClick={()=>moveMonth(-1)}><Icon name="chevronleft" size={17}/></button><button type="button" className="today-button" onClick={()=>{setMonth(new Date(today.getFullYear(),today.getMonth(),1));setSelected(todayKey)}}>Today</button><button type="button" aria-label="Next month" onClick={()=>moveMonth(1)}><Icon name="chevronright" size={17}/></button></div></div>
        <div className="calendar-grid">
          {DAYS.map(d=><div key={d} className="weekday">{d}</div>)}
          {calendar.map(d=>{
            const key=dateKey(d),items=byDay.get(key)||[];
            return <button key={key} type="button" onClick={()=>setSelected(key)} aria-pressed={selected===key} aria-label={`${fullDate(d)}: ${items.length} assignments`} className={`calendar-day ${d.getMonth()!==month.getMonth()?'off-month':''} ${key===todayKey?'today':''} ${selected===key?'selected-day':''}`}>
              <span className="day-number">{d.getDate()}</span>
              <span className="calendar-tasks">{items.slice(0,2).map(t=><span key={t.id} title={t.title} className={`calendar-task ${t.status==='done'?'done':''}`}>{t.title}</span>)}{items.length>2&&<span className="calendar-more">+{items.length-2} more</span>}</span>
            </button>;
          })}
        </div>
        <div className="calendar-legend"><span><i className="legend-dot purple"/> Assignments</span><span><i className="legend-dot green"/> Completed</span><span><i className="legend-dot outlined"/> Today</span></div>
      </section>
      <div className="planner-side">
        <section className="planner-card selected-card"><div className="planner-card-head"><div><div className="section-kicker">SELECTED DATE</div><h2>{fullDate(new Date(selected+'T12:00:00'))}</h2><p>Assignments on this day</p></div><span className="count">{selectedTasks.length} tasks</span></div>
          <div className="planner-list">{selectedTasks.length ? selectedTasks.map(t=><div className="planner-entry" key={t.id}><div className="planner-entry-body"><strong>{t.title}</strong><span>{t.course}</span><div className="planner-entry-meta"><span className={`priority priority-${t.priority}`}><span className="priority-dot"/>{t.priority}</span><span className="planner-entry-state">{t.status.replace('_',' ')}</span></div></div><div className="planner-entry-actions"><button type="button" onClick={()=>onEdit(t)}>Edit</button><button type="button" onClick={()=>onToggleDone(t)}>{t.status==='done'?'Reopen':'Done'}</button></div></div>) : <div className="planner-empty"><Icon name="calendar" size={26}/><strong>Nothing scheduled</strong><p>Enjoy a free day or add a task.</p></div>}</div>
        </section>
        <section className="planner-card upcoming-card"><div className="planner-card-head"><div><div className="section-kicker">STAY ON TOP</div><h2>Upcoming deadlines</h2><p>Your next priorities at a glance</p></div></div>
          <div className="planner-list">{upcoming.length ? upcoming.map(t=><div key={t.id} className="planner-entry"><span className={`planner-deadline-icon ${String(t.due_date).slice(0,10)<todayKey?'overdue':''}`}><Icon name="clock" size={17}/></span><div className="planner-entry-body"><strong>{t.title}</strong><span>{t.course}</span><span className={String(t.due_date).slice(0,10)<todayKey?'planner-overdue':'planner-date'}>{shortDate(t.due_date)}</span></div><button className="planner-edit" type="button" onClick={()=>onEdit(t)}>Edit</button></div>) : <div className="planner-empty"><Icon name="checkcircle" size={26}/><strong>No upcoming deadlines</strong><p>{loading?'Loading from MySQL...':'Add a dated assignment to see it here.'}</p></div>}</div>
          {unscheduled.length>0&&<><div className="planner-subheading">NEEDS A DATE</div><div className="planner-list">{unscheduled.slice(0,3).map(t=><div key={t.id} className="planner-entry"><div className="planner-entry-body"><strong>{t.title}</strong><span>{t.course}</span></div><button className="planner-edit" type="button" onClick={()=>onEdit(t)}>Schedule</button></div>)}</div></>}
        </section>
      </div>
    </div>
  </>;
}
