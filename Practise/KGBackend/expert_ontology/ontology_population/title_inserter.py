import json

from rdflib import Graph, URIRef, Namespace
from rdflib.namespace import RDF, RDFS

g = Graph()
g.parse("../ontologies/expert_v2.owl")
print(len(g))

base = 'http://www.semanticweb.org/taquan/ontologies/expert-ontology#'
base_np = Namespace(base)

triples = []

# insert academic rank (title class in ontology)
with open('../data/title/academic_rank.json', 'r', encoding='utf8') as f:
    data = json.load(f)

for item in data:
    name = URIRef((base + item['_source.name']).replace(" ", "_").lower().strip())
    triples.append((name, RDF.type, base_np.Title, g))

# insert corporate title (title class in ontology)
with open('../data/title/kb_corporate_title.json', 'r', encoding='utf8') as f:
    data = json.load(f)

for item in data:
    name = URIRef((base + item['name']).replace(" ", "_").lower().strip())
    triples.append((name, RDF.type, base_np.Title, g))

g.addN(triples)

print(len(g))
g.serialize(destination='../ontologies/expert_v2.owl', format='xml')
