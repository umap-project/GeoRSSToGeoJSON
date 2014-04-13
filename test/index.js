var test = require('tape').test,
    assert = require('assert'),
    fs = require('fs'),
    g = require('../GeoRSSToGeoJSON').GeoRSSToGeoJSON;

if (!process.browser) {
    var xmldom = require('xmldom');
}

test('Simple GeoRSS - Point', function(t) {
    t.deepEqual(
        JSON.parse(fs.readFileSync('test/data/simple-with-lat-long.geojson')),
        g(toDOM(fs.readFileSync('test/data/simple-with-lat-long.xml'))),
        'simple GeoRSS with <geo:lat> and <geo:long> tags'
    );
    t.deepEqual(
        JSON.parse(fs.readFileSync('test/data/simple-georss-point.geojson')),
        g(toDOM(fs.readFileSync('test/data/simple-georss-point.xml'))),
        'simple GeoRSS with <georss:point> tag'
    );
    t.deepEqual(
        JSON.parse(fs.readFileSync('test/data/items-with-no-geo-are-skipped.geojson')),
        g(toDOM(fs.readFileSync('test/data/items-with-no-geo-are-skipped.xml'))),
        'Items with no geocoding are skipped'
    );
    t.end();
});

function toDOM(_) {
    if (typeof DOMParser === 'undefined') {
        return (new xmldom.DOMParser()).parseFromString(_.toString());
    } else {
        return (new DOMParser()).parseFromString(_, 'text/xml');
    }
}
