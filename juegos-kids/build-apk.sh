#!/usr/bin/env bash
# Compila JuegosMazatlam.apk sin Android Studio ni el SDK oficial.
# Requisitos: Java 11+, curl. Descarga apktool y uber-apk-signer (GitHub Releases) la primera vez.
#   ./build-apk.sh              -> salida: dist/JuegosMazatlam.apk (firmado con llave debug, listo para instalar)
#   KEYSTORE=mi.jks KS_ALIAS=x KS_PASS=y ./build-apk.sh   -> firmar con tu propia llave
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="${TOOLS_DIR:-$HERE/.tools}"
BUILD="${BUILD_DIR:-$HERE/.build}"
DIST="$HERE/dist"
APKTOOL_URL="https://github.com/iBotPeaches/Apktool/releases/download/v2.9.3/apktool_2.9.3.jar"
SIGNER_URL="https://github.com/patrickfav/uber-apk-signer/releases/download/v1.3.0/uber-apk-signer-1.3.0.jar"

mkdir -p "$TOOLS" "$DIST"
[ -f "$TOOLS/apktool.jar" ] || { echo ">> Descargando apktool"; curl -sSL -o "$TOOLS/apktool.jar" "$APKTOOL_URL"; }
[ -f "$TOOLS/uber-apk-signer.jar" ] || { echo ">> Descargando uber-apk-signer"; curl -sSL -o "$TOOLS/uber-apk-signer.jar" "$SIGNER_URL"; }

echo ">> Preparando proyecto"
rm -rf "$BUILD"; mkdir -p "$BUILD/proj/assets"
cp -r "$HERE/android/." "$BUILD/proj/"
rm -f "$BUILD/proj/MainActivity.java.txt"
cp -r "$HERE/www" "$BUILD/proj/assets/www"
rm -f "$BUILD/proj/assets/www/ESPECIFICACION.md"

echo ">> Ensamblando APK (apktool)"
java -jar "$TOOLS/apktool.jar" b "$BUILD/proj" -o "$BUILD/unsigned.apk" --use-aapt2 -q

echo ">> Firmando y alineando (uber-apk-signer)"
if [ -n "${KEYSTORE:-}" ]; then
  java -jar "$TOOLS/uber-apk-signer.jar" -a "$BUILD/unsigned.apk" -o "$BUILD/signed" \
    --ks "$KEYSTORE" --ksAlias "${KS_ALIAS:?KS_ALIAS requerido}" --ksPass "${KS_PASS:?KS_PASS requerido}" --ksKeyPass "${KS_KEY_PASS:-$KS_PASS}" --allowResign >/dev/null
else
  java -jar "$TOOLS/uber-apk-signer.jar" -a "$BUILD/unsigned.apk" -o "$BUILD/signed" --allowResign >/dev/null
fi
SIGNED="$(ls "$BUILD"/signed/*.apk | head -1)"
cp "$SIGNED" "$DIST/JuegosMazatlam.apk"
echo ">> Listo: $DIST/JuegosMazatlam.apk ($(du -h "$DIST/JuegosMazatlam.apk" | cut -f1))"
