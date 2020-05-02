(function() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        alert("Canvas not supported");
        return;
    }

    var myModule;

    var lastTime = Date.now();

    function update() {
        myModule.update(Date.now() - lastTime);
        lastTime = Date.now();
        requestAnimationFrame(update);
    }

    WebAssembly.instantiateStreaming(fetch("./build/optimized.wasm"), {
        env: {
            abort(_msg, _file, line, column) {
                console.error("abort called at main.ts:" + line + ":" + column);
            }
        },
        g2d: {
            fillRect(x, y, w, h) {
                ctx.fillRect(x, y, w, h);
            },
            setColor(r, g, b) {
                ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            }
        },
    }).then(result => {
        myModule = result.instance.exports;

        const { jump, movingLeft, movingRight, stopMoving } = myModule;

        document.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case 37:
                    movingLeft();
                    break;
                case 38:
                    jump();
                    break;
                case 39:
                    movingRight();
                    break;
            }
        })

        document.addEventListener("keyup", (e) => {
            if (e.keyCode == 37 || e.keyCode == 39)
                stopMoving();
        });

        requestAnimationFrame(update);
    }).catch(console.error);

})();