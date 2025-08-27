# Social Graph - Friend Suggestions (Graph + BFS/DFS)

A tiny, dependency-free web app demonstrating friend suggestions using a social network modeled as a graph.

- Users are nodes; friendships are undirected edges
- Suggestions are friends-of-friends ranked by mutual counts
- Includes BFS and DFS traversals for learning

## Run

Open `index.html` in a browser.

If serving locally:

```bash
python3 -m http.server 8080
# visit http://localhost:8080/social-graph/
```

## Features

- Add/remove users
- Add/remove connections (undirected)
- Inspect a user: view friends
- Suggest friends with mutual counts
- BFS/DFS traversals from a start user

## Files

- `app.js`: `Graph` class and sample seed
- `index.html`: UI wiring, renders lists and actions
- `style.css`: minimal styling

## Suggestion logic

- Excludes the selected user and their direct friends
- Counts mutual connections via friends-of-friends
- Sorts by mutualCount desc, then by userId