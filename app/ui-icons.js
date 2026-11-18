import React from 'react';

const paths = {
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h5"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  checkcircle: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5.2V3h6v2.2M9 10h6M9 14h5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  trend: <><path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  edit: <><path d="M4 20h4l11-11a2.12 2.12 0 0 0-3-3L5 17l-1 3Z"/><path d="m14.5 7.5 3 3"/></>,
  trash: <><path d="M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 4v7h-7"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  chevronleft: <path d="m15 18-6-6 6-6"/>,
  chevronright: <path d="m9 18 6-6-6-6"/>,
  x: <path d="M5 5 19 19M19 5 5 19"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  alert: <><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3h.01"/></>
};

export default function Icon({name,size=18,className=''}) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}
