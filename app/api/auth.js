export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const host = req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${proto}://${host}`
  const redirectUri = `${origin}/api/callback`

  if (!clientId) {
    return res.status(500).send('OAUTH_GITHUB_CLIENT_ID not configured')
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`
  res.redirect(302, url)
}
