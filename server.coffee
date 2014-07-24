# server
restify = require 'restify'
server = restify.createServer()

# for random ids
crypto = require 'crypto'

# socket.io
socketio = require 'socket.io'
io = socketio.listen server
connectedSockets = []

addRandomNode = (socket) ->
  ->
    randomId = crypto.randomBytes(Math.ceil(16/2)).toString('hex').slice(0,16)
    socket.emit 'addnode', JSON.stringify({id: randomId})

io.sockets.on 'connection', (socket) ->
  socket.on 'addnode', (data) ->
    console.log data
  socket.on 'addlink', (data) ->
    console.log data

  connectedSockets.push socket
  for socket in connectedSockets
    setInterval addRandomNode(socket), 5000

# cors proxy and body parser
server.use restify.bodyParser()
server.use restify.fullResponse() # set CORS, eTag, other common headers

server.get /\/*$/, restify.serveStatic directory: './public', default: 'index.html'

server.listen (process.env.PORT or 8080), ->
  console.info "[%s] #{server.name} listening at #{server.url}", process.pid
