function newNewYorkState() {


    /**
     * Data taken from
     * New York State Dept of Environmental Conservation
     * Regions
     * www.dec.ny.gov/about/50230.html
     */
    var _regions = [
        { "region"   : "Long Island",
          "counties" : ["Nassau", "Suffolk"] },
        { "region"   : "New York City",
          "counties" : ["Brooklyn", "Bronx", "Manhattan", "Queens", "Staten Island"] },
        { "region"   : "Lower Hudson Valley",
          "counties" : ["Dutchess", "Orange", "Putnam", "Rockland", "Sullivan", "Ulster", "Westchester"] },
        { "region"   : "Capital",
          "counties" : [ "Albany", "Columbia", "Delaware", "Greene", "Montgomery", "Otsego", "Rensselaer", "Schenectady", "Schoharie"] },
        { "region"   : "Eastern Adirondacks",
          "counties" : [ "Clinton", "Essex", "Franklin", "Fulton", "Hamilton", "Saratoga", "Warren", "Washington" ] },
        { "region"   : "Western Adirondacks",
          "counties" : [ "Herkimer", "Jefferson", "Lewis", "Oneida", "St. Lawrence"] },
        { "region"   : "Central New York",
          "counties" : [ "Broome", "Cayuga", "Chenango", "Cortland", "Madison", "Onondaga", "Oswego", "Tioga", "Tompkins"] },
        { "region"   : "Western Finger Lakes",
          "counties" : [ "Chemung", "Genesee", "Livingston", "Monroe", "Ontario", "Orleans", "Schuyler", "Seneca", "Steuben", "Wayne", "Yates"] },
        { "region"   : "Western New York",
          "counties" : [ "Allegany", "Chautauqua", "Cattaraugus", "Erie", "Niagara", "Wyoming" ] 
        } ];

    function regionForCounty(currentRegion) {
        return currentRegion.counties.map(function(element) {
            return { "county" : element,
                     "region" : currentRegion.region };
        });
    };

    function flatten(a, b) {
        return a.concat(b);
    };

    function compareCounty(a, b) {
        if (a.county < b.county)
            return -1;
        if (a.county > b.county) 
            return 1;
        return 0;
    };

    _lookupTable = _regions.map(regionForCounty).reduce(flatten).sort(compareCounty);

    return {
        getRegion: function(c) {
            var bisect = d3.bisector(function(d) { return d.county; }).left;
            var i = bisect(_lookupTable, c);
            if (_lookupTable[i].county == c) {
                return _lookupTable[i].region;
            } else {
                console.log("NYS: unknown county: " + c);
                return c;
            }
        }
    };
}
