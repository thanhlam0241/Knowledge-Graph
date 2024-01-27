package org.hust.expertontology.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SparqlQuery {
    @Schema(
        example = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX expert: <http://www.semanticweb.org/taquan/ontologies/expert-ontology#>
            SELECT ?name ?competencies_name WHERE {
                    ?expert rdf:type expert:Expert.
                    ?expert expert:hasCompetency ?competencies.
                    ?expert expert:hasName ?name.
                    ?competencies rdf:type expert:security_and_privacy_class.
                    ?competencies expert:hasName ?competencies_name.
            }
        """,
        description = "Example sparql query"
    )
    private String query;
}

