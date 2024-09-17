import type { Mesh } from 'three';

export default abstract class Entity {
	protected mesh!: Mesh;
	protected created: boolean = false;

	constructor(protected x: number, protected y: number) {}

	public abstract create(): void;
	public getMesh(): Mesh {
		if (!this.created) {
			this.create();
		}

		return this.mesh;
	}
}