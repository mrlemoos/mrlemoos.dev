/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
	branches: ['main'],
	repositoryUrl: 'https://github.com/mrlemoos/mrlemoos.dev',
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'angular',
				parserOpts: {
					noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
				},
			},
		],
		'@semantic-release/changelog',
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'angular',
				parserOpts: {
					noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
				},
				writerOpts: {
					commitsSort: ['subject', 'scope'],
				},
			},
		],
		[
			'@semantic-release/git',
			{
				message:
					'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
	],
};
