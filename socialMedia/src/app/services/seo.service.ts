import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FRONTEND_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  frontend_url = FRONTEND_URL;

  constructor(private meta: Meta, private titleService: Title) {}

  generateTags(configs: any) {
    // default values
    configs = {
      title: 'Social Media',
      description:
        'Social media are interactive technologies that facilitate the creation and sharing of content, ideas, interests, and other forms of expression through virtual communities and networks.',
      image: `${this.frontend_url}/assets/logo.png`,
      slug: '',
      ...configs,
    };

    // Set a title
    this.titleService.setTitle(configs['title']);

    // Set meta tags

    // Set Twitter meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@socialMedia' });
    this.meta.updateTag({ name: 'twitter:title', content: configs['title'] });
    this.meta.updateTag({
      name: 'twitter:description',
      content: configs['description'],
    });
    this.meta.updateTag({ name: 'twitter:image', content: configs['image'] });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: configs['description'],
    });

    // Set Facebook meta tags
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Social Media' });
    this.meta.updateTag({ property: 'og:title', content: configs['title'] });
    this.meta.updateTag({
      property: 'og:description',
      content: configs['description'],
    });
    this.meta.updateTag({ property: 'og:image', content: configs['image'] });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: configs['description'],
    });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://social-media.com/${configs['slug']}`,
    });

    // Set Description meta tag
    this.meta.updateTag({
      name: 'description',
      content: configs['description'],
    });
  }
}
