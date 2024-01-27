package org.hust.expertontology.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.StmtIterator;
import org.hust.expertontology.Utils.NodeUtil;
import org.hust.expertontology.model.BaseEntity;
import org.hust.expertontology.model.Edge;
import org.hust.expertontology.model.Node;
import org.hust.expertontology.model.RelationShip;
import org.hust.expertontology.request.Url;
import org.hust.expertontology.service.GraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/graph")
@Slf4j
@RequiredArgsConstructor
public class GraphController {
    private final GraphService graphService;

    @PostMapping("file")
    public ResponseEntity getByFile(
            @RequestParam("file") MultipartFile file
    ) {
        try (InputStream in = file.getInputStream()) {
            Model model = ModelFactory.createDefaultModel();
            model.read(in, null, "RDF/XML");
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
                System.out.println(localNameSub + " " + localNamePred + " " + localNameObj);
                boolean isExist = false;
                if(localNamePred.equals("type") || localNamePred.equals("comment") || localNamePred.equals("label")  ) {
                    for(RelationShip r : list) {
                        if(r.subject.name.equals(localNameSub) && r.subject.uri.equals(uriSub) ) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if(isExist) continue;

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
            return ResponseEntity.ok(list);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("class")
    public ResponseEntity getByClass(
            @RequestParam("class") String className,
            @RequestParam(required = false, defaultValue = "100") String limit
    ) {
        try {
            List<BaseEntity> list = graphService.getListEntitiesByClass(className, limit);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("expert/uri")
    public ResponseEntity getLinkNode(
            @RequestBody Url url
    ) {
        try {
            List<RelationShip> list = graphService.getRelationShipByUriExpert(url.uri);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("uri")
    public ResponseEntity getByUri(
            @RequestBody Url url
    ) {
        Logger.getGlobal().info("uri: " + url.uri);
        try {
            Model model = ModelFactory.createDefaultModel();
            model.read(url.uri);
            StmtIterator it =  model.listStatements();
            List<RelationShip> list = new ArrayList<>();
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
                System.out.println(localNameSub + " " + localNamePred + " " + localNameObj);
                boolean isExist = false;
                if(localNamePred.equals("type") || localNamePred.equals("comment") || localNamePred.equals("label")  ) {
                    for(RelationShip r : list) {
                        if(r.subject.name.equals(localNameSub) && r.subject.uri.equals(uriSub) ) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if(isExist) continue;

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
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
