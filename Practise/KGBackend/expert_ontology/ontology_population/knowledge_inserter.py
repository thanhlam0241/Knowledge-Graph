import json

from rdflib import Graph, URIRef, Namespace, Literal, XSD
from rdflib.namespace import RDFS, RDF

g = Graph()
g.parse("../ontologies/expert_v2.owl")
print(len(g))

base = 'http://www.semanticweb.org/taquan/ontologies/expert-ontology#'
base_np = Namespace(base)

triples = []

# insert kb taxonomy computer science (knowledge class in ontology)
with open('../data/categories_or_competencies/kb_taxonomy_computer_science.json', 'r', encoding='utf8') as f:
    data = json.load(f)

data_dict = dict()
for item in data:
    data_dict[item['source_id']] = item['id']

for item in data:
    class_name = URIRef((base + item['id'] + '_class').replace(" ", "_").lower().strip())
    name = URIRef((base + item['id']).replace(" ", "_").lower().strip())
    triples.append((class_name, RDF.type, RDFS.Class, g))
    if item['level'] != 1:
        parent_name = URIRef((base + data_dict[item['parent_id']] + '_class').replace(" ", "_").lower().strip())
        triples.append((class_name, RDFS.subClassOf, parent_name, g))
    else:
        triples.append((class_name, RDFS.subClassOf, base_np.Knowledge, g))

    triples.append((name, RDF.type, class_name, g))
    triples.append((name, base_np.hasName, Literal(item['name'], datatype=XSD.string), g))

g.addN(triples)

print(len(g))
g.serialize(destination='../ontologies/expert_v2.owl', format='xml')
