exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*.js'],
    capabilities: {
        browserName: 'firefox'
    },
    onPrepare: function() {

        // By default, Protractor use data:text/html,<html></html> as resetUrl, but
        // location.replace from the data: to the file: protocol is not allowed
        // (we'll get ‘not allowed local resource’ error), so we replace resetUrl with one
        // with the file: protocol (this particular one will open system's root folder)
        //browser.resetUrl = 'file://';
    }
    //baseUrl: 'file://' + __dirname + '../index.html'
};
