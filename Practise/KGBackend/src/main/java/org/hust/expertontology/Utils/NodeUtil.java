package org.hust.expertontology.Utils;

public class NodeUtil {
    public static String getLocalName(String uri){
        var lastName = uri.split("/")[uri.split("/").length - 1];
        if(lastName.contains("#")){
            return lastName.split("#")[1];
        }
        return lastName;
    }
    public static boolean CheckNullOrEmpty(String str){
        return str == null || str.isEmpty();
    }
}
