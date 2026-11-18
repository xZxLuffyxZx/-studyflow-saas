'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import StudyPlanner from './study-planner';
import Icon from './ui-icons';

const empty = {title:'', course:'', notes:'', status:'todo', priority:'medium', due_date:''};
const statusNames = {todo:'To do', in_progress:'In progress', done:'Completed'};
const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const prettyDate = (v) => v ? new Date(String(v).slice(0,10) + 'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'No deadline';

function StatusPill({status}) {
  return <span className={`tag status-${status}`}><span className="tag-dot"/>{statusNames[status] || status}</span>;
}

function PriorityPill({priority}) {
  return <span className={`priority priority-${priority}`}><span className="priority-dot"/>{priority}</span>;
}

function Metric({icon, label, value, description, tone}) {
  return <article className={`metric metric-${tone}`}>
    <div className="metric-top"><span className="metric-icon"><Icon name={icon} size={20}/></span><Icon name="arrow" size={17} className="metric-arrow"/></div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    <div className="metric-description">{description}</div>
  </article>;
}

export default function Dashboard() {
  const [view,setView] = useState('assignments');
  const [tasks,setTasks] = useState([]);
  const [form,setForm] = useState(empty);
  const [editing,setEditing] = useState(null);
  const [showForm,setShowForm] = useState(false);
  const [query,setQuery] = useState('');
  const [filter,setFilter] = useState('all');
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [actionBusy,setActionBusy] = useState(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks',{cache:'no-store'});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to load assignments');
      if(!Array.isArray(data)) throw new Error('Unexpected response from server');
      setTasks(data);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not connect to MySQL');
    } finally { setLoading(false); }
  },[]);

  useEffect(() => { load(); },[load]);

  const filtered = useMemo(() => tasks.filter(t =>
    (filter === 'all' || t.status === filter) &&
    `${t.title} ${t.course} ${t.notes || ''}`.toLowerCase().includes(query.toLowerCase().trim())
  ),[tasks,filter,query]);

  const counts = {
    total: tasks.length,
    todo: tasks.filter(t=>t.status==='todo').length,
    progress: tasks.filter(t=>t.status==='in_progress').length,
    done: tasks.filter(t=>t.status==='done').length
  };
  const completion = counts.total ? Math.round(100*counts.done/counts.total) : 0;
  const nowKey = dateKey(new Date());
  const upcoming = tasks.filter(t=>t.status!=='done' && t.due_date).sort((a,b)=>String(a.due_date).localeCompare(String(b.due_date))).slice(0,4);

  const change = (key,value) => setForm(f=>({...f,[key]:value}));
  const switchView = (next) => {setView(next); setShowForm(false); setNotice('');};

  function openNew() {
    setView('assignments'); setEditing(null); setForm({...empty});
    setShowForm(true); setError(''); setNotice('');
    window.setTimeout(()=>document.getElementById('assignment-form')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }
  function openEdit(t) {
    setView('assignments'); setEditing(t.id);
    setForm({title:t.title,course:t.course,notes:t.notes||'',status:t.status,priority:t.priority,due_date:t.due_date||''});
    setShowForm(true); setError(''); setNotice('');
    window.setTimeout(()=>document.getElementById('assignment-form')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(editing ? `/api/tasks/${editing}` : '/api/tasks',{
        method:editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to save assignment');
      setShowForm(false); setEditing(null); setForm({...empty});
      await load(); setNotice(editing?'Assignment updated successfully.':'Assignment added successfully.');
    } catch(e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function remove(t) {
    if(!window.confirm(`Delete "${t.title}"?`)) return;
    setActionBusy(t.id); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/tasks/${t.id}`,{method:'DELETE'});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to delete assignment');
      await load(); setNotice('Assignment deleted.');
    } catch(e) { setError(e.message); }
    finally { setActionBusy(null); }
  }
  async function toggleDone(t) {
    setActionBusy(t.id); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/tasks/${t.id}`,{
        method:'PUT', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...t,status:t.status==='done'?'todo':'done'})
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to update assignment');
      await load(); setNotice('Assignment status saved to MySQL.');
    } catch(e) { setError(e.message); }
    finally { setActionBusy(null); }
  }

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">
        <span className="brandmark"><Icon name="book" size={24}/></span>
        <div><strong>StudyFlow<span className="brand-period">.</span></strong><small>STUDENT WORKSPACE</small></div>
      </div>
      <div className="nav-title">WORKSPACE</div>
      <nav className="nav-stack" aria-label="Main navigation">
        <button type="button" className={`nav-item ${view==='assignments'?'active':''}`} onClick={()=>switchView('assignments')}>
          <Icon name="grid" size={19}/> <span>Assignment Board</span><Icon name="chevronright" size={16} className="nav-arrow"/>
        </button>
        <button type="button" className={`nav-item ${view==='planner'?'active':''}`} onClick={()=>switchView('planner')}>
          <Icon name="calendar" size={19}/> <span>Study Planner</span><Icon name="chevronright" size={16} className="nav-arrow"/>
        </button>
      </nav>
      <div className="sidebar-promo"><span className="sidebar-promo-icon"><Icon name="sparkles" size={20}/></span><strong>Progress adds up.</strong><p>Small steps today make room for big wins tomorrow.</p><button onClick={()=>switchView('planner')}>Open planner <Icon name="arrow" size={14}/></button></div>
      <div className="sidebar-bottom"><div className="avatar">SF</div><div><strong>My workspace</strong><small>DIT312 · Course project</small></div></div>
    </aside>

    <div className="main">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><Icon name="chevronright" size={14}/><strong>{view==='planner'?'Study Planner':'Assignment Board'}</strong></div>
        <div className="topbar-right"><span className={`server-pill ${error?'server-error':''}`}><span className="server-dot"/>{loading?'Connecting…':error?'Database unavailable':'MySQL connected'}</span><span className="top-avatar">SF</span></div>
      </header>
      <main className="content">
        <div className="planner-mobile-tabs" role="group" aria-label="Workspace pages"><button className={view==='assignments'?'active':''} onClick={()=>switchView('assignments')}>Assignments</button><button className={view==='planner'?'active':''} onClick={()=>switchView('planner')}>Study planner</button></div>
        {error && <div role="alert" className="alert error"><Icon name="alert" size={17}/>{error}<button className="text-button" onClick={load}>Retry</button></div>}
        {notice && <div role="status" className="alert success"><Icon name="checkcircle" size={17}/>{notice}</div>}
        {view==='planner' ? <StudyPlanner tasks={tasks} loading={loading} onNew={openNew} onEdit={openEdit} onToggleDone={toggleDone}/> : <>
          <div className="page-title-row"><div><div className="eyebrow"><span className="eyebrow-line"/>YOUR LEARNING SPACE</div><h1>Assignment board<span className="dot">.</span></h1><p className="page-subtitle">A little clarity for your busiest study days.</p></div><div className="date-caption"><Icon name="calendar" size={17}/><span>{new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span></div></div>
          <section className="hero-card"><div className="hero-copy"><span className="hero-kicker"><Icon name="sparkles" size={15}/> STAY IN YOUR FLOW</span><h2>Make progress feel<br/>effortless.</h2><p>Everything on your plate, beautifully organized. Pick a priority and keep moving forward.</p><div className="hero-actions"><button className="hero-button" onClick={openNew}><Icon name="plus" size={18}/> New assignment</button><button className="hero-link" onClick={()=>switchView('planner')}>View planner <Icon name="arrow" size={16}/></button></div></div><div className="hero-progress"><div className="progress-ring" style={{'--progress':`${completion}%`}}><div className="progress-ring-inner"><span>{completion}%</span><small>completed</small></div></div><p>One task at a time <Icon name="sparkles" size={14}/></p></div></section>
          <div className="stats">
            <Metric icon="clipboard" label="Total assignments" value={counts.total} description="All your coursework" tone="purple"/>
            <Metric icon="clock" label="To do" value={counts.todo} description="Ready when you are" tone="orange"/>
            <Metric icon="trend" label="In progress" value={counts.progress} description="Keep up the momentum" tone="blue"/>
            <Metric icon="checkcircle" label="Completed" value={counts.done} description="Every win counts" tone="green"/>
          </div>

          {showForm && <form id="assignment-form" className="formcard" onSubmit={save}>
            <div className="formheader"><div><div className="eyebrow">YOUR NEXT STEP</div><h2>{editing?'Edit assignment':'Create an assignment'}</h2><p>Keep the details in one place.</p></div><button type="button" className="icon-button" aria-label="Close form" onClick={()=>setShowForm(false)}><Icon name="x" size={18}/></button></div>
            <div className="formgrid">
              <label>Assignment title<input autoFocus required maxLength={150} value={form.title} placeholder="e.g. Submit final report" onChange={e=>change('title',e.target.value)}/></label>
              <label>Course<input required maxLength={100} value={form.course} placeholder="e.g. DIT312" onChange={e=>change('course',e.target.value)}/></label>
              <label>Due date<input type="date" value={form.due_date} onChange={e=>change('due_date',e.target.value)}/></label>
              <label>Priority<select value={form.priority} onChange={e=>change('priority',e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label>Status<select value={form.status} onChange={e=>change('status',e.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Completed</option></select></label>
              <label className="wide">Notes<textarea maxLength={2000} rows={3} value={form.notes} placeholder="Add any helpful details..." onChange={e=>change('notes',e.target.value)}/></label>
            </div><div className="formactions"><button type="button" className="secondary" onClick={()=>setShowForm(false)}>Cancel</button><button disabled={busy} className="primary" type="submit">{busy?'Saving...':editing?'Save changes':'Create assignment'} <Icon name="arrow" size={16}/></button></div>
          </form>}

          <div className="dashboard-grid"><section className="tablecard"><div className="sectionheader"><div><div className="section-kicker">YOUR TASKS</div><h2>All assignments</h2><p>Stay organized across every course.</p></div><span className="count">{filtered.length} tasks</span></div>
            <div className="toolbar"><div className="searchbox"><Icon name="search" size={18}/><input aria-label="Search assignments" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search assignments or courses..."/></div><select aria-label="Filter by status" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Completed</option></select></div>
            <div className="tablewrap"><table><thead><tr><th>ASSIGNMENT</th><th>STATUS</th><th>PRIORITY</th><th>DUE DATE</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(t=><tr key={t.id}><td><div className="tasktitle">{t.title}</div><div className="course"><Icon name="book" size={13}/>{t.course}</div>{t.notes&&<div className="notes">{t.notes}</div>}</td><td><StatusPill status={t.status}/></td><td><PriorityPill priority={t.priority}/></td><td><span className={`date ${t.status!=='done'&&t.due_date&&String(t.due_date).slice(0,10)<nowKey?'overdue':''}`}>{prettyDate(t.due_date)}</span></td><td><div className="actions"><button type="button" disabled={actionBusy===t.id} aria-label={t.status==='done'?'Reopen assignment':'Mark completed'} title={t.status==='done'?'Reopen':'Mark completed'} onClick={()=>toggleDone(t)}><Icon name={t.status==='done'?'refresh':'check'} size={16}/></button><button type="button" aria-label={`Edit ${t.title}`} title="Edit" onClick={()=>openEdit(t)}><Icon name="edit" size={15}/></button><button type="button" disabled={actionBusy===t.id} aria-label={`Delete ${t.title}`} title="Delete" className="delete" onClick={()=>remove(t)}><Icon name="trash" size={15}/></button></div></td></tr>)}</tbody></table>{!loading&&!filtered.length&&<div className="empty"><span className="empty-icon"><Icon name="clipboard" size={25}/></span><strong>No assignments found</strong><p>{query||filter!=='all'?'Try a different search or filter.':'Create your first assignment to get started.'}</p></div>}{loading&&<div className="empty">Loading assignments from MySQL…</div>}</div>
          </section>
          <aside className="next-panel"><div className="section-kicker">COMING UP</div><div className="next-header"><h2>Next deadlines</h2><span className="next-count">{upcoming.length}</span></div><p className="next-intro">A quick look at what needs your attention.</p><div className="next-list">{upcoming.length?upcoming.map(t=>{const d=t.due_date?new Date(String(t.due_date).slice(0,10)+'T12:00:00'):null;const overdue=String(t.due_date).slice(0,10)<nowKey;return <button type="button" className="next-item" key={t.id} onClick={()=>openEdit(t)}><span className={`next-date ${overdue?'late':''}`}><strong>{d?.getDate()}</strong><small>{d?.toLocaleDateString('en-US',{month:'short'})}</small></span><span className="next-item-copy"><strong>{t.title}</strong><small>{t.course}</small><span className={`next-priority ${t.priority}`}>{overdue?'Overdue':`${t.priority} priority`}</span></span><Icon name="chevronright" size={16} className="next-chevron"/></button>}):<div className="next-empty"><Icon name="checkcircle" size={26}/><strong>All clear!</strong><p>Your upcoming deadlines will appear here.</p></div>}</div><button className="next-bottom" type="button" onClick={()=>switchView('planner')}>View study planner <Icon name="arrow" size={16}/></button></aside>
          </div>
        </>}
        <footer className="footer"><span>© StudyFlow · Student workspace</span><span>Made with Next.js, MySQL & Docker</span></footer>
      </main>
    </div>
  </div>;
}
