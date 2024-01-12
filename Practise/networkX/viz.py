import pandas as pd
import networkx as nx
import plotly.graph_objects as go

# Define the heads, relations, and tails
head = [
    "drugA",
    "drugB",
    "drugC",
    "drugD",
    "drugA",
    "drugC",
    "drugD",
    "drugE",
    "gene1",
    "gene2",
    "gene3",
    "gene4",
    "gene50",
    "gene2",
    "gene3",
    "gene4",
]
relation = [
    "treats",
    "treats",
    "treats",
    "treats",
    "inhibits",
    "inhibits",
    "inhibits",
    "inhibits",
    "associated",
    "associated",
    "associated",
    "associated",
    "associated",
    "interacts",
    "interacts",
    "interacts",
]
tail = [
    "fever",
    "hepatitis",
    "bleeding",
    "pain",
    "gene1",
    "gene2",
    "gene4",
    "gene20",
    "obesity",
    "heart_attack",
    "hepatitis",
    "bleeding",
    "cancer",
    "gene1",
    "gene20",
    "gene50",
]

# Create a dataframe
df = pd.DataFrame({"head": head, "relation": relation, "tail": tail})

# Create a graph
G = nx.Graph()
for _, row in df.iterrows():
    G.add_edge(row["head"], row["tail"], label=row["relation"])
# Get positions for nodes
pos = nx.fruchterman_reingold_layout(G, k=0.5)
# Create edge traces
edge_traces = []
for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_trace = go.Scatter(
        x=[x0, x1, None],
        y=[y0, y1, None],
        mode="lines",
        line=dict(width=0.5, color="gray"),
        hoverinfo="none",
    )
    edge_traces.append(edge_trace)

# Create node trace
node_trace = go.Scatter(
    x=[pos[node][0] for node in G.nodes()],
    y=[pos[node][1] for node in G.nodes()],
    mode="markers+text",
    marker=dict(size=10, color="lightblue"),
    text=[node for node in G.nodes()],
    textposition="top center",
    hoverinfo="text",
    textfont=dict(size=7),
)

# Create edge label trace
edge_label_trace = go.Scatter(
    x=[(pos[edge[0]][0] + pos[edge[1]][0]) / 2 for edge in G.edges()],
    y=[(pos[edge[0]][1] + pos[edge[1]][1]) / 2 for edge in G.edges()],
    mode="text",
    text=[G[edge[0]][edge[1]]["label"] for edge in G.edges()],
    textposition="middle center",
    hoverinfo="none",
    textfont=dict(size=7),
)

# Create layout
layout = go.Layout(
    title="Knowledge Graph",
    titlefont_size=16,
    title_x=0.5,
    showlegend=False,
    hovermode="closest",
    margin=dict(b=20, l=5, r=5, t=40),
    xaxis_visible=False,
    yaxis_visible=False,
)

# Create Plotly figure
fig = go.Figure(data=edge_traces + [node_trace, edge_label_trace], layout=layout)

# Show the interactive plot
fig.show()
