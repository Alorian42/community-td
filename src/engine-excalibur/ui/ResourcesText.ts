import { Color, Font, Label, Vector } from 'excalibur';
import { type IResources } from '../../engine-shared/engines/ResourcesEngine';

export default class ResourcesText extends Label {
	protected gold: number = 0;
	protected wood: number = 0;
	protected food: number = 0;
	protected maxFood: number = 0;

	constructor(x: number, y: number) {
		super({
			text: '',
			pos: new Vector(x, y),
			font: new Font({ size: 20 }),
			color: Color.White,
		});

		this.text = this.contructText();
	}

	protected contructText(): string {
		return `G${this.gold} | W${this.wood} | F${this.food}/${this.maxFood}`;
	}

	public updateResources({ gold, wood, food, maxFood }: Partial<IResources>): void {
		if (gold !== undefined) {
			this.gold = gold;
		}

		if (wood !== undefined) {
			this.wood = wood;
		}

		if (food !== undefined) {
			this.food = food;
		}

		if (maxFood !== undefined) {
			this.maxFood = maxFood;
		}

		this.text = this.contructText();
	}
}
