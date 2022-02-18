class Graph {
	public referenceTable: paper.CurveLocation[] = [];
	public adjacencyList: number[][];
	private sufficientList: [number, number][] = [];

	constructor(curveLocations: paper.CurveLocation[]) {
		this.adjacencyList = new Array(curveLocations.length);
		this.referenceTable = curveLocations;
		for (let i = 0; i < curveLocations.length; i++) {
			this.adjacencyList[i] = [];
		}
	}

	/**
	 *
	 * @param cl1 vertex 1
	 * @param cl2 vertex 2
	 * @param sufficient whether the path finding algorithm will stop once all of the sufficient edges have been visited
	 * @returns {boolean} if the edge has been added
	 */
	public addEdge(
		cl1: paper.CurveLocation,
		cl2: paper.CurveLocation,
		sufficient: boolean = false
	): boolean {
		if (cl1 === cl2) return false;

		const index1 = this.referenceTable.findIndex((value) => {
			if (value.point === cl1.point) return true;
			return false;
		});
		const index2 = this.referenceTable.findIndex((value) => {
			if (value.point === cl2.point) return true;
			return false;
		});

		if (index1 === -1 || index2 === -1) return false;

		this.adjacencyList[index1].push(index2);
		this.adjacencyList[index2].push(index1);
		if (sufficient) this.sufficientList.push([index1, index2]);
		return true;
	}

	/**
	 * @description checks whether a path is a type of eulorian
	 * @returns 0 not eulorian; 1 eulorian cycle; 2 eulorian path
	 */
	private isEulorian(): number {
		if (!this.isConnected) return 0;

		let numOdd = 0;

		for (const adj of this.adjacencyList) {
			if (adj.length % 2 === 1) numOdd++;
		}

		if (numOdd === 0) return 1;
		else if (numOdd === 2) return 2;

		return 0;
	}

	/**
	 * @description checks if a graph is connected
	 * @returns {boolean} if the vertecies in the graph that have edges > 0 are connected
	 */
	private isConnected(): boolean {
		let visited: boolean[] = new Array(this.adjacencyList.length);
		let i;

		for (i = 0; i < this.adjacencyList.length; i++) visited[i] = false;

		for (i = 0; i < this.adjacencyList.length; i++)
			if (this.adjacencyList[i].length !== 0) break;

		if (i === this.adjacencyList.length) return true;

		this.recursionCheck(i, visited);

		for (i = 0; i < this.adjacencyList.length; i++)
			if (visited[i] === false && this.adjacencyList[i].length > 0)
				return false;

		return true;
	}

	/**
	 * @description helper function for the isConnected() function
	 * @param {number} i vertex to check
	 * @param {boolean[]} visited vertex visited status
	 */
	private recursionCheck(i: number, visited: boolean[]) {
		visited[i] = true;

		for (let node of this.adjacencyList[i]) {
			if (!visited[node]) this.recursionCheck(node, visited);
		}
	}

	/**
	 * @description hierholzer's algorithm to find the an eulorian path, with a sufficiency of the edges between the intersections
	 * @param closestPoint choose the vertex closest to this point, to start at with a eulorian cycle
	 * @returns {number[]} path to take
	 */
	public getSufficientEulorianPath(
		closestPoint: paper.Point | null = null
	): paper.CurveLocation[] | false {
		const eulroianResult = this.isEulorian();
		let curVertex = -1;

		// copy the list to delete edges as they are found
		let sufficientListClone = [...this.sufficientList];

		// get point to start at
		if (eulroianResult === 1) {
			// eulorian cycle, can start from anywhere
			if (closestPoint !== null) {
				let d_ = Number.MAX_VALUE;
				let v_ = -1;

				this.referenceTable.forEach((vertex, index) => {
					if (vertex.point.getDistance(closestPoint, false) < d_) {
						v_ = index;
						d_ = vertex.point.getDistance(closestPoint, false);
					}
				});

				curVertex = v_;
			} else {
				curVertex = 0;
			}
		} else if (eulroianResult === 2) {
			// if its a eulorian path, must choose one of the 2 odd vertecies
			for (let i = 0; i < this.adjacencyList.length; i++) {
				if (this.adjacencyList[i].length % 2 === 1) {
					curVertex = i;
					break;
				}
			}
		} else {
			return false;
		}

		let cPath: number[] = [];
		let ePath: number[] = [];

		cPath.push(curVertex);

		while (cPath.length > 0) {
			const u = cPath[cPath.length - 1];

			// all edges are visited
			if (this.adjacencyList[u].length === 0) {
				ePath.push(u);

				// if (this.checkSufficiency(ePath, sufficientListClone)) break;

				cPath.pop();
			} else {
				cPath.push(this.adjacencyList[u][0]);
				this.adjacencyList[u].shift();
			}
		}

		return ePath.map((e) => this.referenceTable[e]);
	}

	private checkSufficiency(
		path: number[],
		edges: [number, number][]
	): boolean {
		for (let i = 0; i < path.length - 1; i++) {
			let indexFound: number =
				edges.indexOf([path[i], path[i + 1]]) !== -1
					? edges.indexOf([path[i], path[i + 1]])
					: edges.indexOf([path[i + 1], path[i]]);

			if (indexFound !== -1) {
				edges.splice(indexFound);
			}
		}

		if (edges.length === 0) {
			return true;
		}
		return false;
	}
}

export default Graph;
