package org.hust.expertontology.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class BaseEntity {
    private Property name;
    private Property uri;
}
