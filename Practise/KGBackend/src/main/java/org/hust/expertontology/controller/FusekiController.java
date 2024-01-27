package org.hust.expertontology.controller;

import lombok.RequiredArgsConstructor;
import org.apache.jena.sparql.resultset.RDFOutput;
import org.hust.expertontology.model.Segmentation;
import org.hust.expertontology.model.SparqlQuery;
import org.hust.expertontology.service.FusekiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
public class FusekiController {

    private static final Logger logger = LoggerFactory.getLogger(FusekiController.class);

    private final FusekiService fusekiService;

    @GetMapping("/")
    public String index() {
        return "Hello world";
    }

    @PostMapping(value = "/sparql_query", produces = "text/plain;charset=UTF-8")
    public String receiveSparqlQuery(@RequestBody SparqlQuery request) {
        logger.info("request: " + request.getQuery());
        return new String(fusekiService.receiveSparqlQuery(request.getQuery()).getBytes(), StandardCharsets.UTF_8);
    }

    @PostMapping(value = "/segment")
    public void segmentOntology(@RequestBody Segmentation segmentation) throws IOException {
       fusekiService.segmentOntology(segmentation);
    }

}
