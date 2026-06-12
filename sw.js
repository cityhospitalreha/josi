// ============================================================
// サービスワーカー（オフラインでもアプリを開けるようにする仕組み）
// ============================================================

// キャッシュ（端末に保存するデータ）の名前。
// アプリを更新したときは、この末尾の数字を増やすと、
// 古いキャッシュが自動で削除されて新しい内容に更新されます。
const CACHE_NAME = "joshi-training-cache-v1";

// 保存しておくファイルの一覧
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

// ① インストール時：必要なファイルをまとめて保存する
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ② 有効化時：古いバージョンのキャッシュを削除する
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ③ ファイル取得時：保存済みがあればそれを使い、なければネットから取得する
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
