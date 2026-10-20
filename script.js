const root = document.documentElement;
const saved = localStorage.getItem('theme-pref');
if (saved === 'light') root.setAttribute('data-theme','light');
else root.setAttribute('data-theme','dark');
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme-pref', next);
});
