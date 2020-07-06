#!/usr/bin/env node

const { execFileSync: exec } = require('child_process')
const { EOL } = require('os')
const semver = require('semver')

const { WORKSPACE, SOURCE_DIR } = process.env

const gitTags = (dir, { sort } = {}) => 
	exec(
		'git',
		[
			'tag',
			...(sort ? [ `--sort=${sort}` ] : [])
		],
		{ cwd: dir }
	)
		.toString()
		.trim()
		.split(EOL)
		.filter(tag => tag !== '')

;(async () => {
	const sourceTags = gitTags(SOURCE_DIR, { sort: 'creatordate' })
		.map(tag => {
			const semverResult = semver.coerce(tag.replace(/[_-]/g, '.'))
			return { tag, semver: semverResult ? semverResult.version : null }
		})
		.filter(({ semver }) => !!semver)
	const tags = gitTags(WORKSPACE)
	const latestSourceTag = sourceTags.slice(-1)[0]
	if (!tags.includes(latestSourceTag.semver)) {
		console.log(`::set-output name=build_source_tag::${latestSourceTag.tag}`)
		console.log(`::set-output name=build_tag::${latestSourceTag.semver}`)
	}
})()
