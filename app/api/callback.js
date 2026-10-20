export default async function handler(req, res) {
  const { code } = req.query
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET

  if (!code) {
    return res.status(400).send('Missing authorization code')
  }

  if (!clientId || !clientSecret) {
    return res.status(500).send('OAuth credentials not configured')
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })

  const data = await tokenRes.json()

  if (!data.access_token) {
    const err = data.error_description || data.error || 'Unknown error'
    return res.status(500).send(`Token exchange failed: ${err}`)
  }

  const token = data.access_token
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(`<!DOCTYPE html>
<html>
<head><title>Authorization</title></head>
<body>
<script>
  (function() {
    var token = ${JSON.stringify(token)};
    if (window.opener) {
      window.opener.postMessage({ type: 'authorization:success', token: token }, '*');
      window.close();
    } else {
      document.body.textContent = 'Authorization successful. You can close this window.';
    }
  })();
</script>
<p>Authorization successful. You can close this window.</p>
</body>
</html>`)
}
