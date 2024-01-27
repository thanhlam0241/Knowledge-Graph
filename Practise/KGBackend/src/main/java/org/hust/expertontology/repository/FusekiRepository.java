package org.hust.expertontology.repository;

import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.*;
import org.hust.expertontology.model.Segmentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Repository
public class FusekiRepository {

    private static final Logger logger = LoggerFactory.getLogger(FusekiRepository.class);
    private static final ByteArrayOutputStream BAOS = new ByteArrayOutputStream();

    private final OntModel readOnto;

    private final OntModel segmentOnto;

    public FusekiRepository(
            @Qualifier("readOnto") OntModel readOnto,
            @Qualifier("segmentOnto") OntModel segmentOnto
    ) {
        this.readOnto = readOnto;
        this.segmentOnto = segmentOnto;
    }

    public String receiveSparqlQuery(String request) {
        Query query = QueryFactory.create(request);
        QueryExecution queryExecution = QueryExecutionFactory.create(query, this.readOnto);
        ResultSet resultSet = queryExecution.execSelect();
        ResultSetFormatter.outputAsJSON(BAOS, resultSet);
        String result = BAOS.toString();
        BAOS.reset();
        queryExecution.close();
        return result;
    }

    public void segmentOntology(Segmentation segmentation) throws IOException {
        // build query
        String sparql_query = String.format("""
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX expert: <http://www.semanticweb.org/taquan/ontologies/expert-ontology#>
                SELECT ?s ?p ?o WHERE {
                    {
                        ?s ?p ?o.
                        ?s expert:hasName "%s".
                    }

                }
                """, segmentation.getSubject());

        // perform sparql query
        Query query = QueryFactory.create(sparql_query);
        QueryExecution queryExecution = QueryExecutionFactory.create(query, this.readOnto);
        ResultSet resultSet = queryExecution.execSelect();

        // add resultset to segment model
        List<QuerySolution> list = ResultSetFormatter.toList(resultSet);
        for (QuerySolution querySolution : list) {
            RDFNode s = querySolution.get("?s");
            RDFNode p = querySolution.get("?p");
            RDFNode o = querySolution.get("?o");

            if (o.isLiteral()) {
                Class<?> clazz = o.asLiteral().getDatatype().getJavaClass();
                if (clazz == java.lang.String.class) {
                    this.segmentOnto.add(
                            ResourceFactory.createResource(String.valueOf(s)),
                            ResourceFactory.createProperty(String.valueOf(p)),
                            ResourceFactory.createTypedLiteral(String.valueOf(o), XSDDatatype.XSDstring)
                    );
                } else {
                    logger.info("different type: " + clazz);
                }
            } else {
                this.segmentOnto.add(
                        ResourceFactory.createResource(String.valueOf(s)),
                        ResourceFactory.createProperty(String.valueOf(p)),
                        ResourceFactory.createResource(String.valueOf(o))
                );
            }

            // segment resultSet to ontology file
            FileOutputStream fs = new FileOutputStream("tmp_ontology.owl");
            OutputStreamWriter out = new OutputStreamWriter(fs, StandardCharsets.UTF_8);

            try {
                this.segmentOnto.write(out, "RDF/XML");
            } finally {
                try {
                    out.close();
                } catch (IOException closeException) {
                    logger.error(closeException.toString());
                }
            }
        }

    }
}