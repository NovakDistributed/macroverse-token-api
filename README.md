# Macroverse Token API

This repo implements an API for serving Macroverse token metadata using serverless [Cloudflare workers](https://workers.cloudflare.com/).

Make a request to `https://api.macroverse.io/vre/v1/chain/<chain ID in decimal>/token/<token in decimal>` and receive an [ERC721 metadata API](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md#specification) response, with some [OpenSea extensions](https://docs.opensea.io/docs/metadata-standards#section-metadata-structure) available.

## Example Usage

For example (using [`jq`](https://stedolan.github.io/jq/) to pretty-print):

```
curl https://api.macroverse.io/vre/v1/chain/4/token/1770887488800634701954 | jq
```

```
{
  "name": "Macroverse Planet",
  "description": "A deed representing ownership of the 4th planet or asteroid belt orbiting the 1st star or stellar-equivalent object in sector <68, 75, 420> of the Macroverse world on the Rinkeby testnet.",
  "image": "https://macroverse.io/img/logo-big.png",
  "external_url": "https://novakdistributed.github.io/macroverse-explorer/#68.75.420.0.3"
}
```

## Development and Deployment

You need to have Cloudflare's [`wrangler` tool](https://github.com/cloudflare/wrangler) to deploy.

For development, with Wrangler 1.8+, you can do:

```
wrangler dev
```

Then you can access the API on `http://localhost:8787/vre/v1/chain/<chain ID in decimal>/token/<token in decimal>`.

For deployment, set the `CF_API_TOKEN` environment variable to an API token on the account specified by `account_id` in `wrangler.toml`, and make sure that `zone_id` refers to a Cloudflare zone (i.e. web site) in that account, and `route` refers to a route on a domain in that zone.

Then run:

```
wrangler deploy
```
