#!/bin/bash

set -e

git checkout "${BUILD_TAG_SOURCE}"

curl -L --create-dirs -o /tmp/ldqt.AppImage "https://github.com/probonopd/linuxdeployqt/releases/download/continuous/linuxdeployqt-continuous-x86_64.AppImage"
chmod a+x /tmp/ldqt.AppImage
ldqt () {
	/tmp/ldqt.AppImage --appimage-extract-and-run $@
}

sudo apt update

sudo apt install -y curl

sudo apt install -y \
	libcairo-dev \
	build-essential \
	gnulib \
	gtk2.0 \
	software-properties-common

./autogen.sh

./configure --disable-update-desktop-database

make

make install DESTDIR=$PWD/AppDir

ldqt AppDir/usr/local/share/applications/*.desktop -bundle-non-qt-libs
ldqt AppDir/usr/local/share/applications/*.desktop -appimage

AppImage_name="`echo gerbv-*.AppImage`"
AppImage_path="${PWD}/${AppImage_name}"

echo "::set-output name=AppImage_name::${AppImage_name}"
echo "::set-output name=AppImage_path::${AppImage_path}"
