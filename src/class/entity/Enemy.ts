import * as THREE from "three";
import Entity from "./Entity";

export default class Enemy extends Entity {
	public override create(): void {
		const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
		const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(this.x, 1, this.y);

		this.mesh = sphere;
		this.created = true;
	}
}