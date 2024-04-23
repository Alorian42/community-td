import { ImageSource, Loader } from 'excalibur';
import sword from './images/sword.png';

export const Resources = {
	Sword: new ImageSource(sword),
} as const;

export const loader = new Loader();
Object.values(Resources).forEach(res => {
	loader.addResource(res);
});
