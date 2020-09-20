// default handler1
defaultHandler = (req, res) => {
  console.log('[Default Handler 404]')
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain')
  res.write('wake up neo follow the white rabbit')
  res.end()
}

module.exports = defaultHandler;