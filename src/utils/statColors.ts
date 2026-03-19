export function wpmColorClass(wpm: number): string {
  if (wpm >= 80) return 'good';
  if (wpm >= 40) return '';
  if (wpm > 0) return 'warning';
  return '';
}

export function accColorClass(acc: number): string {
  if (acc >= 95) return 'good';
  if (acc >= 80) return 'warning';
  if (acc < 80 && acc > 0) return 'bad';
  return '';
}

export function accColorStyle(acc: number): string {
  if (acc >= 95) return 'var(--success)';
  if (acc >= 80) return 'var(--warning)';
  if (acc < 80 && acc > 0) return 'var(--error)';
  return 'var(--text-primary)';
}