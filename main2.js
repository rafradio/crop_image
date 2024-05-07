class DrawStrokes {
    constructor(block) { 
        this.box = document.getElementById(block);
        // this.box = document.getElementById("sel_box");
    }

    getCursorPosition(e) {
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

    mousedown(e) {
        let mxy = this.getCursorPosition(e);
        // var box = document.getElementById("sel_box");
        this.box.orig_x = mxy[0];
        this.box.orig_y = mxy[1];
        this.box.style.left = mxy[0]+"px";
        this.box.style.top = mxy[1]+"px";
        this.box.style.display = "block";
        document.onmousemove = this.mousemove.bind(this);
        document.onmouseup = this.mouseup.bind(this);
        // document.onmouseup = () => {
        //     this.mouseup();
        // };
    }

    mousemove(e) {
        let mxy = this.getCursorPosition(e);
        // var box = document.getElementById("sel_box");
        if(mxy[0]-this.box.orig_x < 0) {
            this.box.style.left = mxy[0]+"px";
        }
    
        if(mxy[1]-this.box.orig_y<0) {
          this.box.style.top = mxy[1]+"px";
        }
    
        this.box.style.width = Math.abs(mxy[0]-this.box.orig_x)+"px";
        this.box.style.height = Math.abs(mxy[1]-this.box.orig_y)+"px";
    }

    mouseup(e) {
        // var box = document.getElementById("sel_box");
        this.drawOnCanvas(this.box.style.width, this.box.style.height, this.box.orig_x, this.box.orig_y);
        this.box.style.display = "none";
        this.box.style.width = "0";
        this.box.style.height = "0";
        document.onmousemove = function() {};
        document.onmouseup = function() {};
    }

    drawOnCanvas(picWidth, picHeight, picX, picY) {
        let canvas = document.getElementById('myCanvas');
        canvas.classList.add("canvas_vis");
        let context = canvas.getContext('2d');
    
        var imageObj = new Image();
    
        imageObj.src = 'img/savr.jpg';
        imageObj.onload = function() {
            console.log("from onload");
            canvas.style.width = picWidth;
            canvas.style.height = picHeight;
            const desiredWidth = parseFloat(picWidth.replaceAll("px",""));
            const desiredHeight = parseFloat(picHeight.replaceAll("px",""));
            context.imageSmoothingEnabled = true;
            context.drawImage(imageObj, picX*2, picY*2, desiredWidth*2, desiredHeight*2, 0, 0, canvas.width, canvas.height);
        }
    }
}



// let obj = new DrawStrokes("sel_box");
let img = new Image();

img.src = 'img/savr.jpg';
img.onload = function() {
    console.log(img.naturalWidth, img.naturalHeight, img.width, img.height);
    let img1 = new Image();
    img1.width = img.width/2;
    img1.height = img.height/2;
    img1.src = img.src;
    document.getElementById('test_box').appendChild(img1);
}

document.getElementById('crop').onclick = () => {
    let obj = new DrawStrokes("sel_box");
    document.body.style.cursor = "nw-resize";
    document.onmousedown = obj.mousedown.bind(obj);
}

document.getElementById('arrow').onclick = () => {
    let obj = new DrawStrokes("rnd_box");
    document.body.style.cursor = "crosshair";
    document.onmousedown = obj.mousedown.bind(obj);
}


