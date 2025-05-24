/**
 * Module de gestion du thème (clair/sombre)
 * Gère le basculement entre les thèmes et sauvegarde la préférence utilisateur
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  
  // Fonction pour définir le thème
  const setTheme = (isDark) => {
    if (isDark) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      themeSwitch.checked = true;
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      themeSwitch.checked = false;
    }
  };
  
  // Récupérer la préférence de thème enregistrée
  const savedTheme = localStorage.getItem('theme');
  localStorage.setItem('theme', 'dark');

  // Appliquer le thème sauvegardé ou utiliser la préférence du système
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    // Utiliser la préférence du système si disponible
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
  }
  
  // Écouteur d'événement pour le changement de thème
  themeSwitch.addEventListener('change', () => {
    const isDark = themeSwitch.checked;
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    console.log('Thème changé :', isDark ? 'dark' : 'light');
  });
  
  // Écouter les changements de préférence du système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Ne mettre à jour que si l'utilisateur n'a pas de préférence explicite
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });
});

