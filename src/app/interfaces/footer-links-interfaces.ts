import { Type } from "@angular/core";

export type Links = {
  links: Link[];
}

export type Link = {
  title: string;
  component: Type<any>;
}
