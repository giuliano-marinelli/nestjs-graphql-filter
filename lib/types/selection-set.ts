import { SelectionInputOptions } from '../decorators/selection-set.decorator';

import _ from 'lodash';

export class SelectionInput {
  private selectionSetArray: string[] = [];
  private selectionSetObject: any = {};
  private selectionSetRelations: any = {};

  constructor(info: any, options?: SelectionInputOptions) {
    const selections = info?.fieldNodes
      ? this.getSeletionSetRoot(info?.fieldNodes[0]?.selectionSet?.selections, options?.root)
      : null;
    const variables = info?.variableValues;
    this.selectionSetArray = this.getSelectionSetArray(selections, variables);
    this.selectionSetObject = this.getSelectionSetObject(selections, variables);
    this.selectionSetRelations = this.getSelectionSetRelations(selections, variables);
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
   * Retrieves the relations present in the selection set formatted as:
   *
   * ```javascript
   * { relation: { childRelation: true, anotherRelation: { anotherOne: true } } }
   * ```
   *
   * Relations are all the fields that have subfields in the selection set.
   *
   * @param include - Optional parameter to include specific relations.
   * @returns An object containing the TypeORM relations as keys, with a value of true.
   */
  getRelations = (include?: any): any => {
    return _.merge({}, this.selectionSetRelations, include);
  };

  // convert selections set object to object
  // sub selections set are showed as parent: { child: {} }
  // example: user { name, email, sessions { id, ip } }
  // selectionsSet = { name: {}, email: {}, sessions: { id: {}, ip: {} } }
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

  // convert selections set object to relations object
  // sub selections set are showed as parent: { child: true }
  // example: user { name, email, sessions { id, ip, device: { id } } }
  // selectionsSet = { sessions: { device: true } }
  private getSelectionSetRelations = (selections: readonly any[], variables: any): any => {
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

      if (shouldInclude && selection.selectionSet?.selections?.length) {
        fields[selection.name.value] = true;
        const selectionSetResult = this.getSelectionSetRelations(selection.selectionSet.selections, variables);
        if (Object.keys(selectionSetResult).length) {
          fields[selection.name.value] = selectionSetResult;
        }
      }
    }

    return fields;
  };

  // convert selections set object to array of string fields
  // sub selections set are showed as parent.child
  // example: user { name, email, sessions { id, ip } }
  // selectionsSet = ['name', 'email', 'sessions.id', 'sessions.ip']
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
