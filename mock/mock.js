const test = require('./json/test.json');

function Mock(app) {
    app.get('/login/check_login(.*)', function(req, res) {
        console.log('getPower111');
        res.json(test);
    });
    /*app.post('/reconfig', function(req, res) {
        console.log('reConfig111');
        res.json(reConfig);
    });
    app.post('/conlist', function(req, res) {
        console.log('reConList111');
        res.json(reConList);
    });
    app.post('/regroup', function(req, res) {
        console.log('reGroup111');
        res.json(reGroup);
    });*/
}

module.exports = Mock;