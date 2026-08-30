(() => {
  const saved = localStorage.getItem('theme');
  const dark = saved
    ? saved === 'dark'
    : (() => {
        const hour = new Date().getHours();
        return hour >= 19 || hour < 7;
      })();

  if (dark) {
    document.documentElement.classList.add('dark');
  }
})();
