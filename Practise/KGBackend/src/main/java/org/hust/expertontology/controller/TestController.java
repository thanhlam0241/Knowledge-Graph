package org.hust.expertontology.controller;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.StmtIterator;
import org.hust.expertontology.Utils.NodeUtil;
import org.hust.expertontology.model.Edge;
import org.hust.expertontology.model.Node;
import org.hust.expertontology.model.RelationShip;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/test")
@Slf4j
public class TestController {
    @GetMapping("/1")
    public ResponseEntity<List<Object>> test() {
        Logger.getGlobal().info("Visualize graph");
        try (InputStream in = new FileInputStream("expert_ontology/ontologies/expert_v3.owl")) {
            Model model = ModelFactory.createDefaultModel();
            model.read(in, null, "RDF/XML");
            StmtIterator it =  model.listStatements();
            var listPrefix = model.getNsPrefixMap();
            List<Object> list = new ArrayList<>();
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
                count++;
                if(count > 200) break;
            }
            return ResponseEntity.ok(list);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/2")
    public ResponseEntity<List<Object>> test1() {
        try (InputStream in = new FileInputStream("expert_ontology/ontologies/expert.owl")) {
            Model model = ModelFactory.createDefaultModel();
            model.read(in, null, "RDF/XML");
            StmtIterator it =  model.listStatements();
            var listPrefix = model.getNsPrefixMap();
            List<Object> list = new ArrayList<>();
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
                count++;
                if(count > 200) break;
            }
            return ResponseEntity.ok(list);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/4")
    public ResponseEntity<List<Object>> test4() {
        try (InputStream in = new FileInputStream("expert_ontology/ontologies/expert_pellet.owl")) {
            Model model = ModelFactory.createDefaultModel();
            model.read(in, null, "RDF/XML");
            StmtIterator it =  model.listStatements();
            var listPrefix = model.getNsPrefixMap();
            List<Object> list = new ArrayList<>();
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
                count++;
                if(count > 200) break;
            }
            return ResponseEntity.ok(list);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/3")
    public ResponseEntity<List<Object>> test3() {
        try (InputStream in = new FileInputStream("expert_ontology/ontologies/expert_hermit.owl")) {
            Model model = ModelFactory.createDefaultModel();
            model.read(in, null, "RDF/XML");
            StmtIterator it =  model.listStatements();
            var listPrefix = model.getNsPrefixMap();
            List<Object> list = new ArrayList<>();
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
                count++;
                if(count > 200) break;
            }
            return ResponseEntity.ok(list);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
