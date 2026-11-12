/* ===== SAO LƯU THỦ CÔNG: xuất tiến độ ra file, nhập lại = GỘP (không ghi đè) =====
   File: { app:'jlpt-n2', kind:'backup', v:1, at, from, state:S }. Không chứa tài liệu khóa học. */
const BAK_KEY = 'jlpt-n2-lastbak';                     // lần xuất gần nhất trên máy này (không đồng bộ)
const lastBak = () => { try { return +localStorage.getItem(BAK_KEY) || 0; } catch (e) { return 0; } };
const hasProgress = () => Object.keys(S.att).length + Object.keys(S.phr).length + (S.exams || []).length > 0;
const needBackup = () => hasProgress() && Date.now() - lastBak() > 7 * 864e5;
function backupCounts(st) { const n = Object.values(st.att || {}).reduce((a, x) => a + x.length, 0); return { att: n, items: Object.keys(st.att || {}).length, phr: Object.keys(st.phr || {}).length, exams: (st.exams || []).length }; }

function backupExport() {
  const data = { app: 'jlpt-n2', kind: 'backup', v: 1, at: Date.now(), from: devName(), state: S };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `jlpt-backup-${dayKey()}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  try { localStorage.setItem(BAK_KEY, String(Date.now())); } catch (e) { }
  const c = backupCounts(S); toast(`Đã xuất: ${c.att} lần làm, ${c.phr} thẻ, ${c.exams} bài thi`); render();
}
async function backupImport(file) {
  try {
    const b = JSON.parse(await file.text());
    if (!b || b.app !== 'jlpt-n2' || b.kind !== 'backup' || !b.state || typeof b.state.att !== 'object') throw new Error('Đây không phải file sao lưu của app này');
    const before = backupCounts(S);
    S = mergeState(S, b.state); save();
    const after = backupCounts(S);
    toast(`Đã gộp: thêm ${after.att - before.att} lần làm, ${after.phr - before.phr} thẻ, ${after.exams - before.exams} bài thi`);
    render();
  } catch (e) { toast('Không nhập được: ' + (e.message || e)); }
}
function backupUI() {
  const lb = lastBak(), c = backupCounts(S);
  return `<div class="gist">
    <p class="hint">Trên máy này: ${c.att} lần làm (${c.items} câu), ${c.phr} thẻ cụm từ, ${c.exams} bài thi. Lần xuất gần nhất: <b>${lb ? fmtDate(new Date(lb)) : 'chưa xuất lần nào'}</b>.</p>
    <div class="row"><button class="btn ${needBackup() ? 'pri' : ''}" data-a="bakOut">Xuất file sao lưu</button>
    <label class="btn ghost">Nhập file sao lưu…<input type="file" accept=".json,application/json" hidden data-a="bakIn"></label></div>
    <p class="hint">File chỉ chứa tiến độ (không có đề, file nghe). Nhập là <b>gộp</b> với dữ liệu đang có, nhập lại nhiều lần không bị trùng. Nên xuất mỗi tuần và cất vào Google Drive/OneDrive.</p>
  </div>`;
}
function backupNudge() {
  if (!needBackup()) return '';
  const lb = lastBak();
  return `<section class="panel"><div class="ph"><h2>Nên sao lưu</h2></div><p class="hint">${lb ? `Đã ${Math.floor((Date.now() - lb) / 864e5)} ngày chưa xuất file sao lưu.` : 'Bạn chưa xuất file sao lưu lần nào.'}</p><div class="row"><button class="btn pri" data-a="bakOut">Xuất file sao lưu</button></div></section>`;
}
Object.assign(ACT, {
  bakOut() { backupExport(); },
  bakIn(t) { if (t.files && t.files[0]) backupImport(t.files[0]); t.value = ''; },
});
