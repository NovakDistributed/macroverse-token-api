const RESPONSE_OPTIONS = {
  headers: {'content-type': 'text/plain'}
}

addEventListener('fetch', (e) => {
  // The request is e.request
  e.respondWith(new Response('', RESPONSE_OPTIONS))
})
