import * as bcrypt from "bcrypt";
import { SelectQueryBuilder } from "typeorm";
import { OrderType } from "./enum/order";
import { PageMetaDto } from "./dto/page-meta.dto";
import { PageOptionsDto } from "./dto/page-options.dto";

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export async function queryPagination<T>({
  query,
  o,
}: {
  query: SelectQueryBuilder<T>;
  o: PageOptionsDto;
}): Promise<[T[], number]> {
  return query
    .take(o.take)
    .skip(o.skip)
    .orderBy(`${query.alias}.${o.sort}`, o.order)
    .getManyAndCount();
}

// export function getVariableName<TResult>(getVar: () => TResult): string {
//   const m = /\(\)=>(.*)/.exec(
//     getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
//   );

//   if (!m) {
//     throw new Error(
//       "The function does not contain a statement matching 'return variableName;'",
//     );
//   }

//   const fullMemberName = m[1];

//   const memberParts = fullMemberName.split('.');

//   return memberParts[memberParts.length - 1];
// }

export function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
