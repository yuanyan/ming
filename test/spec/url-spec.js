var expect = require('../lib/expect');
require('../../lib/jquery/jquery');
require('../../dist/module');

describe("url module", function() {

    it("parse a url with all part", function(){
        var url ='http://user:pass@host.com:8080/p/a/t/h/index.html?q1=s1&&q2&q3=s3&#hash-123';
        var obj = $.url(url);
        expect(obj).to.eql({
            anchor: 'hash-123',
            querystring: 'q1=s1&&q2&q3=s3&',
            file: 'index.html',
            directory: '/p/a/t/h/',
            path: '/p/a/t/h/index.html',
            relative: '/p/a/t/h/index.html?q1=s1&&q2&q3=s3&#hash-123',
            port: '8080',
            hostname: 'host.com',
            password: 'pass',
            user: 'user',
            auth: 'user:pass',
            authority: 'user:pass@host.com:8080',
            scheme: 'http',
            href: 'http://user:pass@host.com:8080/p/a/t/h/index.html?q1=s1&&q2&q3=s3&#hash-123',
            query: { q1: 's1', q2: '', q3: 's3' },
            host: 'host.com:8080',
            hash: '#hash-123',
            search: '?q1=s1&&q2&q3=s3&',
            protocol: 'http:'
        });
    });

});
