/* ===== LƯU TRÊN MÁY (offline): IndexedDB =====
   Kho 'content': slot → nội dung bài tập (thay cho localStorage, vì localStorage chỉ ~5 MB)
   Kho 'files'  : id → { b: Blob, type, size, at }  (file nghe + PDF đề, nhập từ thư mục trên laptop) */
const DB = {
  name: 'jlpt-local', ver: 1, p: null,
  open() {
    if (this.p) return this.p;
    this.p = new Promise((res, rej) => {
      if (!('indexedDB' in window)) return rej(new Error('Trình duyệt này không lưu được dữ liệu lớn'));
      const r = indexedDB.open(this.name, this.ver);
      r.onupgradeneeded = () => { const d = r.result; ['content', 'files'].forEach(s => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s); }); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    this.p.catch(() => { this.p = null; });
    return this.p;
  },
  async run(store, mode, fn) {
    const d = await this.open();
    return new Promise((res, rej) => {
      const t = d.transaction(store, mode), req = fn(t.objectStore(store));
      t.oncomplete = () => res(req ? req.result : undefined);
      t.onerror = t.onabort = () => rej(t.error || new Error('Lỗi lưu dữ liệu'));
    });
  },
  get(store, k) { return this.run(store, 'readonly', s => s.get(k)); },
  put(store, k, v) { return this.run(store, 'readwrite', s => s.put(v, k)); },
  del(store, k) { return this.run(store, 'readwrite', s => s.delete(k)); },
  keys(store) { return this.run(store, 'readonly', s => s.getAllKeys()); },
  clear(store) { return this.run(store, 'readwrite', s => s.clear()); },
};

let LF = new Set();            // id các file (nghe/đề) đang có trên máy này
async function localFilesLoad() { try { LF = new Set(await DB.keys('files')); } catch (e) { } return LF; }
async function fileGet(id) { try { const v = await DB.get('files', id); return v ? v.b : null; } catch (e) { return null; } }
async function filePut(id, blob, type) { await DB.put('files', id, { b: blob, type, size: blob.size, at: Date.now() }); LF.add(id); }
const MURL = {};               // id → blob: URL (tạo một lần, dùng lại)
function blobUrl(id, b) { return MURL[id] || (MURL[id] = URL.createObjectURL(b)); }

/* Xin trình duyệt giữ dữ liệu lâu dài (không tự xóa khi máy đầy) */
async function askPersist() { try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch (e) { } }
async function storageInfo() {
  const o = { used: 0, quota: 0, persisted: false };
  try { if (navigator.storage) { const e = await navigator.storage.estimate(); o.used = e.usage || 0; o.quota = e.quota || 0; o.persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false; } } catch (e) { }
  return o;
}
const fmtMB = b => (b / 1048576).toFixed(b > 1048576 * 100 ? 0 : 1) + ' MB';
