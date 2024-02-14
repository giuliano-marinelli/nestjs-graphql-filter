import { FindOptionsWhere } from 'typeorm';

// example: where: [{ something: "value" }, {another: "othervalue"}], "user.id", authUser.role == 'user'
// => [{ something: "value", user: { id: authUser.id } }, {another: "othervalue", user: { id: authUser.id }}]
// example 2: where: { something: "value" }, "user.id", authUser.role == 'user'
// => { something: "value", user: { id: authUser.id } }
// example 3: where: [{ something: "value" }, {another: "othervalue"}], "user.id", authUser.role == 'admin'
// => [{ something: "value" }, {another: "othervalue"}]
// example 4: where: { something: "value" }, "user.id", authUser.role == 'admin'

/**
 * Filters the `where` object based on ownership rules.
 *
 * @template T - The type of the object being filtered.
 * @param where - The original `where` object to be filtered.
 * @param path - The path to the ownership rules.
 * @param authUser - The authenticated user.
 * @param authRoles - User roles that can bypass the filter.
 * @param options - Additional options.
 * @param options.idField - The field name for the user object's ID.
 * @param options.roleField - The field name for the user object's role.
 * @returns The filtered `where` object.
 */
export function Owner<T>(
  where: FindOptionsWhere<T>,
  path: string,
  authUser: any,
  authRoles?: string[],
  options?: { idField: string; roleField: string }
): FindOptionsWhere<T>;
export function Owner<T>(
  where: any | any[],
  path: string,
  authUser: any,
  authRolesOrOptions?: string[] | { idField: string; roleField: string },
  options?: { idField: string; roleField: string }
): FindOptionsWhere<T> {
  const [authRoles, opts] = Array.isArray(authRolesOrOptions)
    ? [authRolesOrOptions, options]
    : [undefined, authRolesOrOptions];

  const [idField, roleField] = [opts?.idField ? opts?.idField : 'id', opts?.roleField ? opts?.roleField : 'role'];

  if (authRoles?.includes(authUser[roleField])) {
    return where;
  } else {
    const ownerParam = ownerParameter(path, authUser[idField]);
    if (Array.isArray(where)) {
      return where.map((andBlock) => ({
        ...andBlock,
        ...ownerParam
      })) as FindOptionsWhere<T>;
    } else {
      return { ...where, ...ownerParam };
    }
  }
}

// returns a where parameter with the user id at path
// example: field: "user.id" => { user: { id: userId } }
function ownerParameter(path: string, userId: string | any) {
  const pathParts = path.split('.');
  const parameter = {};
  pathParts.reduce(function (obj, part, index) {
    return index >= pathParts.length - 1 ? (obj[part] = userId) : (obj[part] = {});
  }, parameter);

  return parameter;
}
