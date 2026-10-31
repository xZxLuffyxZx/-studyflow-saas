import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import { parseId, validateTask } from '../../../../lib/tasks';
export const runtime = 'nodejs';
export async function GET(_request, {params}) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({error:'Invalid ID.'},{status:400});
  try { const [rows] = await pool.execute('SELECT id,title,course,notes,status,priority,DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date FROM tasks WHERE id=?',[id]);
    return rows.length ? NextResponse.json(rows[0]) : NextResponse.json({error:'Not found.'},{status:404});
  } catch (e) { console.error(e); return NextResponse.json({error:'Database unavailable.'},{status:500}); }
}
export async function PUT(request,{params}) {
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({error:'Invalid ID.'},{status:400});
  let body; try { body=await request.json(); } catch {return NextResponse.json({error:'Invalid JSON.'},{status:400});}
  const result=validateTask(body);
  if(result.error) return NextResponse.json({error:result.error},{status:400});
  const {title,course,notes,status,priority,due_date}=result.value;
  try { const [write]=await pool.execute('UPDATE tasks SET title=?,course=?,notes=?,status=?,priority=?,due_date=? WHERE id=?',[title,course,notes,status,priority,due_date,id]);
    return write.affectedRows ? NextResponse.json({message:'Updated'}) : NextResponse.json({error:'Not found.'},{status:404});
  } catch(e){console.error(e);return NextResponse.json({error:'Database unavailable.'},{status:500});}
}
export async function DELETE(_request,{params}) {
  const id=parseId((await params).id);
  if(!id) return NextResponse.json({error:'Invalid ID.'},{status:400});
  try { const [write]=await pool.execute('DELETE FROM tasks WHERE id=?',[id]);
    return write.affectedRows ? NextResponse.json({message:'Deleted'}) : NextResponse.json({error:'Not found.'},{status:404});
  } catch(e){console.error(e);return NextResponse.json({error:'Database unavailable.'},{status:500});}
}
