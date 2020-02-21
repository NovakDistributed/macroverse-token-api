const mv = require('macroverse')

// This defines the URL pattern we match and how to extract the parameters.
const URL_PATTERN = /^https?:\/\/[^\/]+\/vre\/v1\/net\/([0-9]+)\/token\/([0-9]+)$/

addEventListener('fetch', (e) => {
  // The request is e.request
  e.respondWith(handle(e.request))
})


async function handle(request) {
  // Parse the URL. It's not a real URL object on Cloudflare; it is just a string.
  console.log(request.url)
  console.log(JSON.stringify(request.url))
  let match = request.url.match(URL_PATTERN)
  if (!match) {
    return new Response('URL path must be /vre/v1/net/<network id in decimal>/token/<token in decimal>\n', { status: 400 })
  }

  // Check the network 
  let network = match[1]
  // TODO: for now we say the same thing regardless of network.
  
  // Parse the token into a keypath. It automatically gets bignumber'd
  let keypath = mv.tokenToKeypath(match[2])

  return new Response('Macroverse token ' + keypath + '\n', {
    headers: {'content-type': 'text/plain'}
  })
}
