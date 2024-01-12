/**
 * Create the neo4j driver to use in Popoto query runner
 *
 * See Neo4j driver documentation here:
 * https://neo4j.com/docs/javascript-manual/current/get-started/
 * https://neo4j.com/docs/api/javascript-driver/4.3/
 */
var driver = neo4j.driver(
    "neo4j+s://996e435d.databases.neo4j.io", // Unencrypted
    //"neo4j+s://dff437fa.databases.neo4j.io", //Encrypted with Full Certificate
    neo4j.auth.basic("neo4j", "xb_2POpZGeds00bxEdaIQ_p3HXz5vma7HspkVzB8SLo"),
    //{disableLosslessIntegers: true} // Enabling native numbers
);

console.log(driver)
console.log(popoto)

/**
 * Set the driver to Popoto's query runner
 */
popoto.runner.DRIVER = driver

/**
 * Define the Label provider you need for your application.
 * This configuration is mandatory and should contain at least all the labels you could find in your graph model.
 *
 * In this version only nodes with a label are supported.
 *
 * By default If no attributes are specified Neo4j internal ID will be used.
 * These label provider configuration can be used to customize the node display in the graph.
 * See www.popotojs.com or example for more details on available configuration options.
 */
popoto.provider.node.Provider = {
    "Actor": {
        "returnAttributes": ["name", "born"],
        "constraintAttribute": "name",
        "autoExpandRelations": true // if set to true Person nodes will be automatically expanded in graph
    },
    "Movie": {
        "returnAttributes": ["title", "released", "budget"],
        "constraintAttribute": "title"
    }
};

/**
  * Here a listener is used to retrieve the total results count and update the page accordingly.
  * This listener will be called on every graph modification.
  */
popoto.result.onTotalResultCount(function (count) {
    document.getElementById("result-total-count").innerHTML = "(" + count + ")";
});

/**
  * The number of results returned can be changed with the following parameter.
  * Default value is 100.
  *
  * Note that in this current version no pagination mechanism is available in displayed results
  */
popoto.query.RESULTS_PAGE_SIZE = 100;
/**
  * You can activate debug traces with the following properties:
  * The value can be one of these values: DEBUG, INFO, WARN, ERROR, NONE.
  *
  * With INFO level all the executed cypher query can be seen in the navigator console.
  * Default is NONE
  */
popoto.logger.LEVEL = popoto.logger.LogLevels.INFO;

/**
 * Start popoto.js generation.
 * The function requires the label to use as root element in the graph.
 */
popoto.start("Actor");

driver.verifyConnectivity().then(function () {
    popoto.start("Actor");
}).catch(function (error) {
    // Handle error...
})