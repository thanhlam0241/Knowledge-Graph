package org.hust.expertontology.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.StmtIterator;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.hust.expertontology.Utils.NodeUtil;
import org.hust.expertontology.model.BaseEntity;
import org.hust.expertontology.model.Edge;
import org.hust.expertontology.model.Node;
import org.hust.expertontology.model.RelationShip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class GraphService {
    public List<BaseEntity> getListEntitiesByClass(String className, String limit) throws IOException {
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
                }
                LIMIT %s""", className, limit));
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
        return list;
    }

    public List<RelationShip> getRelationShipByUri(String uri) {
        Model model = ModelFactory.createDefaultModel();
        model.read("expert_ontology/ontologies/expert_v3.owl");
        StmtIterator it =  model.listStatements();
        List<RelationShip> list = new ArrayList<>();
        int count = 0;
        while(it.hasNext()) {
            var stmt = it.nextStatement();
            var obj = stmt.getObject();
            var pred = stmt.getPredicate();
            var sub = stmt.getSubject();
            String uriSub = sub.isURIResource() ? sub.getURI() : "";
            String uriPred = pred.getURI();
            String uriObj = obj.isLiteral() ? null : obj.asResource().getURI();;
            var localNameSub = uriSub.equals("") ? sub.getLocalName() : NodeUtil.getLocalName(uriSub);
            var localNamePred = pred.getLocalName();
            var localNameObj = obj.isLiteral() ? obj.asLiteral().getString() : obj.asResource().getLocalName();

            if(NodeUtil.CheckNullOrEmpty(localNameSub) || NodeUtil.CheckNullOrEmpty(localNamePred) || NodeUtil.CheckNullOrEmpty(localNameObj)) {
                continue;
            }
            boolean isExist = false;
            if(localNamePred.equals("type") || localNamePred.equals("comment") || localNamePred.equals("label")  ) {
                for(RelationShip r : list) {
                    if(r.subject.name.equals(localNameSub) && r.subject.uri.equals(uriSub) ) {
                        isExist = true;
                        break;
                    }
                }
            }

            if(isExist){
                continue;
            }
                System.out.println(localNameSub + " " + localNamePred + " " + localNameObj);

                list.add(new RelationShip(){
                    {
                        object = new Node(){{
                            name = localNameObj;
                            uri = uriObj;
                            type = obj.isLiteral() ? "literal" : "resource";
                        }};
                        predicate = new Edge(){{
                            name = localNamePred;
                            uri = uriPred;
                            type = obj.isLiteral() ? "literal" : "resource";
                        }};
                        subject = new Node(){{
                            name = localNameSub;
                            uri = sub.getURI();
                            type = sub.isLiteral() ? "literal" : "resource";
                        }};
                    }
                });

        }
        return list;
    }

    public List<RelationShip> getRelationShipByUriExpert(String uri) {
        Model model = ModelFactory.createDefaultModel();
        model.read("expert_ontology/ontologies/expert_v3.owl");
        StmtIterator it =  model.listStatements();
        List<RelationShip> list = new ArrayList<>();
        int count = 0;
        while(it.hasNext()) {
            var stmt = it.nextStatement();
            var obj = stmt.getObject();
            var pred = stmt.getPredicate();
            var sub = stmt.getSubject();
            String uriSub = sub.isURIResource() ? sub.getURI() : "";
            String uriPred = pred.getURI();
            String uriObj = obj.isLiteral() ? null : obj.asResource().getURI();;
            var localNameSub = uriSub.equals("") ? sub.getLocalName() : NodeUtil.getLocalName(uriSub);
            var localNamePred = pred.getLocalName();
            var localNameObj = obj.isLiteral() ? obj.asLiteral().getString() : obj.asResource().getLocalName();

            if(NodeUtil.CheckNullOrEmpty(localNameSub) || NodeUtil.CheckNullOrEmpty(localNamePred) || NodeUtil.CheckNullOrEmpty(localNameObj)) {
                continue;
            }
            boolean isExist = false;
            if(localNamePred.equals("type") || localNamePred.equals("comment") || localNamePred.equals("label")  ) {
                for(RelationShip r : list) {
                    if(r.subject.name.equals(localNameSub) && r.subject.uri.equals(uriSub) ) {
                        isExist = true;
                        break;
                    }
                }
            }

            if(isExist){
                continue;
            }

            if((uriSub != null && uriSub.equals(uri)) || (uriObj != null && uriObj.equals(uri))){

                System.out.println(localNameSub + " " + localNamePred + " " + localNameObj);

                list.add(new RelationShip(){
                    {
                        object = new Node(){{
                            name = localNameObj;
                            uri = uriObj;
                            type = obj.isLiteral() ? "literal" : "resource";
                        }};
                        predicate = new Edge(){{
                            name = localNamePred;
                            uri = uriPred;
                            type = obj.isLiteral() ? "literal" : "resource";
                        }};
                        subject = new Node(){{
                            name = localNameSub;
                            uri = sub.getURI();
                            type = sub.isLiteral() ? "literal" : "resource";
                        }};
                    }
                });
            }
        }
        return list;
    }
}
