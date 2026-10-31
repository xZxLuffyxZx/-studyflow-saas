import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { validateTask } from '../../../lib/tasks';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id,title,course,notes,status,priority,DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date, created_at FROM tasks ORDER BY (status = "done") ASC, due_date IS NULL ASC, due_date ASC, id DESC');
    return NextResponse.json(rows);
  } catch (e) { console.error(e); return NextResponse.json({error:'Database unavailable.'},{status:500}); }
}
export async function POST(request) {
  let body; try { body = await request.json(); } catch { return NextResponse.json({error:'Invalid JSON.'},{status:400}); }
  const result = validateTask(body);
  if (result.error) return NextResponse.json({error:result.error},{status:400});
  const {title,course,notes,status,priority,due_date} = result.value;
  try {
    const [write] = await pool.execute('INSERT INTO tasks (title,course,notes,status,priority,due_date) VALUES (?,?,?,?,?,?)', [title,course,notes,status,priority,due_date]);
    return NextResponse.json({id:write.insertId, message:'Task created'},{status:201});
  } catch (e) { console.error(e); return NextResponse.json({error:'Database unavailable.'},{status:500}); }
}
