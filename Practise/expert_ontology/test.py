import brickschema

g = brickschema.Graph(load_brick=True)

g.load_file("ontologies/expert_v3.owl")

g.expand(profile="rdfs")

# validate your Brick graph against built-in shapes (or add your own)
valid, _, resultsText = g.validate()
if not valid:
    print("Graph is not valid!")
    print(resultsText)
