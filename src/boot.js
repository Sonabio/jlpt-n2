/* ===== BOOT ===== */
handlePairHash(); readHash(); render();
if (!CF.start()) CF.status().then(() => { if (route === 'plan') render(); });
else if (!C) fetchContent().then(ok => { if (ok) render(); });
