from owlready2 import *

onto = get_ontology("../ontologies/expert_v3.owl").load()
with onto: sync_reasoner()


onto.save('../ontologies/expert_pellet.owl')