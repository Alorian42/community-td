import { Unit } from 'w3ts';
import { INVENTORY_SIZE_3 } from '../Abilities/Inventory';
import Tower from './Abstract';

export default class BasicTower extends Tower {
	name = 'Basic Tower';
	icon = 'ReplaceableTextures\\CommandButtons\\BTNBookOfSummoning';

	attack = 100;
	armor = 0;
	evade = 0;
	block = 0;
	fireRes = 0;
	coldRes = 0;
	lightningRes = 0;
	attackSpeed = 1;
	critChance = 50;
	critDamage = 25;
	spellCritChance = 0;
	spellCritDamage = 0;

	constructor() {
		super(1, INVENTORY_SIZE_3);
	}

	get unitId(): number {
		return FourCC('t001');
	}

	get buildAbility(): number {
		return FourCC('A006');
	}
}