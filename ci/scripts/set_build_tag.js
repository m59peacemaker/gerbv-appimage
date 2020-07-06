#!/usr/bin/env node

const { execFileSync: exec } = require('child_process')
const { EOL } = require('os')
const semver = require('semver')

const { WORKSPACE, SOURCE_DIR, BUILD_REQUIRED } = process.env

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
	const latestSourceTag = sourceTags.slice(-1)[0]
	const tags = gitTags(WORKSPACE).map(tag => {
		const [ main, build ] = tag.split('-')
		return { tag, main, build: Number(build) }
	})
	const matchingTags = tags.filter(({ main }) => main === latestSourceTag.semver)
	if (BUILD_REQUIRED === 'true' || !matchingTags.length) {
		const buildId = matchingTags.length
			? matchingTags.map(({ build }) => build).sort((a, b) => b - 1)[0] + 1
			: 1
		const buildTag = [ latestSourceTag.semver, buildId ].join('-')
		console.log(`::set-output name=build_source_tag::${latestSourceTag.tag}`)
		console.log(`::set-output name=build_tag::${buildTag}`)
	}
})()
