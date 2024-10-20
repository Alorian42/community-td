import { AnimationMixer, Vector3, type Mesh, type AnimationActionLoopStyles } from 'three';

export default class Unit {
	protected created: boolean = false;
	protected mixer: AnimationMixer | null = null;
	protected animation: Record<string, any> = {};
	protected mesh!: Mesh;

	public create(): void {
		this.mixer = new AnimationMixer(this.mesh);
		this.mixer.clipAction(this.animation.idle).play();

		this.created = true;
	}

	public destroy(): void {
		this.mesh.geometry?.dispose();

		if (this.mesh.material) {
			if (Array.isArray(this.mesh.material)) {
				this.mesh.material.forEach(material => material.dispose());
			} else {
				this.mesh.material.dispose();
			}
		}

		this.mixer?.stopAllAction();
		this.mesh.removeFromParent();
	}

	public getMesh(): Mesh {
		if (!this.created) {
			this.create();
		}

		return this.mesh;
	}

	public startMove(x: number, y: number, currentX: number, currentY: number): void {
		const direction = new Vector3();
		direction.subVectors(new Vector3(x, 0, y), new Vector3(currentX, 0, currentY));
		direction.normalize();
		const angle = Math.atan2(direction.x, direction.z);

		this.mesh.children[0].rotation.y = angle;

		this.playMoveAnimation();
	}

	public move(x: number, y: number): void {
		this.mesh.position.set(x, 0, y);
	}

	public stopMove(): void {
		this.playIdleAnimation();
	}

	public startAttack(): void {
		this.playAttackAnimation();
	}

	public stopAttack(): void {
		this.playIdleAnimation();
	}

	public updateAnimation(delta: number): void {
		if (this.mixer) {
			this.mixer.update(delta);
		}
	}

	public setAnimation(name: string, animation: any, loop: AnimationActionLoopStyles): void {
		this.animation[name] = animation;
		this.animation[name].loop = loop;
	}

	public setMesh(mesh: Mesh): void {
		this.mesh = mesh;
	}

	public isCreated(): boolean {
		return this.created;
	}

	private playMoveAnimation(): void {
		if (this.animation.move && this.mixer) {
			this.mixer.stopAllAction();
			this.mixer.clipAction(this.animation.move).play();
		}
	}

	private playIdleAnimation(): void {
		if (this.animation.idle && this.mixer) {
			this.mixer.stopAllAction();
			this.mixer.clipAction(this.animation.idle).play();
		}
	}

	private playAttackAnimation(): void {
		if (this.animation.attack && this.mixer) {
			this.mixer.stopAllAction();
			this.mixer.clipAction(this.animation.attack).play();
		}
	}
}
