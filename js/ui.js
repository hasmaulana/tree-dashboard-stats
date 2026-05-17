/**
 * UI Controller
 */

const UI = {
    // Chart instances
    charts: {},

    // Elements
    elements: {
        uploadView: document.getElementById('upload-view'),
        dashboardView: document.getElementById('dashboard-view'),
        galleryView: document.getElementById('gallery-view'),
        syncView: document.getElementById('sync-view'),
        navDataTabs: document.getElementById('nav-data-tabs'),
        tabDashboard: document.getElementById('tab-dashboard'),
        tabGallery: document.getElementById('tab-gallery'),
        gallerySearch: document.getElementById('gallery-search'),
        galleryFilterUser: document.getElementById('gallery-filter-user'),
        galleryFilterType: document.getElementById('gallery-filter-type'),
        gallerySort: document.getElementById('gallery-sort'),
        galleryClearFilters: document.getElementById('gallery-clear-filters'),
        galleryGrid: document.getElementById('gallery-grid'),
        galleryEmptyState: document.getElementById('gallery-empty-state'),
        galleryStatsTotal: document.getElementById('gallery-stats-total'),
        galleryStatsFiltered: document.getElementById('gallery-stats-filtered'),
        dropzone: document.getElementById('dropzone'),
        fileInput: document.getElementById('file-input'),
        errorMsg: document.getElementById('error-message'),
        resetBtn: document.getElementById('reset-btn'),
        navUpload: document.getElementById('nav-upload'),
        navSync: document.getElementById('nav-sync'),
        showSyncBtn: document.getElementById('show-sync-btn'),

        // Sync Form
        syncName: document.getElementById('sync-name'),
        syncTreeId: document.getElementById('sync-tree-id'),
        syncPages: document.getElementById('sync-pages'),
        syncPagesLabel: document.getElementById('sync-pages-label'),
        syncModeToggle: document.getElementById('sync-mode-toggle'),
        syncModeKnob: document.getElementById('sync-mode-knob'),
        syncToken: document.getElementById('sync-token'),
        syncSubmitBtn: document.getElementById('sync-submit-btn'),
        syncProgressContainer: document.getElementById('sync-progress-container'),
        syncProgressBar: document.getElementById('sync-progress-bar'),
        syncStatus: document.getElementById('sync-status'),
        syncPercentage: document.getElementById('sync-percentage'),
        syncCount: document.getElementById('sync-count'),
        syncHistoryList: document.getElementById('sync-history-list'),
        syncHistoryClear: document.getElementById('sync-history-clear'),

        // Stats
        totalPosts: document.getElementById('stat-total-posts'),
        totalMembers: document.getElementById('stat-total-members'),
        totalInteractions: document.getElementById('stat-total-interactions'),
        avgLikes: document.getElementById('stat-avg-likes'),

        // Lists
        tableBody: document.getElementById('data-table-body'),
        leaderboardBody: document.getElementById('leaderboard-body'),
        leaderboardSearch: document.getElementById('leaderboard-search'),
        leaderboardSort: document.getElementById('leaderboard-sort'),

        // Table filters
        tableSearch: document.getElementById('table-search'),
        tableFilterDate: document.getElementById('table-filter-date'),
        tableFilterUsername: document.getElementById('table-filter-username'),
        tableStatsCount: document.getElementById('table-stats-count'),

        // Modals
        modalBackdrop: document.getElementById('modal-backdrop'),
        userProfileModal: document.getElementById('user-profile-modal'),

        // Post Detail Modal
        postDetailModal: document.getElementById('post-detail-modal'),
        postDetailImage: document.getElementById('post-detail-image'),
        postDetailVideoIcon: document.getElementById('post-detail-video-icon'),
        postDetailAvatar: document.getElementById('post-detail-avatar'),
        postDetailUsername: document.getElementById('post-detail-username'),
        postDetailDate: document.getElementById('post-detail-date'),
        postDetailLikes: document.getElementById('post-detail-likes'),
        postDetailComments: document.getElementById('post-detail-comments'),
        postDetailCaption: document.getElementById('post-detail-caption'),
        postDetailLink: document.getElementById('post-detail-link'),

        // Profile Modal Elements
        profileAvatar: document.getElementById('profile-avatar'),
        profileUsername: document.getElementById('profile-username'),
        profileStatus: document.getElementById('profile-status'),
        profileTotalPosts: document.getElementById('profile-total-posts'),
        profileTotalLikes: document.getElementById('profile-total-likes'),
        profileExternalLink: document.getElementById('profile-external-link'),
        profileGallery: document.getElementById('profile-gallery'),
        profileChartToggle: document.getElementById('profile-chart-toggle'),
        profileChartIcon: document.getElementById('profile-chart-icon'),
        profileChartContainer: document.getElementById('profile-chart-container'),
        profileGalleryClearFilter: document.getElementById('profile-gallery-clear-filter'),
        profileGalleryFilterText: document.getElementById('profile-gallery-filter-text'),

        // Buttons
        closeModalBtns: document.querySelectorAll('.close-modal-btn'),
    },

    init() {
        // Chart defaults
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = 'Inter';

        this.initModals();
        this.initViewSwitching();
        this.initSyncForm();
        this.renderSyncHistory();
        this.initGallery();
    },

    initViewSwitching() {
        const { navUpload, navSync, showSyncBtn, tabDashboard, tabGallery } = this.elements;

        const switchView = (target) => {
            const views = [this.elements.uploadView, this.elements.syncView, this.elements.dashboardView, this.elements.galleryView];
            views.forEach(v => {
                if (!v) return;
                if (v === target) {
                    v.classList.remove('hidden');
                    setTimeout(() => v.classList.remove('opacity-0', 'translate-y-4'), 10);
                } else {
                    v.classList.add('opacity-0', 'translate-y-4');
                    setTimeout(() => v.classList.add('hidden'), 500);
                }
            });

            // Update Nav
            if (target === this.elements.uploadView) {
                navUpload.classList.add('text-primary');
                navUpload.classList.remove('text-gray-400');
                navSync.classList.add('text-gray-400');
                navSync.classList.remove('text-white');
                this.updateTabStyles('none');
            } else if (target === this.elements.syncView) {
                navSync.classList.add('text-white');
                navSync.classList.remove('text-gray-400');
                navUpload.classList.remove('text-primary');
                navUpload.classList.add('text-gray-400');
                this.updateTabStyles('none');
            } else {
                navUpload.classList.remove('text-primary');
                navUpload.classList.add('text-gray-400');
                navSync.classList.add('text-gray-400');
                navSync.classList.remove('text-white');
                
                if (target === this.elements.dashboardView) {
                    this.updateTabStyles('dashboard');
                } else if (target === this.elements.galleryView) {
                    this.updateTabStyles('gallery');
                }
            }

            // Manage Tab Switcher visibility
            if (window.currentData && window.currentData.length > 0 && this.elements.navDataTabs) {
                this.elements.navDataTabs.classList.remove('hidden');
            } else if (this.elements.navDataTabs) {
                this.elements.navDataTabs.classList.add('hidden');
            }
        };

        navUpload.addEventListener('click', () => switchView(this.elements.uploadView));
        navSync.addEventListener('click', () => switchView(this.elements.syncView));
        showSyncBtn.addEventListener('click', () => switchView(this.elements.syncView));

        if (tabDashboard) {
            tabDashboard.addEventListener('click', () => switchView(this.elements.dashboardView));
        }
        if (tabGallery) {
            tabGallery.addEventListener('click', () => switchView(this.elements.galleryView));
        }
    },

    initSyncForm() {
        this.elements.syncSubmitBtn.addEventListener('click', () => this.startSync());

        if (this.elements.syncHistoryClear) {
            this.elements.syncHistoryClear.addEventListener('click', () => this.clearSyncHistory());
        }

        // Mode Toggle Logic
        this.syncIsRawMode = false;
        if (this.elements.syncModeToggle) {
            this.elements.syncModeToggle.addEventListener('click', () => {
                this.syncIsRawMode = !this.syncIsRawMode;
                this.updateSyncModeUI();
            });
        }

        // Auto-fill from last session if available
        const lastSync = this.getCookie('last_sync');
        if (lastSync) {
            try {
                const data = JSON.parse(lastSync);
                this.elements.syncTreeId.value = data.tree_id || '';
                this.elements.syncName.value = data.name || '';
                this.elements.syncToken.value = data.token || '';
                if (data.is_raw !== undefined) {
                    this.syncIsRawMode = data.is_raw;
                    this.updateSyncModeUI();
                }
            } catch (e) { }
        }
    },

    updateSyncModeUI() {
        const knob = this.elements.syncModeKnob;
        const label = this.elements.syncPagesLabel;
        const toggle = this.elements.syncModeToggle;

        if (this.syncIsRawMode) {
            knob.style.left = 'calc(100% - 14px)';
            knob.classList.replace('bg-gray-500', 'bg-primary');
            toggle.classList.replace('bg-white/10', 'bg-primary/20');
            label.textContent = 'Raw Item Count';
        } else {
            knob.style.left = '2px';
            knob.classList.replace('bg-primary', 'bg-gray-500');
            toggle.classList.replace('bg-primary/20', 'bg-white/10');
            label.textContent = 'Page Count';
        }
    },

    async startSync() {
        const name = this.elements.syncName.value.trim() || 'Untitled Request';
        const treeId = this.elements.syncTreeId.value.trim();
        const inputVal = parseInt(this.elements.syncPages.value) || 1;
        const token = this.elements.syncToken.value.trim();

        if (!treeId) {
            this.showError("Please enter a Tree ID.");
            return;
        }

        // Calculate actual pages
        const pages = this.syncIsRawMode ? Math.ceil(inputVal / 20) : inputVal;

        // Save to cookies
        this.saveSyncHistory(name, treeId, inputVal, token, this.syncIsRawMode);
        this.setCookie('last_sync', JSON.stringify({ name, tree_id: treeId, token, is_raw: this.syncIsRawMode }));

        // UI Reset
        this.elements.syncProgressContainer.classList.remove('hidden');
        this.elements.syncSubmitBtn.disabled = true;
        this.elements.syncSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Syncing...';

        let allResults = [];
        let stopLoop = false;

        for (let i = 1; i <= pages && !stopLoop; i++) {
            this.updateSyncProgress(i, pages, `Fetching page ${i}...`, allResults.length);

            try {
                const url = `https://api.fotoyu.com/tree/v1/leaves?page=${i}&limit=20&tree_id=${treeId}`;
                const headers = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(url, { headers });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const results = data.result || [];

                if (results.length === 0) {
                    stopLoop = true;
                    this.elements.syncStatus.textContent = "No more data found. Finishing...";
                } else {
                    allResults = [...allResults, ...results];
                }

                // Small artificial delay for UI feel
                await new Promise(r => setTimeout(r, 300));

            } catch (err) {
                console.error(err);
                this.showError(`Error at page ${i}: ${err.message}`);
                stopLoop = true;
            }
        }

        this.updateSyncProgress(pages, pages, "Complete!", allResults.length);

        setTimeout(() => {
            if (allResults.length > 0) {
                window.currentData = allResults;
                const stats = Analytics.process(allResults);
                this.showDashboard(stats, allResults);
            } else {
                this.showError("No data was fetched.");
            }

            // Reset button
            this.elements.syncSubmitBtn.disabled = false;
            this.elements.syncSubmitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down mr-2"></i> Start Synchronizing';
        }, 800);
    },

    updateSyncProgress(current, total, status, count) {
        const percent = Math.round((current / total) * 100);
        this.elements.syncProgressBar.style.width = `${percent}%`;
        this.elements.syncPercentage.textContent = `${percent}%`;
        this.elements.syncStatus.textContent = status;
        this.elements.syncCount.textContent = `Total items collected: ${count}`;
    },

    saveSyncHistory(name, tree_id, pages, token, is_raw = false) {
        let history = [];
        const existing = this.getCookie('sync_history');
        if (existing) {
            try { history = JSON.parse(existing); } catch (e) { }
        }

        // Remove duplicate and add to top
        history = history.filter(h => h.tree_id !== tree_id || h.name !== name);
        history.unshift({ name, tree_id, pages, token, is_raw, date: new Date().toISOString() });

        // Limit to 20
        if (history.length > 20) history = history.slice(0, 20);

        this.setCookie('sync_history', JSON.stringify(history));
        this.renderSyncHistory();
    },

    clearSyncHistory() {
        if (confirm("Are you sure you want to clear all sync history?")) {
            this.setCookie('sync_history', '[]');
            this.renderSyncHistory();
        }
    },

    deleteSyncHistoryItem(index) {
        let history = [];
        const existing = this.getCookie('sync_history');
        if (existing) {
            try { history = JSON.parse(existing); } catch (e) { }
        }

        history.splice(index, 1);
        this.setCookie('sync_history', JSON.stringify(history));
        this.renderSyncHistory();
    },

    renderSyncHistory() {
        const list = this.elements.syncHistoryList;
        if (!list) return;

        let history = [];
        const existing = this.getCookie('sync_history');
        if (existing) {
            try { history = JSON.parse(existing); } catch (e) { }
        }

        if (history.length === 0) {
            list.innerHTML = `
                <div class="text-center py-8 text-gray-500 border border-white/5 border-dashed rounded-xl">
                    No history found.
                </div>`;
            return;
        }

        list.innerHTML = '';
        history.forEach((h, index) => {
            const date = new Date(h.date).toLocaleDateString();
            const item = document.createElement('div');
            item.className = "bg-white/5 border border-white/5 hover:border-primary/30 rounded-xl p-4 cursor-pointer transition-all group relative";
            item.innerHTML = `
                <div class="flex justify-between items-start mb-1 pr-6">
                    <h4 class="font-bold text-white group-hover:text-primary transition-colors truncate">${h.name}</h4>
                    <span class="text-[10px] text-gray-500">${date}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-400">
                    <span class="truncate max-w-[150px]">ID: ${h.tree_id}</span>
                    <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">${h.is_raw ? 'Raw' : 'Pages'}</span>
                </div>
                <button class="delete-history-btn absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1" title="Delete Item">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            
            item.onclick = (e) => {
                if (e.target.closest('.delete-history-btn')) return; // Ignore if delete button clicked
                this.elements.syncName.value = h.name;
                this.elements.syncTreeId.value = h.tree_id;
                this.elements.syncPages.value = h.pages;
                this.elements.syncToken.value = h.token || '';
                this.syncIsRawMode = !!h.is_raw;
                this.updateSyncModeUI();
            };

            const delBtn = item.querySelector('.delete-history-btn');
            delBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteSyncHistoryItem(index);
            };

            list.appendChild(item);
        });
    },

    setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    },

    getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    },

    initModals() {
        // Close buttons
        this.elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Click outside to close - fix: only close if clicking directly on backdrop
        this.elements.modalBackdrop.addEventListener('click', (e) => {
            if (e.target === this.elements.modalBackdrop) {
                this.closeAllModals();
            }
        });

        // Chart Toggle
        if (this.elements.profileChartToggle) {
            this.elements.profileChartToggle.addEventListener('click', () => {
                const container = this.elements.profileChartContainer;
                const icon = this.elements.profileChartIcon;
                if (container.classList.contains('hidden')) {
                    container.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                    if (this.charts.profileActivity) {
                        this.charts.profileActivity.resize();
                    }
                } else {
                    container.classList.add('hidden');
                    icon.classList.remove('rotate-180');
                }
            });
        }

        if (this.elements.profileGalleryClearFilter) {
            this.elements.profileGalleryClearFilter.addEventListener('click', () => {
                if (this.currentProfileDetails) {
                    this.renderProfileGallery(this.currentProfileDetails.posts);
                    this.elements.profileGalleryClearFilter.classList.add('hidden');
                    if (this.elements.profileGalleryFilterText) {
                        this.elements.profileGalleryFilterText.textContent = '';
                    }
                }
            });
        }

        // Leaderboard Filter Listeners
        if (this.elements.leaderboardSearch && this.elements.leaderboardSort) {
            const filterLeaderboard = () => {
                const term = this.elements.leaderboardSearch.value.toLowerCase();
                const sortType = this.elements.leaderboardSort.value;
                this.filterAndRenderLeaderboard(term, sortType);
            };

            this.elements.leaderboardSearch.addEventListener('input', filterLeaderboard);
            this.elements.leaderboardSort.addEventListener('change', filterLeaderboard);
        }
    },

    openModal(modal) {
        [this.elements.userProfileModal, this.elements.postDetailModal].forEach(m => {
            if (m && m !== modal && !m.classList.contains('hidden')) {
                m.classList.add('hidden');
                m.classList.remove('scale-100');
                m.classList.add('scale-95');
            }
        });

        this.elements.modalBackdrop.classList.remove('hidden');
        // Small delay to allow display:block to apply before transition
        setTimeout(() => {
            this.elements.modalBackdrop.classList.remove('opacity-0');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('scale-95');
                modal.classList.add('scale-100');
            }, 10);
        }, 10);
    },

    closeAllModals() {
        const modals = [this.elements.userProfileModal, this.elements.postDetailModal];

        this.elements.modalBackdrop.classList.add('opacity-0');
        modals.forEach(m => {
            m.classList.remove('scale-100');
            m.classList.add('scale-95');
        });

        setTimeout(() => {
            this.elements.modalBackdrop.classList.add('hidden');
            modals.forEach(m => m.classList.add('hidden'));
        }, 300);
    },

    showUserDetail(username) {
        const details = Analytics.getMemberDetails(window.currentData, username);
        if (!details) return;

        this.renderUserProfile(details);
        // this.closeAllModals(); // Removing this as it likely conflicts with openModal if using same backdrop or timeouts

        this.openModal(this.elements.userProfileModal);
    },


    showDashboard(stats, rawData) {
        try {
            // Animation: Hide Upload/Sync, Show Dashboard
            this.elements.uploadView.classList.add('opacity-0', '-translate-y-4');
            this.elements.syncView.classList.add('opacity-0', 'translate-y-4');

            setTimeout(() => {
                this.elements.uploadView.classList.add('hidden');
                this.elements.syncView.classList.add('hidden');
                this.elements.dashboardView.classList.remove('hidden');
                if (this.elements.galleryView) {
                    this.elements.galleryView.classList.add('hidden', 'opacity-0', 'translate-y-4');
                }

                // Trigger reflow
                void this.elements.dashboardView.offsetWidth;

                this.elements.dashboardView.classList.remove('opacity-0', 'translate-y-4');
                this.elements.resetBtn.classList.remove('hidden');

                // Show data tabs
                if (this.elements.navDataTabs) {
                    this.elements.navDataTabs.classList.remove('hidden');
                }
                this.updateTabStyles('dashboard');

                // Clear nav highlighting
                this.elements.navUpload.classList.remove('text-primary');
                this.elements.navUpload.classList.add('text-gray-400');
                this.elements.navSync.classList.remove('text-white');
                this.elements.navSync.classList.add('text-gray-400');
            }, 500);

            this.renderStats(stats.summary);

            try {
                this.renderCharts(stats);
            } catch (chartErr) {
                console.error("Chart rendering error:", chartErr);
            }

            // Store and Render full leaderboard
            this.allLeaderboardUsers = Analytics.getTopUsers(rawData, 0); // Store for filtering
            this.filterAndRenderLeaderboard(); // Initial render

            // Initialize and Render Table
            this.initTableFilters(rawData);
            this.filterAndRenderTable();

            // Initialize Gallery View
            this.populateGalleryUserFilter(rawData);
            this.filterAndRenderGallery(rawData);

        } catch (err) {
            console.error("Dashboard rendering error:", err);
            this.showError("Error rendering dashboard: " + err.message);
        }
    },

    reset() {
        this.elements.dashboardView.classList.add('opacity-0', 'translate-y-4');
        if (this.elements.galleryView) {
            this.elements.galleryView.classList.add('opacity-0', 'translate-y-4');
        }

        setTimeout(() => {
            this.elements.dashboardView.classList.add('hidden');
            if (this.elements.galleryView) {
                this.elements.galleryView.classList.add('hidden');
            }
            this.elements.syncView.classList.add('hidden');
            this.elements.uploadView.classList.remove('hidden');
            this.elements.resetBtn.classList.add('hidden');

            // Hide tabs switcher
            if (this.elements.navDataTabs) {
                this.elements.navDataTabs.classList.add('hidden');
            }
            this.updateTabStyles('none');

            // Reset Nav
            this.elements.navUpload.classList.add('text-primary');
            this.elements.navUpload.classList.remove('text-gray-400');
            this.elements.navSync.classList.remove('text-white');
            this.elements.navSync.classList.add('text-gray-400');

            // Trigger reflow
            void this.elements.uploadView.offsetWidth;

            this.elements.uploadView.classList.remove('opacity-0', '-translate-y-4');

            // Clear charts
            Object.values(this.charts).forEach(chart => chart.destroy());
            this.charts = {};

            // Clear input
            this.elements.fileInput.value = '';
        }, 500);
    },

    showError(msg) {
        const el = this.elements.errorMsg;
        el.querySelector('span').textContent = msg || "Invalid JSON file.";
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 3000);
    },

    renderStats(summary) {
        const animateValue = (obj, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.innerHTML = end; // Ensure final value is exact
                }
            };
            window.requestAnimationFrame(step);
        };

        animateValue(this.elements.totalPosts, 0, summary.totalPosts, 1000);
        animateValue(this.elements.totalMembers, 0, summary.totalMembers, 1000);
        animateValue(this.elements.totalInteractions, 0, summary.totalInteractions, 1000);
        this.elements.avgLikes.textContent = summary.avgLikes;
    },

    renderCharts(stats) {
        // Activity Chart (Line)
        const activityCtx = document.getElementById('chart-activity').getContext('2d');
        this.charts.activity = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: stats.dailyActivity.map(d => d.date),
                datasets: [{
                    label: 'New Posts',
                    data: stats.dailyActivity.map(d => d.count),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Content Type (Doughnut)
        const contentCtx = document.getElementById('chart-content-type').getContext('2d');
        this.charts.content = new Chart(contentCtx, {
            type: 'doughnut',
            data: {
                labels: stats.contentType.map(d => d.type),
                datasets: [{
                    data: stats.contentType.map(d => d.count),
                    backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });

        // Engagement (Bar)
        const engagementCtx = document.getElementById('chart-engagement').getContext('2d');
        const engagementLabels = Object.keys(stats.engagement);
        const engagementValues = Object.values(stats.engagement);

        this.charts.engagement = new Chart(engagementCtx, {
            type: 'bar',
            data: {
                labels: engagementLabels,
                datasets: [{
                    label: 'Posts',
                    data: engagementValues,
                    backgroundColor: '#8B5CF6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Likes Distribution' }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    // renderTopUsers REMOVED

    filterAndRenderLeaderboard(searchTerm = '', sortType = 'posts') {
        if (!this.allLeaderboardUsers) return;

        let filtered = [...this.allLeaderboardUsers];

        // Filter
        if (searchTerm) {
            filtered = filtered.filter(u => u.username.toLowerCase().includes(searchTerm));
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortType === 'likes') return b.likes - a.likes;
            if (sortType === 'avg') {
                const avgA = a.count > 0 ? a.likes / a.count : 0;
                const avgB = b.count > 0 ? b.likes / b.count : 0;
                return avgB - avgA;
            }
            return b.count - a.count; // Default: posts
        });

        this.renderLeaderboard(filtered);
    },

    renderLeaderboard(users) {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) {
            console.error("Critical: 'leaderboard-body' element not found in DOM.");
            this.showError("UI Error: Leaderboard table missing.");
            return;
        }

        console.log(`Rendering leaderboard: ${users ? users.length : 'null'} users.`);
        tbody.innerHTML = '';

        if (!users || users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400 italic">No contributors found.</td></tr>`;
            return;
        }

        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-white/5 transition-colors cursor-pointer group";
            tr.onclick = () => this.showUserDetail(user.username);

            const avatarHtml = user.avatar
                ? `<img src="${user.avatar}" class="w-8 h-8 rounded-full bg-gray-700 object-cover mr-3 inline-block" onerror="this.src='https://via.placeholder.com/32'">`
                : `<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white mr-3 inline-block">${user.username.substring(0, 2).toUpperCase()}</div>`;

            const avgLikes = (user.count > 0 ? (user.likes / user.count) : 0).toFixed(1);

            tr.innerHTML = `
                <td class="px-6 py-4 text-gray-500 font-bold">#${index + 1}</td>
                <td class="px-6 py-4 text-white font-medium group-hover:text-primary transition-colors">
                    ${avatarHtml}
                    ${user.username}
                </td>
                <td class="px-6 py-4 text-center text-white">${user.count}</td>
                <td class="px-6 py-4 text-center text-gray-400">${user.likes}</td>
                <td class="px-6 py-4 text-center text-gray-400">${avgLikes}</td>
                <td class="px-6 py-4 text-right">
                   <button class="text-primary hover:text-white"><i class="fa-solid fa-chevron-right"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderUserProfile(details) {
        this.currentProfileDetails = details;
        const { member, stats, posts } = details;
        const els = this.elements;

        // Header
        els.profileUsername.textContent = member.username;
        els.profileTotalPosts.textContent = stats.totalPosts;
        els.profileTotalLikes.textContent = stats.totalLikes;
        els.profileStatus.textContent = member.creator_status || 'regular';

        // Avatar
        if (member.photo) {
            els.profileAvatar.innerHTML = `<img src="${member.photo}" class="w-full h-full object-cover">`;
        } else {
            els.profileAvatar.innerHTML = `<div class="w-full h-full bg-primary flex items-center justify-center text-xl font-bold text-white">${member.username.substring(0, 2).toUpperCase()}</div>`;
        }

        // External Link
        els.profileExternalLink.href = `https://www.fotoyu.com/profile/${member.username}`;

        if (els.profileGalleryClearFilter) {
            els.profileGalleryClearFilter.classList.add('hidden');
        }
        if (els.profileGalleryFilterText) {
            els.profileGalleryFilterText.textContent = '';
        }

        // Default: it is collapsed, but when opening a new user profile, 
        // chart might be left open from previous user.
        if (els.profileChartContainer && !els.profileChartContainer.classList.contains('hidden')) {
            els.profileChartContainer.classList.add('hidden');
            if (els.profileChartIcon) els.profileChartIcon.classList.remove('rotate-180');
        }

        // Render Profile Chart
        const dailyActivity = Analytics.getDailyActivity(posts);
        const ctx = document.getElementById('profile-chart-activity').getContext('2d');

        if (this.charts.profileActivity) {
            this.charts.profileActivity.destroy();
        }

        // Ensure canvas width/height gets set correctly when eventually displayed
        this.charts.profileActivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyActivity.map(d => d.date),
                datasets: [{
                    label: 'Posts',
                    data: dailyActivity.map(d => d.count),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10B981',
                    pointHoverBackgroundColor: '#10B981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.raw} Posts (Click to filter)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                },
                onClick: (e, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const clickedDate = dailyActivity[index].date;
                        this.filterProfileGalleryByDate(clickedDate);
                    }
                }
            }
        });

        this.renderProfileGallery(posts);
    },

    filterProfileGalleryByDate(date) {
        if (!this.currentProfileDetails) return;
        const filteredPosts = this.currentProfileDetails.posts.filter(p => {
            if (!p.created_at) return false;
            return p.created_at.split('T')[0] === date;
        });
        this.renderProfileGallery(filteredPosts);
        this.elements.profileGalleryClearFilter.classList.remove('hidden');
        if (this.elements.profileGalleryFilterText) {
            this.elements.profileGalleryFilterText.textContent = `(Showing posts from ${date})`;
        }
    },

    renderProfileGallery(posts) {
        const els = this.elements;
        // Gallery
        els.profileGallery.innerHTML = '';

        if (posts.length === 0) {
            els.profileGallery.innerHTML = `<div class="col-span-full py-8 text-center text-gray-400 border border-white/5 rounded-lg border-dashed">No posts found for this date.</div>`;
            return;
        }

        // Lazy loading observer
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('opacity-0');
                    obs.unobserve(img);
                }
            });
        });

        posts.forEach(post => {
            const item = document.createElement('div');
            item.className = "aspect-[2/3] bg-white/5 rounded-lg overflow-hidden relative group border border-white/5";

            const likes = post.likes_count || 0;
            const comments = post.comment_count || 0;
            const isVideo = post.content_type === 'video';
            const icon = isVideo ? '<i class="fa-solid fa-video absolute top-2 right-2 text-white/80 drop-shadow-md"></i>' : '';

            // Thumbnail or main URL? Use thumbnail if valid, else url
            const thumbUrl = (post.thumbnail && post.thumbnail.length > 0) ? post.thumbnail : post.url;

            item.innerHTML = `
                <img data-src="${thumbUrl}" class="w-full h-full object-cover opacity-0 transition-opacity duration-500" alt="${post.caption || ''}">
                ${icon}
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <p class="text-[10px] text-gray-300 mb-1 font-medium"><i class="fa-regular fa-calendar mr-1"></i> ${new Date(post.created_at).toLocaleDateString()}</p>
                    <div class="flex justify-between items-center text-xs text-white">
                        <span><i class="fa-solid fa-heart text-red-400 mr-1"></i> ${likes}</span>
                        <span><i class="fa-solid fa-comment text-white/70 mr-1"></i> ${comments}</span>
                    </div>
                </div>
            `;

            const img = item.querySelector('img');
            observer.observe(img);

            // Open full image on click? (Optional, not requested but good UX)
            // For now, let's link to external url
            item.title = "Open on Web";
            item.style.cursor = "pointer";
            item.onclick = () => window.open(post.url, '_blank');

            els.profileGallery.appendChild(item);
        });
    },

    initTableFilters(data) {
        this.allTableData = data;

        // Extract unique dates
        const dates = [...new Set(data.map(item => item.created_at ? item.created_at.split('T')[0] : null).filter(Boolean))];
        dates.sort((a, b) => new Date(b) - new Date(a)); // Newest first

        const dateSelect = this.elements.tableFilterDate;
        if (dateSelect) {
            dateSelect.innerHTML = '<option value="">All Dates</option>';
            dates.forEach(date => {
                dateSelect.innerHTML += `<option value="${date}">${date}</option>`;
            });
            dateSelect.addEventListener('change', () => this.filterAndRenderTable());
        }

        // Extract unique usernames
        const usernames = [...new Set(data.map(item => item.member?.username).filter(Boolean))];
        usernames.sort((a, b) => a.localeCompare(b));

        const userSelect = this.elements.tableFilterUsername;
        if (userSelect) {
            userSelect.innerHTML = '<option value="">All Users</option>';
            usernames.forEach(username => {
                userSelect.innerHTML += `<option value="${username}">${username}</option>`;
            });
            userSelect.addEventListener('change', () => this.filterAndRenderTable());
        }

        // Setup search listener
        if (this.elements.tableSearch) {
            this.elements.tableSearch.addEventListener('input', () => this.filterAndRenderTable());
        }
    },

    filterAndRenderTable(page = 1) {
        if (!this.allTableData) return;

        let filtered = [...this.allTableData];

        const dateFilter = this.elements.tableFilterDate?.value;
        const userFilter = this.elements.tableFilterUsername?.value;
        const searchTerm = this.elements.tableSearch?.value.toLowerCase();

        if (dateFilter) {
            filtered = filtered.filter(item => item.created_at && item.created_at.startsWith(dateFilter));
        }

        if (userFilter) {
            filtered = filtered.filter(item => item.member && item.member.username === userFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(item => {
                const caption = (item.caption || '').toLowerCase();
                const type = (item.content_type || '').toLowerCase();
                return caption.includes(searchTerm) || type.includes(searchTerm);
            });
        }

        if (this.elements.tableStatsCount) {
            this.elements.tableStatsCount.textContent = filtered.length;
        }

        // Default sort by created_at desc
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        this.renderTable(filtered, page);
    },

    showPostDetail(post) {
        const els = this.elements;
        if (!els.postDetailModal) return;

        // Image / Video
        const thumbUrl = (post.thumbnail && post.thumbnail.length > 0) ? post.thumbnail : post.url;
        els.postDetailImage.src = thumbUrl || 'https://via.placeholder.com/800x600?text=No+Image';

        if (post.content_type === 'video') {
            els.postDetailVideoIcon.classList.remove('hidden');
        } else {
            els.postDetailVideoIcon.classList.add('hidden');
        }

        // Details
        els.postDetailAvatar.src = post.member?.photo || '';
        els.postDetailUsername.textContent = post.member?.username || 'Unknown';
        els.postDetailDate.textContent = post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown Date';

        els.postDetailLikes.textContent = post.likes_count || 0;
        els.postDetailComments.textContent = post.comment_count || 0;
        els.postDetailCaption.textContent = post.caption || 'No caption provided.';

        els.postDetailLink.href = post.url || '#';

        this.openModal(els.postDetailModal);
    },

    renderTable(data, page = 1) {
        const tbody = this.elements.tableBody;
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-400 italic">No entries found.</td></tr>`;
            const controls = document.getElementById('pagination-controls');
            if (controls) controls.innerHTML = '';
            return;
        }

        const itemsPerPage = 10;
        const maxPage = Math.ceil(data.length / itemsPerPage);

        if (page > maxPage) page = maxPage;
        if (page < 1) page = 1;

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.slice(start, end);

        pageData.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-white/5 transition-colors cursor-pointer";
            tr.onclick = (e) => {
                if (e.target.closest('a')) return;
                this.showPostDetail(item);
            };

            const date = new Date(item.created_at).toLocaleDateString();
            const username = item.member?.username || 'Unknown';
            const likes = item.likes_count || 0;
            const comments = item.comment_count || 0;
            const type = item.content_type || 'photo';

            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${date}</td>
                <td class="px-6 py-4 text-white font-medium">${username}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/5">${type}</span>
                </td>
                <td class="px-6 py-4 text-center">${likes}</td>
                <td class="px-6 py-4 text-center">${comments}</td>
                <td class="px-6 py-4 text-right">
                    <button class="text-gray-400 hover:text-white mr-3 transition-colors" title="View Details"><i class="fa-solid fa-eye"></i></button>
                    <a href="${item.url}" target="_blank" class="text-primary hover:text-white transition-colors" title="Open External"><i class="fa-solid fa-external-link-alt"></i></a>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const controls = document.getElementById('pagination-controls');
        if (controls) {
            controls.innerHTML = `
                <span class="text-sm text-gray-500">Page ${page} of ${maxPage} (${data.length} total)</span>
                <div class="flex gap-2">
                    <button ${page <= 1 ? 'disabled' : ''} onclick="UI.filterAndRenderTable(${page - 1})" class="px-3 py-1 bg-white/5 text-sm rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
                    <button ${page >= maxPage ? 'disabled' : ''} onclick="UI.filterAndRenderTable(${page + 1})" class="px-3 py-1 bg-white/5 text-sm rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
            `;
        }
    },

    updateTabStyles(activeView) {
        const { tabDashboard, tabGallery } = this.elements;
        if (!tabDashboard || !tabGallery) return;

        if (activeView === 'dashboard') {
            tabDashboard.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg transition-all flex items-center gap-1.5 shadow-md";
            tabGallery.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5";
        } else if (activeView === 'gallery') {
            tabGallery.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg transition-all flex items-center gap-1.5 shadow-md";
            tabDashboard.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5";
        } else {
            tabDashboard.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5";
            tabGallery.className = "px-3 md:px-4 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5";
        }
    },

    initGallery() {
        const { gallerySearch, galleryFilterUser, galleryFilterType, gallerySort, galleryClearFilters } = this.elements;

        if (!gallerySearch) return;

        const handleFilterChange = () => {
            this.filterAndRenderGallery();
        };

        gallerySearch.addEventListener('input', handleFilterChange);
        galleryFilterUser.addEventListener('change', handleFilterChange);
        galleryFilterType.addEventListener('change', handleFilterChange);
        gallerySort.addEventListener('change', handleFilterChange);

        galleryClearFilters.addEventListener('click', () => {
            gallerySearch.value = '';
            galleryFilterUser.value = '';
            galleryFilterType.value = '';
            gallerySort.value = 'newest';
            this.filterAndRenderGallery();
        });
    },

    populateGalleryUserFilter(data) {
        const userSelect = this.elements.galleryFilterUser;
        if (!userSelect) return;

        // Extract unique usernames
        const usernames = [...new Set(data.map(item => item.member?.username).filter(Boolean))];
        usernames.sort((a, b) => a.localeCompare(b));

        userSelect.innerHTML = '<option value="" class="bg-dark-light">All Creators</option>';
        usernames.forEach(username => {
            const opt = document.createElement('option');
            opt.value = username;
            opt.className = 'bg-dark-light';
            opt.textContent = username;
            userSelect.appendChild(opt);
        });
    },

    filterAndRenderGallery(data) {
        const rawData = data || window.currentData;
        if (!rawData) return;

        const { gallerySearch, galleryFilterUser, galleryFilterType, gallerySort, galleryGrid, galleryEmptyState, galleryStatsTotal, galleryStatsFiltered } = this.elements;

        if (!galleryGrid) return;

        let filtered = [...rawData];

        // 1. Text Search Filter
        const searchVal = gallerySearch.value.trim().toLowerCase();
        if (searchVal) {
            filtered = filtered.filter(item => {
                const caption = (item.caption || '').toLowerCase();
                const username = (item.member?.username || '').toLowerCase();
                const type = (item.content_type || '').toLowerCase();
                return caption.includes(searchVal) || username.includes(searchVal) || type.includes(searchVal);
            });
        }

        // 2. User Filter
        const userVal = galleryFilterUser.value;
        if (userVal) {
            filtered = filtered.filter(item => item.member?.username === userVal);
        }

        // 3. Content Type Filter
        const typeVal = galleryFilterType.value;
        if (typeVal) {
            filtered = filtered.filter(item => item.content_type === typeVal);
        }

        // 4. Sorting
        const sortVal = gallerySort.value;
        filtered.sort((a, b) => {
            if (sortVal === 'oldest') {
                return new Date(a.created_at) - new Date(b.created_at);
            } else if (sortVal === 'likes') {
                return (b.likes_count || 0) - (a.likes_count || 0);
            } else if (sortVal === 'comments') {
                return (b.comment_count || 0) - (a.comment_count || 0);
            } else { // default: newest
                return new Date(b.created_at) - new Date(a.created_at);
            }
        });

        // 5. Update Stats
        if (galleryStatsTotal) galleryStatsTotal.textContent = rawData.length;
        if (galleryStatsFiltered) galleryStatsFiltered.textContent = filtered.length;

        // 6. Render
        galleryGrid.innerHTML = '';

        if (filtered.length === 0) {
            galleryEmptyState.classList.remove('hidden');
            return;
        } else {
            galleryEmptyState.classList.add('hidden');
        }

        // Setup IntersectionObserver for lazy loading
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    // Remove skeleton background class once loaded
                    img.onload = () => {
                        img.classList.remove('opacity-0');
                        const skeleton = img.previousElementSibling;
                        if (skeleton && skeleton.classList.contains('animate-shimmer')) {
                            skeleton.classList.add('opacity-0');
                            setTimeout(() => skeleton.remove(), 500);
                        }
                    };
                    obs.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px', // start loading slightly before they scroll into view
            threshold: 0.01
        });

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = "group relative bg-white/5 border border-white/5 hover:border-primary/40 rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between";
            
            const thumbUrl = (post.thumbnail && post.thumbnail.length > 0) ? post.thumbnail : post.url;
            const avatarUrl = post.member?.photo || '';
            const username = post.member?.username || 'Unknown';
            const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown Date';
            const likes = post.likes_count || 0;
            const comments = post.comment_count || 0;
            const caption = post.caption || '';
            
            const isVideo = post.content_type === 'video';
            const badgeHtml = isVideo 
                ? `<div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-bold z-30 flex items-center gap-1 shadow-lg"><i class="fa-solid fa-video text-[8px]"></i> Video</div>`
                : `<div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-bold z-30 flex items-center gap-1 shadow-lg"><i class="fa-solid fa-camera text-[8px]"></i> Image</div>`;

            card.innerHTML = `
                <!-- Shimmer Skeleton Preloader -->
                <div class="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer z-0 transition-opacity duration-500"></div>
                
                <!-- Lazy Loaded Image -->
                <img data-src="${thumbUrl}" class="w-full h-full object-cover opacity-0 transition-opacity duration-500 z-10" alt="${caption}">
                
                <!-- Media Type Badge -->
                ${badgeHtml}

                <!-- Glassmorphic Details Overlay (shows on hover) -->
                <div class="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 p-4 flex flex-col justify-between">
                    <!-- Top Part: Member avatar & username -->
                    <div class="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        ${avatarUrl 
                            ? `<img src="${avatarUrl}" class="w-6 h-6 rounded-full border border-white/20 object-cover" onerror="this.src='https://via.placeholder.com/24'">`
                            : `<div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">${username.substring(0, 2).toUpperCase()}</div>`
                        }
                        <span class="text-xs text-white font-semibold truncate max-w-[120px]">${username}</span>
                    </div>

                    <!-- Bottom Part: Description, Divider, and Stats -->
                    <div class="space-y-2.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <!-- Caption Text (two lines maximum) -->
                        <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed font-normal">${caption || 'No caption'}</p>
                        
                        <!-- Divider Line -->
                        <div class="border-t border-white/10"></div>
                        
                        <!-- Engagement & Date Footer -->
                        <div class="flex justify-between items-center text-[10px] text-gray-400">
                            <span class="font-medium flex items-center gap-1"><i class="fa-regular fa-calendar text-[9px]"></i> ${dateStr}</span>
                            <div class="flex items-center gap-2.5 font-bold text-white">
                                <span class="flex items-center gap-1"><i class="fa-solid fa-heart text-red-500 text-[9px]"></i> ${likes}</span>
                                <span class="flex items-center gap-1"><i class="fa-solid fa-comment text-blue-400 text-[9px]"></i> ${comments}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Click event to show detailed modal
            card.onclick = () => {
                this.showPostDetail(post);
            };

            const img = card.querySelector('img');
            observer.observe(img);

            galleryGrid.appendChild(card);
        });
    }
};

UI.init();
