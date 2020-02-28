const mv = require('macroverse')

// This defines the URL pattern we match and how to extract the parameters.
const URL_PATTERN = /^https?:\/\/[^\/]+\/vre\/v1\/chain\/([0-9]+)\/token\/([0-9]+)$/

addEventListener('fetch', (e) => {
  // The request is e.request
  e.respondWith(handle(e.request))
})

// Format a number as an ordinal (1st, 23rd, etc.)
function ordinal(i) {
  let baseNumber = i.toString()
  let suffix = undefined
  switch(baseNumber[baseNumber.length - 1]) {
  case '1':
    suffix = 'st'
    break
  case '2':
    suffix = 'nd'
    break
  case '3':
    suffix = 'rd'
    break
  default:
    suffix = 'th'
    break
  }

  return baseNumber + suffix
}

// Capitalize the first letter of a string
function capitalize(s) {
  return s[0].toUpperCase() + s.substring(1)
}

async function handle(request) {
  // Parse the URL. It's not a real URL object on Cloudflare; it is just a string.
  console.log(request.url)
  console.log(JSON.stringify(request.url))
  let match = request.url.match(URL_PATTERN)
  if (!match) {
    return new Response('URL path must be /vre/v1/chain/<network id in decimal>/token/<token in decimal>\n', { status: 400 })
  }

  // Check the chain ID 
  let chain = match[1]
  
  // Parse the token into a keypath. It automatically gets bignumber'd
  let keypath = mv.tokenToKeypath(match[2])

  // Figure out what it is
  let parts = keypath.split('.')

  // Find all the coordinates
  let sectorX = parts[0]
  let sectorY = parts[1]
  let sectorZ = parts[2]
  let system = parts.length > 3 ? parts[3] : undefined
  let planet = parts.length > 4 ? parts[4] : undefined
  let moon = parts.length > 5 ? parts[5] : undefined
  let landSpec = parts.length > 6 ? parts.slice(6) : undefined

  // Compose a description of where this is.
  descriptors = ['A deed representing ownership of']
  
  // And work out a definite type
  let type = undefined

  if (landSpec) {
    // TODO: describe the land better
    descriptors.push('a plot of land')
    descriptors.push('on')

    if (!type) {
      type = 'Land'
    }
  }
  if (moon) {
    if (moon == '-1' && !landSpec) {
      return new Response('Moon -1 cannot exist\n', { status: 400 })
    }
    descriptors.push('the')
    descriptors.push(ordinal(parseInt(moon) + 1))
    descriptors.push('moon or ring system of')

    if (!type) {
      type = 'Moon'
    }
  }
  if (planet) {
    descriptors.push('the')
    descriptors.push(ordinal(parseInt(planet) + 1))
    descriptors.push('planet')
    if (!moon) {
      // If moon isn't set or -1 for land, this may be an asteroid belt
      descriptors.push('or asteroid belt')
    }
    descriptors.push('orbiting')

    if (!type) {
      type = 'Planet'
    }
  }
  if (system) {
    descriptors.push('the')
    descriptors.push(ordinal(parseInt(system) + 1))
    descriptors.push('star or stellar-equivalent object in')
    
    if (!type) {
      type = 'Star System'
    }
  } else {
    return new Response('Sector tokens cannot exist\n', { status: 400 })
  }
  descriptors.push('sector (' + sectorX + ', ' + sectorY + ', ' + sectorZ + ') of the Macroverse world')

  if (chain == '4') {
    descriptors.push('on the Rinkeby testnet')
  }

  // Compose the metadata object
  metadata = {
    'name': 'Macroverse ' + type + ' ' + keypath,
    'description': capitalize(descriptors.join(' ')) + '.',
    'image': 'https://macroverse.io/img/logo-big.png',
    'external_url': 'https://novakdistributed.github.io/macroverse-explorer/#' + keypath, 
  }

  // Serialize and send
  return new Response(JSON.stringify(metadata) + '\n', {
    headers: {'content-type': 'text/json'}
  })
}
