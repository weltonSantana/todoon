tailwind.config = {
  darkMode: 'class',
};

function applyTheme() {
  const theme = localStorage.getItem('theme');
  const checkbox = document.querySelector('.theme-controller');

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    checkbox.checked = true;
  } else {
    document.documentElement.classList.remove('dark');
    checkbox.checked = false;
  }
}

window.onload = applyTheme;

function toggleTheme() {
  const checkbox = document.querySelector('.theme-controller');
  if (checkbox.checked) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}