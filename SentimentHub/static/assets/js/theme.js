/**
 * Module de gestion du thème (clair/sombre)
 * Gère le basculement entre les thèmes et sauvegarde la préférence utilisateur
 */
document.addEventListener('DOMContentLoaded', () => {
  // Sélectionner tous les switches de thème dans le document
  const themeSwitches = document.querySelectorAll('[id*="theme-switch"], [id*="themeSwitch"]');
  const body = document.body;
  
  // Fonction pour définir le thème
  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      
      // Synchroniser tous les switches de thème
      themeSwitches.forEach(switchElement => {
        switchElement.checked = true;
      });

      // Mettre à jour les icônes de thème
      document.querySelectorAll('[id*="themeIcon"]').forEach(icon => {
        icon.innerHTML = '<i class="fas fa-sun"></i>';
      });
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      
      // Synchroniser tous les switches de thème
      themeSwitches.forEach(switchElement => {
        switchElement.checked = false;
      });

      // Mettre à jour les icônes de thème
      document.querySelectorAll('[id*="themeIcon"]').forEach(icon => {
        icon.innerHTML = '<i class="fas fa-moon"></i>';
      });
    }

    // Émettre un événement personnalisé pour la mise à jour des graphiques
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { isDark } 
    }));

    // Synchroniser à travers les iframes si elles existent
    try {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        iframe.contentWindow.postMessage({
          type: 'themeChange',
          isDark: isDark
        }, '*');
      });
    } catch (e) {
      console.warn('Impossible de synchroniser le thème avec les iframes:', e);
    }
  };

  // Détecter la préférence système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Récupérer le thème sauvegardé ou utiliser la préférence système
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
  
  // Appliquer le thème initial
  setTheme(initialTheme === 'dark');

  // Écouter les changements de thème sur tous les switches
  themeSwitches.forEach(switchElement => {
    switchElement.addEventListener('change', (e) => {
      setTheme(e.target.checked);
    });
  });

  // Écouter les changements de préférence système
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });

  // Écouter les messages des iframes
  window.addEventListener('message', (event) => {
    if (event.data.type === 'themeChange') {
      setTheme(event.data.isDark);
    }
  });

  // Exposer la fonction setTheme globalement
  window.setTheme = setTheme;
});