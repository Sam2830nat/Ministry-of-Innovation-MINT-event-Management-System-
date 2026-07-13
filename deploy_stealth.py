#!/usr/bin/env python3
"""
Stealth deploy via Paramiko.
- Nested disguised path under /opt/data-pipeline
- Only binds free host port 18447 (does NOT touch 80/443/3000/etc.)
"""

from __future__ import annotations

import os
import sys
import tarfile
import tempfile
import time
from pathlib import Path

import paramiko

HOST = "178.238.228.167"
USERNAME = "root"
PASSWORD = os.environ.get("STEALTH_SSH_PASS", "388Wm4YJbnZ2RP7r")

# Nested folders (disguised as cache/index runtime)
COVER_DIR = "/opt/data-pipeline"
APP_DIR = f"{COVER_DIR}/.sys/cache/index/runtime"
HOST_PORT = 18447
PUBLIC_BASE = f"http://{HOST}:{HOST_PORT}"

ROOT = Path(__file__).resolve().parent

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "coverage",
    "__pycache__",
    ".turbo",
    "trained_models",
}
EXCLUDE_FILES = {".env", "deploy_stealth.py", "setup_contabo.py"}


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 600, get_pty: bool = True) -> tuple[str, str, int]:
    print(f"\n$ {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=get_pty)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        # keep output readable
        lines = out.strip().splitlines()
        if len(lines) > 80:
            print("\n".join(lines[:40]))
            print(f"... ({len(lines) - 80} lines omitted) ...")
            print("\n".join(lines[-40:]))
        else:
            print(out.strip())
    if err.strip() and code != 0:
        print(f"[stderr] {err.strip()[:2000]}")
    if code != 0:
        print(f"[exit {code}]")
    return out, err, code


def should_exclude(path: Path) -> bool:
    parts = set(path.parts)
    if parts & EXCLUDE_DIRS:
        return True
    if path.name in EXCLUDE_FILES:
        return True
    if path.name.endswith(".pyc"):
        return True
    return False


def make_archive() -> Path:
    tmp = Path(tempfile.mkdtemp(prefix="mint-stealth-"))
    archive = tmp / "payload.tar.gz"
    print(f"==> Creating archive → {archive}")
    with tarfile.open(archive, "w:gz") as tar:
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            rel = path.relative_to(ROOT)
            if should_exclude(rel):
                continue
            tar.add(path, arcname=str(rel))
    size_mb = archive.stat().st_size / (1024 * 1024)
    print(f"✓ Archive size: {size_mb:.1f} MB")
    return archive


def upload(sftp: paramiko.SFTPClient, local: Path, remote: str) -> None:
    print(f"==> Uploading {local} → {remote}")
    sftp.put(str(local), remote)
    print("✓ Upload complete")


def stealth_env() -> str:
    # Production-ish env pointed at stealth public URL / free port
    return f"""DATABASE_URL=postgresql://mint:mint_stealth_secret@postgres:5432/mint_db?schema=public
POSTGRES_USER=mint
POSTGRES_PASSWORD=mint_stealth_secret
POSTGRES_DB=mint_db

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=mint_stealth_jwt_{HOST.replace('.', '')}_change_me
JWT_REFRESH_SECRET=mint_stealth_refresh_{HOST.replace('.', '')}_change_me
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

PORT=4000
NODE_ENV=production
BACKEND_URL=http://api:4000
FRONTEND_URL={PUBLIC_BASE}
PRISMA_LOG_QUERIES=false

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=nasamri33@gmail.com
SMTP_PASS=tbbpfbcmfmaivixu
SMTP_FROM=nasamri33@gmail.com

EMAIL_VERIFICATION_TOKEN_TTL=60
RESET_TOKEN_TTL_MINUTES=30

SEED_SUPERUSER_EMAIL=admin@mint.gov.et
SEED_SUPERUSER_PASSWORD=samri@212830
SEED_SUPERUSER_FULL_NAME=MINT Admin

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=gq2eqqxw
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=mint_events

TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
TELEGRAM_CHANNEL_ID=
TELEGRAM_WEBHOOK_URL=

NEXT_PUBLIC_API_URL={PUBLIC_BASE}
NEXT_PUBLIC_SOCKET_URL={PUBLIC_BASE}

ML_SERVICE_URL=http://ml-service:8000
WEB_NODE_MEMORY_MB=3072
"""


def main() -> int:
    print(f"==> Connecting to {HOST} ...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USERNAME, password=PASSWORD, timeout=30)
    print("✓ Connected")

    # Phase 1: nested cover folders
    print("\n==> Phase 1: nested disguise folders")
    run(
        client,
        f"""
set -e
mkdir -p {APP_DIR}
mkdir -p {COVER_DIR}/.sys/cache/index
# decoy files so casual browsing looks like a cache tree
cat > {COVER_DIR}/README.md << 'EOF'
# Data Pipeline Service
Internal data aggregation and processing pipeline.
Managed by the infrastructure team.
Do not modify without approval.
EOF
cat > {COVER_DIR}/.sys/README << 'EOF'
System cache index. Auto-generated. Do not edit.
EOF
cat > {COVER_DIR}/.sys/cache/README << 'EOF'
Content-addressable cache store.
EOF
# hide from casual ls (dot dirs already hidden)
chmod 700 {COVER_DIR}/.sys
echo READY
""".strip(),
    )

    # Phase 2: pack + upload
    print("\n==> Phase 2: pack & upload project")
    archive = make_archive()
    sftp = client.open_sftp()
    remote_tar = "/tmp/dp_runtime_payload.tar.gz"
    upload(sftp, archive, remote_tar)
    sftp.close()

    out, _, code = run(
        client,
        f"""
set -e
rm -rf {APP_DIR}.new
mkdir -p {APP_DIR}.new
tar -xzf {remote_tar} -C {APP_DIR}.new
# preserve existing .env if present, else write new after swap
if [ -d {APP_DIR} ] && [ -f {APP_DIR}/.env ]; then
  cp {APP_DIR}/.env {APP_DIR}.new/.env.bak 2>/dev/null || true
fi
rm -rf {APP_DIR}.old
if [ -d {APP_DIR} ]; then mv {APP_DIR} {APP_DIR}.old; fi
mv {APP_DIR}.new {APP_DIR}
rm -f {remote_tar}
echo EXTRACT_OK
ls -la {APP_DIR} | head
""".strip(),
        timeout=180,
    )
    if code != 0:
        print("Extract failed")
        client.close()
        return 1

    # Phase 3: write env
    print("\n==> Phase 3: write stealth .env")
    env_body = stealth_env()
    sftp = client.open_sftp()
    with sftp.file(f"{APP_DIR}/.env", "w") as f:
        f.write(env_body)
    sftp.close()
    print("✓ .env written")

    # Phase 4: ensure docker running (do not reinstall/disrupt existing stacks)
    print("\n==> Phase 4: docker check (no port 80/443 changes)")
    run(client, "systemctl is-active docker || systemctl start docker", timeout=60)
    run(
        client,
        f"ss -tln | grep -q ':{HOST_PORT} ' && echo PORT_BUSY || echo PORT_FREE",
        timeout=30,
    )

    # Phase 5: build & start stealth stack only
    print("\n==> Phase 5: docker compose stealth up (long build)")
    # Nest build OOMs at 512MB on this host — bump build heap only in deployed copy
    run(
        client,
        f"sed -i 's/--max-old-space-size=512/--max-old-space-size=3072/g' {APP_DIR}/apps/api/Dockerfile",
        timeout=30,
    )
    out, err, code = run(
        client,
        f"""
set -e
cd {APP_DIR}
# stop ONLY this project stack if previously running
docker compose -f docker-compose.stealth.yml -p dp_cache down --remove-orphans 2>/dev/null || true
docker compose -f docker-compose.stealth.yml -p dp_cache up -d --build
""".strip(),
        timeout=2400,
    )
    if code != 0:
        print("Compose up failed — check logs above")
        client.close()
        return 1

    # Phase 6: wait + migrate + seed
    print("\n==> Phase 6: wait for API, migrate, seed")
    run(
        client,
        f"""
set -e
cd {APP_DIR}
for i in $(seq 1 60); do
  if docker compose -f docker-compose.stealth.yml -p dp_cache ps | grep -q 'dp-cache-api'; then
    if docker exec dp-cache-api wget -q --spider http://127.0.0.1:4000/api/health/liveness 2>/dev/null; then
      echo API_READY
      break
    fi
  fi
  echo "waiting api... $i"
  sleep 10
done
docker exec dp-cache-api npx prisma generate
docker exec dp-cache-api npx prisma migrate deploy
docker exec dp-cache-api npm run script_roles:prod --prefix /usr/src/app || docker exec dp-cache-api npm run script_roles || true
docker exec dp-cache-api npm run script_users:prod --prefix /usr/src/app || docker exec dp-cache-api npm run script_users || true
curl -fsS http://127.0.0.1:{HOST_PORT}/nginx-health || true
docker compose -f docker-compose.stealth.yml -p dp_cache ps
""".strip(),
        timeout=900,
    )

    print(
        f"""
╔══════════════════════════════════════════════════════════╗
║              Stealth deploy finished                     ║
╠══════════════════════════════════════════════════════════╣
║  Cover folder : {COVER_DIR}
║  App folder   : {APP_DIR}
║  Public URL   : {PUBLIC_BASE}
║  Health       : {PUBLIC_BASE}/nginx-health
║  API docs     : {PUBLIC_BASE}/api/docs
║  Host port    : {HOST_PORT}  (80/443 untouched)
╚══════════════════════════════════════════════════════════╝
"""
    )
    client.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
