/* ===== BOOT ===== */
handlePairHash(); readHash(); render();
if (!CF.start()) CF.status().then(() => { if (route === 'plan') render(); });
else if (!Object.keys(CS).length) fetchContent().then(ok => { if (ok) render(); });
