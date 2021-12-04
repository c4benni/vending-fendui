const handler = (req, res, next) => {
  const searchParams = new URLSearchParams(req._parsedUrl.query)
  const name = searchParams.get('name')
  if (typeof name === 'string' && name.length) {
    res.setHeader('Content-type', 'application/json')
    const result = {
      name,
      message: `Hello, ${name}.`
    }
    res.statusCode = 200
    res.end(JSON.stringify(result))
  } else {
    res.statusCode = 500
    res.end()
  }
}

export default handler
