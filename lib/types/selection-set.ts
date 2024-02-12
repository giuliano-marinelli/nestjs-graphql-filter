export class SelectionInput {
  private selectionSetArray: string[] = [];
  private selectionSetObject: any = {};

  constructor(selections: readonly any[]) {
    this.selectionSetArray = this.getSelectionSetArray(selections);
    this.selectionSetObject = this.getSelectionSetObject(selections);
  }

  getAttributes = (): string[] => {
    // filter out relations (ex: sessions._id, sessions.ip)
    return this.selectionSetArray.filter((field) => !field.includes('.'));
  };

  getFullAttributes = (): string[] => {
    return this.selectionSetArray;
  };

  getRelations = (): string[] => {
    // get relations (ex: sessions)
    return this.selectionSetArray.filter((field) => field.includes('.')).map((field) => field.split('.')[0]);
  };

  getTypeORMRelations = (): any => {
    const relations: any = {};
    this.getRelations().forEach((relation) => {
      relations[relation] = true;
    });
    return relations;
  };

  // convert selections set object to object
  // sub selections set are showed as parent: { child: {} }
  // example: user { name, email, sessions { _id, ip } }
  // selectionsSet = { user: { name: {}, email: {}, sessions: { _id: {}, ip: {} } } }
  private getSelectionSetObject = (selections: readonly any[]): any => {
    const fields: any = {};

    for (const selection of selections) {
      if (selection.kind === 'Field') {
        fields[selection.name.value] = {};
      }

      if (selection.selectionSet) {
        fields[selection.name.value] = this.getSelectionSetObject(selection.selectionSet.selections);
      }
    }

    return fields;
  };

  // convert selections set object to array of string fields
  // sub selections set are showed as parent.child
  // example: user { name, email, sessions { _id, ip } }
  // selectionsSet = ['name', 'email', 'sessions._id', 'sessions.ip']
  private getSelectionSetArray = (selections: readonly any[]): string[] => {
    const fields: string[] = [];

    if (!selections) return [];

    for (const selection of selections) {
      if (selection.kind === 'Field') {
        if (selection.selectionSet) {
          fields.push(
            ...this.getSelectionSetArray(selection.selectionSet.selections).map(
              (field) => `${selection.name.value}.${field}`
            )
          );
        } else {
          fields.push(selection.name.value);
        }
      }
    }

    return fields;
  };
}
