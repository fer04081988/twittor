//imporrts
importScripts('js/sw-util.js');

const CACHE_STATIC_NAME = 'ITK_cache_estatico-v3';
const CACHE_DYNAMIC_NAME = 'ITK_cache_dinamico';
const CACHE_INMUTABLE_NAME = 'ITK_cache_inmutable';

const APP_SELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-util.js'
]

const APP_SELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    const cacheStatic = caches.open(CACHE_STATIC_NAME)
        .then(cache => cache.addAll(APP_SELL));

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => cache.addAll(APP_SELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {

    //Borrado de versiones anteriores
    const respuestaBorrado = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC_NAME && key.includes('estatico')) {
                return caches.delete(key)
            }

            if (key !== CACHE_DYNAMIC_NAME && key.includes('dinamico')) {
                return caches.delete(key)
            }
        });
    });

    e.waitUntil(respuestaBorrado);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newRes => {
                return actualizaCacheDinamico(CACHE_DYNAMIC_NAME, e.request, newRes);
            });
            
        }
    });
    e.respondWith(respuesta);
});