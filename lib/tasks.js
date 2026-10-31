export const STATUSES = ['todo', 'in_progress', 'done'];
export const PRIORITIES = ['low', 'medium', 'high'];
export function validateTask(body) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const course = typeof body?.course === 'string' ? body.course.trim() : '';
  const notes = typeof body?.notes === 'string' ? body.notes.trim() : '';
  const status = body?.status ?? 'todo';
  const priority = body?.priority ?? 'medium';
  const due_date = body?.due_date || null;
  if (!title || title.length > 150) return {error: 'Title is required (max 150 characters).'};
  if (!course || course.length > 100) return {error: 'Course is required (max 100 characters).'};
  if (notes.length > 2000) return {error: 'Notes must be under 2000 characters.'};
  if (!STATUSES.includes(status)) return {error: 'Invalid status.'};
  if (!PRIORITIES.includes(priority)) return {error: 'Invalid priority.'};
  if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) return {error: 'Invalid due date.'};
  if (due_date && (!Number.isFinite(Date.parse(due_date + 'T00:00:00Z')) || new Date(due_date + 'T00:00:00Z').toISOString().slice(0,10) !== due_date)) return {error: 'Invalid due date.'};
  return {value: {title, course, notes, status, priority, due_date}};
}
export function parseId(raw) { const n = Number(raw); return Number.isSafeInteger(n) && n > 0 ? n : null; }
