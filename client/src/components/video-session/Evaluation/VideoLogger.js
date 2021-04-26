define(['jquery', 'lib/vi2/vi2.main'], function ($, Vi2) {
    var video_data = {};
    video_data.metadata = [];
    video_data.metadata[0] = {};
    video_data.metadata[0].author = 'Meyer';
    video_data.metadata[0].title = 'Test';
    video_data.metadata[0].abstract = 'bla';
    //video_data.metadata[0].thumbnail = "still-" + video_data.filename.replace('.mp4', '_comp.jpg');
    //video_data.video = 'http://download.media.tagesschau.de/video/2017/0605/TV-20170605-0145-1001.websm.h264.mp4';
    video_data.video = 'http://localhost/videos/VIDEO03_1_Biathlon2_Biathlon_Instruktion.mp4';
    Vi2.start(video_data, 1);

    var
        print = document.getElementById('print'),
        out = document.getElementById('logoutput'),
        timeupdate_check = document.getElementById('timeupdatelog'),
        check_segments = document.getElementById('logsegments'),
        check_segments_length = document.getElementById('logseglength'),
        check_heartbeat = document.getElementById('logheartbeat'),
        check_heartbeat_length = document.getElementById('logheartlength'),
        check_clickstream = document.getElementById('logclick'),
        clickstream_tolerance = document.getElementById('clickstreamtolerance')
    heartbeat = check_heartbeat_length.value,
        heart_interval = -1
        ;

    /*print.addEventListener('click', function () {
        computeWatchTime();
    });*/
    var compute_interval = 0;
    compute_interval = clearInterval(compute_interval);
    compute_interval = setInterval(computeWatchTime, 1000);

    out.addEventListener('change', function () {

        //computeWatchTime();
    });

    timeupdate_check.addEventListener('change', function () {
        if (this.checked) {
            Vi2.Observer.player.video.addEventListener('timeupdate', writeTimeupdate, false);
        } else {
            Vi2.Observer.player.video.removeEventListener('timeupdate', writeTimeupdate, false);
        }
    });

    function writeTimeupdate() {
        Vi2.Observer.log({
            context: 'player',
            action: 'timeupdate',
            values: [Number(Vi2.Observer.player.currentTime().toFixed(1))]
        });
    }

    check_segments.addEventListener('change', function () {
        if (this.checked) {
            // Checkbox is checked..
        } else {
            // Checkbox is not checked..
        }
    });

    check_segments_length.addEventListener('change', function () {
        window.vi2.observer.getWidget('player-playback-logger').interval(Number(this.value));
    });

    check_heartbeat.addEventListener('change', function () {
        if (this.checked) {
            heart_interval = setInterval(writeHeartbeat, heartbeat * 1000);
        } else {
            heart_interval = clearInterval(heart_interval);
        }
    });

    check_heartbeat_length.addEventListener('change', function () {
        heartbeat = this.value;
        heart_interval = clearInterval(heart_interval);
        heart_interval = setInterval(writeHeartbeat, heartbeat * 1000);
    });

    function writeHeartbeat() {
        Vi2.Observer.log({
            context: 'player',
            action: 'heartbeat',
            values: [Number(Vi2.Observer.player.currentTime().toFixed(1))]
        });
    }

    /*check_clickstream.addEventListener('change', function () {
        if (this.checked) {
            // Checkbox is checked..
        } else {
            // Checkbox is not checked..
        }
    });*/

    /**
     * Automotatic scrol down after adding a new entry to the texarea
     */
    //out.addEventListener('input selectionchange propertychange', function (e) {
    //  this.scrollTop = this.scrollHeight;
    //})

    // leave tab
    var interval_id;
    $(window).focus(function () {
        console.log('focus returned to window')
        //if (!interval_id)
        //interval_id = setInterval(hard_work, 1000);
    });

    $(window).blur(function () {
        console.log('blur..leaves the window')
        //clearInterval(interval_id);
        interval_id = 0;
    });



    /**
     * Compute watching time using different measurements.
     */
    function computeWatchTime() {
        var
            log = out.value.split(/\r?\n/),
            res = {}
            ;
        // distinguish log entries by their capturing method
        for (var i = 0, len = log.length; i < len; i++) {
            var entry = log[i].split(',');
            if (entry[1] === 'playback' || entry[1] === 'heartbeat' || entry[1] === 'timeupdate') {
                res[entry[1]] = res[entry[1]] || [];
                if (entry[2] !== undefined)
                    res[entry[1]].push({ utc: entry[0], event: entry[1], time: entry[2] });
            } else {
                res['clickstream'] = res['clickstream'] || [];
                if (entry[2] !== undefined)
                    res['clickstream'].push({ utc: parseInt(entry[0]), event: 'clickstream', time: parseInt(entry[2]) });
            }
        }

        // compute watching time using timeupdate data
        if (res['timeupdate'] !== undefined) {
            var
                epsilon2 = clickstream_tolerance.value,
                timeupdate_watching_time = 0,
                tmp = res['timeupdate'][0]
                ;
            for (var i = 1, len = res['timeupdate'].length; i < len; i++) {
                var
                    entry = res['timeupdate'][i],
                    timeDistance = entry.utc - tmp.utc,
                    playbackDistance = (entry.time - tmp.time) * 1000
                    ;
                if (playbackDistance > 0) {
                    if (playbackDistance - timeDistance <= epsilon2) {
                        timeupdate_watching_time += playbackDistance
                    }
                }
                tmp = entry;
            }
            document.getElementById('resulttimeupdate').innerHTML = (timeupdate_watching_time / 1000).toFixed(1);
        }


        // compute watching time using segments
        if (res['playback'] !== undefined) {
            document.getElementById('resultsegment').innerHTML = res['playback'].length * check_segments_length.value;
        } else {
            document.getElementById('resultsegment').innerHTML = 0;
        }

        // by heartbeats
        if (res['heartbeat'] !== undefined) {
            var
                heartbeat_watching_time = 0,
                tmp = res['heartbeat'][0]
                ;
            for (var i = 1, len = res['heartbeat'].length; i < len; i++) {
                var
                    entry = res['heartbeat'][i],
                    timeDistance = entry.utc - tmp.utc,
                    playbackDistance = (entry.time - tmp.time) * 1000
                    ;
                if (playbackDistance > 0) {
                    heartbeat_watching_time += playbackDistance
                }
                tmp = entry;
            }
            document.getElementById('resultheartbeat').innerHTML = (heartbeat_watching_time / 1000).toFixed(1);
        }

        // compute watching time using clickstreams
        if (res['clickstream'] !== undefined) {
            var
                clickstream_watching_time = 0,
                tmp = res['clickstream'][0],
                epsilon = clickstream_tolerance.value
                ;
            for (var i = 1, len = res['clickstream'].length; i < len; i++) {
                var
                    entry = res['clickstream'][i],
                    timeDistance = entry.utc - tmp.utc,
                    playbackDistance = (entry.time - tmp.time) * 1000
                    ;
                if (playbackDistance > 0) {
                    if (playbackDistance - timeDistance <= epsilon) {
                        clickstream_watching_time += playbackDistance
                    }
                }
                tmp = entry;
            }
            document.getElementById('resultclickstream').innerHTML = (clickstream_watching_time / 1000).toFixed(1);
        }
    }
});
