export interface FooterResource {
  name: string;
  url: string;
}

export interface ProjectLink {
  name: string;
  url: string;
  iconName: 'code' | 'mail';
}

export const FOOTER_RESOURCES: FooterResource[] = [
  { name: 'Chicago Housing Authority', url: 'https://www.thecha.org' },
  { name: 'Chicago Dept. of Housing', url: 'https://www.chicago.gov/city/en/depts/doh.html' },
];

export const PROJECT_LINKS: ProjectLink[] = [
  { name: 'View on GitHub', url: 'https://github.com/jonathanjacka/chicago-housing-helper', iconName: 'code' },
  { name: 'Contact Developers', url: 'mailto:contact@chicagohousinghelper.org', iconName: 'mail' },
];
