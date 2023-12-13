import { ObjectId } from "mongodb";

export type Ingredient = {
  amount: string;
  units: string;
  ingredient: string;
};

export type Image = {
  url: string;
};

export type Meta = {
  likes: number;
  favourites: number;
};

export type Recipe = {
  _id: string;
  title: string; 
  author: string;
  description: string;
  ingredients: Ingredient[];
  images: Image[];
  date: Date;
  meta: Meta;
  instructions: string;
};
