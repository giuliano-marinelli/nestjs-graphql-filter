import { SelectionInputOptions } from '../decorators/selection-set.decorator';

export class SelectionInput {
  private selectionSetArray: string[] = [];
  private selectionSetObject: any = {};

  constructor(info: any, options?: SelectionInputOptions) {
    const selections = info?.fieldNodes
      ? this.getSeletionSetRoot(info?.fieldNodes[0]?.selectionSet?.selections, options?.root)
      : null;
    const variables = info?.variableValues;
    this.selectionSetArray = this.getSelectionSetArray(selections, variables);
    this.selectionSetObject = this.getSelectionSetObject(selections, variables);
  }

  /**
   * Returns an array of attributes from the selection set.
   * Relations (ex: sessions.id, sessions.ip) are filtered out.
   *
   * @returns {string[]} The array of attributes.
   */
  getAttributes = (): string[] => {
    // filter out relations (ex: sessions.id, sessions.ip)
    return this.selectionSetArray.filter((field) => !field.includes('.'));
  };

  /**
   * Returns an array of full attributes.
   *
   * @returns {string[]} The array of full attributes.
   */
  getFullAttributes = (): string[] => {
    return this.selectionSetArray;
  };

  /**
   * Retrieves the relations from the selection set.
   * Relations are fields that include a dot (ex: sessions.id => sessions).
   * @returns An array of relation names.
   */
  getRelations = (): string[] => {
    // get relations (ex: sessions)
    return Array.from(
      new Set(this.selectionSetArray.filter((field) => field.includes('.')).map((field) => field.split('.')[0]))
    );
  };

  /**
   * Retrieves the TypeORM relations present in the selection set.
   *
   * @param include - Optional parameter to include specific relations.
   * @returns An object containing the TypeORM relations as keys, with a value of true.
   */
  getTypeORMRelations = (include?: any): any => {
    const relations: any = {};
    this.getRelations().forEach((relation) => {
      relations[relation] = true;
    });
    if (include) {
      Object.keys(include).forEach((relation) => {
        relations[relation] = include[relation];
      });
    }
    return relations;
  };

  // convert selections set object to object
  // sub selections set are showed as parent: { child: {} }
  // example: user { name, email, sessions { _id, ip } }
  // selectionsSet = { user: { name: {}, email: {}, sessions: { _id: {}, ip: {} } } }
  private getSelectionSetObject = (selections: readonly any[], variables: any): any => {
    const fields: any = {};

    if (!selections) return {};

    for (const selection of selections) {
      const includeDirective = selection.directives?.find((directive) => directive.name.value === 'include');
      const shouldInclude =
        (!includeDirective ||
          includeDirective.arguments.some(
            (arg) => arg?.name?.value === 'if' && variables && variables[arg?.value?.name?.value]
          )) &&
        selection.name.value !== '__typename';

      if (shouldInclude && selection.kind === 'Field') {
        fields[selection.name.value] = {};
      }

      if (shouldInclude && selection.selectionSet) {
        fields[selection.name.value] = this.getSelectionSetObject(selection.selectionSet.selections, variables);
      }
    }

    return fields;
  };

  // convert selections set object to array of string fields
  // sub selections set are showed as parent.child
  // example: user { name, email, sessions { _id, ip } }
  // selectionsSet = ['name', 'email', 'sessions._id', 'sessions.ip']
  private getSelectionSetArray = (selections: readonly any[], variables: any): string[] => {
    const fields: string[] = [];

    if (!selections) return [];

    for (const selection of selections) {
      const includeDirective = selection.directives?.find((directive) => directive.name.value === 'include');
      const shouldInclude =
        (!includeDirective ||
          includeDirective.arguments.some(
            (arg) => arg?.name?.value === 'if' && variables && variables[arg?.value?.name?.value]
          )) &&
        selection.name?.value !== '__typename';

      if (shouldInclude && selection.kind === 'Field') {
        if (selection.selectionSet) {
          fields.push(
            ...this.getSelectionSetArray(selection.selectionSet.selections, variables).map(
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

  private getSeletionSetRoot = (selections: readonly any[], root: string): any => {
    if (!selections) return null;
    if (!root) return selections;

    const rootPath = root.split('.');

    rootPath.forEach((path) => {
      selections = selections.find((selection) => selection.name.value === path)?.selectionSet?.selections;
    });

    return selections;
  };
}
