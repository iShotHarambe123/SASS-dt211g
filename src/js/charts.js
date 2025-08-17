
/**
 * Gets data from URL.
 * @returns {Promise<Array>}
 */
async function fetchAdmissions() {
  const url = 'https://studenter.miun.se/~mallar/dt211g/';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

/**
 * Gets top 6 courses.
 * @param {Array} data
 * @returns {Object}
 */
function top6Courses(data) {
  const courses = data
    .filter(item => item.type === 'Kurs')
    .map(item => ({
      name: item.name,
      total: Number(item.applicantsTotal) || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    labels: courses.map(c => c.name),
    values: courses.map(c => c.total)
  };
}

/**
 * Gets top 5 programs.
 * @param {Array} data
 * @returns {Object}
 */
function top5Programs(data) {
  const programs = data
    .filter(item => item.type === 'Program')
    .map(item => ({
      name: item.name,
      total: Number(item.applicantsTotal) || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    labels: programs.map(p => p.name),
    values: programs.map(p => p.total)
  };
}

/**
 * Makes bar chart.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} dataset
 * @returns {Chart}
 */
function renderBarChart(canvas, dataset) {
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dataset.labels,
      datasets: [
        {
          label: 'Totalt antal sökande',
          data: dataset.values
          // Chart.js väljer färger automatiskt
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '6 mest sökta kurser år HT24'
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toLocaleString('sv-SE')} sökande`
          }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 30, minRotation: 0 },
          title: { display: true, text: 'Kurs' }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Totalt antal sökande' },
          ticks: {
            callback: (value) => Number(value).toLocaleString('sv-SE')
          }
        }
      }
    }
  });
}

/**
 * Makes pie chart.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} dataset
 * @returns {Chart}
 */
function renderPieChart(canvas, dataset) {
  const total = dataset.values.reduce((acc, v) => acc + v, 0);
  return new Chart(canvas, {
    type: 'pie',
    data: {
      labels: dataset.labels,
      datasets: [
        {
          label: 'Totalt antal sökande',
          data: dataset.values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '5 mest sökta program år HT24'
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const pct = total ? (val / total) * 100 : 0;
              return `${val.toLocaleString('sv-SE')} sökande (${pct.toFixed(1)}%)`;
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

/**
 * Starts everything.
 */
async function init() {
  try {
    const raw = await fetchAdmissions();
    const courses = top6Courses(raw);
    const programs = top5Programs(raw);

    const barCanvas = document.getElementById('coursesBar');
    const pieCanvas = document.getElementById('programsPie');

    renderBarChart(barCanvas, courses);
    renderPieChart(pieCanvas, programs);
  } catch (err) {
    console.error('Fel vid inläsning/diagram:', err);
    const el = document.querySelector('#charts-status');
    if (el) {
      el.textContent = 'Kunde inte ladda data för diagrammen. Försök igen senare.';
      el.removeAttribute('aria-hidden');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}