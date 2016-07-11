// create simple trainingsDB
// display db data
// update data


function onPageLoaded(args) {
    console.log("Page Loaded");
}
exports.onPageLoaded = onPageLoaded;


  // to store an array of JSON objects
exports.createDB = function() {
  firebase.setValue(
      '/companies',
      [
        {name: 'Telerik', country: 'Bulgaria'},
        {name: 'Google', country: 'USA'}
      ]
  );
};


  // retrieve data
      var onQueryEvent = function(result) {
        // note that the query returns 1 match at a time
        // in the order specified in the query
        if (!result.error) {
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value));
        }
    };

    firebase.query(
        onQueryEvent,
        "/companies",
        {
            // set this to true if you want to check if the value exists or just want the event to fire once
            // default false, so it listens continuously
            singleEvent: true,
            // order by timestamp
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'country' // mandatory when type is 'child'
            },
            // but only companies named 'Telerik'
            // (this range relates to the orderBy clause)
            range: {
                type: firebase.QueryRangeType.EQUAL_TO,
                value: 'Bulgaria'
            },
            // only the first 2 matches
            // (note that there's only 1 in this case anyway)
            limit: {
                type: firebase.QueryLimitType.LAST,
                value: 2
            }
        }
    );

    // update data
      firebase.update(
      '/companies',
      {'foo':'baz'}
  );