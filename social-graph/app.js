"use strict";

// Graph data structure for social network
// - Users are nodes (strings or numbers)
// - Friendships are undirected edges

class Graph {
	constructor() {
		this.adjacency = new Map(); // Map<userId, Set<friendId>>
	}

	// User management
	addUser(userId) {
		if (!this.adjacency.has(userId)) {
			this.adjacency.set(userId, new Set());
		}
	}

	removeUser(userId) {
		if (!this.adjacency.has(userId)) return;
		// Remove user from all friends' sets
		for (const [otherUserId, friends] of this.adjacency.entries()) {
			if (otherUserId !== userId) {
				friends.delete(userId);
			}
		}
		this.adjacency.delete(userId);
	}

	// Connection management (undirected)
	addConnection(userA, userB) {
		if (userA === userB) return; // ignore self loops
		this.addUser(userA);
		this.addUser(userB);
		this.adjacency.get(userA).add(userB);
		this.adjacency.get(userB).add(userA);
	}

	removeConnection(userA, userB) {
		if (!this.adjacency.has(userA) || !this.adjacency.has(userB)) return;
		this.adjacency.get(userA).delete(userB);
		this.adjacency.get(userB).delete(userA);
	}

	getFriends(userId) {
		return this.adjacency.get(userId) ? new Set(this.adjacency.get(userId)) : new Set();
	}

	getUsers() {
		return Array.from(this.adjacency.keys());
	}

	// Breadth-First Search from a start user, limiting depth if provided
	bfs(startUserId, maxDepth = Infinity) {
		if (!this.adjacency.has(startUserId)) return [];
		const visited = new Set([startUserId]);
		const queue = [[startUserId, 0]]; // [node, depth]
		const order = [];
		while (queue.length) {
			const [node, depth] = queue.shift();
			order.push(node);
			if (depth >= maxDepth) continue;
			for (const neighbor of this.adjacency.get(node)) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push([neighbor, depth + 1]);
				}
			}
		}
		return order;
	}

	// Depth-First Search (iterative)
	dfs(startUserId, maxDepth = Infinity) {
		if (!this.adjacency.has(startUserId)) return [];
		const visited = new Set();
		const stack = [[startUserId, 0]]; // [node, depth]
		const order = [];
		while (stack.length) {
			const [node, depth] = stack.pop();
			if (visited.has(node)) continue;
			visited.add(node);
			order.push(node);
			if (depth >= maxDepth) continue;
			// Push neighbors in reverse-sorted order for deterministic traversal
			const neighbors = Array.from(this.adjacency.get(node)).sort().reverse();
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					stack.push([neighbor, depth + 1]);
				}
			}
		}
		return order;
	}

	// Suggest friends based on friends-of-friends using BFS limited to depth 2
	// Returns array of { userId, mutualCount } sorted by mutualCount desc, then userId asc
	suggestFriends(userId) {
		if (!this.adjacency.has(userId)) return [];
		const directFriends = this.getFriends(userId);
		const mutualCounts = new Map(); // Map<suggestedId, count>
		// For each direct friend, count their friends (excluding self and existing direct friends)
		for (const friend of directFriends) {
			for (const foaf of this.getFriends(friend)) { // friend-of-a-friend
				if (foaf === userId) continue;
				if (directFriends.has(foaf)) continue;
				mutualCounts.set(foaf, (mutualCounts.get(foaf) || 0) + 1);
			}
		}
		// Convert to sorted array
		return Array.from(mutualCounts.entries())
			.map(([suggestedId, mutualCount]) => ({ userId: suggestedId, mutualCount }))
			.sort((a, b) => {
				if (b.mutualCount !== a.mutualCount) return b.mutualCount - a.mutualCount;
				// tie-breaker: lexicographic by userId string value
				return String(a.userId).localeCompare(String(b.userId));
			});
	}
}

// Simple in-memory singleton for the UI
export const socialGraph = new Graph();

// Seed with some default data for quick demo
function seedSampleData(graph) {
	const users = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"];
	for (const u of users) graph.addUser(u);
	graph.addConnection("Alice", "Bob");
	graph.addConnection("Alice", "Carol");
	graph.addConnection("Bob", "Dave");
	graph.addConnection("Carol", "Eve");
	graph.addConnection("Dave", "Frank");
	graph.addConnection("Eve", "Frank");
}

seedSampleData(socialGraph);

// Expose helpers for debugging from the browser console
export function getSuggestionsFor(userId) {
	return socialGraph.suggestFriends(userId);
}

export function connect(a, b) {
	socialGraph.addConnection(a, b);
	return true;
}

export function disconnect(a, b) {
	socialGraph.removeConnection(a, b);
	return true;
}

export function addUser(userId) {
	socialGraph.addUser(userId);
	return true;
}

export function removeUser(userId) {
	socialGraph.removeUser(userId);
	return true;
}

