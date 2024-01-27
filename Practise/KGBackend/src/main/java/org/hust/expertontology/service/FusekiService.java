package org.hust.expertontology.service;

import lombok.RequiredArgsConstructor;
import org.hust.expertontology.model.Segmentation;
import org.hust.expertontology.repository.FusekiRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FusekiService {

    private static final Logger logger = LoggerFactory.getLogger(FusekiService.class);


    private final FusekiRepository fusekiRepository;

    public String receiveSparqlQuery(String request) {
        return fusekiRepository.receiveSparqlQuery(request);
    }

    public void segmentOntology(Segmentation segmentation) throws IOException {
        fusekiRepository.segmentOntology(segmentation);
    }
}
