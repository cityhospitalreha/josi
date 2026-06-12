// キャッシュ（保存領域）の名前とバージョン
// バージョンを変えると古いキャッシュが自動で削除されます
const CACHE_NAME = 'joshi-training-v1';

// キャッシュしておくファイルの一覧
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ===== インストール時：ファイルをキャッシュに保存 =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // 新しいSWをすぐに有効にする
  self.skipWaiting();
});

// ===== アクティベート時：古いキャッシュを削除 =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ===== ネットワーク要求の処理 =====
// 戦略：キャッシュ優先（オフラインでも動く）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返す、なければネットから取得
      return response || fetch(event.request);
    })
  );
});
