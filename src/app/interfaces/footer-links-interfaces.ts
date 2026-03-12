import type { Type } from '@angular/core';

export type Links = {
  readonly links: readonly Link[];
};

export type Link = {
  readonly title: string;
  readonly component: Type<unknown>;
};
