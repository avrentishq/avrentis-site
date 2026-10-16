#!/bin/sh
# Vercel's install step (vercel.json "installCommand"). The private
# @avrentishq/core git dependency is cloned over https; git asks a credential
# helper that reads GITHUB_TOKEN from the environment when it needs it, so the
# token is never written into a URL or a file and a failed clone's error shows
# only the plain address.
set -eu
config="$(mktemp)"
git config --file "$config" url."https://github.com/".insteadOf "git@github.com:"
git config --file "$config" credential.helper '!f() { echo username=x-access-token; echo "password=${GITHUB_TOKEN}"; }; f'
GIT_CONFIG_GLOBAL="$config" pnpm install --frozen-lockfile
