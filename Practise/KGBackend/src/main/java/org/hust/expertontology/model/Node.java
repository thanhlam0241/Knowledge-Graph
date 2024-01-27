package org.hust.expertontology.model;

public class Node {
    public String name;
    public String type;
    public String uri;
    public Node() {
    }

    public Node(String name, String type, String uri) {
        this.name = name;
        this.type = type;
        this.uri = uri;
    }
}
