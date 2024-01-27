from rdflib import Graph

g = Graph()
g.parse("../ontologies/expert.owl")

print(len(g))
g.serialize(destination='../ontologies/expert_v2.owl', format='xml')
