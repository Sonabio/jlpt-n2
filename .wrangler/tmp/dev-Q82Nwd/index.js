var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-x8fm5j/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init2) {
  const request = new Request(input, init2);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// worker/index.js
var REPORT_HASH = "072d55652a81b1b6b93460e12e54198d6069e0c3b28483f347937f5bd944e69e";
var PAIR_TTL = 10 * 60 * 1e3;
var MAX_DATA = 18e5;
var ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
var json = /* @__PURE__ */ __name((o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }), "json");
var err = /* @__PURE__ */ __name((code, msg, status) => json({ error: code, message: msg }, status), "err");
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(sha, "sha");
function randKey() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(randKey, "randKey");
function randCode(n) {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => ALPHA[x % ALPHA.length]).join("");
}
__name(randCode, "randCode");
var ready = false;
async function init(db) {
  if (ready) return;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS space (id TEXT PRIMARY KEY, data TEXT, upd INTEGER DEFAULT 0, rev INTEGER DEFAULT 0, summary TEXT, recovery TEXT, created_at INTEGER, updated_at INTEGER)"),
    db.prepare("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)"),
    db.prepare("CREATE TABLE IF NOT EXISTS pair (code TEXT PRIMARY KEY, k TEXT, exp INTEGER)")
  ]);
  ready = true;
}
__name(init, "init");
async function auth(req, db) {
  const h = req.headers.get("authorization") || "";
  const key = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (key.length < 20) return null;
  const id = await sha(key);
  const row = await db.prepare("SELECT id, upd, rev, updated_at FROM space WHERE id = ?").bind(id).first();
  return row ? { id, key, row } : null;
}
__name(auth, "auth");
async function body(req) {
  try {
    return await req.json();
  } catch (e) {
    return {};
  }
}
__name(body, "body");
async function api(req, env, url) {
  const db = env.DB;
  if (!db) return err("no_db", "Ch\u01B0a g\u1EAFn database D1", 500);
  await init(db);
  const p = url.pathname, m = req.method;
  if (p === "/api/status" && m === "GET") {
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    return json({ ok: true, hasOwner: !!owner });
  }
  if (p === "/api/space/init" && m === "POST") {
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    if (owner) return err("exists", "\u0110\xE3 c\xF3 d\u1EEF li\u1EC7u \u0111\u1ED3ng b\u1ED9. H\xE3y gh\xE9p m\xE1y n\xE0y b\u1EB1ng m\xE3 t\u1EEB m\xE1y \u0111\xE3 k\u1EBFt n\u1ED1i, ho\u1EB7c d\xF9ng m\xE3 kh\xF4i ph\u1EE5c.", 409);
    const key = randKey(), recovery = randCode(4) + "-" + randCode(4) + "-" + randCode(4) + "-" + randCode(4);
    const id = await sha(key), now = Date.now();
    await db.batch([
      db.prepare("INSERT INTO space (id, data, upd, rev, recovery, created_at, updated_at) VALUES (?, NULL, 0, 0, ?, ?, ?)").bind(id, await sha(recovery.replace(/-/g, "")), now, now),
      db.prepare("INSERT INTO meta (k, v) VALUES ('owner', ?)").bind(id)
    ]);
    return json({ key, recovery });
  }
  if (p === "/api/space/recover" && m === "POST") {
    const b = await body(req);
    const code = String(b.recovery || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length < 16) return err("bad_code", "M\xE3 kh\xF4i ph\u1EE5c kh\xF4ng \u0111\xFAng.", 400);
    const row = await db.prepare("SELECT id FROM space WHERE recovery = ?").bind(await sha(code)).first();
    if (!row) return err("bad_code", "M\xE3 kh\xF4i ph\u1EE5c kh\xF4ng \u0111\xFAng.", 403);
    return rotate(db, row.id);
  }
  if (p === "/api/pair/claim" && m === "POST") {
    const b = await body(req);
    const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    await db.prepare("DELETE FROM pair WHERE exp < ?").bind(Date.now()).run();
    const row = code.length === 8 ? await db.prepare("SELECT k FROM pair WHERE code = ?").bind(code).first() : null;
    if (!row) return err("bad_code", "M\xE3 gh\xE9p sai ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n (10 ph\xFAt). T\u1EA1o m\xE3 m\u1EDBi tr\xEAn m\xE1y \u0111\xE3 k\u1EBFt n\u1ED1i.", 403);
    await db.prepare("DELETE FROM pair WHERE code = ?").bind(code).run();
    return json({ key: row.k });
  }
  if (p.startsWith("/api/report/") && m === "GET") {
    const tok = p.slice("/api/report/".length);
    if (!tok || await sha(tok) !== REPORT_HASH) return err("forbidden", "Sai m\xE3 b\xE1o c\xE1o.", 403);
    const owner = await db.prepare("SELECT v FROM meta WHERE k = 'owner'").first();
    const row = owner ? await db.prepare("SELECT summary, updated_at, rev FROM space WHERE id = ?").bind(owner.v).first() : null;
    if (!row) return err("empty", "Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u.", 404);
    return json({ lastSync: row.updated_at ? new Date(row.updated_at).toISOString() : null, rev: row.rev, summary: row.summary ? JSON.parse(row.summary) : null });
  }
  const a = await auth(req, db);
  if (!a) return err("unauthorized", "M\xE1y n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c gh\xE9p ho\u1EB7c kh\xF3a \u0111\xE3 b\u1ECB \u0111\u1ED5i. H\xE3y gh\xE9p l\u1EA1i.", 401);
  if (p === "/api/sync" && m === "GET") {
    const row = await db.prepare("SELECT data, upd, rev FROM space WHERE id = ?").bind(a.id).first();
    return json({ data: row.data, upd: row.upd, rev: row.rev });
  }
  if (p === "/api/sync" && m === "PUT") {
    const b = await body(req);
    if (typeof b.data !== "string" || b.data.length > MAX_DATA) return err("too_large", "D\u1EEF li\u1EC7u qu\xE1 l\u1EDBn.", 413);
    const base = Number(b.baseRev) || 0, now = Date.now();
    const r = await db.prepare("UPDATE space SET data = ?, upd = ?, rev = rev + 1, summary = COALESCE(?, summary), updated_at = ? WHERE id = ? AND rev = ?").bind(b.data, Number(b.upd) || now, b.summary ? JSON.stringify(b.summary).slice(0, 2e5) : null, now, a.id, base).run();
    if (!r.meta || !r.meta.changes) {
      const cur = await db.prepare("SELECT rev FROM space WHERE id = ?").bind(a.id).first();
      return json({ error: "conflict", message: "C\xF3 d\u1EEF li\u1EC7u m\u1EDBi h\u01A1n t\u1EEB m\xE1y kh\xE1c.", rev: cur ? cur.rev : 0 }, 409);
    }
    return json({ ok: true, rev: base + 1 });
  }
  if (p === "/api/pair/create" && m === "POST") {
    await db.prepare("DELETE FROM pair WHERE exp < ?").bind(Date.now()).run();
    const code = randCode(8), exp = Date.now() + PAIR_TTL;
    await db.prepare("INSERT INTO pair (code, k, exp) VALUES (?, ?, ?)").bind(code, a.key, exp).run();
    return json({ code: code.slice(0, 4) + "-" + code.slice(4), exp });
  }
  if (p === "/api/space/rotate" && m === "POST") return rotate(db, a.id);
  return err("not_found", "Kh\xF4ng c\xF3 API n\xE0y.", 404);
}
__name(api, "api");
async function rotate(db, oldId) {
  const key = randKey(), id = await sha(key);
  await db.batch([
    db.prepare("UPDATE space SET id = ?, updated_at = ? WHERE id = ?").bind(id, Date.now(), oldId),
    db.prepare("UPDATE meta SET v = ? WHERE k = 'owner' AND v = ?").bind(id, oldId),
    db.prepare("DELETE FROM pair")
  ]);
  return json({ key });
}
__name(rotate, "rotate");
var worker_default = {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(req, env, url);
      } catch (e) {
        return err("server", "L\u1ED7i m\xE1y ch\u1EE7: " + (e && e.message || e), 500);
      }
    }
    return env.ASSETS.fetch(req);
  }
};

// ../../../tmp/claude-0/-home-claude/770378e2-c447-5d77-8015-e9fda95687c4/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../tmp/claude-0/-home-claude/770378e2-c447-5d77-8015-e9fda95687c4/scratchpad/wr/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-x8fm5j/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../tmp/claude-0/-home-claude/770378e2-c447-5d77-8015-e9fda95687c4/scratchpad/wr/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-x8fm5j/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
