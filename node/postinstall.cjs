#!/usr/bin/env node

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const binLinks = require('bin-links')
const download = require('download')
const readPkg = require('read-package-json-fast')

;(async () => {
	const url = (await fs.promises.readFile(`${__dirname}/../AppImage_url`, 'utf8')).replace('+', encodeURIComponent('+'))
	const appimage = `${__dirname}/bin/gerbv/gerbv_AppImage`
	const root = `${__dirname}/../`

	console.log(`Downloading ${url} to ${appimage}...`)
	fs.promises.mkdir(path.dirname(appimage), { recursive: true })
	await fs.promises.writeFile(appimage, await download(url))

	execFileSync('chmod', [ 'a+x', appimage ])

	console.log(`extracting AppImage...`)
	execFileSync(appimage, [ '--appimage-extract' ], { cwd: path.dirname(appimage) })

	console.log('linking bin...')
	await binLinks({
		path: root,
		pkg: await readPkg(`${root}/package.json`),
		force: true
	})
})()
