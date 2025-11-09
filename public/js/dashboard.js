// Dashboard initialization and rendering
// Wait for Plotly to load before initializing
(function initDashboard() {
	if (typeof Plotly === 'undefined') {
		setTimeout(initDashboard, 100);
		return;
	}

	// Auto-detect API URL
	const API_URL = window.location.hostname === 'localhost'
		? 'http://localhost:8000'
		: 'https://soma-analytics.fly.dev';

	// Color scheme
	const colors = {
		variantA: '#6366f1',
		variantB: '#ef4444',
		median: '#10b981',
		p25: '#f59e0b',
		grid: '#e5e7eb',
		gridDark: '#374151'
	};

	// Get Plotly theme config
	function getPlotlyTheme() {
		const isDark = document.documentElement.classList.contains('dark');
		const textColor = isDark ? '#e5e7eb' : '#374151';
		const gridColor = isDark ? '#1f2937' : '#f3f4f6';
		const lineColor = isDark ? '#374151' : '#e5e7eb';

		return {
			font: { family: 'Satoshi, sans-serif', size: 12, color: textColor },
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			xaxis: { gridcolor: gridColor, linecolor: lineColor, zerolinecolor: lineColor },
			yaxis: { gridcolor: gridColor, linecolor: lineColor, zerolinecolor: lineColor }
		};
	}

	// Format time helper
	function getLastUpdateTime() {
		const now = new Date();
		return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	// Render comparison card
	function renderComparison(comparison) {
		const diff = comparison.percentage_difference;
		const isSignificant = Math.abs(diff) > 10;
		const isWinnerB = diff < 0;
		
		const card = document.getElementById('comparison-card');
		card.innerHTML = `
			<div class="grid gap-4" style="grid-template-columns: 2fr 1fr;">
				<div class="rounded-2xl border border-border bg-primary-foreground p-4">
					<div class="grid grid-cols-2 gap-6">
						<div>
							<div class="text-xs text-muted-foreground">Variant A<br><span class="text-xs">(3 words)</span></div>
							<div class="font-mono text-3xl font-bold">${comparison.variant_a_avg}s</div>
							<div class="text-xs text-muted-foreground mt-1">${comparison.variant_a_completions} completions</div>
						</div>
						<div>
							<div class="text-xs text-muted-foreground">Variant B<br><span class="text-xs">(4 words)</span></div>
							<div class="font-mono text-3xl font-bold">${comparison.variant_b_avg}s</div>
							<div class="text-xs text-muted-foreground mt-1">${comparison.variant_b_completions} completions</div>
						</div>
					</div>
				</div>
				<div class="rounded-2xl border border-border bg-primary-foreground p-4 flex flex-col justify-center items-center text-center">
					<div class="text-sm font-semibold mb-2 ${isSignificant ? (isWinnerB ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-foreground'}">${comparison.interpretation}</div>
					<div class="text-xs text-muted-foreground">
						<span class="font-mono font-bold block">${diff > 0 ? '+' : ''}${diff}%</span>
						<span>${isSignificant ? 'significant' : 'not significant'}</span>
					</div>
				</div>
			</div>
		`;
	}

	// Render average time chart
	function renderAvgTimeChart(stats, theme) {
		if (!stats || stats.length < 2) return;

		const trace = {
			x: ['Variant A', 'Variant B'],
			y: [stats[0].avg_completion_time, stats[1].avg_completion_time],
			type: 'bar',
			marker: { color: [colors.variantA, colors.variantB] },
			text: [stats[0].avg_completion_time.toFixed(2) + 's', stats[1].avg_completion_time.toFixed(2) + 's']
		};

		const layout = {
			title: { text: 'Average Completion Time', font: { size: 14 } },
			font: theme.font,
			paper_bgcolor: theme.paper_bgcolor,
			plot_bgcolor: theme.plot_bgcolor,
			xaxis: { title: '', gridcolor: theme.xaxis.gridcolor, linecolor: theme.xaxis.linecolor },
			yaxis: { title: 'Seconds', gridcolor: theme.yaxis.gridcolor, linecolor: theme.yaxis.linecolor },
			height: 320,
			margin: { l: 50, r: 50, t: 50, b: 40 },
			automargin: true,
			showlegend: false
		};

		Plotly.newPlot('avg-time-chart', [trace], layout, { responsive: true, displayModeBar: false });
	}

	// Compute simple Gaussian KDE
	function computeKDE(data) {
		if (!data || data.length === 0) return { x: [], y: [] };
		
		const mean = data.reduce((a, b) => a + b) / data.length;
		const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
		const std = Math.sqrt(variance);
		const bandwidth = std * Math.pow(data.length, -0.2);

		const min = Math.min(...data);
		const max = Math.max(...data);
		const xPoints = [];
		const yPoints = [];
		
		for (let i = 0; i <= 150; i++) {
			const x = min + (max - min) * i / 150;
			xPoints.push(x);
			
			let density = 0;
			for (let j = 0; j < data.length; j++) {
				density += Math.exp(-Math.pow((x - data[j]) / bandwidth, 2) / 2);
			}
			yPoints.push(density / (data.length * bandwidth * Math.sqrt(2 * Math.PI)));
		}
		
		return { x: xPoints, y: yPoints };
	}

	// Render KDE distribution
	function renderDistributionChart(distributionData, theme) {
		if (!distributionData.variant_a_times || !distributionData.variant_b_times) return;

		const kdeA = computeKDE(distributionData.variant_a_times);
		const kdeB = computeKDE(distributionData.variant_b_times);

		const traces = [
			{
				x: kdeA.x,
				y: kdeA.y,
				type: 'scatter',
				mode: 'lines',
				name: 'Variant A',
				line: { color: colors.variantA, width: 2 },
				fill: 'tozeroy',
				fillcolor: 'rgba(99, 102, 241, 0.2)'
			},
			{
				x: kdeB.x,
				y: kdeB.y,
				type: 'scatter',
				mode: 'lines',
				name: 'Variant B',
				line: { color: colors.variantB, width: 2 },
				fill: 'tozeroy',
				fillcolor: 'rgba(239, 68, 68, 0.2)'
			}
		];

		const layout = {
			title: { text: 'Completion Time Distribution (KDE)', font: { size: 14 } },
			font: theme.font,
			paper_bgcolor: theme.paper_bgcolor,
			plot_bgcolor: theme.plot_bgcolor,
			xaxis: { title: 'Completion Time (seconds)', gridcolor: theme.xaxis.gridcolor, linecolor: theme.xaxis.linecolor },
			yaxis: { title: 'Density', gridcolor: theme.yaxis.gridcolor, linecolor: theme.yaxis.linecolor },
			height: 320,
			margin: { l: 50, r: 30, t: 50, b: 40 },
			showlegend: true
		};

		Plotly.newPlot('distribution-chart', traces, layout, { responsive: true, displayModeBar: false });
	}

	// Render funnel chart
	function renderFunnelChart(funnel, theme) {
		const variantA = funnel.filter(f => f.variant === 'A').sort((a, b) => a.stage_order - b.stage_order);
		const variantB = funnel.filter(f => f.variant === 'B').sort((a, b) => a.stage_order - b.stage_order);

		const traces = [
			{
				type: 'funnel',
				y: variantA.map(f => f.stage),
				x: variantA.map(f => f.event_count),
				name: 'Variant A',
				marker: { color: colors.variantA },
				textposition: 'inside',
				textinfo: 'value+percent initial'
			},
			{
				type: 'funnel',
				y: variantB.map(f => f.stage),
				x: variantB.map(f => f.event_count),
				name: 'Variant B',
				marker: { color: colors.variantB },
				textposition: 'inside',
				textinfo: 'value+percent initial'
			}
		];

		const layout = {
			title: { text: 'Conversion Funnel', font: { size: 14 } },
			font: theme.font,
			paper_bgcolor: theme.paper_bgcolor,
			plot_bgcolor: theme.plot_bgcolor,
			xaxis: { gridcolor: theme.xaxis.gridcolor, linecolor: theme.xaxis.linecolor },
			yaxis: { gridcolor: theme.yaxis.gridcolor, linecolor: theme.yaxis.linecolor },
			height: 320,
			margin: { l: 100, r: 30, t: 50, b: 40 },
			showlegend: true
		};

		Plotly.newPlot('funnel-chart', traces, layout, { responsive: true, displayModeBar: false });
	}

	// Render recent completions table
	function renderCompletionsTable(completions, theme) {
		const isDark = document.documentElement.classList.contains('dark');
		const headerBg = isDark ? '#1f2937' : '#f3f4f6';
		
		if (!completions || completions.length === 0) {
			const emptyTrace = {
				type: 'table',
				header: {
					values: ['<b>No Data</b>'],
					align: 'center',
					fill: { color: headerBg },
					font: { color: theme.font.color, size: 12, family: 'Satoshi, monospace' },
					height: 28
				},
				cells: {
					values: [['No completions yet']],
					align: 'center',
					fill: { color: 'rgba(0,0,0,0)' },
					font: { color: '#9ca3af', size: 11 },
					height: 24
				}
			};

			Plotly.newPlot('completions-table', [emptyTrace], {
				margin: { l: 0, r: 0, t: 0, b: 0 },
				paper_bgcolor: 'transparent',
				plot_bgcolor: 'transparent',
				height: 80
			}, { responsive: true, displayModeBar: false });
			return;
		}

		// Auto-detect columns from first row
		const columns = Object.keys(completions[0]);
		const headers = columns.map(col => `<b>${col.replace(/_/g, ' ').toUpperCase()}</b>`);
		const values = columns.map(col => completions.map(row => row[col]));

		const trace = {
			type: 'table',
			header: {
				values: headers,
				align: 'center',
				fill: { color: headerBg },
				font: { color: theme.font.color, size: 12, family: 'Satoshi, monospace' },
				height: 28,
				line: { color: isDark ? '#374151' : '#e5e7eb', width: 1 }
			},
			cells: {
				values: values,
				align: 'center',
				fill: { 
					color: [completions.map((c, i) => i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0)')]
				},
				font: { color: theme.font.color, size: 11, family: 'Satoshi, monospace' },
				height: 24,
				line: { color: isDark ? '#374151' : '#e5e7eb', width: 1 }
			}
		};

		Plotly.newPlot('completions-table', [trace], {
			margin: { l: 0, r: 0, t: 0, b: 0 },
			paper_bgcolor: 'transparent',
			plot_bgcolor: 'transparent',
			height: 10 * 24 + 40  // Fixed height: 10 rows visible, scrollable
		}, { responsive: true, displayModeBar: false, scrollZoom: false });
	}

	// Main update function
	async function updateDashboard() {
		try {
			const [stats, comparison, funnel, completions, distribution] = await Promise.all([
				fetch(`${API_URL}/api/variant-stats`).then(r => r.json()),
				fetch(`${API_URL}/api/comparison`).then(r => r.json()),
				fetch(`${API_URL}/api/conversion-funnel`).then(r => r.json()),
				fetch(`${API_URL}/api/recent-completions?limit=50`).then(r => r.json()),
				fetch(`${API_URL}/api/time-distribution`).then(r => r.json())
			]);

			const theme = getPlotlyTheme();

			// Render all components
			renderComparison(comparison);
			renderFunnelChart(funnel, theme);
			renderAvgTimeChart(stats, theme);
			renderDistributionChart(distribution, theme);
			renderCompletionsTable(completions, theme);

			// Update timestamp
			document.getElementById('last-updated').innerHTML = `Last updated: ${getLastUpdateTime()}`;
			document.getElementById('update-indicator').classList.remove('opacity-50');

		} catch (err) {
			console.error('Dashboard error:', err);
			document.getElementById('comparison-card').innerHTML = `
				<div class="rounded-lg p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
					<div class="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">❌ Error Loading Dashboard</div>
					<div class="text-xs text-red-800 dark:text-red-200">${err.message}</div>
					<div class="text-xs text-red-700 dark:text-red-300 mt-2">Check if soma-analytics API is running at ${API_URL}</div>
				</div>
			`;
		}
	}

	// Initial load
	updateDashboard();

	// Auto-refresh every 10 seconds
	setInterval(() => {
		document.getElementById('update-indicator').classList.add('opacity-50');
		updateDashboard();
	}, 10000);

	// Re-render when theme changes (dark mode toggle)
	const observer = new MutationObserver(() => {
		if (document.getElementById('avg-time-chart').hasChildNodes()) {
			updateDashboard();
		}
	});
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
