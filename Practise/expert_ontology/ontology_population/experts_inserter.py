import json

from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, XSD
from random import randint

g = Graph()
g.parse("ontologies/expert_v2.owl")
print(len(g))

base = 'http://www.semanticweb.org/taquan/ontologies/expert-ontology#'
base_np = Namespace(base)

triples = []


def get_name(item):
    return URIRef((base + item['name']).replace(" ", "_").lower().strip())


def get_title(item):
    return URIRef((base + item['_source.names.en']).replace(" ", "_").lower().strip())


with open('../data/expert/experts_first_crawl.json', 'r', encoding='utf8') as f:
    expert_data = json.load(f)[:2000]

with open('../data/organization/research_academic_organization/universities.json', 'r', encoding='utf8') as f:
    uni_data = list(map(get_name, json.load(f)))

with open('../data/categories_or_competencies/kb_taxonomy_computer_science.json', 'r', encoding='utf8') as f:
    knowledge_data = list(map(get_name, json.load(f)))

with open('../data/occupation/job_title.json', 'r', encoding='utf8') as f:
    title_data = list(map(get_title, json.load(f)))

with open('../data/organization/industry/companies.json', 'r', encoding='utf8') as f:
    company_data = list(map(get_name, json.load(f)))

for item in expert_data:
    name = URIRef((base + item['name'] + item['id']).replace(" ", "_").lower().strip())
    triples.append((name, RDF.type, base_np.Expert, g))
    triples.append((name, base_np.hasName, Literal(item['name'], datatype=XSD.string), g))
    nameBNode = URIRef((base + item['name'] + '_bnode').replace(" ", "_").lower().strip())
    triples.append((nameBNode, RDF.type, base_np.Expertise, g))
    triples.append((name, base_np.hasExpertise, nameBNode, g))
    triples.append((name, base_np.hasEducation, uni_data[randint(0, len(uni_data) - 1)], g))
    triples.append((name, base_np.hasCompetency, knowledge_data[randint(0, len(knowledge_data) - 1)], g))
    triples.append((name, base_np.hasCompetency, knowledge_data[randint(0, len(knowledge_data) - 1)], g))
    triples.append((name, base_np.hasCompetency, knowledge_data[randint(0, len(knowledge_data) - 1)], g))
    triples.append((name, base_np.workFor, company_data[randint(0, len(company_data) - 1)], g))
    triples.append((name, base_np.hasOccupation, title_data[randint(0, len(title_data) - 1)], g))


g.addN(triples)

print(len(g))
g.serialize(destination='../ontologies/expert_v3.owl', format='xml')
