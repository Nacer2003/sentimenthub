// Ajouter au début du fichier existant
document.addEventListener('DOMContentLoaded', () => {
  let charts = {};
  
  const chartColors = {
    light: {
      background: '#ffffff',
      text: '#212121',
      grid: '#e0e0e0'
    },
    dark: {
      background: '#1e1e1e',
      text: '#ffffff',
      grid: '#333333'
    }
  };

  // Fonction pour mettre à jour les couleurs des graphiques
  const updateChartsTheme = (isDark) => {
    const colors = isDark ? chartColors.dark : chartColors.light;
    
    Object.values(charts).forEach(chart => {
      if (chart.config) {
        chart.config.options.plugins.legend.labels.color = colors.text;
        chart.config.options.scales.x.grid.color = colors.grid;
        chart.config.options.scales.y.grid.color = colors.grid;
        chart.config.options.scales.x.ticks.color = colors.text;
        chart.config.options.scales.y.ticks.color = colors.text;
        chart.update();
      }
    });
  };

  // Écouter les changements de thème
  window.addEventListener('themeChanged', (e) => {
    updateChartsTheme(e.detail.isDark);
  });

  // Initialiser les graphiques avec le thème actuel
  const isDark = document.body.classList.contains('dark-theme');
  updateChartsTheme(isDark);
});

// Le reste du code existant reste inchangé