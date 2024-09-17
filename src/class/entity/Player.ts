import * as THREE from "three";
import Entity from "./Entity";

export default class Player extends Entity {
	public override create(): void {
		const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
		const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
		const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
		cylinder.position.set(this.x, 0, this.y);
		cylinder.rotation.x = Math.PI / 2;

		this.mesh = cylinder;
		this.speed = 1;
		this.created = true;
	}
}