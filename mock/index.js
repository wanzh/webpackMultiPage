const fs = require('fs');
const path = require('path');
const proxy = {
    // Priority processing.
    // apiMocker(app, path, option)
    // This is the option parameter setting for apiMocker
    _proxy: {
        proxy: {
            '/repos/(.*)': 'https://api.github.com/',
            '/:owner/:repo/raw/:ref/(.*)': 'http://127.0.0.1:2018'
        },
        changeHost: true,
        // modify the http-proxy options
        httpProxy: {
            options: {
                ignorePath: true,
            },
            listeners: {
                proxyReq: function (proxyReq, req, res, options) {
                    console.log('proxyReq');
                },
            },
        },
    },
    // =====================
    'GET /api/user': {
        id: 1,
        username: 'kenny',
        sex: 6
    },
    'GET /api/user/list': [
        {
            id: 1,
            username: 'kenny',
            sex: 6
        }, {
            id: 2,
            username: 'kenny',
            sex: 6
        }
    ],
    'GET /api/:owner/:repo/raw/:ref/(.*)': (req, res) => {
        const {owner, repo, ref} = req.params;
        // http://localhost:8081/api/admin/webpack-mock-api/raw/master/add/ddd.md
        // owner => admin
        // repo => webpack-mock-api
        // ref => master
        // req.params[0] => add/ddd.md
        return res.json({
            id: 1,
            owner, repo, ref,
            path: req.params[0]
        });
    },

    'POST /logout': (req, res) => {
        const file = path.resolve(__dirname, `./json/login/is_login.txt`);
        fs.writeFileSync(file, 5);
        return res.json({
            type: 'success'
        });
    },
    'POST /login/user_info': (req, res) => {
        const file = path.resolve(__dirname, `./json/login/is_login.txt`);
        const is_login = fs.readFileSync(file).toString();
        let num = Number(is_login);
        if (num <= 0) {//已经登录
            const data = fs.readFileSync(path.resolve(__dirname, `./json/login/user_info2.json`)).toString();
            const json = JSON.parse(data);
            return res.json(json);
        } else {
            const data = fs.readFileSync(path.resolve(__dirname, `./json/login/user_info.json`)).toString();
            const json = JSON.parse(data);
            return res.json(json);
        }
    },
    'POST /login/auth_code': (req, res) => {
        const data = fs.readFileSync(path.resolve(__dirname, `./json/login/auth_code.json`)).toString();
        const json = JSON.parse(data);
        return res.json(json);
    },
    'POST /login/check_login(.*)': (req, res) => {
        const file = path.resolve(__dirname, `./json/login/is_login.txt`);
        const is_login = fs.readFileSync(file).toString();
        let num = Number(is_login);
        if (num <= 0) {
            const data = fs.readFileSync(path.resolve(__dirname, `./json/login/check_login2.json`)).toString();
            const json = JSON.parse(data);
            return res.json(json);
        } else {
            num--;
            fs.writeFileSync(file, num);
            const data = fs.readFileSync(path.resolve(__dirname, `./json/login/check_login.json`)).toString();
            const json = JSON.parse(data);
            return res.json(json);
        }

    },
    'DELETE /api/user/:id': (req, res) => {
        console.log('---->', req.body)
        console.log('---->', req.params.id)
        res.send({status: 'ok', message: '删除成功！'});
    }
}
module.exports = proxy;