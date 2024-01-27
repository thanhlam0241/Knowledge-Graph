package org.hust.expertontology;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.StmtIterator;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.hust.expertontology.Utils.NodeUtil;
import org.hust.expertontology.model.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class Jena {
    public static void main(String[] args) throws IOException {
        Model model = ModelFactory.createDefaultModel();
        model.read("expert_ontology/ontologies/expert_v3.owl");
        model.setNsPrefix("expert", "http://www.semanticweb.org/taquan/ontologies/expert-ontology#");
        Query query = QueryFactory.create(String.format("""
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX expert: <http://www.semanticweb.org/taquan/ontologies/expert-ontology#>
                SELECT * WHERE {
                ?uri rdf:type expert:%s.
                ?uri expert:hasName ?name.
                }""", "Expert"));
        QueryExecution queryExecution = QueryExecutionFactory.create(query, model);
        ResultSet resultSet = queryExecution.execSelect();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        ResultSetFormatter.outputAsJSON(byteArrayOutputStream, resultSet);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(byteArrayOutputStream.toString());
        String json = jsonNode.get("results").get("bindings").toString();
        System.out.println(byteArrayOutputStream.toString());
        List<BaseEntity> list = objectMapper.readValue(json, new TypeReference<List<BaseEntity>>(){});

        queryExecution.close();

    }
}
