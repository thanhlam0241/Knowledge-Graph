#!/bin/bash
cd database/ExpertOntology/ontology_population
export PYTHONPATH=.
python ontology_duplication.py
python company_inserter.py
python knowledge_inserter.py
python occupation_inserter.py
python title_inserter.py
python university_inserter.py
python experts_inserter.py