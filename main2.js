class DrawStrokes {
    constructor(block, className) { 
        this.createElement(block, className);
        this.box = document.getElementById(block);
    }

    createElement(block, className) {
        let newDiv = document.createElement('div');
        newDiv.setAttribute("class", className);
        newDiv.setAttribute("id", block);
        document.getElementById('test_box').appendChild(newDiv);
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
        this.box.orig_x = mxy[0];
        this.box.orig_y = mxy[1];
        this.box.style.left = mxy[0]+"px";
        this.box.style.top = mxy[1]+"px";
        this.box.style.display = "block";
        document.onmousemove = this.mousemove.bind(this);
        document.onmouseup = this.mouseup.bind(this);
    }

    mousemove(e) {
        let mxy = this.getCursorPosition(e);
        if(mxy[0]-this.box.orig_x < 0) {
            this.box.style.left = mxy[0]+"px";
        }
    
        if(mxy[1]-this.box.orig_y<0) {
          this.box.style.top = mxy[1]+"px";
        }
    
        this.box.style.width = Math.abs(mxy[0]-this.box.orig_x)+"px";
        this.box.style.height = Math.abs(mxy[1]-this.box.orig_y)+"px";
    }

    mouseup(e) {}

    removeListners() {
        document.body.style.cursor = "auto";
        document.onmousemove = function() {};
        document.onmousedown = function() {};
        document.onmouseup = function() {};
    }
    findAvarageRGB(canvas) {}
}

class CropPicture extends DrawStrokes {
    constructor(block, className) {
        super(block, className);
    }

    mouseup(e) {
        console.log("from mouseup ", this.box.style.width, this.box.style.height);
        this.drawOnCanvas(this.box.style.width, this.box.style.height, this.box.orig_x, this.box.orig_y);
        this.box.style.display = "none";
        this.box.style.width = "0";
        this.box.style.height = "0";
        this.removeListners();
    }

    drawOnCanvas(picWidth, picHeight, picX, picY) {
        let self = this;
        let canvas = document.getElementById('myCanvas');
        // box.classList.add("canvas-no-vis");
        canvas.classList.remove("no-vis");
        canvas.classList.add("canvas_vis");
        let context = canvas.getContext('2d');
    
        var imageObj = new Image();
    
        imageObj.src = 'img/savr.jpg';
        imageObj.onload = function() {
            console.log("from onload");
            canvas.style.width = picWidth;
            canvas.style.height = picHeight;
            
            console.log(picWidth, canvas.height);
            const desiredWidth = parseFloat(picWidth.replaceAll("px",""));
            const desiredHeight = parseFloat(picHeight.replaceAll("px",""));
            canvas.width = desiredWidth;
            canvas.height = desiredHeight;
            context.imageSmoothingEnabled = true;
            context.drawImage(imageObj, picX*2, picY*2, desiredWidth*2, desiredHeight*2, 0, 0, desiredWidth, desiredHeight);
            console.log(self.findAvarageRGB(canvas));
        }
    }

    findAvarageRGB(canvas) {
        let rgb = {r:0,g:0,b:0};
        let blockSize = 5;
        let context = canvas.getContext('2d');
        let i = -4;
        let count = 0;
        let data = context.getImageData(0, 0, canvas.width, canvas.height);
        length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }

        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);
        
        return rgb;

    }
}

class SelectUrgent extends DrawStrokes {
    constructor(block, className) {
        console.log(block);
        super(block, className);
    }

    mouseup(e) {
        // this.drawOnCanvas(this.box.style.width, this.box.style.height, this.box.orig_x, this.box.orig_y);
        this.box.style.display = "block";
        // this.box.style.width = "0";
        // this.box.style.height = "0";
        this.removeListners();
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "red";
        console.log("mouse up: ", this.box.style.width, this.box.style.height);
        ctx.roundRect(this.box.orig_x, this.box.orig_y,  this.box.style.width.replace("px", ""), this.box.style.height.replace("px", ""), [parseFloat(this.box.style.width.replace("px", "")/2)]);
        ctx.stroke();
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
    document.body.style.cursor = "nw-resize";
    let obj = new CropPicture("sel_box", "sel_box");
    document.onmousedown = obj.mousedown.bind(obj);
}

function createID(i) {
    let namID = "rnd_box_" + i;
    let block = document.getElementById(namID);
    if (block != null) {namID = createID(i+1)}
    return namID;
}

document.getElementById('arrow').onclick = () => {
    document.body.style.cursor = "crosshair";
    let id = createID(1);
    let obj = new SelectUrgent(id, "rnd_box");
    document.onmousedown = obj.mousedown.bind(obj);
}

document.getElementById('reset').onclick = () => {
    canvas = document.getElementById("myCanvas");
    canvas.classList.add("no-vis");
    // sel_box.remove();
    sel_box = document.getElementById("sel_box");
    sel_box.remove();
    rnd_box = document.getElementById("rnd_box_1");
    rnd_box.remove();
    // rnd_box.style.display = "none";
    // rnd_box.style.width = "0";
    // rnd_box.style.height = "0";
}

document.getElementById('save').onclick = () => {
    let canvas = document.getElementById('myCanvas');

    
    canvas.toBlob(function(blob) {
        // после того, как Blob создан, загружаем его
        let link = document.createElement('a');
        link.download = 'example.png';

        link.href = URL.createObjectURL(blob);
        link.click();
      
        // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
        URL.revokeObjectURL(link.href);
      }, 'image/png');
}


