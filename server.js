// Variables
const express   = require('express'),
		  fs			  = require('fs'),
		  path		  = require('path'),
		  server 	  = express(),
		  port      = 3000, // YOUR PORT HERE
		  host      = 'localhost', // YOUR IP HERE
		  videoLink = 'videos/hotelhell.mp4' // CHANGE VIDEO LINK

// Routes

// Home page
server.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// Video link
server.get('/video', (req, res) => {
	const filePath = videoLink, // Whatever the video name is
	 			stat 		 = fs.statSync(filePath),
				fileSize = stat.size,
				range 	 = req.headers.range

	if (range) {
  	const parts 		= range.replace(/bytes=/, "").split("-"),
  				start 		= parseInt(parts[0], 10),
  				end 			= parts[1] ? parseInt(parts[1], 10) : fileSize-1,
  				chunksize = (end-start)+1,
  				file 			= fs.createReadStream(filePath, {start, end}),
				 	header = {
			  		'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			  		'Accept-Ranges': 'bytes',
			  		'Content-Length': chunksize,
			  		'Content-Type': 'video/mp4'
					}

    res.writeHead(206, header)
    file.pipe(res)
  } else {
    const header = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, header)
    fs.createReadStream(filePath).pipe(res)
  }
})

// Start server
server.listen(port, host, () => console.log('Listening on port 3000'))