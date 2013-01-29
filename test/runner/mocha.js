(function () {
    var runner = mocha.run();

    var failed = [];

    runner.on('fail', function (test, err) {
        failed.push({
            title:test.title,
            fullTitle:test.fullTitle(),
            error:{
                message:err.message,
                stack:err.stack
            }
        });
    });

    runner.on('end', function () {
        runner.stats.failed = failed;
        global.mochaResults = runner.stats;
    });


    // PHANTOMJS
    if (!window.PHANTOMJS) return;

    runner.on('test', function (test) {
        sendMessage('testStart', test.title);
    });

    runner.on('test end', function (test) {
        sendMessage('testDone', test.title, test.state);
    });

    runner.on('suite', function (suite) {
        sendMessage('suiteStart', suite.title);
    });

    runner.on('suite end', function (suite) {
        if (suite.root) return;
        sendMessage('suiteDone', suite.title);
    });

    runner.on('fail', function (test, err) {
        sendMessage('testFail', test.title, err);
    });

    runner.on('end', function () {
        var output = {
            failed:this.failures,
            passed:this.total - this.failures,
            total:this.total
        };

        sendMessage('done', output.failed, output.passed, output.total);
    });

    function sendMessage() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    }
})();


