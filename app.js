const express = require('express');
const speakeasy = require('speakeasy');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; 


function generate2FACode(secret) {
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
  return token;
}

app.get('/generatecode', (req, res) => {
  let secret = req.query.secret;
  if (!secret) {
    return res.status(400).json({ error: 'Secret tidak disediakan' });
  }
  
  secret = secret.replace(/\s+/g, '').replace(/[^A-Z2-7]/gi, '');

  if (secret.length < 1) {
    return res.status(400).json({ error: 'Secret tidak valid' });
  }

  const code = generate2FACode(secret);
  res.json({ code: code });
});

app.use(express.static(path.join(__dirname)));

// Buat server HTTP
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
