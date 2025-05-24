/**
 * Module de visualisation des données
 * Gère les graphiques et leur adaptation au thème
 */
document.addEventListener('DOMContentLoaded', () => {
  // Stockage global des instances de graphiques
  const charts = new Map();
  
  // Configuration des couleurs par thème
  const chartColors = {
    light: {
      background: '#ffffff',
      text: '#212121',
      grid: '#e0e0e0',
      primary: '#2563eb',
      success: '#4caf50',
      warning: '#f59e0b',
      danger: '#ef4444'
    },
    dark: {
      background: '#1e1e1e',
      text: '#ffffff',
      grid: '#333333',
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  };

  // Fonction pour mettre à jour les couleurs des graphiques
  const updateChartsTheme = (isDark) => {
    const colors = isDark ? chartColors.dark : chartColors.light;
    
    charts.forEach((chart, id) => {
      if (!chart.config) return;

      // Mise à jour des options communes
      chart.config.options.plugins.legend.labels.color = colors.text;
      chart.config.options.plugins.title.color = colors.text;

      // Mise à jour spécifique selon le type de graphique
      if (chart.config.type === 'doughnut') {
        chart.config.data.datasets[0].backgroundColor = [
          colors.success,
          colors.primary,
          colors.danger
        ];
      } else if (chart.config.type === 'line' || chart.config.type === 'bar') {
        chart.config.options.scales.x.grid.color = colors.grid;
        chart.config.options.scales.y.grid.color = colors.grid;
        chart.config.options.scales.x.ticks.color = colors.text;
        chart.config.options.scales.y.ticks.color = colors.text;
      }

      chart.update('none'); // Mise à jour sans animation
    });
  };

  // Fonction pour créer un nouveau graphique
  const createChart = (id, config) => {
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return null;

    const isDark = document.body.classList.contains('dark-theme');
    const colors = isDark ? chartColors.dark : chartColors.light;

    // Fusion de la configuration avec les couleurs du thème
    const chartConfig = {
      ...config,
      options: {
        ...config.options,
        plugins: {
          ...config.options?.plugins,
          legend: {
            ...config.options?.plugins?.legend,
            labels: {
              ...config.options?.plugins?.legend?.labels,
              color: colors.text
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, chartConfig);
    charts.set(id, chart);
    return chart;
  };

  // Écouter les changements de thème
  window.addEventListener('themeChanged', (e) => {
    updateChartsTheme(e.detail.isDark);
  });

  // Initialiser avec le thème actuel
  const isDark = document.body.classList.contains('dark-theme');
  updateChartsTheme(isDark);

  // Exposer les fonctions nécessaires
  window.chartUtils = {
    createChart,
    updateChartsTheme,
    getChartColors: () => document.body.classList.contains('dark-theme') ? 
      chartColors.dark : chartColors.light
  };
});