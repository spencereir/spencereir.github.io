$(document).ready(function () {
	$("#c")
	$("#start").click(function() {
		var audio = document.getElementById('source');
		var audio2 = document.getElementById('source2');
		audio.setAttribute('src', $("#song").val());
		audio2.setAttribute('src', $("#song").val());
		var vis = $("#visualization").val();
		var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
		var analyser = audioCtx.createAnalyser();

		var source = audioCtx.createMediaElementSource(audio);
		
		source.connect(analyser);
		audio.play();
		audio2.play();

		analyser.fftSize = 128;
		var bufferLength = analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(dataArray);

		// Get a canvas defined with ID "oscilloscope"
		var canvas = document.getElementById("c");
		var canvasCtx = canvas.getContext("2d");
  		canvasCtx.canvas.width  = window.innerWidth;
  		canvasCtx.canvas.height = window.innerHeight;
		// draw an oscilloscope of the current audio source

		var HEIGHT = canvas.height;
		var WIDTH = canvas.width;
		if (vis == "circle") {
			function draw() {
			    drawVisual = requestAnimationFrame(draw);
				analyser.getByteFrequencyData(dataArray);

			    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			    canvasCtx.fillStyle = 'rgb(100, 0, 100)';
			    var cx = WIDTH/2;
			    var cy = HEIGHT/2;
			
			    var x = cx;
			    var y = 0;
			    var theta = (2*Math.PI)/bufferLength;

			    for(var i = 0; i < bufferLength; i++) {
			    	var scale1 = dataArray[i]/512;
			      	var scale2 = dataArray[(i+1)%bufferLength]/512;
	    			var nx = rotate(cx,cy,x,y,theta)[0];
	    			var ny = rotate(cx,cy,x,y,theta)[1];
	    			console.log(x + " " + y + " " + nx + " " + ny);

			      	canvasCtx.fillStyle = rainbow(Math.floor(255*i/bufferLength));
	    			canvasCtx.beginPath();
			        canvasCtx.moveTo(cx,cy);
			        canvasCtx.lineTo((x-cx) * scale1 + cx, (y-cy) * scale1 + cy);
			        canvasCtx.lineTo((nx-cx) * scale2 + cx, (ny-cy) * scale2 + cy);
			        canvasCtx.fill();
			        x = nx;
			        y = ny;
			    }
			}
		} else if (vis == "sweep") {
			var cx = WIDTH/2;
			var cy = HEIGHT/2;
			
			var x = cx;
			var y = 0;
			canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
			var theta = 0.5 * Math.PI / bufferLength;
			function draw() {

			    drawVisual = requestAnimationFrame(draw);
				analyser.getByteFrequencyData(dataArray);


			    canvasCtx.fillStyle = 'rgb(100, 0, 100)';
			    for(var i = 0; i < bufferLength; i++) {
			    	canvasCtx.fillStyle = 'rgb(' + dataArray[i] + ',' + dataArray[i] + ',' + dataArray[i] + ')';
			    	canvasCtx.fillRect(cx + i*(x - cx)/bufferLength, cy + i*(y - cy)/bufferLength, 1, 1);
			    }
	    		var nx = rotate(cx,cy,x,y,theta)[0];
	    		var ny = rotate(cx,cy,x,y,theta)[1];
	    		x = nx;
	    		y = ny;
	    		console.log(x + " " + y);
			}
		}
		draw();
	});

	function rainbow(n) {
	    n = n * 240 / 255;
	    return 'hsl(' + n + ',100%,50%)';
	}
	
	function rotate(cx, cy, x, y, angle) {
	    cos = Math.cos(angle),
	    sin = Math.sin(angle),
	        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
	        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	    return [nx, ny];
	}
	

});