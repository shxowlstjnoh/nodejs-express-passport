var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var authData = require('../lib/authData');
const { format } = require('path');

module.exports = function (passport) {
    router.get(`/login`, function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - auth';
        var list = template.list(request.list);
        var html = template.HTML(
            title,
            list,
            `
          <div style="color:red;">${feedback}</div>
          <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="text" name="pwd" placeholder="password"></p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
            ''
        );
        response.send(html);
    });

    router.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true, successFlash: true }),
        function (request, response) {
            request.session.save(function () {
                response.redirect('/');
            });
        }
    );

    router.get(`/logout`, function (request, response) {
        request.logout();
        response.redirect('/');
    });
    return router;
};
