export class Detail {
  name: string = "";
  stringValue: string = "";
  numberValue: number = -1;
  type: number = 0;
  importance: number = 0;
  required: boolean = true;
  possibleValues: string[] = [];
  metaId: number = 0;
}

export interface Category {
  id?: number;
  name: string;
}
