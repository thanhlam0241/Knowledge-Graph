package org.hust.expertontology.config;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.rdf.model.ModelFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JenaConfig {

    @Bean("readOnto")
    public OntModel getOntoModel() {
        OntModel model = ModelFactory.createOntologyModel();
        model.setNsPrefix("expert", "http://www.semanticweb.org/taquan/ontologies/expert-ontology#");
        model.read("expert_ontology/ontologies/expert_v3.owl");
        return model;
    }

    @Bean("segmentOnto")
    public OntModel getSegmentOntoModel() {
        OntModel model = ModelFactory.createOntologyModel();
        model.setNsPrefix("expert", "http://www.semanticweb.org/taquan/ontologies/expert-ontology#");
        model.read("expert_ontology/ontologies/expert_v3.owl");
        model.removeAll();
        return model;
    }
}
