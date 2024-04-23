import { ImageSource, Loader } from 'excalibur';
import ResourcesConfig from './config/ResourcesConfig';

export default class Resources {
	/**
	 * Game resources
	 */
	private readonly resources: Record<string, ImageSource>;

	/**
	 * Excalibur loader
	 */
	private loader: Loader | null = null;

	constructor() {
		this.resources = Object.entries(ResourcesConfig.config.images).reduce<Record<string, ImageSource>>(
			(acc, [key, value]) => {
				acc[key] = new ImageSource(value);
				return acc;
			},
			{}
		);
	}

	/**
	 * Get resources
	 */
	public getResources(): Record<string, ImageSource> {
		return this.resources;
	}

	/**
	 * Load resources
	 */
	public loadResources(): Loader {
		if (this.loader === null) {
			this.loader = new Loader(Object.values(this.resources));
			this.loader.logoWidth = 128;
			this.loader.logoHeight = 128;
			this.loader.backgroundColor = ResourcesConfig.config.colors.defaultBackground;
			this.loader.logo = this.resources.Logo.path;
			this.loader.playButtonText = 'Play';
		}

		return this.loader;
	}
}
