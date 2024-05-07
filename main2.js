function getCursorPosition(e) {
	e = e || window.event;
	if (e) {
		if (e.pageX || e.pageX == 0) return [e.pageX,e.pageY];
		var dE = document.documentElement || {};
		var dB = document.body || {};
		if ((e.clientX || e.clientX == 0) && ((dB.scrollLeft || dB.scrollLeft == 0) || (dE.clientLeft || dE.clientLeft == 0))) 
            return [e.clientX + (dE.scrollLeft || dB.scrollLeft || 0) - (dE.clientLeft || 0),e.clientY + (dE.scrollTop || dB.scrollTop || 0) - (dE.clientTop || 0)];
	}
	return null;
	}

function mousedown(e) {
	var mxy = getCursorPosition(e);
	var box = document.getElementById("sel_box");
    // console.log(box);
	box.orig_x = mxy[0];
	box.orig_y = mxy[1];
	box.style.left = mxy[0]+"px";
	box.style.top = mxy[1]+"px";
	box.style.display = "block";
	document.onmousemove = mousemove;
	document.onmouseup = () => {
        mouseup();
    };
}

function mousemove(e) {
	var mxy = getCursorPosition(e);
	var box = document.getElementById("sel_box");
    if(mxy[0]-box.orig_x < 0) {
        box.style.left = mxy[0]+"px";
	}

    if(mxy[1]-box.orig_y<0) {
      box.style.top = mxy[1]+"px";
    }

	box.style.width = Math.abs(mxy[0]-box.orig_x)+"px";
	box.style.height = Math.abs(mxy[1]-box.orig_y)+"px";
}

function mouseup(e) {
    // let selection = document.getSelection();
    // console.log(selection);
    // console.log(selection.getRangeAt(0));
	var box = document.getElementById("sel_box");
    // console.log(box.style.width, box.style.height, box.orig_x, box.orig_y);
    drawOnCanvas(box.style.width, box.style.height, box.orig_x, box.orig_y)
	box.style.display = "none";
	box.style.width = "0";
	box.style.height = "0";
    document.onmousemove = function() {};
	document.onmouseup = function() {};
}

function drawOnCanvas(picWidth, picHeight, picX, picY) {
    var canvas = document.getElementById('myCanvas');
    canvas.classList.add("canvas_vis");
    var context = canvas.getContext('2d');
    // let imageObj = img1;
    var imageObj = new Image();
    // img.width = 200;
    // img.height = 300;
    imageObj.src = 'img/savr.jpg';
    imageObj.onload = function() {
        console.log("from onload");
        canvas.style.width = picWidth;
        canvas.style.height = picHeight;
        const desiredWidth = parseFloat(picWidth.replaceAll("px",""));
        const desiredHeight = parseFloat(picHeight.replaceAll("px",""));
        // canvas.width = desiredWidth;
        // canvas.height = desiredHeight;
        context.drawImage(imageObj, picX*2, picY*2, desiredWidth*2, desiredHeight*2, 0, 0, canvas.width, canvas.height);
    }
}

let img = new Image();

img.src = 'img/savr.jpg';
img.onload = function() {
    console.log(img.naturalWidth, img.naturalHeight, img.width, img.height);
    let img1 = new Image();
    img1.width = img.width/2;
    img1.height = img.height/2;
    img1.src = img.src;
    document.getElementById('pic1').appendChild(img1);
}
// console.log(img.naturalWidth, img.naturalHeight);


document.onmousedown = mousedown;
