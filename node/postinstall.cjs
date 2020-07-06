#!/usr/bin/env node

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const download = require('download')

;(async () => {
	const url = (await fs.promises.readFile(`${__dirname}/../AppImage_url`)).replace('+', encodeUriComponent('+'))
	const appimage = `${__dirname}/.tmp/gerbv/gerbv`

	console.log(`Downloading ${url} to ${appimage}...`)

	fs.promises.mkdir(path.dirname(appimage), { recursive: true })
	await fs.promises.writeFile(appimage, await download(url))

	execFileSync('chmod', [ 'a+x', appimage ])
	execFileSync(appimage, [ '--appimage-extract' ])
})()
