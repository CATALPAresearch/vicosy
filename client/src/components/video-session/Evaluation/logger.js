function logger() {
    var
        _this = this,
        interval = 2, // THE LENGTH OF AN INTERVAL IN SECONDS 
        lastposition = -1,
        timer
        ;

    function loop() {
        var currentinterval;
        currentinterval = (Math.round(_this.currentTime()) / interval) >> 0;
        console.log("i:" + currentinterval + ", p:" + player.getPosition());
        if (currentinterval != lastposition) {
            // HERE YOU SHOUL ADD SOME CALL TO WRITE THE PLAYBACK EVENT INCL. currentinterval TO THE LOG FILE ECT:
            // {context:'player', action:'playback', values:[ currentinterval ]});
            lastposition = currentinterval;
        }
    }

    function start() {
        if (timer) {
            timer = clearInterval(timer);
        }
        timer = setInterval(loop, interval * 1000);
        setTimeout(loop, 100);
    }


    function stop() {
        timer = clearInterval(timer);
        loop();
    }

    // this.video REFERS TO THE VIDEO ELEMENT
    this.video.addEventListener('play', function (e) {
        start();
    });

    this.video.addEventListener('pause', function (e) {
        stop();
    });

    this.video.addEventListener('abort', function (e) {
        stop();
    });

    this.video.addEventListener('ended', function (e) {
        stop();
    }, false);

}