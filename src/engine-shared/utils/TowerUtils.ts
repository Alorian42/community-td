import { type IResources } from '../engines/ResourcesEngine';
import type Tower from '../tower/Tower';

export default class TowerUtils {
	public static canBuildTowerByClass(resources: IResources, towerClass: any): boolean {
		return (
			resources.gold >= towerClass.goldCost &&
			resources.wood >= towerClass.woodCost &&
			resources.food + towerClass.foodCost <= resources.maxFood
		);
	}

	public static canBuildTower(resources: IResources, tower: Tower): boolean {
		return (
			resources.gold >= tower.getGoldCost() &&
			resources.wood >= tower.getWoodCost() &&
			resources.food + tower.getFoodCost() <= resources.maxFood
		);
	}
}
