import json

from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import XSD, RDF, RDFS

g = Graph()
g.parse("../ontologies/expert_v2.owl")
print(len(g))

base = 'http://www.semanticweb.org/taquan/ontologies/expert-ontology#'
base_np = Namespace(base)

triples = []

# insert universities (universities class in ontology)
with open('../data/organization/research_academic_organization/universities.json', 'r', encoding='utf8') as f:
    data = json.load(f)

for item in data:
    name = URIRef((base + item['name']).replace(" ", "_").lower().strip())
    triples.append((name, RDF.type, base_np.University, g))
    triples.append((name, base_np.hasName,
                    Literal(item['name'], datatype=XSD.string), g))
    rank = 0
    rank_count = 0
    for r in item['ranks']:
        rank += r['rank']
        rank_count += 1
    rank = rank // rank_count
    rank = Literal(rank, datatype=XSD.integer)
    triples.append((name, base_np.hasRank, rank, g))
    triples.append((name, base_np.atCountry, Literal(item['country'], datatype=XSD.string), g))

g.addN(triples)

print(len(g))
g.serialize(destination='../ontologies/expert_v2.owl', format='xml')
