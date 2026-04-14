#!/usr/bin/env bash
set -euo pipefail

DOMAIN="sell.onfire.so"
SERVER_IP="65.109.160.82"
REMOTE_PATH="/data/websites/sell.onfire.so"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CF_ZONE_ID="71124bc5d0e997456b79ee953f1da026"
CF_API_TOKEN="GFXMW8jPcZZZ69c2UMCnkWOM-U_od-OoAwJWKjFm"

echo "=== Deploying ${DOMAIN} ==="

echo "[1/4] Creating Cloudflare DNS A record for ${DOMAIN} -> ${SERVER_IP}..."
EXISTING=$(curl -s "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?name=${DOMAIN}&type=A" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json")

RECORD_COUNT=$(echo "$EXISTING" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('result',[])))" 2>/dev/null || echo "0")

if [ "$RECORD_COUNT" -gt "0" ]; then
  echo "  DNS record already exists, updating..."
  RECORD_ID=$(echo "$EXISTING" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
  curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${RECORD_ID}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"${DOMAIN}\",\"content\":\"${SERVER_IP}\",\"ttl\":1,\"proxied\":false}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print('  OK' if r.get('success') else f'  FAILED: {r}')"
else
  echo "  Creating new DNS record..."
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"${DOMAIN}\",\"content\":\"${SERVER_IP}\",\"ttl\":1,\"proxied\":false}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print('  OK' if r.get('success') else f'  FAILED: {r}')"
fi

echo "[2/4] Copying files to hetzner-websites:${REMOTE_PATH}..."
ssh hetzner-websites "mkdir -p ${REMOTE_PATH}/public"
scp "${SCRIPT_DIR}/docker-compose.yml" "hetzner-websites:${REMOTE_PATH}/docker-compose.yml"
scp "${SCRIPT_DIR}/nginx.conf" "hetzner-websites:${REMOTE_PATH}/nginx.conf"
scp -r "${SCRIPT_DIR}/public/" "hetzner-websites:${REMOTE_PATH}/public/"

echo "[3/4] Starting Docker container..."
ssh hetzner-websites "cd ${REMOTE_PATH} && docker compose up -d"

echo "[4/4] Deployment complete!"
echo ""
echo "  URL: https://${DOMAIN}"
echo "  Note: SSL auto-provisioned by Traefik/LetsEncrypt (1-2 min on first deploy)."
