package org.hust.expertontology.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Segmentation {

    private String subject;
    private String verb;
    private String objet;
}
