var GeoRSSToGeoJSON = function (dom, options) {
    var serializer;
    if (typeof XMLSerializer !== 'undefined') {
        serializer = new XMLSerializer();
    // only require xmldom in a node environment
    } else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
        serializer = new (require('xmldom').XMLSerializer)();
    }
    function xml2str(str) { return serializer.serializeToString(str); }
    function get(x, y) { return x.getElementsByTagName(y); }
    function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
    function norm(el) { if (el.normalize) { el.normalize(); } return el; }
    function nodeVal(x) { if (x) {norm(x);} return x && x.firstChild && x.firstChild.nodeValue; }

    var g = {
        type: 'FeatureCollection',
        features: []
    };

    function geom (node) {
        var type, coordinates;
        if (get1(node, 'geo:long')) {
            type = 'Point';
            coordinates = [nodeVal(get1(node, 'geo:long')), nodeVal(get1(node, 'geo:lat'))];
        } else if (get1(node, 'georss:point')) {
            type = 'Point';
            coordinates = nodeVal(get1(node, 'georss:point')).split(' ').reverse();
        }
        if (type && coordinates) {
            return {
                type: type,
                coordinates: coordinates.map(parseFloat)
            };
        }
    }

    function processOne (node) {
        var geometry = geom(node);
        // TODO collect and fire errors
        if (!geometry) return;
        var f = {
            type: "Feature",
            geometry: geometry,
            properties: {
                title: nodeVal(get1(node, 'title')),
                description: nodeVal(get1(node, 'description'))
            }
        };
        g.features.push(f);
    }

    var items = get(dom, 'item');
    for (var i = 0; i < items.length; i++) {
        processOne(items[i]);
    }
    return g;
};
if (typeof module !== 'undefined') module.exports = {GeoRSSToGeoJSON: GeoRSSToGeoJSON};