const adminPageStyles = `
  .admin-page { width: 100%; overflow-x: hidden; }
  .admin-page * { box-sizing: border-box; }
  .admin-page .dashboard-card, .admin-page .admin-table, .admin-page .kpi-card,
  .admin-page .dashboard-panel, .admin-page .live-donor-bar { border-radius: 16px; }
  .admin-page .dashboard-panel, .admin-page .dashboard-card {
    border-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .admin-page .dashboard-panel:hover {
    border-color: rgba(45, 212, 191, 0.45);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }
  .admin-page input, .admin-page select, .admin-page textarea {
    box-shadow: 0 4px 14px rgba(2, 6, 23, 0.06);
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    border-radius: 0.75rem;
    min-height: 44px;
  }
  .admin-page select {
    appearance: none;
    min-width: 150px;
    padding-right: 2.5rem;
    background-color: rgba(255, 255, 255, 0.85);
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.8rem center;
    background-size: 18px;
  }
  .admin-page .kpi-card {
    cursor: pointer;
    min-height: 148px;
    background: rgba(255, 255, 255, 0.52);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-color: rgba(255, 255, 255, 0.85);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
  }
  .admin-page .kpi-card:hover {
    border-color: rgba(45, 212, 191, 0.65);
    box-shadow: 0 16px 32px rgba(15, 118, 110, 0.12);
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.82);
  }
  .admin-page .live-donor-bar {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .admin-page .security-kpi-card:hover {
    border-color: #99f6e4;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.1);
  }
  .admin-page tbody tr { transition: background-color 0.18s ease; }
  .admin-page tbody tr:hover { background: #f8fafc; box-shadow: inset 3px 0 0 #0f766e; }
  .admin-page .admin-table thead th {
    white-space: nowrap;
    letter-spacing: 0.02em;
    color: #64748b;
    font-weight: 800;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #f8fafc;
  }
  .admin-page .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .admin-page .dashboard-home-wrap { min-height: 0; width: 100%; }
  .admin-content-area { width: 100%; max-width: none; }
  .admin-page section.rounded-lg {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  }
`;

export default adminPageStyles;
