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
      document.documentElement.setAttribute('data-theme', 'dark');
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      
      // Synchroniser tous les switches de thème
      document.querySelectorAll('[id*="theme-switch"]').forEach(switch => {
        switch.checked = true;
      });
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      
      // Synchroniser tous les switches de thème
      document.querySelectorAll('[id*="theme-switch"]').forEach(switch => {
        switch.checked = false;
      });
    }

    // Émettre un événement personnalisé pour la mise à jour des graphiques
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { isDark } 
    }));
  };

  // Détecter la préférence système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Récupérer le thème sauvegardé ou utiliser la préférence système
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
  
  // Appliquer le thème initial
  setTheme(initialTheme === 'dark');

  // Écouter les changements de thème
  document.querySelectorAll('[id*="theme-switch"]').forEach(switch => {
    switch.addEventListener('change', (e) => {
      setTheme(e.target.checked);
    });
  });

  // Écouter les changements de préférence système
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });

  // Exposer la fonction setTheme globalement pour une utilisation dans d'autres modules
  window.setTheme = setTheme;
});