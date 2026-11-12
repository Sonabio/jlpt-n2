/* ===== BOOT ===== */
handlePairHash(); readHash(); render();
const CF_ON = CF.start();
if (!CF_ON) CF.status().then(() => { if (route === 'plan') render(); });
// Nội dung + danh sách file nằm trên máy (IndexedDB): đọc xong thì vẽ lại
Promise.all([loadContentDB(), localFilesLoad()]).then(([changed, lf]) => {
  if (changed || lf.size) { if (!busyView()) render(); }
  if (lf.size) askPersist();
  if (CF_ON && !Object.keys(CS).length) fetchContent().then(ok => { if (ok) render(); });
});
