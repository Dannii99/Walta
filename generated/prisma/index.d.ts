
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Budget
 * 
 */
export type Budget = $Result.DefaultSelection<Prisma.$BudgetPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Simulation
 * 
 */
export type Simulation = $Result.DefaultSelection<Prisma.$SimulationPayload>
/**
 * Model MonthlySnapshot
 * 
 */
export type MonthlySnapshot = $Result.DefaultSelection<Prisma.$MonthlySnapshotPayload>
/**
 * Model Loan
 * 
 */
export type Loan = $Result.DefaultSelection<Prisma.$LoanPayload>
/**
 * Model LoanPayment
 * 
 */
export type LoanPayment = $Result.DefaultSelection<Prisma.$LoanPaymentPayload>
/**
 * Model LoanExtraPayment
 * 
 */
export type LoanExtraPayment = $Result.DefaultSelection<Prisma.$LoanExtraPaymentPayload>
/**
 * Model LoanFee
 * 
 */
export type LoanFee = $Result.DefaultSelection<Prisma.$LoanFeePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.budget`: Exposes CRUD operations for the **Budget** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Budgets
    * const budgets = await prisma.budget.findMany()
    * ```
    */
  get budget(): Prisma.BudgetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.simulation`: Exposes CRUD operations for the **Simulation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Simulations
    * const simulations = await prisma.simulation.findMany()
    * ```
    */
  get simulation(): Prisma.SimulationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.monthlySnapshot`: Exposes CRUD operations for the **MonthlySnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MonthlySnapshots
    * const monthlySnapshots = await prisma.monthlySnapshot.findMany()
    * ```
    */
  get monthlySnapshot(): Prisma.MonthlySnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loan`: Exposes CRUD operations for the **Loan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Loans
    * const loans = await prisma.loan.findMany()
    * ```
    */
  get loan(): Prisma.LoanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loanPayment`: Exposes CRUD operations for the **LoanPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoanPayments
    * const loanPayments = await prisma.loanPayment.findMany()
    * ```
    */
  get loanPayment(): Prisma.LoanPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loanExtraPayment`: Exposes CRUD operations for the **LoanExtraPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoanExtraPayments
    * const loanExtraPayments = await prisma.loanExtraPayment.findMany()
    * ```
    */
  get loanExtraPayment(): Prisma.LoanExtraPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loanFee`: Exposes CRUD operations for the **LoanFee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoanFees
    * const loanFees = await prisma.loanFee.findMany()
    * ```
    */
  get loanFee(): Prisma.LoanFeeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Budget: 'Budget',
    Category: 'Category',
    Transaction: 'Transaction',
    Simulation: 'Simulation',
    MonthlySnapshot: 'MonthlySnapshot',
    Loan: 'Loan',
    LoanPayment: 'LoanPayment',
    LoanExtraPayment: 'LoanExtraPayment',
    LoanFee: 'LoanFee'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "budget" | "category" | "transaction" | "simulation" | "monthlySnapshot" | "loan" | "loanPayment" | "loanExtraPayment" | "loanFee"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Budget: {
        payload: Prisma.$BudgetPayload<ExtArgs>
        fields: Prisma.BudgetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BudgetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BudgetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          findFirst: {
            args: Prisma.BudgetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BudgetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          findMany: {
            args: Prisma.BudgetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          create: {
            args: Prisma.BudgetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          createMany: {
            args: Prisma.BudgetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BudgetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          delete: {
            args: Prisma.BudgetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          update: {
            args: Prisma.BudgetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          deleteMany: {
            args: Prisma.BudgetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BudgetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BudgetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>[]
          }
          upsert: {
            args: Prisma.BudgetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BudgetPayload>
          }
          aggregate: {
            args: Prisma.BudgetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBudget>
          }
          groupBy: {
            args: Prisma.BudgetGroupByArgs<ExtArgs>
            result: $Utils.Optional<BudgetGroupByOutputType>[]
          }
          count: {
            args: Prisma.BudgetCountArgs<ExtArgs>
            result: $Utils.Optional<BudgetCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Simulation: {
        payload: Prisma.$SimulationPayload<ExtArgs>
        fields: Prisma.SimulationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SimulationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SimulationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          findFirst: {
            args: Prisma.SimulationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SimulationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          findMany: {
            args: Prisma.SimulationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>[]
          }
          create: {
            args: Prisma.SimulationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          createMany: {
            args: Prisma.SimulationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SimulationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>[]
          }
          delete: {
            args: Prisma.SimulationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          update: {
            args: Prisma.SimulationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          deleteMany: {
            args: Prisma.SimulationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SimulationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SimulationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>[]
          }
          upsert: {
            args: Prisma.SimulationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SimulationPayload>
          }
          aggregate: {
            args: Prisma.SimulationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSimulation>
          }
          groupBy: {
            args: Prisma.SimulationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SimulationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SimulationCountArgs<ExtArgs>
            result: $Utils.Optional<SimulationCountAggregateOutputType> | number
          }
        }
      }
      MonthlySnapshot: {
        payload: Prisma.$MonthlySnapshotPayload<ExtArgs>
        fields: Prisma.MonthlySnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MonthlySnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MonthlySnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          findFirst: {
            args: Prisma.MonthlySnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MonthlySnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          findMany: {
            args: Prisma.MonthlySnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>[]
          }
          create: {
            args: Prisma.MonthlySnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          createMany: {
            args: Prisma.MonthlySnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MonthlySnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>[]
          }
          delete: {
            args: Prisma.MonthlySnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          update: {
            args: Prisma.MonthlySnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          deleteMany: {
            args: Prisma.MonthlySnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MonthlySnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MonthlySnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>[]
          }
          upsert: {
            args: Prisma.MonthlySnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonthlySnapshotPayload>
          }
          aggregate: {
            args: Prisma.MonthlySnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMonthlySnapshot>
          }
          groupBy: {
            args: Prisma.MonthlySnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<MonthlySnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.MonthlySnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<MonthlySnapshotCountAggregateOutputType> | number
          }
        }
      }
      Loan: {
        payload: Prisma.$LoanPayload<ExtArgs>
        fields: Prisma.LoanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          findFirst: {
            args: Prisma.LoanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          findMany: {
            args: Prisma.LoanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>[]
          }
          create: {
            args: Prisma.LoanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          createMany: {
            args: Prisma.LoanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>[]
          }
          delete: {
            args: Prisma.LoanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          update: {
            args: Prisma.LoanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          deleteMany: {
            args: Prisma.LoanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>[]
          }
          upsert: {
            args: Prisma.LoanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          aggregate: {
            args: Prisma.LoanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoan>
          }
          groupBy: {
            args: Prisma.LoanGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoanCountArgs<ExtArgs>
            result: $Utils.Optional<LoanCountAggregateOutputType> | number
          }
        }
      }
      LoanPayment: {
        payload: Prisma.$LoanPaymentPayload<ExtArgs>
        fields: Prisma.LoanPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          findFirst: {
            args: Prisma.LoanPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          findMany: {
            args: Prisma.LoanPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>[]
          }
          create: {
            args: Prisma.LoanPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          createMany: {
            args: Prisma.LoanPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoanPaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>[]
          }
          delete: {
            args: Prisma.LoanPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          update: {
            args: Prisma.LoanPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          deleteMany: {
            args: Prisma.LoanPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoanPaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>[]
          }
          upsert: {
            args: Prisma.LoanPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPaymentPayload>
          }
          aggregate: {
            args: Prisma.LoanPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoanPayment>
          }
          groupBy: {
            args: Prisma.LoanPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoanPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<LoanPaymentCountAggregateOutputType> | number
          }
        }
      }
      LoanExtraPayment: {
        payload: Prisma.$LoanExtraPaymentPayload<ExtArgs>
        fields: Prisma.LoanExtraPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanExtraPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanExtraPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          findFirst: {
            args: Prisma.LoanExtraPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanExtraPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          findMany: {
            args: Prisma.LoanExtraPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>[]
          }
          create: {
            args: Prisma.LoanExtraPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          createMany: {
            args: Prisma.LoanExtraPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoanExtraPaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>[]
          }
          delete: {
            args: Prisma.LoanExtraPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          update: {
            args: Prisma.LoanExtraPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          deleteMany: {
            args: Prisma.LoanExtraPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanExtraPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoanExtraPaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>[]
          }
          upsert: {
            args: Prisma.LoanExtraPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanExtraPaymentPayload>
          }
          aggregate: {
            args: Prisma.LoanExtraPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoanExtraPayment>
          }
          groupBy: {
            args: Prisma.LoanExtraPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanExtraPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoanExtraPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<LoanExtraPaymentCountAggregateOutputType> | number
          }
        }
      }
      LoanFee: {
        payload: Prisma.$LoanFeePayload<ExtArgs>
        fields: Prisma.LoanFeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanFeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanFeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          findFirst: {
            args: Prisma.LoanFeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanFeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          findMany: {
            args: Prisma.LoanFeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>[]
          }
          create: {
            args: Prisma.LoanFeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          createMany: {
            args: Prisma.LoanFeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoanFeeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>[]
          }
          delete: {
            args: Prisma.LoanFeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          update: {
            args: Prisma.LoanFeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          deleteMany: {
            args: Prisma.LoanFeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanFeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoanFeeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>[]
          }
          upsert: {
            args: Prisma.LoanFeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFeePayload>
          }
          aggregate: {
            args: Prisma.LoanFeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoanFee>
          }
          groupBy: {
            args: Prisma.LoanFeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanFeeGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoanFeeCountArgs<ExtArgs>
            result: $Utils.Optional<LoanFeeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    budget?: BudgetOmit
    category?: CategoryOmit
    transaction?: TransactionOmit
    simulation?: SimulationOmit
    monthlySnapshot?: MonthlySnapshotOmit
    loan?: LoanOmit
    loanPayment?: LoanPaymentOmit
    loanExtraPayment?: LoanExtraPaymentOmit
    loanFee?: LoanFeeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    budgets: number
    simulations: number
    loans: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budgets?: boolean | UserCountOutputTypeCountBudgetsArgs
    simulations?: boolean | UserCountOutputTypeCountSimulationsArgs
    loans?: boolean | UserCountOutputTypeCountLoansArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBudgetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSimulationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SimulationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLoansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanWhereInput
  }


  /**
   * Count Type BudgetCountOutputType
   */

  export type BudgetCountOutputType = {
    categories: number
    snapshots: number
  }

  export type BudgetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | BudgetCountOutputTypeCountCategoriesArgs
    snapshots?: boolean | BudgetCountOutputTypeCountSnapshotsArgs
  }

  // Custom InputTypes
  /**
   * BudgetCountOutputType without action
   */
  export type BudgetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BudgetCountOutputType
     */
    select?: BudgetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BudgetCountOutputType without action
   */
  export type BudgetCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }

  /**
   * BudgetCountOutputType without action
   */
  export type BudgetCountOutputTypeCountSnapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlySnapshotWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    transactions: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | CategoryCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type LoanCountOutputType
   */

  export type LoanCountOutputType = {
    fees: number
    payments: number
    extraPayments: number
  }

  export type LoanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fees?: boolean | LoanCountOutputTypeCountFeesArgs
    payments?: boolean | LoanCountOutputTypeCountPaymentsArgs
    extraPayments?: boolean | LoanCountOutputTypeCountExtraPaymentsArgs
  }

  // Custom InputTypes
  /**
   * LoanCountOutputType without action
   */
  export type LoanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanCountOutputType
     */
    select?: LoanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LoanCountOutputType without action
   */
  export type LoanCountOutputTypeCountFeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanFeeWhereInput
  }

  /**
   * LoanCountOutputType without action
   */
  export type LoanCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanPaymentWhereInput
  }

  /**
   * LoanCountOutputType without action
   */
  export type LoanCountOutputTypeCountExtraPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanExtraPaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    budgets?: boolean | User$budgetsArgs<ExtArgs>
    simulations?: boolean | User$simulationsArgs<ExtArgs>
    loans?: boolean | User$loansArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budgets?: boolean | User$budgetsArgs<ExtArgs>
    simulations?: boolean | User$simulationsArgs<ExtArgs>
    loans?: boolean | User$loansArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      budgets: Prisma.$BudgetPayload<ExtArgs>[]
      simulations: Prisma.$SimulationPayload<ExtArgs>[]
      loans: Prisma.$LoanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    budgets<T extends User$budgetsArgs<ExtArgs> = {}>(args?: Subset<T, User$budgetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    simulations<T extends User$simulationsArgs<ExtArgs> = {}>(args?: Subset<T, User$simulationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    loans<T extends User$loansArgs<ExtArgs> = {}>(args?: Subset<T, User$loansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.budgets
   */
  export type User$budgetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    where?: BudgetWhereInput
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    cursor?: BudgetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * User.simulations
   */
  export type User$simulationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    where?: SimulationWhereInput
    orderBy?: SimulationOrderByWithRelationInput | SimulationOrderByWithRelationInput[]
    cursor?: SimulationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SimulationScalarFieldEnum | SimulationScalarFieldEnum[]
  }

  /**
   * User.loans
   */
  export type User$loansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    where?: LoanWhereInput
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    cursor?: LoanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Budget
   */

  export type AggregateBudget = {
    _count: BudgetCountAggregateOutputType | null
    _avg: BudgetAvgAggregateOutputType | null
    _sum: BudgetSumAggregateOutputType | null
    _min: BudgetMinAggregateOutputType | null
    _max: BudgetMaxAggregateOutputType | null
  }

  export type BudgetAvgAggregateOutputType = {
    income: Decimal | null
  }

  export type BudgetSumAggregateOutputType = {
    income: Decimal | null
  }

  export type BudgetMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    income: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BudgetMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    income: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BudgetCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    income: number
    currency: number
    rule: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BudgetAvgAggregateInputType = {
    income?: true
  }

  export type BudgetSumAggregateInputType = {
    income?: true
  }

  export type BudgetMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    income?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BudgetMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    income?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BudgetCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    income?: true
    currency?: true
    rule?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BudgetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Budget to aggregate.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Budgets
    **/
    _count?: true | BudgetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BudgetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BudgetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BudgetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BudgetMaxAggregateInputType
  }

  export type GetBudgetAggregateType<T extends BudgetAggregateArgs> = {
        [P in keyof T & keyof AggregateBudget]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBudget[P]>
      : GetScalarType<T[P], AggregateBudget[P]>
  }




  export type BudgetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BudgetWhereInput
    orderBy?: BudgetOrderByWithAggregationInput | BudgetOrderByWithAggregationInput[]
    by: BudgetScalarFieldEnum[] | BudgetScalarFieldEnum
    having?: BudgetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BudgetCountAggregateInputType | true
    _avg?: BudgetAvgAggregateInputType
    _sum?: BudgetSumAggregateInputType
    _min?: BudgetMinAggregateInputType
    _max?: BudgetMaxAggregateInputType
  }

  export type BudgetGroupByOutputType = {
    id: string
    userId: string
    name: string
    income: Decimal
    currency: string
    rule: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: BudgetCountAggregateOutputType | null
    _avg: BudgetAvgAggregateOutputType | null
    _sum: BudgetSumAggregateOutputType | null
    _min: BudgetMinAggregateOutputType | null
    _max: BudgetMaxAggregateOutputType | null
  }

  type GetBudgetGroupByPayload<T extends BudgetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BudgetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BudgetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BudgetGroupByOutputType[P]>
            : GetScalarType<T[P], BudgetGroupByOutputType[P]>
        }
      >
    >


  export type BudgetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    income?: boolean
    currency?: boolean
    rule?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    categories?: boolean | Budget$categoriesArgs<ExtArgs>
    snapshots?: boolean | Budget$snapshotsArgs<ExtArgs>
    _count?: boolean | BudgetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    income?: boolean
    currency?: boolean
    rule?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    income?: boolean
    currency?: boolean
    rule?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["budget"]>

  export type BudgetSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    income?: boolean
    currency?: boolean
    rule?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BudgetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "income" | "currency" | "rule" | "createdAt" | "updatedAt", ExtArgs["result"]["budget"]>
  export type BudgetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    categories?: boolean | Budget$categoriesArgs<ExtArgs>
    snapshots?: boolean | Budget$snapshotsArgs<ExtArgs>
    _count?: boolean | BudgetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BudgetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BudgetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BudgetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Budget"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      categories: Prisma.$CategoryPayload<ExtArgs>[]
      snapshots: Prisma.$MonthlySnapshotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      income: Prisma.Decimal
      currency: string
      rule: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["budget"]>
    composites: {}
  }

  type BudgetGetPayload<S extends boolean | null | undefined | BudgetDefaultArgs> = $Result.GetResult<Prisma.$BudgetPayload, S>

  type BudgetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BudgetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BudgetCountAggregateInputType | true
    }

  export interface BudgetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Budget'], meta: { name: 'Budget' } }
    /**
     * Find zero or one Budget that matches the filter.
     * @param {BudgetFindUniqueArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BudgetFindUniqueArgs>(args: SelectSubset<T, BudgetFindUniqueArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Budget that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BudgetFindUniqueOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BudgetFindUniqueOrThrowArgs>(args: SelectSubset<T, BudgetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Budget that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BudgetFindFirstArgs>(args?: SelectSubset<T, BudgetFindFirstArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Budget that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindFirstOrThrowArgs} args - Arguments to find a Budget
     * @example
     * // Get one Budget
     * const budget = await prisma.budget.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BudgetFindFirstOrThrowArgs>(args?: SelectSubset<T, BudgetFindFirstOrThrowArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Budgets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Budgets
     * const budgets = await prisma.budget.findMany()
     * 
     * // Get first 10 Budgets
     * const budgets = await prisma.budget.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const budgetWithIdOnly = await prisma.budget.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BudgetFindManyArgs>(args?: SelectSubset<T, BudgetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Budget.
     * @param {BudgetCreateArgs} args - Arguments to create a Budget.
     * @example
     * // Create one Budget
     * const Budget = await prisma.budget.create({
     *   data: {
     *     // ... data to create a Budget
     *   }
     * })
     * 
     */
    create<T extends BudgetCreateArgs>(args: SelectSubset<T, BudgetCreateArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Budgets.
     * @param {BudgetCreateManyArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BudgetCreateManyArgs>(args?: SelectSubset<T, BudgetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Budgets and returns the data saved in the database.
     * @param {BudgetCreateManyAndReturnArgs} args - Arguments to create many Budgets.
     * @example
     * // Create many Budgets
     * const budget = await prisma.budget.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BudgetCreateManyAndReturnArgs>(args?: SelectSubset<T, BudgetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Budget.
     * @param {BudgetDeleteArgs} args - Arguments to delete one Budget.
     * @example
     * // Delete one Budget
     * const Budget = await prisma.budget.delete({
     *   where: {
     *     // ... filter to delete one Budget
     *   }
     * })
     * 
     */
    delete<T extends BudgetDeleteArgs>(args: SelectSubset<T, BudgetDeleteArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Budget.
     * @param {BudgetUpdateArgs} args - Arguments to update one Budget.
     * @example
     * // Update one Budget
     * const budget = await prisma.budget.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BudgetUpdateArgs>(args: SelectSubset<T, BudgetUpdateArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Budgets.
     * @param {BudgetDeleteManyArgs} args - Arguments to filter Budgets to delete.
     * @example
     * // Delete a few Budgets
     * const { count } = await prisma.budget.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BudgetDeleteManyArgs>(args?: SelectSubset<T, BudgetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BudgetUpdateManyArgs>(args: SelectSubset<T, BudgetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Budgets and returns the data updated in the database.
     * @param {BudgetUpdateManyAndReturnArgs} args - Arguments to update many Budgets.
     * @example
     * // Update many Budgets
     * const budget = await prisma.budget.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Budgets and only return the `id`
     * const budgetWithIdOnly = await prisma.budget.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BudgetUpdateManyAndReturnArgs>(args: SelectSubset<T, BudgetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Budget.
     * @param {BudgetUpsertArgs} args - Arguments to update or create a Budget.
     * @example
     * // Update or create a Budget
     * const budget = await prisma.budget.upsert({
     *   create: {
     *     // ... data to create a Budget
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Budget we want to update
     *   }
     * })
     */
    upsert<T extends BudgetUpsertArgs>(args: SelectSubset<T, BudgetUpsertArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Budgets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetCountArgs} args - Arguments to filter Budgets to count.
     * @example
     * // Count the number of Budgets
     * const count = await prisma.budget.count({
     *   where: {
     *     // ... the filter for the Budgets we want to count
     *   }
     * })
    **/
    count<T extends BudgetCountArgs>(
      args?: Subset<T, BudgetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BudgetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BudgetAggregateArgs>(args: Subset<T, BudgetAggregateArgs>): Prisma.PrismaPromise<GetBudgetAggregateType<T>>

    /**
     * Group by Budget.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BudgetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BudgetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BudgetGroupByArgs['orderBy'] }
        : { orderBy?: BudgetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BudgetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBudgetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Budget model
   */
  readonly fields: BudgetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Budget.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BudgetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    categories<T extends Budget$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, Budget$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    snapshots<T extends Budget$snapshotsArgs<ExtArgs> = {}>(args?: Subset<T, Budget$snapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Budget model
   */
  interface BudgetFieldRefs {
    readonly id: FieldRef<"Budget", 'String'>
    readonly userId: FieldRef<"Budget", 'String'>
    readonly name: FieldRef<"Budget", 'String'>
    readonly income: FieldRef<"Budget", 'Decimal'>
    readonly currency: FieldRef<"Budget", 'String'>
    readonly rule: FieldRef<"Budget", 'Json'>
    readonly createdAt: FieldRef<"Budget", 'DateTime'>
    readonly updatedAt: FieldRef<"Budget", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Budget findUnique
   */
  export type BudgetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget findUniqueOrThrow
   */
  export type BudgetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget findFirst
   */
  export type BudgetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget findFirstOrThrow
   */
  export type BudgetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budget to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget findMany
   */
  export type BudgetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter, which Budgets to fetch.
     */
    where?: BudgetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Budgets to fetch.
     */
    orderBy?: BudgetOrderByWithRelationInput | BudgetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Budgets.
     */
    cursor?: BudgetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Budgets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Budgets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Budgets.
     */
    distinct?: BudgetScalarFieldEnum | BudgetScalarFieldEnum[]
  }

  /**
   * Budget create
   */
  export type BudgetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The data needed to create a Budget.
     */
    data: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>
  }

  /**
   * Budget createMany
   */
  export type BudgetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Budget createManyAndReturn
   */
  export type BudgetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * The data used to create many Budgets.
     */
    data: BudgetCreateManyInput | BudgetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Budget update
   */
  export type BudgetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The data needed to update a Budget.
     */
    data: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>
    /**
     * Choose, which Budget to update.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget updateMany
   */
  export type BudgetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to update.
     */
    limit?: number
  }

  /**
   * Budget updateManyAndReturn
   */
  export type BudgetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * The data used to update Budgets.
     */
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyInput>
    /**
     * Filter which Budgets to update
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Budget upsert
   */
  export type BudgetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * The filter to search for the Budget to update in case it exists.
     */
    where: BudgetWhereUniqueInput
    /**
     * In case the Budget found by the `where` argument doesn't exist, create a new Budget with this data.
     */
    create: XOR<BudgetCreateInput, BudgetUncheckedCreateInput>
    /**
     * In case the Budget was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BudgetUpdateInput, BudgetUncheckedUpdateInput>
  }

  /**
   * Budget delete
   */
  export type BudgetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
    /**
     * Filter which Budget to delete.
     */
    where: BudgetWhereUniqueInput
  }

  /**
   * Budget deleteMany
   */
  export type BudgetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Budgets to delete
     */
    where?: BudgetWhereInput
    /**
     * Limit how many Budgets to delete.
     */
    limit?: number
  }

  /**
   * Budget.categories
   */
  export type Budget$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Budget.snapshots
   */
  export type Budget$snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    where?: MonthlySnapshotWhereInput
    orderBy?: MonthlySnapshotOrderByWithRelationInput | MonthlySnapshotOrderByWithRelationInput[]
    cursor?: MonthlySnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MonthlySnapshotScalarFieldEnum | MonthlySnapshotScalarFieldEnum[]
  }

  /**
   * Budget without action
   */
  export type BudgetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Budget
     */
    select?: BudgetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Budget
     */
    omit?: BudgetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BudgetInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    budgetId: string | null
    name: string | null
    type: string | null
    color: string | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    budgetId: string | null
    name: string | null
    type: string | null
    color: string | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    budgetId: number
    name: number
    type: number
    color: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    budgetId?: true
    name?: true
    type?: true
    color?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    budgetId?: true
    name?: true
    type?: true
    color?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    budgetId?: true
    name?: true
    type?: true
    color?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    budgetId: string
    name: string
    type: string
    color: string
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    name?: boolean
    type?: boolean
    color?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
    transactions?: boolean | Category$transactionsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    name?: boolean
    type?: boolean
    color?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    name?: boolean
    type?: boolean
    color?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    budgetId?: boolean
    name?: boolean
    type?: boolean
    color?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "budgetId" | "name" | "type" | "color", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
    transactions?: boolean | Category$transactionsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      budget: Prisma.$BudgetPayload<ExtArgs>
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      budgetId: string
      name: string
      type: string
      color: string
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    budget<T extends BudgetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BudgetDefaultArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transactions<T extends Category$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Category$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly budgetId: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly type: FieldRef<"Category", 'String'>
    readonly color: FieldRef<"Category", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.transactions
   */
  export type Category$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    categoryId: string | null
    amount: Decimal | null
    description: string | null
    date: Date | null
    recurrence: string | null
    createdAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    categoryId: string | null
    amount: Decimal | null
    description: string | null
    date: Date | null
    recurrence: string | null
    createdAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    categoryId: number
    amount: number
    description: number
    date: number
    recurrence: number
    createdAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    categoryId?: true
    amount?: true
    description?: true
    date?: true
    recurrence?: true
    createdAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    categoryId?: true
    amount?: true
    description?: true
    date?: true
    recurrence?: true
    createdAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    categoryId?: true
    amount?: true
    description?: true
    date?: true
    recurrence?: true
    createdAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    categoryId: string
    amount: Decimal
    description: string | null
    date: Date
    recurrence: string
    createdAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    amount?: boolean
    description?: boolean
    date?: boolean
    recurrence?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    amount?: boolean
    description?: boolean
    date?: boolean
    recurrence?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    categoryId?: boolean
    amount?: boolean
    description?: boolean
    date?: boolean
    recurrence?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    categoryId?: boolean
    amount?: boolean
    description?: boolean
    date?: boolean
    recurrence?: boolean
    createdAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "categoryId" | "amount" | "description" | "date" | "recurrence" | "createdAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      categoryId: string
      amount: Prisma.Decimal
      description: string | null
      date: Date
      recurrence: string
      createdAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly categoryId: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Decimal'>
    readonly description: FieldRef<"Transaction", 'String'>
    readonly date: FieldRef<"Transaction", 'DateTime'>
    readonly recurrence: FieldRef<"Transaction", 'String'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Simulation
   */

  export type AggregateSimulation = {
    _count: SimulationCountAggregateOutputType | null
    _min: SimulationMinAggregateOutputType | null
    _max: SimulationMaxAggregateOutputType | null
  }

  export type SimulationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    title: string | null
    aiAnalysis: string | null
    aiAnalysisGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type SimulationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    title: string | null
    aiAnalysis: string | null
    aiAnalysisGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type SimulationCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    title: number
    inputs: number
    result: number
    aiAnalysis: number
    aiAnalysisGeneratedAt: number
    createdAt: number
    _all: number
  }


  export type SimulationMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    aiAnalysis?: true
    aiAnalysisGeneratedAt?: true
    createdAt?: true
  }

  export type SimulationMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    aiAnalysis?: true
    aiAnalysisGeneratedAt?: true
    createdAt?: true
  }

  export type SimulationCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    inputs?: true
    result?: true
    aiAnalysis?: true
    aiAnalysisGeneratedAt?: true
    createdAt?: true
    _all?: true
  }

  export type SimulationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Simulation to aggregate.
     */
    where?: SimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Simulations to fetch.
     */
    orderBy?: SimulationOrderByWithRelationInput | SimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Simulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Simulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Simulations
    **/
    _count?: true | SimulationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SimulationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SimulationMaxAggregateInputType
  }

  export type GetSimulationAggregateType<T extends SimulationAggregateArgs> = {
        [P in keyof T & keyof AggregateSimulation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSimulation[P]>
      : GetScalarType<T[P], AggregateSimulation[P]>
  }




  export type SimulationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SimulationWhereInput
    orderBy?: SimulationOrderByWithAggregationInput | SimulationOrderByWithAggregationInput[]
    by: SimulationScalarFieldEnum[] | SimulationScalarFieldEnum
    having?: SimulationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SimulationCountAggregateInputType | true
    _min?: SimulationMinAggregateInputType
    _max?: SimulationMaxAggregateInputType
  }

  export type SimulationGroupByOutputType = {
    id: string
    userId: string
    type: string
    title: string
    inputs: JsonValue
    result: JsonValue
    aiAnalysis: string | null
    aiAnalysisGeneratedAt: Date | null
    createdAt: Date
    _count: SimulationCountAggregateOutputType | null
    _min: SimulationMinAggregateOutputType | null
    _max: SimulationMaxAggregateOutputType | null
  }

  type GetSimulationGroupByPayload<T extends SimulationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SimulationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SimulationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SimulationGroupByOutputType[P]>
            : GetScalarType<T[P], SimulationGroupByOutputType[P]>
        }
      >
    >


  export type SimulationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    inputs?: boolean
    result?: boolean
    aiAnalysis?: boolean
    aiAnalysisGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["simulation"]>

  export type SimulationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    inputs?: boolean
    result?: boolean
    aiAnalysis?: boolean
    aiAnalysisGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["simulation"]>

  export type SimulationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    inputs?: boolean
    result?: boolean
    aiAnalysis?: boolean
    aiAnalysisGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["simulation"]>

  export type SimulationSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    inputs?: boolean
    result?: boolean
    aiAnalysis?: boolean
    aiAnalysisGeneratedAt?: boolean
    createdAt?: boolean
  }

  export type SimulationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "title" | "inputs" | "result" | "aiAnalysis" | "aiAnalysisGeneratedAt" | "createdAt", ExtArgs["result"]["simulation"]>
  export type SimulationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SimulationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SimulationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SimulationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Simulation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      title: string
      inputs: Prisma.JsonValue
      result: Prisma.JsonValue
      aiAnalysis: string | null
      aiAnalysisGeneratedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["simulation"]>
    composites: {}
  }

  type SimulationGetPayload<S extends boolean | null | undefined | SimulationDefaultArgs> = $Result.GetResult<Prisma.$SimulationPayload, S>

  type SimulationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SimulationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SimulationCountAggregateInputType | true
    }

  export interface SimulationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Simulation'], meta: { name: 'Simulation' } }
    /**
     * Find zero or one Simulation that matches the filter.
     * @param {SimulationFindUniqueArgs} args - Arguments to find a Simulation
     * @example
     * // Get one Simulation
     * const simulation = await prisma.simulation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SimulationFindUniqueArgs>(args: SelectSubset<T, SimulationFindUniqueArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Simulation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SimulationFindUniqueOrThrowArgs} args - Arguments to find a Simulation
     * @example
     * // Get one Simulation
     * const simulation = await prisma.simulation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SimulationFindUniqueOrThrowArgs>(args: SelectSubset<T, SimulationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Simulation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationFindFirstArgs} args - Arguments to find a Simulation
     * @example
     * // Get one Simulation
     * const simulation = await prisma.simulation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SimulationFindFirstArgs>(args?: SelectSubset<T, SimulationFindFirstArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Simulation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationFindFirstOrThrowArgs} args - Arguments to find a Simulation
     * @example
     * // Get one Simulation
     * const simulation = await prisma.simulation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SimulationFindFirstOrThrowArgs>(args?: SelectSubset<T, SimulationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Simulations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Simulations
     * const simulations = await prisma.simulation.findMany()
     * 
     * // Get first 10 Simulations
     * const simulations = await prisma.simulation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const simulationWithIdOnly = await prisma.simulation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SimulationFindManyArgs>(args?: SelectSubset<T, SimulationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Simulation.
     * @param {SimulationCreateArgs} args - Arguments to create a Simulation.
     * @example
     * // Create one Simulation
     * const Simulation = await prisma.simulation.create({
     *   data: {
     *     // ... data to create a Simulation
     *   }
     * })
     * 
     */
    create<T extends SimulationCreateArgs>(args: SelectSubset<T, SimulationCreateArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Simulations.
     * @param {SimulationCreateManyArgs} args - Arguments to create many Simulations.
     * @example
     * // Create many Simulations
     * const simulation = await prisma.simulation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SimulationCreateManyArgs>(args?: SelectSubset<T, SimulationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Simulations and returns the data saved in the database.
     * @param {SimulationCreateManyAndReturnArgs} args - Arguments to create many Simulations.
     * @example
     * // Create many Simulations
     * const simulation = await prisma.simulation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Simulations and only return the `id`
     * const simulationWithIdOnly = await prisma.simulation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SimulationCreateManyAndReturnArgs>(args?: SelectSubset<T, SimulationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Simulation.
     * @param {SimulationDeleteArgs} args - Arguments to delete one Simulation.
     * @example
     * // Delete one Simulation
     * const Simulation = await prisma.simulation.delete({
     *   where: {
     *     // ... filter to delete one Simulation
     *   }
     * })
     * 
     */
    delete<T extends SimulationDeleteArgs>(args: SelectSubset<T, SimulationDeleteArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Simulation.
     * @param {SimulationUpdateArgs} args - Arguments to update one Simulation.
     * @example
     * // Update one Simulation
     * const simulation = await prisma.simulation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SimulationUpdateArgs>(args: SelectSubset<T, SimulationUpdateArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Simulations.
     * @param {SimulationDeleteManyArgs} args - Arguments to filter Simulations to delete.
     * @example
     * // Delete a few Simulations
     * const { count } = await prisma.simulation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SimulationDeleteManyArgs>(args?: SelectSubset<T, SimulationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Simulations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Simulations
     * const simulation = await prisma.simulation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SimulationUpdateManyArgs>(args: SelectSubset<T, SimulationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Simulations and returns the data updated in the database.
     * @param {SimulationUpdateManyAndReturnArgs} args - Arguments to update many Simulations.
     * @example
     * // Update many Simulations
     * const simulation = await prisma.simulation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Simulations and only return the `id`
     * const simulationWithIdOnly = await prisma.simulation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SimulationUpdateManyAndReturnArgs>(args: SelectSubset<T, SimulationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Simulation.
     * @param {SimulationUpsertArgs} args - Arguments to update or create a Simulation.
     * @example
     * // Update or create a Simulation
     * const simulation = await prisma.simulation.upsert({
     *   create: {
     *     // ... data to create a Simulation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Simulation we want to update
     *   }
     * })
     */
    upsert<T extends SimulationUpsertArgs>(args: SelectSubset<T, SimulationUpsertArgs<ExtArgs>>): Prisma__SimulationClient<$Result.GetResult<Prisma.$SimulationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Simulations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationCountArgs} args - Arguments to filter Simulations to count.
     * @example
     * // Count the number of Simulations
     * const count = await prisma.simulation.count({
     *   where: {
     *     // ... the filter for the Simulations we want to count
     *   }
     * })
    **/
    count<T extends SimulationCountArgs>(
      args?: Subset<T, SimulationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SimulationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Simulation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SimulationAggregateArgs>(args: Subset<T, SimulationAggregateArgs>): Prisma.PrismaPromise<GetSimulationAggregateType<T>>

    /**
     * Group by Simulation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SimulationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SimulationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SimulationGroupByArgs['orderBy'] }
        : { orderBy?: SimulationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SimulationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSimulationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Simulation model
   */
  readonly fields: SimulationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Simulation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SimulationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Simulation model
   */
  interface SimulationFieldRefs {
    readonly id: FieldRef<"Simulation", 'String'>
    readonly userId: FieldRef<"Simulation", 'String'>
    readonly type: FieldRef<"Simulation", 'String'>
    readonly title: FieldRef<"Simulation", 'String'>
    readonly inputs: FieldRef<"Simulation", 'Json'>
    readonly result: FieldRef<"Simulation", 'Json'>
    readonly aiAnalysis: FieldRef<"Simulation", 'String'>
    readonly aiAnalysisGeneratedAt: FieldRef<"Simulation", 'DateTime'>
    readonly createdAt: FieldRef<"Simulation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Simulation findUnique
   */
  export type SimulationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter, which Simulation to fetch.
     */
    where: SimulationWhereUniqueInput
  }

  /**
   * Simulation findUniqueOrThrow
   */
  export type SimulationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter, which Simulation to fetch.
     */
    where: SimulationWhereUniqueInput
  }

  /**
   * Simulation findFirst
   */
  export type SimulationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter, which Simulation to fetch.
     */
    where?: SimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Simulations to fetch.
     */
    orderBy?: SimulationOrderByWithRelationInput | SimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Simulations.
     */
    cursor?: SimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Simulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Simulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Simulations.
     */
    distinct?: SimulationScalarFieldEnum | SimulationScalarFieldEnum[]
  }

  /**
   * Simulation findFirstOrThrow
   */
  export type SimulationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter, which Simulation to fetch.
     */
    where?: SimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Simulations to fetch.
     */
    orderBy?: SimulationOrderByWithRelationInput | SimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Simulations.
     */
    cursor?: SimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Simulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Simulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Simulations.
     */
    distinct?: SimulationScalarFieldEnum | SimulationScalarFieldEnum[]
  }

  /**
   * Simulation findMany
   */
  export type SimulationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter, which Simulations to fetch.
     */
    where?: SimulationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Simulations to fetch.
     */
    orderBy?: SimulationOrderByWithRelationInput | SimulationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Simulations.
     */
    cursor?: SimulationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Simulations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Simulations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Simulations.
     */
    distinct?: SimulationScalarFieldEnum | SimulationScalarFieldEnum[]
  }

  /**
   * Simulation create
   */
  export type SimulationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * The data needed to create a Simulation.
     */
    data: XOR<SimulationCreateInput, SimulationUncheckedCreateInput>
  }

  /**
   * Simulation createMany
   */
  export type SimulationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Simulations.
     */
    data: SimulationCreateManyInput | SimulationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Simulation createManyAndReturn
   */
  export type SimulationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * The data used to create many Simulations.
     */
    data: SimulationCreateManyInput | SimulationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Simulation update
   */
  export type SimulationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * The data needed to update a Simulation.
     */
    data: XOR<SimulationUpdateInput, SimulationUncheckedUpdateInput>
    /**
     * Choose, which Simulation to update.
     */
    where: SimulationWhereUniqueInput
  }

  /**
   * Simulation updateMany
   */
  export type SimulationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Simulations.
     */
    data: XOR<SimulationUpdateManyMutationInput, SimulationUncheckedUpdateManyInput>
    /**
     * Filter which Simulations to update
     */
    where?: SimulationWhereInput
    /**
     * Limit how many Simulations to update.
     */
    limit?: number
  }

  /**
   * Simulation updateManyAndReturn
   */
  export type SimulationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * The data used to update Simulations.
     */
    data: XOR<SimulationUpdateManyMutationInput, SimulationUncheckedUpdateManyInput>
    /**
     * Filter which Simulations to update
     */
    where?: SimulationWhereInput
    /**
     * Limit how many Simulations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Simulation upsert
   */
  export type SimulationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * The filter to search for the Simulation to update in case it exists.
     */
    where: SimulationWhereUniqueInput
    /**
     * In case the Simulation found by the `where` argument doesn't exist, create a new Simulation with this data.
     */
    create: XOR<SimulationCreateInput, SimulationUncheckedCreateInput>
    /**
     * In case the Simulation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SimulationUpdateInput, SimulationUncheckedUpdateInput>
  }

  /**
   * Simulation delete
   */
  export type SimulationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
    /**
     * Filter which Simulation to delete.
     */
    where: SimulationWhereUniqueInput
  }

  /**
   * Simulation deleteMany
   */
  export type SimulationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Simulations to delete
     */
    where?: SimulationWhereInput
    /**
     * Limit how many Simulations to delete.
     */
    limit?: number
  }

  /**
   * Simulation without action
   */
  export type SimulationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Simulation
     */
    select?: SimulationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Simulation
     */
    omit?: SimulationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SimulationInclude<ExtArgs> | null
  }


  /**
   * Model MonthlySnapshot
   */

  export type AggregateMonthlySnapshot = {
    _count: MonthlySnapshotCountAggregateOutputType | null
    _avg: MonthlySnapshotAvgAggregateOutputType | null
    _sum: MonthlySnapshotSumAggregateOutputType | null
    _min: MonthlySnapshotMinAggregateOutputType | null
    _max: MonthlySnapshotMaxAggregateOutputType | null
  }

  export type MonthlySnapshotAvgAggregateOutputType = {
    month: number | null
    year: number | null
    income: Decimal | null
    totalExpenses: Decimal | null
    totalSavings: Decimal | null
  }

  export type MonthlySnapshotSumAggregateOutputType = {
    month: number | null
    year: number | null
    income: Decimal | null
    totalExpenses: Decimal | null
    totalSavings: Decimal | null
  }

  export type MonthlySnapshotMinAggregateOutputType = {
    id: string | null
    budgetId: string | null
    month: number | null
    year: number | null
    income: Decimal | null
    totalExpenses: Decimal | null
    totalSavings: Decimal | null
    createdAt: Date | null
  }

  export type MonthlySnapshotMaxAggregateOutputType = {
    id: string | null
    budgetId: string | null
    month: number | null
    year: number | null
    income: Decimal | null
    totalExpenses: Decimal | null
    totalSavings: Decimal | null
    createdAt: Date | null
  }

  export type MonthlySnapshotCountAggregateOutputType = {
    id: number
    budgetId: number
    month: number
    year: number
    income: number
    totalExpenses: number
    totalSavings: number
    categoryBreakdown: number
    createdAt: number
    _all: number
  }


  export type MonthlySnapshotAvgAggregateInputType = {
    month?: true
    year?: true
    income?: true
    totalExpenses?: true
    totalSavings?: true
  }

  export type MonthlySnapshotSumAggregateInputType = {
    month?: true
    year?: true
    income?: true
    totalExpenses?: true
    totalSavings?: true
  }

  export type MonthlySnapshotMinAggregateInputType = {
    id?: true
    budgetId?: true
    month?: true
    year?: true
    income?: true
    totalExpenses?: true
    totalSavings?: true
    createdAt?: true
  }

  export type MonthlySnapshotMaxAggregateInputType = {
    id?: true
    budgetId?: true
    month?: true
    year?: true
    income?: true
    totalExpenses?: true
    totalSavings?: true
    createdAt?: true
  }

  export type MonthlySnapshotCountAggregateInputType = {
    id?: true
    budgetId?: true
    month?: true
    year?: true
    income?: true
    totalExpenses?: true
    totalSavings?: true
    categoryBreakdown?: true
    createdAt?: true
    _all?: true
  }

  export type MonthlySnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonthlySnapshot to aggregate.
     */
    where?: MonthlySnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlySnapshots to fetch.
     */
    orderBy?: MonthlySnapshotOrderByWithRelationInput | MonthlySnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MonthlySnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlySnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlySnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MonthlySnapshots
    **/
    _count?: true | MonthlySnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MonthlySnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MonthlySnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MonthlySnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MonthlySnapshotMaxAggregateInputType
  }

  export type GetMonthlySnapshotAggregateType<T extends MonthlySnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateMonthlySnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonthlySnapshot[P]>
      : GetScalarType<T[P], AggregateMonthlySnapshot[P]>
  }




  export type MonthlySnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonthlySnapshotWhereInput
    orderBy?: MonthlySnapshotOrderByWithAggregationInput | MonthlySnapshotOrderByWithAggregationInput[]
    by: MonthlySnapshotScalarFieldEnum[] | MonthlySnapshotScalarFieldEnum
    having?: MonthlySnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MonthlySnapshotCountAggregateInputType | true
    _avg?: MonthlySnapshotAvgAggregateInputType
    _sum?: MonthlySnapshotSumAggregateInputType
    _min?: MonthlySnapshotMinAggregateInputType
    _max?: MonthlySnapshotMaxAggregateInputType
  }

  export type MonthlySnapshotGroupByOutputType = {
    id: string
    budgetId: string
    month: number
    year: number
    income: Decimal
    totalExpenses: Decimal
    totalSavings: Decimal
    categoryBreakdown: JsonValue
    createdAt: Date
    _count: MonthlySnapshotCountAggregateOutputType | null
    _avg: MonthlySnapshotAvgAggregateOutputType | null
    _sum: MonthlySnapshotSumAggregateOutputType | null
    _min: MonthlySnapshotMinAggregateOutputType | null
    _max: MonthlySnapshotMaxAggregateOutputType | null
  }

  type GetMonthlySnapshotGroupByPayload<T extends MonthlySnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonthlySnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MonthlySnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MonthlySnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], MonthlySnapshotGroupByOutputType[P]>
        }
      >
    >


  export type MonthlySnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    month?: boolean
    year?: boolean
    income?: boolean
    totalExpenses?: boolean
    totalSavings?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlySnapshot"]>

  export type MonthlySnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    month?: boolean
    year?: boolean
    income?: boolean
    totalExpenses?: boolean
    totalSavings?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlySnapshot"]>

  export type MonthlySnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    budgetId?: boolean
    month?: boolean
    year?: boolean
    income?: boolean
    totalExpenses?: boolean
    totalSavings?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monthlySnapshot"]>

  export type MonthlySnapshotSelectScalar = {
    id?: boolean
    budgetId?: boolean
    month?: boolean
    year?: boolean
    income?: boolean
    totalExpenses?: boolean
    totalSavings?: boolean
    categoryBreakdown?: boolean
    createdAt?: boolean
  }

  export type MonthlySnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "budgetId" | "month" | "year" | "income" | "totalExpenses" | "totalSavings" | "categoryBreakdown" | "createdAt", ExtArgs["result"]["monthlySnapshot"]>
  export type MonthlySnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }
  export type MonthlySnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }
  export type MonthlySnapshotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    budget?: boolean | BudgetDefaultArgs<ExtArgs>
  }

  export type $MonthlySnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MonthlySnapshot"
    objects: {
      budget: Prisma.$BudgetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      budgetId: string
      month: number
      year: number
      income: Prisma.Decimal
      totalExpenses: Prisma.Decimal
      totalSavings: Prisma.Decimal
      categoryBreakdown: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["monthlySnapshot"]>
    composites: {}
  }

  type MonthlySnapshotGetPayload<S extends boolean | null | undefined | MonthlySnapshotDefaultArgs> = $Result.GetResult<Prisma.$MonthlySnapshotPayload, S>

  type MonthlySnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MonthlySnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MonthlySnapshotCountAggregateInputType | true
    }

  export interface MonthlySnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MonthlySnapshot'], meta: { name: 'MonthlySnapshot' } }
    /**
     * Find zero or one MonthlySnapshot that matches the filter.
     * @param {MonthlySnapshotFindUniqueArgs} args - Arguments to find a MonthlySnapshot
     * @example
     * // Get one MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonthlySnapshotFindUniqueArgs>(args: SelectSubset<T, MonthlySnapshotFindUniqueArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MonthlySnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MonthlySnapshotFindUniqueOrThrowArgs} args - Arguments to find a MonthlySnapshot
     * @example
     * // Get one MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonthlySnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, MonthlySnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MonthlySnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotFindFirstArgs} args - Arguments to find a MonthlySnapshot
     * @example
     * // Get one MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonthlySnapshotFindFirstArgs>(args?: SelectSubset<T, MonthlySnapshotFindFirstArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MonthlySnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotFindFirstOrThrowArgs} args - Arguments to find a MonthlySnapshot
     * @example
     * // Get one MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonthlySnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, MonthlySnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MonthlySnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MonthlySnapshots
     * const monthlySnapshots = await prisma.monthlySnapshot.findMany()
     * 
     * // Get first 10 MonthlySnapshots
     * const monthlySnapshots = await prisma.monthlySnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const monthlySnapshotWithIdOnly = await prisma.monthlySnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MonthlySnapshotFindManyArgs>(args?: SelectSubset<T, MonthlySnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MonthlySnapshot.
     * @param {MonthlySnapshotCreateArgs} args - Arguments to create a MonthlySnapshot.
     * @example
     * // Create one MonthlySnapshot
     * const MonthlySnapshot = await prisma.monthlySnapshot.create({
     *   data: {
     *     // ... data to create a MonthlySnapshot
     *   }
     * })
     * 
     */
    create<T extends MonthlySnapshotCreateArgs>(args: SelectSubset<T, MonthlySnapshotCreateArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MonthlySnapshots.
     * @param {MonthlySnapshotCreateManyArgs} args - Arguments to create many MonthlySnapshots.
     * @example
     * // Create many MonthlySnapshots
     * const monthlySnapshot = await prisma.monthlySnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MonthlySnapshotCreateManyArgs>(args?: SelectSubset<T, MonthlySnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MonthlySnapshots and returns the data saved in the database.
     * @param {MonthlySnapshotCreateManyAndReturnArgs} args - Arguments to create many MonthlySnapshots.
     * @example
     * // Create many MonthlySnapshots
     * const monthlySnapshot = await prisma.monthlySnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MonthlySnapshots and only return the `id`
     * const monthlySnapshotWithIdOnly = await prisma.monthlySnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MonthlySnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, MonthlySnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MonthlySnapshot.
     * @param {MonthlySnapshotDeleteArgs} args - Arguments to delete one MonthlySnapshot.
     * @example
     * // Delete one MonthlySnapshot
     * const MonthlySnapshot = await prisma.monthlySnapshot.delete({
     *   where: {
     *     // ... filter to delete one MonthlySnapshot
     *   }
     * })
     * 
     */
    delete<T extends MonthlySnapshotDeleteArgs>(args: SelectSubset<T, MonthlySnapshotDeleteArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MonthlySnapshot.
     * @param {MonthlySnapshotUpdateArgs} args - Arguments to update one MonthlySnapshot.
     * @example
     * // Update one MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MonthlySnapshotUpdateArgs>(args: SelectSubset<T, MonthlySnapshotUpdateArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MonthlySnapshots.
     * @param {MonthlySnapshotDeleteManyArgs} args - Arguments to filter MonthlySnapshots to delete.
     * @example
     * // Delete a few MonthlySnapshots
     * const { count } = await prisma.monthlySnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MonthlySnapshotDeleteManyArgs>(args?: SelectSubset<T, MonthlySnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonthlySnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MonthlySnapshots
     * const monthlySnapshot = await prisma.monthlySnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MonthlySnapshotUpdateManyArgs>(args: SelectSubset<T, MonthlySnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonthlySnapshots and returns the data updated in the database.
     * @param {MonthlySnapshotUpdateManyAndReturnArgs} args - Arguments to update many MonthlySnapshots.
     * @example
     * // Update many MonthlySnapshots
     * const monthlySnapshot = await prisma.monthlySnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MonthlySnapshots and only return the `id`
     * const monthlySnapshotWithIdOnly = await prisma.monthlySnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MonthlySnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, MonthlySnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MonthlySnapshot.
     * @param {MonthlySnapshotUpsertArgs} args - Arguments to update or create a MonthlySnapshot.
     * @example
     * // Update or create a MonthlySnapshot
     * const monthlySnapshot = await prisma.monthlySnapshot.upsert({
     *   create: {
     *     // ... data to create a MonthlySnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MonthlySnapshot we want to update
     *   }
     * })
     */
    upsert<T extends MonthlySnapshotUpsertArgs>(args: SelectSubset<T, MonthlySnapshotUpsertArgs<ExtArgs>>): Prisma__MonthlySnapshotClient<$Result.GetResult<Prisma.$MonthlySnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MonthlySnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotCountArgs} args - Arguments to filter MonthlySnapshots to count.
     * @example
     * // Count the number of MonthlySnapshots
     * const count = await prisma.monthlySnapshot.count({
     *   where: {
     *     // ... the filter for the MonthlySnapshots we want to count
     *   }
     * })
    **/
    count<T extends MonthlySnapshotCountArgs>(
      args?: Subset<T, MonthlySnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MonthlySnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MonthlySnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MonthlySnapshotAggregateArgs>(args: Subset<T, MonthlySnapshotAggregateArgs>): Prisma.PrismaPromise<GetMonthlySnapshotAggregateType<T>>

    /**
     * Group by MonthlySnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonthlySnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MonthlySnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonthlySnapshotGroupByArgs['orderBy'] }
        : { orderBy?: MonthlySnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MonthlySnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMonthlySnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MonthlySnapshot model
   */
  readonly fields: MonthlySnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MonthlySnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonthlySnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    budget<T extends BudgetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BudgetDefaultArgs<ExtArgs>>): Prisma__BudgetClient<$Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MonthlySnapshot model
   */
  interface MonthlySnapshotFieldRefs {
    readonly id: FieldRef<"MonthlySnapshot", 'String'>
    readonly budgetId: FieldRef<"MonthlySnapshot", 'String'>
    readonly month: FieldRef<"MonthlySnapshot", 'Int'>
    readonly year: FieldRef<"MonthlySnapshot", 'Int'>
    readonly income: FieldRef<"MonthlySnapshot", 'Decimal'>
    readonly totalExpenses: FieldRef<"MonthlySnapshot", 'Decimal'>
    readonly totalSavings: FieldRef<"MonthlySnapshot", 'Decimal'>
    readonly categoryBreakdown: FieldRef<"MonthlySnapshot", 'Json'>
    readonly createdAt: FieldRef<"MonthlySnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MonthlySnapshot findUnique
   */
  export type MonthlySnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter, which MonthlySnapshot to fetch.
     */
    where: MonthlySnapshotWhereUniqueInput
  }

  /**
   * MonthlySnapshot findUniqueOrThrow
   */
  export type MonthlySnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter, which MonthlySnapshot to fetch.
     */
    where: MonthlySnapshotWhereUniqueInput
  }

  /**
   * MonthlySnapshot findFirst
   */
  export type MonthlySnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter, which MonthlySnapshot to fetch.
     */
    where?: MonthlySnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlySnapshots to fetch.
     */
    orderBy?: MonthlySnapshotOrderByWithRelationInput | MonthlySnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonthlySnapshots.
     */
    cursor?: MonthlySnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlySnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlySnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonthlySnapshots.
     */
    distinct?: MonthlySnapshotScalarFieldEnum | MonthlySnapshotScalarFieldEnum[]
  }

  /**
   * MonthlySnapshot findFirstOrThrow
   */
  export type MonthlySnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter, which MonthlySnapshot to fetch.
     */
    where?: MonthlySnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlySnapshots to fetch.
     */
    orderBy?: MonthlySnapshotOrderByWithRelationInput | MonthlySnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonthlySnapshots.
     */
    cursor?: MonthlySnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlySnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlySnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonthlySnapshots.
     */
    distinct?: MonthlySnapshotScalarFieldEnum | MonthlySnapshotScalarFieldEnum[]
  }

  /**
   * MonthlySnapshot findMany
   */
  export type MonthlySnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter, which MonthlySnapshots to fetch.
     */
    where?: MonthlySnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonthlySnapshots to fetch.
     */
    orderBy?: MonthlySnapshotOrderByWithRelationInput | MonthlySnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MonthlySnapshots.
     */
    cursor?: MonthlySnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonthlySnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonthlySnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonthlySnapshots.
     */
    distinct?: MonthlySnapshotScalarFieldEnum | MonthlySnapshotScalarFieldEnum[]
  }

  /**
   * MonthlySnapshot create
   */
  export type MonthlySnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a MonthlySnapshot.
     */
    data: XOR<MonthlySnapshotCreateInput, MonthlySnapshotUncheckedCreateInput>
  }

  /**
   * MonthlySnapshot createMany
   */
  export type MonthlySnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MonthlySnapshots.
     */
    data: MonthlySnapshotCreateManyInput | MonthlySnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MonthlySnapshot createManyAndReturn
   */
  export type MonthlySnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many MonthlySnapshots.
     */
    data: MonthlySnapshotCreateManyInput | MonthlySnapshotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MonthlySnapshot update
   */
  export type MonthlySnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a MonthlySnapshot.
     */
    data: XOR<MonthlySnapshotUpdateInput, MonthlySnapshotUncheckedUpdateInput>
    /**
     * Choose, which MonthlySnapshot to update.
     */
    where: MonthlySnapshotWhereUniqueInput
  }

  /**
   * MonthlySnapshot updateMany
   */
  export type MonthlySnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MonthlySnapshots.
     */
    data: XOR<MonthlySnapshotUpdateManyMutationInput, MonthlySnapshotUncheckedUpdateManyInput>
    /**
     * Filter which MonthlySnapshots to update
     */
    where?: MonthlySnapshotWhereInput
    /**
     * Limit how many MonthlySnapshots to update.
     */
    limit?: number
  }

  /**
   * MonthlySnapshot updateManyAndReturn
   */
  export type MonthlySnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * The data used to update MonthlySnapshots.
     */
    data: XOR<MonthlySnapshotUpdateManyMutationInput, MonthlySnapshotUncheckedUpdateManyInput>
    /**
     * Filter which MonthlySnapshots to update
     */
    where?: MonthlySnapshotWhereInput
    /**
     * Limit how many MonthlySnapshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MonthlySnapshot upsert
   */
  export type MonthlySnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the MonthlySnapshot to update in case it exists.
     */
    where: MonthlySnapshotWhereUniqueInput
    /**
     * In case the MonthlySnapshot found by the `where` argument doesn't exist, create a new MonthlySnapshot with this data.
     */
    create: XOR<MonthlySnapshotCreateInput, MonthlySnapshotUncheckedCreateInput>
    /**
     * In case the MonthlySnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonthlySnapshotUpdateInput, MonthlySnapshotUncheckedUpdateInput>
  }

  /**
   * MonthlySnapshot delete
   */
  export type MonthlySnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
    /**
     * Filter which MonthlySnapshot to delete.
     */
    where: MonthlySnapshotWhereUniqueInput
  }

  /**
   * MonthlySnapshot deleteMany
   */
  export type MonthlySnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonthlySnapshots to delete
     */
    where?: MonthlySnapshotWhereInput
    /**
     * Limit how many MonthlySnapshots to delete.
     */
    limit?: number
  }

  /**
   * MonthlySnapshot without action
   */
  export type MonthlySnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlySnapshot
     */
    select?: MonthlySnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MonthlySnapshot
     */
    omit?: MonthlySnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonthlySnapshotInclude<ExtArgs> | null
  }


  /**
   * Model Loan
   */

  export type AggregateLoan = {
    _count: LoanCountAggregateOutputType | null
    _avg: LoanAvgAggregateOutputType | null
    _sum: LoanSumAggregateOutputType | null
    _min: LoanMinAggregateOutputType | null
    _max: LoanMaxAggregateOutputType | null
  }

  export type LoanAvgAggregateOutputType = {
    principal: Decimal | null
    downPayment: Decimal | null
    annualRate: Decimal | null
    termMonths: number | null
    monthlyPayment: Decimal | null
    paidInstallments: number | null
    totalInterest: Decimal | null
    totalCost: Decimal | null
  }

  export type LoanSumAggregateOutputType = {
    principal: Decimal | null
    downPayment: Decimal | null
    annualRate: Decimal | null
    termMonths: number | null
    monthlyPayment: Decimal | null
    paidInstallments: number | null
    totalInterest: Decimal | null
    totalCost: Decimal | null
  }

  export type LoanMinAggregateOutputType = {
    id: string | null
    userId: string | null
    simulationId: string | null
    title: string | null
    type: string | null
    principal: Decimal | null
    downPayment: Decimal | null
    annualRate: Decimal | null
    termMonths: number | null
    formula: string | null
    monthlyPayment: Decimal | null
    startDate: Date | null
    status: string | null
    paidInstallments: number | null
    totalInterest: Decimal | null
    totalCost: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    simulationId: string | null
    title: string | null
    type: string | null
    principal: Decimal | null
    downPayment: Decimal | null
    annualRate: Decimal | null
    termMonths: number | null
    formula: string | null
    monthlyPayment: Decimal | null
    startDate: Date | null
    status: string | null
    paidInstallments: number | null
    totalInterest: Decimal | null
    totalCost: Decimal | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanCountAggregateOutputType = {
    id: number
    userId: number
    simulationId: number
    title: number
    type: number
    principal: number
    downPayment: number
    annualRate: number
    termMonths: number
    formula: number
    monthlyPayment: number
    startDate: number
    status: number
    paidInstallments: number
    totalInterest: number
    totalCost: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoanAvgAggregateInputType = {
    principal?: true
    downPayment?: true
    annualRate?: true
    termMonths?: true
    monthlyPayment?: true
    paidInstallments?: true
    totalInterest?: true
    totalCost?: true
  }

  export type LoanSumAggregateInputType = {
    principal?: true
    downPayment?: true
    annualRate?: true
    termMonths?: true
    monthlyPayment?: true
    paidInstallments?: true
    totalInterest?: true
    totalCost?: true
  }

  export type LoanMinAggregateInputType = {
    id?: true
    userId?: true
    simulationId?: true
    title?: true
    type?: true
    principal?: true
    downPayment?: true
    annualRate?: true
    termMonths?: true
    formula?: true
    monthlyPayment?: true
    startDate?: true
    status?: true
    paidInstallments?: true
    totalInterest?: true
    totalCost?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanMaxAggregateInputType = {
    id?: true
    userId?: true
    simulationId?: true
    title?: true
    type?: true
    principal?: true
    downPayment?: true
    annualRate?: true
    termMonths?: true
    formula?: true
    monthlyPayment?: true
    startDate?: true
    status?: true
    paidInstallments?: true
    totalInterest?: true
    totalCost?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanCountAggregateInputType = {
    id?: true
    userId?: true
    simulationId?: true
    title?: true
    type?: true
    principal?: true
    downPayment?: true
    annualRate?: true
    termMonths?: true
    formula?: true
    monthlyPayment?: true
    startDate?: true
    status?: true
    paidInstallments?: true
    totalInterest?: true
    totalCost?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Loan to aggregate.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Loans
    **/
    _count?: true | LoanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanMaxAggregateInputType
  }

  export type GetLoanAggregateType<T extends LoanAggregateArgs> = {
        [P in keyof T & keyof AggregateLoan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoan[P]>
      : GetScalarType<T[P], AggregateLoan[P]>
  }




  export type LoanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanWhereInput
    orderBy?: LoanOrderByWithAggregationInput | LoanOrderByWithAggregationInput[]
    by: LoanScalarFieldEnum[] | LoanScalarFieldEnum
    having?: LoanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanCountAggregateInputType | true
    _avg?: LoanAvgAggregateInputType
    _sum?: LoanSumAggregateInputType
    _min?: LoanMinAggregateInputType
    _max?: LoanMaxAggregateInputType
  }

  export type LoanGroupByOutputType = {
    id: string
    userId: string
    simulationId: string | null
    title: string
    type: string
    principal: Decimal
    downPayment: Decimal
    annualRate: Decimal
    termMonths: number
    formula: string
    monthlyPayment: Decimal
    startDate: Date
    status: string
    paidInstallments: number
    totalInterest: Decimal
    totalCost: Decimal
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: LoanCountAggregateOutputType | null
    _avg: LoanAvgAggregateOutputType | null
    _sum: LoanSumAggregateOutputType | null
    _min: LoanMinAggregateOutputType | null
    _max: LoanMaxAggregateOutputType | null
  }

  type GetLoanGroupByPayload<T extends LoanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanGroupByOutputType[P]>
            : GetScalarType<T[P], LoanGroupByOutputType[P]>
        }
      >
    >


  export type LoanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    simulationId?: boolean
    title?: boolean
    type?: boolean
    principal?: boolean
    downPayment?: boolean
    annualRate?: boolean
    termMonths?: boolean
    formula?: boolean
    monthlyPayment?: boolean
    startDate?: boolean
    status?: boolean
    paidInstallments?: boolean
    totalInterest?: boolean
    totalCost?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    fees?: boolean | Loan$feesArgs<ExtArgs>
    payments?: boolean | Loan$paymentsArgs<ExtArgs>
    extraPayments?: boolean | Loan$extraPaymentsArgs<ExtArgs>
    _count?: boolean | LoanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loan"]>

  export type LoanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    simulationId?: boolean
    title?: boolean
    type?: boolean
    principal?: boolean
    downPayment?: boolean
    annualRate?: boolean
    termMonths?: boolean
    formula?: boolean
    monthlyPayment?: boolean
    startDate?: boolean
    status?: boolean
    paidInstallments?: boolean
    totalInterest?: boolean
    totalCost?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loan"]>

  export type LoanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    simulationId?: boolean
    title?: boolean
    type?: boolean
    principal?: boolean
    downPayment?: boolean
    annualRate?: boolean
    termMonths?: boolean
    formula?: boolean
    monthlyPayment?: boolean
    startDate?: boolean
    status?: boolean
    paidInstallments?: boolean
    totalInterest?: boolean
    totalCost?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loan"]>

  export type LoanSelectScalar = {
    id?: boolean
    userId?: boolean
    simulationId?: boolean
    title?: boolean
    type?: boolean
    principal?: boolean
    downPayment?: boolean
    annualRate?: boolean
    termMonths?: boolean
    formula?: boolean
    monthlyPayment?: boolean
    startDate?: boolean
    status?: boolean
    paidInstallments?: boolean
    totalInterest?: boolean
    totalCost?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "simulationId" | "title" | "type" | "principal" | "downPayment" | "annualRate" | "termMonths" | "formula" | "monthlyPayment" | "startDate" | "status" | "paidInstallments" | "totalInterest" | "totalCost" | "currency" | "createdAt" | "updatedAt", ExtArgs["result"]["loan"]>
  export type LoanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    fees?: boolean | Loan$feesArgs<ExtArgs>
    payments?: boolean | Loan$paymentsArgs<ExtArgs>
    extraPayments?: boolean | Loan$extraPaymentsArgs<ExtArgs>
    _count?: boolean | LoanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LoanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LoanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Loan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      fees: Prisma.$LoanFeePayload<ExtArgs>[]
      payments: Prisma.$LoanPaymentPayload<ExtArgs>[]
      extraPayments: Prisma.$LoanExtraPaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      simulationId: string | null
      title: string
      type: string
      principal: Prisma.Decimal
      downPayment: Prisma.Decimal
      annualRate: Prisma.Decimal
      termMonths: number
      formula: string
      monthlyPayment: Prisma.Decimal
      startDate: Date
      status: string
      paidInstallments: number
      totalInterest: Prisma.Decimal
      totalCost: Prisma.Decimal
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loan"]>
    composites: {}
  }

  type LoanGetPayload<S extends boolean | null | undefined | LoanDefaultArgs> = $Result.GetResult<Prisma.$LoanPayload, S>

  type LoanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanCountAggregateInputType | true
    }

  export interface LoanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Loan'], meta: { name: 'Loan' } }
    /**
     * Find zero or one Loan that matches the filter.
     * @param {LoanFindUniqueArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanFindUniqueArgs>(args: SelectSubset<T, LoanFindUniqueArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Loan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanFindUniqueOrThrowArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Loan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindFirstArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanFindFirstArgs>(args?: SelectSubset<T, LoanFindFirstArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Loan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindFirstOrThrowArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Loans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Loans
     * const loans = await prisma.loan.findMany()
     * 
     * // Get first 10 Loans
     * const loans = await prisma.loan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanWithIdOnly = await prisma.loan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanFindManyArgs>(args?: SelectSubset<T, LoanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Loan.
     * @param {LoanCreateArgs} args - Arguments to create a Loan.
     * @example
     * // Create one Loan
     * const Loan = await prisma.loan.create({
     *   data: {
     *     // ... data to create a Loan
     *   }
     * })
     * 
     */
    create<T extends LoanCreateArgs>(args: SelectSubset<T, LoanCreateArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Loans.
     * @param {LoanCreateManyArgs} args - Arguments to create many Loans.
     * @example
     * // Create many Loans
     * const loan = await prisma.loan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanCreateManyArgs>(args?: SelectSubset<T, LoanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Loans and returns the data saved in the database.
     * @param {LoanCreateManyAndReturnArgs} args - Arguments to create many Loans.
     * @example
     * // Create many Loans
     * const loan = await prisma.loan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Loans and only return the `id`
     * const loanWithIdOnly = await prisma.loan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoanCreateManyAndReturnArgs>(args?: SelectSubset<T, LoanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Loan.
     * @param {LoanDeleteArgs} args - Arguments to delete one Loan.
     * @example
     * // Delete one Loan
     * const Loan = await prisma.loan.delete({
     *   where: {
     *     // ... filter to delete one Loan
     *   }
     * })
     * 
     */
    delete<T extends LoanDeleteArgs>(args: SelectSubset<T, LoanDeleteArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Loan.
     * @param {LoanUpdateArgs} args - Arguments to update one Loan.
     * @example
     * // Update one Loan
     * const loan = await prisma.loan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanUpdateArgs>(args: SelectSubset<T, LoanUpdateArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Loans.
     * @param {LoanDeleteManyArgs} args - Arguments to filter Loans to delete.
     * @example
     * // Delete a few Loans
     * const { count } = await prisma.loan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanDeleteManyArgs>(args?: SelectSubset<T, LoanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Loans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Loans
     * const loan = await prisma.loan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanUpdateManyArgs>(args: SelectSubset<T, LoanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Loans and returns the data updated in the database.
     * @param {LoanUpdateManyAndReturnArgs} args - Arguments to update many Loans.
     * @example
     * // Update many Loans
     * const loan = await prisma.loan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Loans and only return the `id`
     * const loanWithIdOnly = await prisma.loan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoanUpdateManyAndReturnArgs>(args: SelectSubset<T, LoanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Loan.
     * @param {LoanUpsertArgs} args - Arguments to update or create a Loan.
     * @example
     * // Update or create a Loan
     * const loan = await prisma.loan.upsert({
     *   create: {
     *     // ... data to create a Loan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Loan we want to update
     *   }
     * })
     */
    upsert<T extends LoanUpsertArgs>(args: SelectSubset<T, LoanUpsertArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Loans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanCountArgs} args - Arguments to filter Loans to count.
     * @example
     * // Count the number of Loans
     * const count = await prisma.loan.count({
     *   where: {
     *     // ... the filter for the Loans we want to count
     *   }
     * })
    **/
    count<T extends LoanCountArgs>(
      args?: Subset<T, LoanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Loan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanAggregateArgs>(args: Subset<T, LoanAggregateArgs>): Prisma.PrismaPromise<GetLoanAggregateType<T>>

    /**
     * Group by Loan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanGroupByArgs['orderBy'] }
        : { orderBy?: LoanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Loan model
   */
  readonly fields: LoanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Loan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fees<T extends Loan$feesArgs<ExtArgs> = {}>(args?: Subset<T, Loan$feesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends Loan$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Loan$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    extraPayments<T extends Loan$extraPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, Loan$extraPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Loan model
   */
  interface LoanFieldRefs {
    readonly id: FieldRef<"Loan", 'String'>
    readonly userId: FieldRef<"Loan", 'String'>
    readonly simulationId: FieldRef<"Loan", 'String'>
    readonly title: FieldRef<"Loan", 'String'>
    readonly type: FieldRef<"Loan", 'String'>
    readonly principal: FieldRef<"Loan", 'Decimal'>
    readonly downPayment: FieldRef<"Loan", 'Decimal'>
    readonly annualRate: FieldRef<"Loan", 'Decimal'>
    readonly termMonths: FieldRef<"Loan", 'Int'>
    readonly formula: FieldRef<"Loan", 'String'>
    readonly monthlyPayment: FieldRef<"Loan", 'Decimal'>
    readonly startDate: FieldRef<"Loan", 'DateTime'>
    readonly status: FieldRef<"Loan", 'String'>
    readonly paidInstallments: FieldRef<"Loan", 'Int'>
    readonly totalInterest: FieldRef<"Loan", 'Decimal'>
    readonly totalCost: FieldRef<"Loan", 'Decimal'>
    readonly currency: FieldRef<"Loan", 'String'>
    readonly createdAt: FieldRef<"Loan", 'DateTime'>
    readonly updatedAt: FieldRef<"Loan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Loan findUnique
   */
  export type LoanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan findUniqueOrThrow
   */
  export type LoanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan findFirst
   */
  export type LoanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Loans.
     */
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan findFirstOrThrow
   */
  export type LoanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Loans.
     */
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan findMany
   */
  export type LoanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter, which Loans to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Loans.
     */
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan create
   */
  export type LoanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * The data needed to create a Loan.
     */
    data: XOR<LoanCreateInput, LoanUncheckedCreateInput>
  }

  /**
   * Loan createMany
   */
  export type LoanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Loans.
     */
    data: LoanCreateManyInput | LoanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Loan createManyAndReturn
   */
  export type LoanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * The data used to create many Loans.
     */
    data: LoanCreateManyInput | LoanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Loan update
   */
  export type LoanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * The data needed to update a Loan.
     */
    data: XOR<LoanUpdateInput, LoanUncheckedUpdateInput>
    /**
     * Choose, which Loan to update.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan updateMany
   */
  export type LoanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Loans.
     */
    data: XOR<LoanUpdateManyMutationInput, LoanUncheckedUpdateManyInput>
    /**
     * Filter which Loans to update
     */
    where?: LoanWhereInput
    /**
     * Limit how many Loans to update.
     */
    limit?: number
  }

  /**
   * Loan updateManyAndReturn
   */
  export type LoanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * The data used to update Loans.
     */
    data: XOR<LoanUpdateManyMutationInput, LoanUncheckedUpdateManyInput>
    /**
     * Filter which Loans to update
     */
    where?: LoanWhereInput
    /**
     * Limit how many Loans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Loan upsert
   */
  export type LoanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * The filter to search for the Loan to update in case it exists.
     */
    where: LoanWhereUniqueInput
    /**
     * In case the Loan found by the `where` argument doesn't exist, create a new Loan with this data.
     */
    create: XOR<LoanCreateInput, LoanUncheckedCreateInput>
    /**
     * In case the Loan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanUpdateInput, LoanUncheckedUpdateInput>
  }

  /**
   * Loan delete
   */
  export type LoanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
    /**
     * Filter which Loan to delete.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan deleteMany
   */
  export type LoanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Loans to delete
     */
    where?: LoanWhereInput
    /**
     * Limit how many Loans to delete.
     */
    limit?: number
  }

  /**
   * Loan.fees
   */
  export type Loan$feesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    where?: LoanFeeWhereInput
    orderBy?: LoanFeeOrderByWithRelationInput | LoanFeeOrderByWithRelationInput[]
    cursor?: LoanFeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoanFeeScalarFieldEnum | LoanFeeScalarFieldEnum[]
  }

  /**
   * Loan.payments
   */
  export type Loan$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    where?: LoanPaymentWhereInput
    orderBy?: LoanPaymentOrderByWithRelationInput | LoanPaymentOrderByWithRelationInput[]
    cursor?: LoanPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoanPaymentScalarFieldEnum | LoanPaymentScalarFieldEnum[]
  }

  /**
   * Loan.extraPayments
   */
  export type Loan$extraPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    where?: LoanExtraPaymentWhereInput
    orderBy?: LoanExtraPaymentOrderByWithRelationInput | LoanExtraPaymentOrderByWithRelationInput[]
    cursor?: LoanExtraPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoanExtraPaymentScalarFieldEnum | LoanExtraPaymentScalarFieldEnum[]
  }

  /**
   * Loan without action
   */
  export type LoanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanInclude<ExtArgs> | null
  }


  /**
   * Model LoanPayment
   */

  export type AggregateLoanPayment = {
    _count: LoanPaymentCountAggregateOutputType | null
    _avg: LoanPaymentAvgAggregateOutputType | null
    _sum: LoanPaymentSumAggregateOutputType | null
    _min: LoanPaymentMinAggregateOutputType | null
    _max: LoanPaymentMaxAggregateOutputType | null
  }

  export type LoanPaymentAvgAggregateOutputType = {
    amount: Decimal | null
    principalPaid: Decimal | null
    interestPaid: Decimal | null
  }

  export type LoanPaymentSumAggregateOutputType = {
    amount: Decimal | null
    principalPaid: Decimal | null
    interestPaid: Decimal | null
  }

  export type LoanPaymentMinAggregateOutputType = {
    id: string | null
    loanId: string | null
    amount: Decimal | null
    principalPaid: Decimal | null
    interestPaid: Decimal | null
    paidDate: Date | null
    createdAt: Date | null
  }

  export type LoanPaymentMaxAggregateOutputType = {
    id: string | null
    loanId: string | null
    amount: Decimal | null
    principalPaid: Decimal | null
    interestPaid: Decimal | null
    paidDate: Date | null
    createdAt: Date | null
  }

  export type LoanPaymentCountAggregateOutputType = {
    id: number
    loanId: number
    amount: number
    principalPaid: number
    interestPaid: number
    paidDate: number
    createdAt: number
    _all: number
  }


  export type LoanPaymentAvgAggregateInputType = {
    amount?: true
    principalPaid?: true
    interestPaid?: true
  }

  export type LoanPaymentSumAggregateInputType = {
    amount?: true
    principalPaid?: true
    interestPaid?: true
  }

  export type LoanPaymentMinAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    principalPaid?: true
    interestPaid?: true
    paidDate?: true
    createdAt?: true
  }

  export type LoanPaymentMaxAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    principalPaid?: true
    interestPaid?: true
    paidDate?: true
    createdAt?: true
  }

  export type LoanPaymentCountAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    principalPaid?: true
    interestPaid?: true
    paidDate?: true
    createdAt?: true
    _all?: true
  }

  export type LoanPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanPayment to aggregate.
     */
    where?: LoanPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanPayments to fetch.
     */
    orderBy?: LoanPaymentOrderByWithRelationInput | LoanPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoanPayments
    **/
    _count?: true | LoanPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanPaymentMaxAggregateInputType
  }

  export type GetLoanPaymentAggregateType<T extends LoanPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateLoanPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoanPayment[P]>
      : GetScalarType<T[P], AggregateLoanPayment[P]>
  }




  export type LoanPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanPaymentWhereInput
    orderBy?: LoanPaymentOrderByWithAggregationInput | LoanPaymentOrderByWithAggregationInput[]
    by: LoanPaymentScalarFieldEnum[] | LoanPaymentScalarFieldEnum
    having?: LoanPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanPaymentCountAggregateInputType | true
    _avg?: LoanPaymentAvgAggregateInputType
    _sum?: LoanPaymentSumAggregateInputType
    _min?: LoanPaymentMinAggregateInputType
    _max?: LoanPaymentMaxAggregateInputType
  }

  export type LoanPaymentGroupByOutputType = {
    id: string
    loanId: string
    amount: Decimal
    principalPaid: Decimal
    interestPaid: Decimal
    paidDate: Date
    createdAt: Date
    _count: LoanPaymentCountAggregateOutputType | null
    _avg: LoanPaymentAvgAggregateOutputType | null
    _sum: LoanPaymentSumAggregateOutputType | null
    _min: LoanPaymentMinAggregateOutputType | null
    _max: LoanPaymentMaxAggregateOutputType | null
  }

  type GetLoanPaymentGroupByPayload<T extends LoanPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], LoanPaymentGroupByOutputType[P]>
        }
      >
    >


  export type LoanPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    principalPaid?: boolean
    interestPaid?: boolean
    paidDate?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanPayment"]>

  export type LoanPaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    principalPaid?: boolean
    interestPaid?: boolean
    paidDate?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanPayment"]>

  export type LoanPaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    principalPaid?: boolean
    interestPaid?: boolean
    paidDate?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanPayment"]>

  export type LoanPaymentSelectScalar = {
    id?: boolean
    loanId?: boolean
    amount?: boolean
    principalPaid?: boolean
    interestPaid?: boolean
    paidDate?: boolean
    createdAt?: boolean
  }

  export type LoanPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "loanId" | "amount" | "principalPaid" | "interestPaid" | "paidDate" | "createdAt", ExtArgs["result"]["loanPayment"]>
  export type LoanPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanPaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanPaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }

  export type $LoanPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoanPayment"
    objects: {
      loan: Prisma.$LoanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loanId: string
      amount: Prisma.Decimal
      principalPaid: Prisma.Decimal
      interestPaid: Prisma.Decimal
      paidDate: Date
      createdAt: Date
    }, ExtArgs["result"]["loanPayment"]>
    composites: {}
  }

  type LoanPaymentGetPayload<S extends boolean | null | undefined | LoanPaymentDefaultArgs> = $Result.GetResult<Prisma.$LoanPaymentPayload, S>

  type LoanPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanPaymentCountAggregateInputType | true
    }

  export interface LoanPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoanPayment'], meta: { name: 'LoanPayment' } }
    /**
     * Find zero or one LoanPayment that matches the filter.
     * @param {LoanPaymentFindUniqueArgs} args - Arguments to find a LoanPayment
     * @example
     * // Get one LoanPayment
     * const loanPayment = await prisma.loanPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanPaymentFindUniqueArgs>(args: SelectSubset<T, LoanPaymentFindUniqueArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoanPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanPaymentFindUniqueOrThrowArgs} args - Arguments to find a LoanPayment
     * @example
     * // Get one LoanPayment
     * const loanPayment = await prisma.loanPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentFindFirstArgs} args - Arguments to find a LoanPayment
     * @example
     * // Get one LoanPayment
     * const loanPayment = await prisma.loanPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanPaymentFindFirstArgs>(args?: SelectSubset<T, LoanPaymentFindFirstArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentFindFirstOrThrowArgs} args - Arguments to find a LoanPayment
     * @example
     * // Get one LoanPayment
     * const loanPayment = await prisma.loanPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoanPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoanPayments
     * const loanPayments = await prisma.loanPayment.findMany()
     * 
     * // Get first 10 LoanPayments
     * const loanPayments = await prisma.loanPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanPaymentWithIdOnly = await prisma.loanPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanPaymentFindManyArgs>(args?: SelectSubset<T, LoanPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoanPayment.
     * @param {LoanPaymentCreateArgs} args - Arguments to create a LoanPayment.
     * @example
     * // Create one LoanPayment
     * const LoanPayment = await prisma.loanPayment.create({
     *   data: {
     *     // ... data to create a LoanPayment
     *   }
     * })
     * 
     */
    create<T extends LoanPaymentCreateArgs>(args: SelectSubset<T, LoanPaymentCreateArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoanPayments.
     * @param {LoanPaymentCreateManyArgs} args - Arguments to create many LoanPayments.
     * @example
     * // Create many LoanPayments
     * const loanPayment = await prisma.loanPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanPaymentCreateManyArgs>(args?: SelectSubset<T, LoanPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoanPayments and returns the data saved in the database.
     * @param {LoanPaymentCreateManyAndReturnArgs} args - Arguments to create many LoanPayments.
     * @example
     * // Create many LoanPayments
     * const loanPayment = await prisma.loanPayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoanPayments and only return the `id`
     * const loanPaymentWithIdOnly = await prisma.loanPayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoanPaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, LoanPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoanPayment.
     * @param {LoanPaymentDeleteArgs} args - Arguments to delete one LoanPayment.
     * @example
     * // Delete one LoanPayment
     * const LoanPayment = await prisma.loanPayment.delete({
     *   where: {
     *     // ... filter to delete one LoanPayment
     *   }
     * })
     * 
     */
    delete<T extends LoanPaymentDeleteArgs>(args: SelectSubset<T, LoanPaymentDeleteArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoanPayment.
     * @param {LoanPaymentUpdateArgs} args - Arguments to update one LoanPayment.
     * @example
     * // Update one LoanPayment
     * const loanPayment = await prisma.loanPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanPaymentUpdateArgs>(args: SelectSubset<T, LoanPaymentUpdateArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoanPayments.
     * @param {LoanPaymentDeleteManyArgs} args - Arguments to filter LoanPayments to delete.
     * @example
     * // Delete a few LoanPayments
     * const { count } = await prisma.loanPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanPaymentDeleteManyArgs>(args?: SelectSubset<T, LoanPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoanPayments
     * const loanPayment = await prisma.loanPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanPaymentUpdateManyArgs>(args: SelectSubset<T, LoanPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanPayments and returns the data updated in the database.
     * @param {LoanPaymentUpdateManyAndReturnArgs} args - Arguments to update many LoanPayments.
     * @example
     * // Update many LoanPayments
     * const loanPayment = await prisma.loanPayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoanPayments and only return the `id`
     * const loanPaymentWithIdOnly = await prisma.loanPayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoanPaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, LoanPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoanPayment.
     * @param {LoanPaymentUpsertArgs} args - Arguments to update or create a LoanPayment.
     * @example
     * // Update or create a LoanPayment
     * const loanPayment = await prisma.loanPayment.upsert({
     *   create: {
     *     // ... data to create a LoanPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoanPayment we want to update
     *   }
     * })
     */
    upsert<T extends LoanPaymentUpsertArgs>(args: SelectSubset<T, LoanPaymentUpsertArgs<ExtArgs>>): Prisma__LoanPaymentClient<$Result.GetResult<Prisma.$LoanPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoanPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentCountArgs} args - Arguments to filter LoanPayments to count.
     * @example
     * // Count the number of LoanPayments
     * const count = await prisma.loanPayment.count({
     *   where: {
     *     // ... the filter for the LoanPayments we want to count
     *   }
     * })
    **/
    count<T extends LoanPaymentCountArgs>(
      args?: Subset<T, LoanPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoanPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanPaymentAggregateArgs>(args: Subset<T, LoanPaymentAggregateArgs>): Prisma.PrismaPromise<GetLoanPaymentAggregateType<T>>

    /**
     * Group by LoanPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanPaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanPaymentGroupByArgs['orderBy'] }
        : { orderBy?: LoanPaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoanPayment model
   */
  readonly fields: LoanPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoanPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loan<T extends LoanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoanDefaultArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoanPayment model
   */
  interface LoanPaymentFieldRefs {
    readonly id: FieldRef<"LoanPayment", 'String'>
    readonly loanId: FieldRef<"LoanPayment", 'String'>
    readonly amount: FieldRef<"LoanPayment", 'Decimal'>
    readonly principalPaid: FieldRef<"LoanPayment", 'Decimal'>
    readonly interestPaid: FieldRef<"LoanPayment", 'Decimal'>
    readonly paidDate: FieldRef<"LoanPayment", 'DateTime'>
    readonly createdAt: FieldRef<"LoanPayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoanPayment findUnique
   */
  export type LoanPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanPayment to fetch.
     */
    where: LoanPaymentWhereUniqueInput
  }

  /**
   * LoanPayment findUniqueOrThrow
   */
  export type LoanPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanPayment to fetch.
     */
    where: LoanPaymentWhereUniqueInput
  }

  /**
   * LoanPayment findFirst
   */
  export type LoanPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanPayment to fetch.
     */
    where?: LoanPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanPayments to fetch.
     */
    orderBy?: LoanPaymentOrderByWithRelationInput | LoanPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanPayments.
     */
    cursor?: LoanPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanPayments.
     */
    distinct?: LoanPaymentScalarFieldEnum | LoanPaymentScalarFieldEnum[]
  }

  /**
   * LoanPayment findFirstOrThrow
   */
  export type LoanPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanPayment to fetch.
     */
    where?: LoanPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanPayments to fetch.
     */
    orderBy?: LoanPaymentOrderByWithRelationInput | LoanPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanPayments.
     */
    cursor?: LoanPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanPayments.
     */
    distinct?: LoanPaymentScalarFieldEnum | LoanPaymentScalarFieldEnum[]
  }

  /**
   * LoanPayment findMany
   */
  export type LoanPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanPayments to fetch.
     */
    where?: LoanPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanPayments to fetch.
     */
    orderBy?: LoanPaymentOrderByWithRelationInput | LoanPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoanPayments.
     */
    cursor?: LoanPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanPayments.
     */
    distinct?: LoanPaymentScalarFieldEnum | LoanPaymentScalarFieldEnum[]
  }

  /**
   * LoanPayment create
   */
  export type LoanPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a LoanPayment.
     */
    data: XOR<LoanPaymentCreateInput, LoanPaymentUncheckedCreateInput>
  }

  /**
   * LoanPayment createMany
   */
  export type LoanPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoanPayments.
     */
    data: LoanPaymentCreateManyInput | LoanPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoanPayment createManyAndReturn
   */
  export type LoanPaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * The data used to create many LoanPayments.
     */
    data: LoanPaymentCreateManyInput | LoanPaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanPayment update
   */
  export type LoanPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a LoanPayment.
     */
    data: XOR<LoanPaymentUpdateInput, LoanPaymentUncheckedUpdateInput>
    /**
     * Choose, which LoanPayment to update.
     */
    where: LoanPaymentWhereUniqueInput
  }

  /**
   * LoanPayment updateMany
   */
  export type LoanPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoanPayments.
     */
    data: XOR<LoanPaymentUpdateManyMutationInput, LoanPaymentUncheckedUpdateManyInput>
    /**
     * Filter which LoanPayments to update
     */
    where?: LoanPaymentWhereInput
    /**
     * Limit how many LoanPayments to update.
     */
    limit?: number
  }

  /**
   * LoanPayment updateManyAndReturn
   */
  export type LoanPaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * The data used to update LoanPayments.
     */
    data: XOR<LoanPaymentUpdateManyMutationInput, LoanPaymentUncheckedUpdateManyInput>
    /**
     * Filter which LoanPayments to update
     */
    where?: LoanPaymentWhereInput
    /**
     * Limit how many LoanPayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanPayment upsert
   */
  export type LoanPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the LoanPayment to update in case it exists.
     */
    where: LoanPaymentWhereUniqueInput
    /**
     * In case the LoanPayment found by the `where` argument doesn't exist, create a new LoanPayment with this data.
     */
    create: XOR<LoanPaymentCreateInput, LoanPaymentUncheckedCreateInput>
    /**
     * In case the LoanPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanPaymentUpdateInput, LoanPaymentUncheckedUpdateInput>
  }

  /**
   * LoanPayment delete
   */
  export type LoanPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
    /**
     * Filter which LoanPayment to delete.
     */
    where: LoanPaymentWhereUniqueInput
  }

  /**
   * LoanPayment deleteMany
   */
  export type LoanPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanPayments to delete
     */
    where?: LoanPaymentWhereInput
    /**
     * Limit how many LoanPayments to delete.
     */
    limit?: number
  }

  /**
   * LoanPayment without action
   */
  export type LoanPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanPayment
     */
    select?: LoanPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanPayment
     */
    omit?: LoanPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanPaymentInclude<ExtArgs> | null
  }


  /**
   * Model LoanExtraPayment
   */

  export type AggregateLoanExtraPayment = {
    _count: LoanExtraPaymentCountAggregateOutputType | null
    _avg: LoanExtraPaymentAvgAggregateOutputType | null
    _sum: LoanExtraPaymentSumAggregateOutputType | null
    _min: LoanExtraPaymentMinAggregateOutputType | null
    _max: LoanExtraPaymentMaxAggregateOutputType | null
  }

  export type LoanExtraPaymentAvgAggregateOutputType = {
    amount: Decimal | null
    newTermMonths: number | null
  }

  export type LoanExtraPaymentSumAggregateOutputType = {
    amount: Decimal | null
    newTermMonths: number | null
  }

  export type LoanExtraPaymentMinAggregateOutputType = {
    id: string | null
    loanId: string | null
    amount: Decimal | null
    date: Date | null
    note: string | null
    recalculationMode: string | null
    newTermMonths: number | null
    createdAt: Date | null
  }

  export type LoanExtraPaymentMaxAggregateOutputType = {
    id: string | null
    loanId: string | null
    amount: Decimal | null
    date: Date | null
    note: string | null
    recalculationMode: string | null
    newTermMonths: number | null
    createdAt: Date | null
  }

  export type LoanExtraPaymentCountAggregateOutputType = {
    id: number
    loanId: number
    amount: number
    date: number
    note: number
    recalculationMode: number
    newTermMonths: number
    createdAt: number
    _all: number
  }


  export type LoanExtraPaymentAvgAggregateInputType = {
    amount?: true
    newTermMonths?: true
  }

  export type LoanExtraPaymentSumAggregateInputType = {
    amount?: true
    newTermMonths?: true
  }

  export type LoanExtraPaymentMinAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    date?: true
    note?: true
    recalculationMode?: true
    newTermMonths?: true
    createdAt?: true
  }

  export type LoanExtraPaymentMaxAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    date?: true
    note?: true
    recalculationMode?: true
    newTermMonths?: true
    createdAt?: true
  }

  export type LoanExtraPaymentCountAggregateInputType = {
    id?: true
    loanId?: true
    amount?: true
    date?: true
    note?: true
    recalculationMode?: true
    newTermMonths?: true
    createdAt?: true
    _all?: true
  }

  export type LoanExtraPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanExtraPayment to aggregate.
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanExtraPayments to fetch.
     */
    orderBy?: LoanExtraPaymentOrderByWithRelationInput | LoanExtraPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanExtraPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanExtraPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanExtraPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoanExtraPayments
    **/
    _count?: true | LoanExtraPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanExtraPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanExtraPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanExtraPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanExtraPaymentMaxAggregateInputType
  }

  export type GetLoanExtraPaymentAggregateType<T extends LoanExtraPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateLoanExtraPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoanExtraPayment[P]>
      : GetScalarType<T[P], AggregateLoanExtraPayment[P]>
  }




  export type LoanExtraPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanExtraPaymentWhereInput
    orderBy?: LoanExtraPaymentOrderByWithAggregationInput | LoanExtraPaymentOrderByWithAggregationInput[]
    by: LoanExtraPaymentScalarFieldEnum[] | LoanExtraPaymentScalarFieldEnum
    having?: LoanExtraPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanExtraPaymentCountAggregateInputType | true
    _avg?: LoanExtraPaymentAvgAggregateInputType
    _sum?: LoanExtraPaymentSumAggregateInputType
    _min?: LoanExtraPaymentMinAggregateInputType
    _max?: LoanExtraPaymentMaxAggregateInputType
  }

  export type LoanExtraPaymentGroupByOutputType = {
    id: string
    loanId: string
    amount: Decimal
    date: Date
    note: string | null
    recalculationMode: string | null
    newTermMonths: number | null
    createdAt: Date
    _count: LoanExtraPaymentCountAggregateOutputType | null
    _avg: LoanExtraPaymentAvgAggregateOutputType | null
    _sum: LoanExtraPaymentSumAggregateOutputType | null
    _min: LoanExtraPaymentMinAggregateOutputType | null
    _max: LoanExtraPaymentMaxAggregateOutputType | null
  }

  type GetLoanExtraPaymentGroupByPayload<T extends LoanExtraPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanExtraPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanExtraPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanExtraPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], LoanExtraPaymentGroupByOutputType[P]>
        }
      >
    >


  export type LoanExtraPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    date?: boolean
    note?: boolean
    recalculationMode?: boolean
    newTermMonths?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanExtraPayment"]>

  export type LoanExtraPaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    date?: boolean
    note?: boolean
    recalculationMode?: boolean
    newTermMonths?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanExtraPayment"]>

  export type LoanExtraPaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    amount?: boolean
    date?: boolean
    note?: boolean
    recalculationMode?: boolean
    newTermMonths?: boolean
    createdAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanExtraPayment"]>

  export type LoanExtraPaymentSelectScalar = {
    id?: boolean
    loanId?: boolean
    amount?: boolean
    date?: boolean
    note?: boolean
    recalculationMode?: boolean
    newTermMonths?: boolean
    createdAt?: boolean
  }

  export type LoanExtraPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "loanId" | "amount" | "date" | "note" | "recalculationMode" | "newTermMonths" | "createdAt", ExtArgs["result"]["loanExtraPayment"]>
  export type LoanExtraPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanExtraPaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanExtraPaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }

  export type $LoanExtraPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoanExtraPayment"
    objects: {
      loan: Prisma.$LoanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loanId: string
      amount: Prisma.Decimal
      date: Date
      note: string | null
      /**
       * Cómo afecta el abono a la amortización:
       * - null | "REDUCE_TERM"     → comportamiento histórico: misma cuota, menor plazo.
       * - "REDUCE_PAYMENT"         → recalcula la cuota con la fórmula francesa sobre
       * `newTermMonths` usando el saldo pendiente post-abono.
       */
      recalculationMode: string | null
      /**
       * Plazo TOTAL en meses del crédito después del recálculo. Solo aplica cuando
       * `recalculationMode === "REDUCE_PAYMENT"`. Debe ser >= meses restantes al
       * momento del abono.
       */
      newTermMonths: number | null
      createdAt: Date
    }, ExtArgs["result"]["loanExtraPayment"]>
    composites: {}
  }

  type LoanExtraPaymentGetPayload<S extends boolean | null | undefined | LoanExtraPaymentDefaultArgs> = $Result.GetResult<Prisma.$LoanExtraPaymentPayload, S>

  type LoanExtraPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanExtraPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanExtraPaymentCountAggregateInputType | true
    }

  export interface LoanExtraPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoanExtraPayment'], meta: { name: 'LoanExtraPayment' } }
    /**
     * Find zero or one LoanExtraPayment that matches the filter.
     * @param {LoanExtraPaymentFindUniqueArgs} args - Arguments to find a LoanExtraPayment
     * @example
     * // Get one LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanExtraPaymentFindUniqueArgs>(args: SelectSubset<T, LoanExtraPaymentFindUniqueArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoanExtraPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanExtraPaymentFindUniqueOrThrowArgs} args - Arguments to find a LoanExtraPayment
     * @example
     * // Get one LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanExtraPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanExtraPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanExtraPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentFindFirstArgs} args - Arguments to find a LoanExtraPayment
     * @example
     * // Get one LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanExtraPaymentFindFirstArgs>(args?: SelectSubset<T, LoanExtraPaymentFindFirstArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanExtraPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentFindFirstOrThrowArgs} args - Arguments to find a LoanExtraPayment
     * @example
     * // Get one LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanExtraPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanExtraPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoanExtraPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoanExtraPayments
     * const loanExtraPayments = await prisma.loanExtraPayment.findMany()
     * 
     * // Get first 10 LoanExtraPayments
     * const loanExtraPayments = await prisma.loanExtraPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanExtraPaymentWithIdOnly = await prisma.loanExtraPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanExtraPaymentFindManyArgs>(args?: SelectSubset<T, LoanExtraPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoanExtraPayment.
     * @param {LoanExtraPaymentCreateArgs} args - Arguments to create a LoanExtraPayment.
     * @example
     * // Create one LoanExtraPayment
     * const LoanExtraPayment = await prisma.loanExtraPayment.create({
     *   data: {
     *     // ... data to create a LoanExtraPayment
     *   }
     * })
     * 
     */
    create<T extends LoanExtraPaymentCreateArgs>(args: SelectSubset<T, LoanExtraPaymentCreateArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoanExtraPayments.
     * @param {LoanExtraPaymentCreateManyArgs} args - Arguments to create many LoanExtraPayments.
     * @example
     * // Create many LoanExtraPayments
     * const loanExtraPayment = await prisma.loanExtraPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanExtraPaymentCreateManyArgs>(args?: SelectSubset<T, LoanExtraPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoanExtraPayments and returns the data saved in the database.
     * @param {LoanExtraPaymentCreateManyAndReturnArgs} args - Arguments to create many LoanExtraPayments.
     * @example
     * // Create many LoanExtraPayments
     * const loanExtraPayment = await prisma.loanExtraPayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoanExtraPayments and only return the `id`
     * const loanExtraPaymentWithIdOnly = await prisma.loanExtraPayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoanExtraPaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, LoanExtraPaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoanExtraPayment.
     * @param {LoanExtraPaymentDeleteArgs} args - Arguments to delete one LoanExtraPayment.
     * @example
     * // Delete one LoanExtraPayment
     * const LoanExtraPayment = await prisma.loanExtraPayment.delete({
     *   where: {
     *     // ... filter to delete one LoanExtraPayment
     *   }
     * })
     * 
     */
    delete<T extends LoanExtraPaymentDeleteArgs>(args: SelectSubset<T, LoanExtraPaymentDeleteArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoanExtraPayment.
     * @param {LoanExtraPaymentUpdateArgs} args - Arguments to update one LoanExtraPayment.
     * @example
     * // Update one LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanExtraPaymentUpdateArgs>(args: SelectSubset<T, LoanExtraPaymentUpdateArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoanExtraPayments.
     * @param {LoanExtraPaymentDeleteManyArgs} args - Arguments to filter LoanExtraPayments to delete.
     * @example
     * // Delete a few LoanExtraPayments
     * const { count } = await prisma.loanExtraPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanExtraPaymentDeleteManyArgs>(args?: SelectSubset<T, LoanExtraPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanExtraPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoanExtraPayments
     * const loanExtraPayment = await prisma.loanExtraPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanExtraPaymentUpdateManyArgs>(args: SelectSubset<T, LoanExtraPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanExtraPayments and returns the data updated in the database.
     * @param {LoanExtraPaymentUpdateManyAndReturnArgs} args - Arguments to update many LoanExtraPayments.
     * @example
     * // Update many LoanExtraPayments
     * const loanExtraPayment = await prisma.loanExtraPayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoanExtraPayments and only return the `id`
     * const loanExtraPaymentWithIdOnly = await prisma.loanExtraPayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoanExtraPaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, LoanExtraPaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoanExtraPayment.
     * @param {LoanExtraPaymentUpsertArgs} args - Arguments to update or create a LoanExtraPayment.
     * @example
     * // Update or create a LoanExtraPayment
     * const loanExtraPayment = await prisma.loanExtraPayment.upsert({
     *   create: {
     *     // ... data to create a LoanExtraPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoanExtraPayment we want to update
     *   }
     * })
     */
    upsert<T extends LoanExtraPaymentUpsertArgs>(args: SelectSubset<T, LoanExtraPaymentUpsertArgs<ExtArgs>>): Prisma__LoanExtraPaymentClient<$Result.GetResult<Prisma.$LoanExtraPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoanExtraPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentCountArgs} args - Arguments to filter LoanExtraPayments to count.
     * @example
     * // Count the number of LoanExtraPayments
     * const count = await prisma.loanExtraPayment.count({
     *   where: {
     *     // ... the filter for the LoanExtraPayments we want to count
     *   }
     * })
    **/
    count<T extends LoanExtraPaymentCountArgs>(
      args?: Subset<T, LoanExtraPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanExtraPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoanExtraPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanExtraPaymentAggregateArgs>(args: Subset<T, LoanExtraPaymentAggregateArgs>): Prisma.PrismaPromise<GetLoanExtraPaymentAggregateType<T>>

    /**
     * Group by LoanExtraPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanExtraPaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanExtraPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanExtraPaymentGroupByArgs['orderBy'] }
        : { orderBy?: LoanExtraPaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanExtraPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanExtraPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoanExtraPayment model
   */
  readonly fields: LoanExtraPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoanExtraPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanExtraPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loan<T extends LoanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoanDefaultArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoanExtraPayment model
   */
  interface LoanExtraPaymentFieldRefs {
    readonly id: FieldRef<"LoanExtraPayment", 'String'>
    readonly loanId: FieldRef<"LoanExtraPayment", 'String'>
    readonly amount: FieldRef<"LoanExtraPayment", 'Decimal'>
    readonly date: FieldRef<"LoanExtraPayment", 'DateTime'>
    readonly note: FieldRef<"LoanExtraPayment", 'String'>
    readonly recalculationMode: FieldRef<"LoanExtraPayment", 'String'>
    readonly newTermMonths: FieldRef<"LoanExtraPayment", 'Int'>
    readonly createdAt: FieldRef<"LoanExtraPayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoanExtraPayment findUnique
   */
  export type LoanExtraPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanExtraPayment to fetch.
     */
    where: LoanExtraPaymentWhereUniqueInput
  }

  /**
   * LoanExtraPayment findUniqueOrThrow
   */
  export type LoanExtraPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanExtraPayment to fetch.
     */
    where: LoanExtraPaymentWhereUniqueInput
  }

  /**
   * LoanExtraPayment findFirst
   */
  export type LoanExtraPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanExtraPayment to fetch.
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanExtraPayments to fetch.
     */
    orderBy?: LoanExtraPaymentOrderByWithRelationInput | LoanExtraPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanExtraPayments.
     */
    cursor?: LoanExtraPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanExtraPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanExtraPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanExtraPayments.
     */
    distinct?: LoanExtraPaymentScalarFieldEnum | LoanExtraPaymentScalarFieldEnum[]
  }

  /**
   * LoanExtraPayment findFirstOrThrow
   */
  export type LoanExtraPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanExtraPayment to fetch.
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanExtraPayments to fetch.
     */
    orderBy?: LoanExtraPaymentOrderByWithRelationInput | LoanExtraPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanExtraPayments.
     */
    cursor?: LoanExtraPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanExtraPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanExtraPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanExtraPayments.
     */
    distinct?: LoanExtraPaymentScalarFieldEnum | LoanExtraPaymentScalarFieldEnum[]
  }

  /**
   * LoanExtraPayment findMany
   */
  export type LoanExtraPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter, which LoanExtraPayments to fetch.
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanExtraPayments to fetch.
     */
    orderBy?: LoanExtraPaymentOrderByWithRelationInput | LoanExtraPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoanExtraPayments.
     */
    cursor?: LoanExtraPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanExtraPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanExtraPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanExtraPayments.
     */
    distinct?: LoanExtraPaymentScalarFieldEnum | LoanExtraPaymentScalarFieldEnum[]
  }

  /**
   * LoanExtraPayment create
   */
  export type LoanExtraPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a LoanExtraPayment.
     */
    data: XOR<LoanExtraPaymentCreateInput, LoanExtraPaymentUncheckedCreateInput>
  }

  /**
   * LoanExtraPayment createMany
   */
  export type LoanExtraPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoanExtraPayments.
     */
    data: LoanExtraPaymentCreateManyInput | LoanExtraPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoanExtraPayment createManyAndReturn
   */
  export type LoanExtraPaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * The data used to create many LoanExtraPayments.
     */
    data: LoanExtraPaymentCreateManyInput | LoanExtraPaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanExtraPayment update
   */
  export type LoanExtraPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a LoanExtraPayment.
     */
    data: XOR<LoanExtraPaymentUpdateInput, LoanExtraPaymentUncheckedUpdateInput>
    /**
     * Choose, which LoanExtraPayment to update.
     */
    where: LoanExtraPaymentWhereUniqueInput
  }

  /**
   * LoanExtraPayment updateMany
   */
  export type LoanExtraPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoanExtraPayments.
     */
    data: XOR<LoanExtraPaymentUpdateManyMutationInput, LoanExtraPaymentUncheckedUpdateManyInput>
    /**
     * Filter which LoanExtraPayments to update
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * Limit how many LoanExtraPayments to update.
     */
    limit?: number
  }

  /**
   * LoanExtraPayment updateManyAndReturn
   */
  export type LoanExtraPaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * The data used to update LoanExtraPayments.
     */
    data: XOR<LoanExtraPaymentUpdateManyMutationInput, LoanExtraPaymentUncheckedUpdateManyInput>
    /**
     * Filter which LoanExtraPayments to update
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * Limit how many LoanExtraPayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanExtraPayment upsert
   */
  export type LoanExtraPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the LoanExtraPayment to update in case it exists.
     */
    where: LoanExtraPaymentWhereUniqueInput
    /**
     * In case the LoanExtraPayment found by the `where` argument doesn't exist, create a new LoanExtraPayment with this data.
     */
    create: XOR<LoanExtraPaymentCreateInput, LoanExtraPaymentUncheckedCreateInput>
    /**
     * In case the LoanExtraPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanExtraPaymentUpdateInput, LoanExtraPaymentUncheckedUpdateInput>
  }

  /**
   * LoanExtraPayment delete
   */
  export type LoanExtraPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
    /**
     * Filter which LoanExtraPayment to delete.
     */
    where: LoanExtraPaymentWhereUniqueInput
  }

  /**
   * LoanExtraPayment deleteMany
   */
  export type LoanExtraPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanExtraPayments to delete
     */
    where?: LoanExtraPaymentWhereInput
    /**
     * Limit how many LoanExtraPayments to delete.
     */
    limit?: number
  }

  /**
   * LoanExtraPayment without action
   */
  export type LoanExtraPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanExtraPayment
     */
    select?: LoanExtraPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanExtraPayment
     */
    omit?: LoanExtraPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanExtraPaymentInclude<ExtArgs> | null
  }


  /**
   * Model LoanFee
   */

  export type AggregateLoanFee = {
    _count: LoanFeeCountAggregateOutputType | null
    _avg: LoanFeeAvgAggregateOutputType | null
    _sum: LoanFeeSumAggregateOutputType | null
    _min: LoanFeeMinAggregateOutputType | null
    _max: LoanFeeMaxAggregateOutputType | null
  }

  export type LoanFeeAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type LoanFeeSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type LoanFeeMinAggregateOutputType = {
    id: string | null
    loanId: string | null
    name: string | null
    amount: Decimal | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanFeeMaxAggregateOutputType = {
    id: string | null
    loanId: string | null
    name: string | null
    amount: Decimal | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanFeeCountAggregateOutputType = {
    id: number
    loanId: number
    name: number
    amount: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoanFeeAvgAggregateInputType = {
    amount?: true
  }

  export type LoanFeeSumAggregateInputType = {
    amount?: true
  }

  export type LoanFeeMinAggregateInputType = {
    id?: true
    loanId?: true
    name?: true
    amount?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanFeeMaxAggregateInputType = {
    id?: true
    loanId?: true
    name?: true
    amount?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanFeeCountAggregateInputType = {
    id?: true
    loanId?: true
    name?: true
    amount?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoanFeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanFee to aggregate.
     */
    where?: LoanFeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFees to fetch.
     */
    orderBy?: LoanFeeOrderByWithRelationInput | LoanFeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanFeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoanFees
    **/
    _count?: true | LoanFeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanFeeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanFeeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanFeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanFeeMaxAggregateInputType
  }

  export type GetLoanFeeAggregateType<T extends LoanFeeAggregateArgs> = {
        [P in keyof T & keyof AggregateLoanFee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoanFee[P]>
      : GetScalarType<T[P], AggregateLoanFee[P]>
  }




  export type LoanFeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanFeeWhereInput
    orderBy?: LoanFeeOrderByWithAggregationInput | LoanFeeOrderByWithAggregationInput[]
    by: LoanFeeScalarFieldEnum[] | LoanFeeScalarFieldEnum
    having?: LoanFeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanFeeCountAggregateInputType | true
    _avg?: LoanFeeAvgAggregateInputType
    _sum?: LoanFeeSumAggregateInputType
    _min?: LoanFeeMinAggregateInputType
    _max?: LoanFeeMaxAggregateInputType
  }

  export type LoanFeeGroupByOutputType = {
    id: string
    loanId: string
    name: string
    amount: Decimal
    type: string
    createdAt: Date
    updatedAt: Date
    _count: LoanFeeCountAggregateOutputType | null
    _avg: LoanFeeAvgAggregateOutputType | null
    _sum: LoanFeeSumAggregateOutputType | null
    _min: LoanFeeMinAggregateOutputType | null
    _max: LoanFeeMaxAggregateOutputType | null
  }

  type GetLoanFeeGroupByPayload<T extends LoanFeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanFeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanFeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanFeeGroupByOutputType[P]>
            : GetScalarType<T[P], LoanFeeGroupByOutputType[P]>
        }
      >
    >


  export type LoanFeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    name?: boolean
    amount?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanFee"]>

  export type LoanFeeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    name?: boolean
    amount?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanFee"]>

  export type LoanFeeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loanId?: boolean
    name?: boolean
    amount?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanFee"]>

  export type LoanFeeSelectScalar = {
    id?: boolean
    loanId?: boolean
    name?: boolean
    amount?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoanFeeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "loanId" | "name" | "amount" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["loanFee"]>
  export type LoanFeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanFeeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }
  export type LoanFeeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loan?: boolean | LoanDefaultArgs<ExtArgs>
  }

  export type $LoanFeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoanFee"
    objects: {
      loan: Prisma.$LoanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loanId: string
      name: string
      amount: Prisma.Decimal
      type: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loanFee"]>
    composites: {}
  }

  type LoanFeeGetPayload<S extends boolean | null | undefined | LoanFeeDefaultArgs> = $Result.GetResult<Prisma.$LoanFeePayload, S>

  type LoanFeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanFeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanFeeCountAggregateInputType | true
    }

  export interface LoanFeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoanFee'], meta: { name: 'LoanFee' } }
    /**
     * Find zero or one LoanFee that matches the filter.
     * @param {LoanFeeFindUniqueArgs} args - Arguments to find a LoanFee
     * @example
     * // Get one LoanFee
     * const loanFee = await prisma.loanFee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanFeeFindUniqueArgs>(args: SelectSubset<T, LoanFeeFindUniqueArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoanFee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanFeeFindUniqueOrThrowArgs} args - Arguments to find a LoanFee
     * @example
     * // Get one LoanFee
     * const loanFee = await prisma.loanFee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanFeeFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanFeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanFee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeFindFirstArgs} args - Arguments to find a LoanFee
     * @example
     * // Get one LoanFee
     * const loanFee = await prisma.loanFee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanFeeFindFirstArgs>(args?: SelectSubset<T, LoanFeeFindFirstArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanFee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeFindFirstOrThrowArgs} args - Arguments to find a LoanFee
     * @example
     * // Get one LoanFee
     * const loanFee = await prisma.loanFee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanFeeFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanFeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoanFees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoanFees
     * const loanFees = await prisma.loanFee.findMany()
     * 
     * // Get first 10 LoanFees
     * const loanFees = await prisma.loanFee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanFeeWithIdOnly = await prisma.loanFee.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanFeeFindManyArgs>(args?: SelectSubset<T, LoanFeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoanFee.
     * @param {LoanFeeCreateArgs} args - Arguments to create a LoanFee.
     * @example
     * // Create one LoanFee
     * const LoanFee = await prisma.loanFee.create({
     *   data: {
     *     // ... data to create a LoanFee
     *   }
     * })
     * 
     */
    create<T extends LoanFeeCreateArgs>(args: SelectSubset<T, LoanFeeCreateArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoanFees.
     * @param {LoanFeeCreateManyArgs} args - Arguments to create many LoanFees.
     * @example
     * // Create many LoanFees
     * const loanFee = await prisma.loanFee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanFeeCreateManyArgs>(args?: SelectSubset<T, LoanFeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoanFees and returns the data saved in the database.
     * @param {LoanFeeCreateManyAndReturnArgs} args - Arguments to create many LoanFees.
     * @example
     * // Create many LoanFees
     * const loanFee = await prisma.loanFee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoanFees and only return the `id`
     * const loanFeeWithIdOnly = await prisma.loanFee.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoanFeeCreateManyAndReturnArgs>(args?: SelectSubset<T, LoanFeeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoanFee.
     * @param {LoanFeeDeleteArgs} args - Arguments to delete one LoanFee.
     * @example
     * // Delete one LoanFee
     * const LoanFee = await prisma.loanFee.delete({
     *   where: {
     *     // ... filter to delete one LoanFee
     *   }
     * })
     * 
     */
    delete<T extends LoanFeeDeleteArgs>(args: SelectSubset<T, LoanFeeDeleteArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoanFee.
     * @param {LoanFeeUpdateArgs} args - Arguments to update one LoanFee.
     * @example
     * // Update one LoanFee
     * const loanFee = await prisma.loanFee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanFeeUpdateArgs>(args: SelectSubset<T, LoanFeeUpdateArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoanFees.
     * @param {LoanFeeDeleteManyArgs} args - Arguments to filter LoanFees to delete.
     * @example
     * // Delete a few LoanFees
     * const { count } = await prisma.loanFee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanFeeDeleteManyArgs>(args?: SelectSubset<T, LoanFeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanFees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoanFees
     * const loanFee = await prisma.loanFee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanFeeUpdateManyArgs>(args: SelectSubset<T, LoanFeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanFees and returns the data updated in the database.
     * @param {LoanFeeUpdateManyAndReturnArgs} args - Arguments to update many LoanFees.
     * @example
     * // Update many LoanFees
     * const loanFee = await prisma.loanFee.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoanFees and only return the `id`
     * const loanFeeWithIdOnly = await prisma.loanFee.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoanFeeUpdateManyAndReturnArgs>(args: SelectSubset<T, LoanFeeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoanFee.
     * @param {LoanFeeUpsertArgs} args - Arguments to update or create a LoanFee.
     * @example
     * // Update or create a LoanFee
     * const loanFee = await prisma.loanFee.upsert({
     *   create: {
     *     // ... data to create a LoanFee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoanFee we want to update
     *   }
     * })
     */
    upsert<T extends LoanFeeUpsertArgs>(args: SelectSubset<T, LoanFeeUpsertArgs<ExtArgs>>): Prisma__LoanFeeClient<$Result.GetResult<Prisma.$LoanFeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoanFees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeCountArgs} args - Arguments to filter LoanFees to count.
     * @example
     * // Count the number of LoanFees
     * const count = await prisma.loanFee.count({
     *   where: {
     *     // ... the filter for the LoanFees we want to count
     *   }
     * })
    **/
    count<T extends LoanFeeCountArgs>(
      args?: Subset<T, LoanFeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanFeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoanFee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanFeeAggregateArgs>(args: Subset<T, LoanFeeAggregateArgs>): Prisma.PrismaPromise<GetLoanFeeAggregateType<T>>

    /**
     * Group by LoanFee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanFeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanFeeGroupByArgs['orderBy'] }
        : { orderBy?: LoanFeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanFeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanFeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoanFee model
   */
  readonly fields: LoanFeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoanFee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanFeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loan<T extends LoanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoanDefaultArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoanFee model
   */
  interface LoanFeeFieldRefs {
    readonly id: FieldRef<"LoanFee", 'String'>
    readonly loanId: FieldRef<"LoanFee", 'String'>
    readonly name: FieldRef<"LoanFee", 'String'>
    readonly amount: FieldRef<"LoanFee", 'Decimal'>
    readonly type: FieldRef<"LoanFee", 'String'>
    readonly createdAt: FieldRef<"LoanFee", 'DateTime'>
    readonly updatedAt: FieldRef<"LoanFee", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoanFee findUnique
   */
  export type LoanFeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter, which LoanFee to fetch.
     */
    where: LoanFeeWhereUniqueInput
  }

  /**
   * LoanFee findUniqueOrThrow
   */
  export type LoanFeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter, which LoanFee to fetch.
     */
    where: LoanFeeWhereUniqueInput
  }

  /**
   * LoanFee findFirst
   */
  export type LoanFeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter, which LoanFee to fetch.
     */
    where?: LoanFeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFees to fetch.
     */
    orderBy?: LoanFeeOrderByWithRelationInput | LoanFeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanFees.
     */
    cursor?: LoanFeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanFees.
     */
    distinct?: LoanFeeScalarFieldEnum | LoanFeeScalarFieldEnum[]
  }

  /**
   * LoanFee findFirstOrThrow
   */
  export type LoanFeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter, which LoanFee to fetch.
     */
    where?: LoanFeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFees to fetch.
     */
    orderBy?: LoanFeeOrderByWithRelationInput | LoanFeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanFees.
     */
    cursor?: LoanFeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanFees.
     */
    distinct?: LoanFeeScalarFieldEnum | LoanFeeScalarFieldEnum[]
  }

  /**
   * LoanFee findMany
   */
  export type LoanFeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter, which LoanFees to fetch.
     */
    where?: LoanFeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFees to fetch.
     */
    orderBy?: LoanFeeOrderByWithRelationInput | LoanFeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoanFees.
     */
    cursor?: LoanFeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanFees.
     */
    distinct?: LoanFeeScalarFieldEnum | LoanFeeScalarFieldEnum[]
  }

  /**
   * LoanFee create
   */
  export type LoanFeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * The data needed to create a LoanFee.
     */
    data: XOR<LoanFeeCreateInput, LoanFeeUncheckedCreateInput>
  }

  /**
   * LoanFee createMany
   */
  export type LoanFeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoanFees.
     */
    data: LoanFeeCreateManyInput | LoanFeeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoanFee createManyAndReturn
   */
  export type LoanFeeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * The data used to create many LoanFees.
     */
    data: LoanFeeCreateManyInput | LoanFeeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanFee update
   */
  export type LoanFeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * The data needed to update a LoanFee.
     */
    data: XOR<LoanFeeUpdateInput, LoanFeeUncheckedUpdateInput>
    /**
     * Choose, which LoanFee to update.
     */
    where: LoanFeeWhereUniqueInput
  }

  /**
   * LoanFee updateMany
   */
  export type LoanFeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoanFees.
     */
    data: XOR<LoanFeeUpdateManyMutationInput, LoanFeeUncheckedUpdateManyInput>
    /**
     * Filter which LoanFees to update
     */
    where?: LoanFeeWhereInput
    /**
     * Limit how many LoanFees to update.
     */
    limit?: number
  }

  /**
   * LoanFee updateManyAndReturn
   */
  export type LoanFeeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * The data used to update LoanFees.
     */
    data: XOR<LoanFeeUpdateManyMutationInput, LoanFeeUncheckedUpdateManyInput>
    /**
     * Filter which LoanFees to update
     */
    where?: LoanFeeWhereInput
    /**
     * Limit how many LoanFees to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoanFee upsert
   */
  export type LoanFeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * The filter to search for the LoanFee to update in case it exists.
     */
    where: LoanFeeWhereUniqueInput
    /**
     * In case the LoanFee found by the `where` argument doesn't exist, create a new LoanFee with this data.
     */
    create: XOR<LoanFeeCreateInput, LoanFeeUncheckedCreateInput>
    /**
     * In case the LoanFee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanFeeUpdateInput, LoanFeeUncheckedUpdateInput>
  }

  /**
   * LoanFee delete
   */
  export type LoanFeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
    /**
     * Filter which LoanFee to delete.
     */
    where: LoanFeeWhereUniqueInput
  }

  /**
   * LoanFee deleteMany
   */
  export type LoanFeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanFees to delete
     */
    where?: LoanFeeWhereInput
    /**
     * Limit how many LoanFees to delete.
     */
    limit?: number
  }

  /**
   * LoanFee without action
   */
  export type LoanFeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFee
     */
    select?: LoanFeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFee
     */
    omit?: LoanFeeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFeeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BudgetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    income: 'income',
    currency: 'currency',
    rule: 'rule',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BudgetScalarFieldEnum = (typeof BudgetScalarFieldEnum)[keyof typeof BudgetScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    budgetId: 'budgetId',
    name: 'name',
    type: 'type',
    color: 'color'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    categoryId: 'categoryId',
    amount: 'amount',
    description: 'description',
    date: 'date',
    recurrence: 'recurrence',
    createdAt: 'createdAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const SimulationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    inputs: 'inputs',
    result: 'result',
    aiAnalysis: 'aiAnalysis',
    aiAnalysisGeneratedAt: 'aiAnalysisGeneratedAt',
    createdAt: 'createdAt'
  };

  export type SimulationScalarFieldEnum = (typeof SimulationScalarFieldEnum)[keyof typeof SimulationScalarFieldEnum]


  export const MonthlySnapshotScalarFieldEnum: {
    id: 'id',
    budgetId: 'budgetId',
    month: 'month',
    year: 'year',
    income: 'income',
    totalExpenses: 'totalExpenses',
    totalSavings: 'totalSavings',
    categoryBreakdown: 'categoryBreakdown',
    createdAt: 'createdAt'
  };

  export type MonthlySnapshotScalarFieldEnum = (typeof MonthlySnapshotScalarFieldEnum)[keyof typeof MonthlySnapshotScalarFieldEnum]


  export const LoanScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    simulationId: 'simulationId',
    title: 'title',
    type: 'type',
    principal: 'principal',
    downPayment: 'downPayment',
    annualRate: 'annualRate',
    termMonths: 'termMonths',
    formula: 'formula',
    monthlyPayment: 'monthlyPayment',
    startDate: 'startDate',
    status: 'status',
    paidInstallments: 'paidInstallments',
    totalInterest: 'totalInterest',
    totalCost: 'totalCost',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoanScalarFieldEnum = (typeof LoanScalarFieldEnum)[keyof typeof LoanScalarFieldEnum]


  export const LoanPaymentScalarFieldEnum: {
    id: 'id',
    loanId: 'loanId',
    amount: 'amount',
    principalPaid: 'principalPaid',
    interestPaid: 'interestPaid',
    paidDate: 'paidDate',
    createdAt: 'createdAt'
  };

  export type LoanPaymentScalarFieldEnum = (typeof LoanPaymentScalarFieldEnum)[keyof typeof LoanPaymentScalarFieldEnum]


  export const LoanExtraPaymentScalarFieldEnum: {
    id: 'id',
    loanId: 'loanId',
    amount: 'amount',
    date: 'date',
    note: 'note',
    recalculationMode: 'recalculationMode',
    newTermMonths: 'newTermMonths',
    createdAt: 'createdAt'
  };

  export type LoanExtraPaymentScalarFieldEnum = (typeof LoanExtraPaymentScalarFieldEnum)[keyof typeof LoanExtraPaymentScalarFieldEnum]


  export const LoanFeeScalarFieldEnum: {
    id: 'id',
    loanId: 'loanId',
    name: 'name',
    amount: 'amount',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoanFeeScalarFieldEnum = (typeof LoanFeeScalarFieldEnum)[keyof typeof LoanFeeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    budgets?: BudgetListRelationFilter
    simulations?: SimulationListRelationFilter
    loans?: LoanListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    budgets?: BudgetOrderByRelationAggregateInput
    simulations?: SimulationOrderByRelationAggregateInput
    loans?: LoanOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    budgets?: BudgetListRelationFilter
    simulations?: SimulationListRelationFilter
    loans?: LoanListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type BudgetWhereInput = {
    AND?: BudgetWhereInput | BudgetWhereInput[]
    OR?: BudgetWhereInput[]
    NOT?: BudgetWhereInput | BudgetWhereInput[]
    id?: StringFilter<"Budget"> | string
    userId?: StringFilter<"Budget"> | string
    name?: StringFilter<"Budget"> | string
    income?: DecimalFilter<"Budget"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Budget"> | string
    rule?: JsonFilter<"Budget">
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    categories?: CategoryListRelationFilter
    snapshots?: MonthlySnapshotListRelationFilter
  }

  export type BudgetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    income?: SortOrder
    currency?: SortOrder
    rule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    categories?: CategoryOrderByRelationAggregateInput
    snapshots?: MonthlySnapshotOrderByRelationAggregateInput
  }

  export type BudgetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BudgetWhereInput | BudgetWhereInput[]
    OR?: BudgetWhereInput[]
    NOT?: BudgetWhereInput | BudgetWhereInput[]
    userId?: StringFilter<"Budget"> | string
    name?: StringFilter<"Budget"> | string
    income?: DecimalFilter<"Budget"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Budget"> | string
    rule?: JsonFilter<"Budget">
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    categories?: CategoryListRelationFilter
    snapshots?: MonthlySnapshotListRelationFilter
  }, "id">

  export type BudgetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    income?: SortOrder
    currency?: SortOrder
    rule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BudgetCountOrderByAggregateInput
    _avg?: BudgetAvgOrderByAggregateInput
    _max?: BudgetMaxOrderByAggregateInput
    _min?: BudgetMinOrderByAggregateInput
    _sum?: BudgetSumOrderByAggregateInput
  }

  export type BudgetScalarWhereWithAggregatesInput = {
    AND?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[]
    OR?: BudgetScalarWhereWithAggregatesInput[]
    NOT?: BudgetScalarWhereWithAggregatesInput | BudgetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Budget"> | string
    userId?: StringWithAggregatesFilter<"Budget"> | string
    name?: StringWithAggregatesFilter<"Budget"> | string
    income?: DecimalWithAggregatesFilter<"Budget"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Budget"> | string
    rule?: JsonWithAggregatesFilter<"Budget">
    createdAt?: DateTimeWithAggregatesFilter<"Budget"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Budget"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    budgetId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    type?: StringFilter<"Category"> | string
    color?: StringFilter<"Category"> | string
    budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>
    transactions?: TransactionListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    budgetId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    color?: SortOrder
    budget?: BudgetOrderByWithRelationInput
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    budgetId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    type?: StringFilter<"Category"> | string
    color?: StringFilter<"Category"> | string
    budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>
    transactions?: TransactionListRelationFilter
  }, "id">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    budgetId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    color?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    budgetId?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    type?: StringWithAggregatesFilter<"Category"> | string
    color?: StringWithAggregatesFilter<"Category"> | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    categoryId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    date?: DateTimeFilter<"Transaction"> | Date | string
    recurrence?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    categoryId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    date?: DateTimeFilter<"Transaction"> | Date | string
    recurrence?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    categoryId?: StringWithAggregatesFilter<"Transaction"> | string
    amount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    date?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    recurrence?: StringWithAggregatesFilter<"Transaction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type SimulationWhereInput = {
    AND?: SimulationWhereInput | SimulationWhereInput[]
    OR?: SimulationWhereInput[]
    NOT?: SimulationWhereInput | SimulationWhereInput[]
    id?: StringFilter<"Simulation"> | string
    userId?: StringFilter<"Simulation"> | string
    type?: StringFilter<"Simulation"> | string
    title?: StringFilter<"Simulation"> | string
    inputs?: JsonFilter<"Simulation">
    result?: JsonFilter<"Simulation">
    aiAnalysis?: StringNullableFilter<"Simulation"> | string | null
    aiAnalysisGeneratedAt?: DateTimeNullableFilter<"Simulation"> | Date | string | null
    createdAt?: DateTimeFilter<"Simulation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SimulationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    inputs?: SortOrder
    result?: SortOrder
    aiAnalysis?: SortOrderInput | SortOrder
    aiAnalysisGeneratedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SimulationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SimulationWhereInput | SimulationWhereInput[]
    OR?: SimulationWhereInput[]
    NOT?: SimulationWhereInput | SimulationWhereInput[]
    userId?: StringFilter<"Simulation"> | string
    type?: StringFilter<"Simulation"> | string
    title?: StringFilter<"Simulation"> | string
    inputs?: JsonFilter<"Simulation">
    result?: JsonFilter<"Simulation">
    aiAnalysis?: StringNullableFilter<"Simulation"> | string | null
    aiAnalysisGeneratedAt?: DateTimeNullableFilter<"Simulation"> | Date | string | null
    createdAt?: DateTimeFilter<"Simulation"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SimulationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    inputs?: SortOrder
    result?: SortOrder
    aiAnalysis?: SortOrderInput | SortOrder
    aiAnalysisGeneratedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SimulationCountOrderByAggregateInput
    _max?: SimulationMaxOrderByAggregateInput
    _min?: SimulationMinOrderByAggregateInput
  }

  export type SimulationScalarWhereWithAggregatesInput = {
    AND?: SimulationScalarWhereWithAggregatesInput | SimulationScalarWhereWithAggregatesInput[]
    OR?: SimulationScalarWhereWithAggregatesInput[]
    NOT?: SimulationScalarWhereWithAggregatesInput | SimulationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Simulation"> | string
    userId?: StringWithAggregatesFilter<"Simulation"> | string
    type?: StringWithAggregatesFilter<"Simulation"> | string
    title?: StringWithAggregatesFilter<"Simulation"> | string
    inputs?: JsonWithAggregatesFilter<"Simulation">
    result?: JsonWithAggregatesFilter<"Simulation">
    aiAnalysis?: StringNullableWithAggregatesFilter<"Simulation"> | string | null
    aiAnalysisGeneratedAt?: DateTimeNullableWithAggregatesFilter<"Simulation"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Simulation"> | Date | string
  }

  export type MonthlySnapshotWhereInput = {
    AND?: MonthlySnapshotWhereInput | MonthlySnapshotWhereInput[]
    OR?: MonthlySnapshotWhereInput[]
    NOT?: MonthlySnapshotWhereInput | MonthlySnapshotWhereInput[]
    id?: StringFilter<"MonthlySnapshot"> | string
    budgetId?: StringFilter<"MonthlySnapshot"> | string
    month?: IntFilter<"MonthlySnapshot"> | number
    year?: IntFilter<"MonthlySnapshot"> | number
    income?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonFilter<"MonthlySnapshot">
    createdAt?: DateTimeFilter<"MonthlySnapshot"> | Date | string
    budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>
  }

  export type MonthlySnapshotOrderByWithRelationInput = {
    id?: SortOrder
    budgetId?: SortOrder
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
    categoryBreakdown?: SortOrder
    createdAt?: SortOrder
    budget?: BudgetOrderByWithRelationInput
  }

  export type MonthlySnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    budgetId_month_year?: MonthlySnapshotBudgetIdMonthYearCompoundUniqueInput
    AND?: MonthlySnapshotWhereInput | MonthlySnapshotWhereInput[]
    OR?: MonthlySnapshotWhereInput[]
    NOT?: MonthlySnapshotWhereInput | MonthlySnapshotWhereInput[]
    budgetId?: StringFilter<"MonthlySnapshot"> | string
    month?: IntFilter<"MonthlySnapshot"> | number
    year?: IntFilter<"MonthlySnapshot"> | number
    income?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonFilter<"MonthlySnapshot">
    createdAt?: DateTimeFilter<"MonthlySnapshot"> | Date | string
    budget?: XOR<BudgetScalarRelationFilter, BudgetWhereInput>
  }, "id" | "budgetId_month_year">

  export type MonthlySnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    budgetId?: SortOrder
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
    categoryBreakdown?: SortOrder
    createdAt?: SortOrder
    _count?: MonthlySnapshotCountOrderByAggregateInput
    _avg?: MonthlySnapshotAvgOrderByAggregateInput
    _max?: MonthlySnapshotMaxOrderByAggregateInput
    _min?: MonthlySnapshotMinOrderByAggregateInput
    _sum?: MonthlySnapshotSumOrderByAggregateInput
  }

  export type MonthlySnapshotScalarWhereWithAggregatesInput = {
    AND?: MonthlySnapshotScalarWhereWithAggregatesInput | MonthlySnapshotScalarWhereWithAggregatesInput[]
    OR?: MonthlySnapshotScalarWhereWithAggregatesInput[]
    NOT?: MonthlySnapshotScalarWhereWithAggregatesInput | MonthlySnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MonthlySnapshot"> | string
    budgetId?: StringWithAggregatesFilter<"MonthlySnapshot"> | string
    month?: IntWithAggregatesFilter<"MonthlySnapshot"> | number
    year?: IntWithAggregatesFilter<"MonthlySnapshot"> | number
    income?: DecimalWithAggregatesFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalWithAggregatesFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalWithAggregatesFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonWithAggregatesFilter<"MonthlySnapshot">
    createdAt?: DateTimeWithAggregatesFilter<"MonthlySnapshot"> | Date | string
  }

  export type LoanWhereInput = {
    AND?: LoanWhereInput | LoanWhereInput[]
    OR?: LoanWhereInput[]
    NOT?: LoanWhereInput | LoanWhereInput[]
    id?: StringFilter<"Loan"> | string
    userId?: StringFilter<"Loan"> | string
    simulationId?: StringNullableFilter<"Loan"> | string | null
    title?: StringFilter<"Loan"> | string
    type?: StringFilter<"Loan"> | string
    principal?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    termMonths?: IntFilter<"Loan"> | number
    formula?: StringFilter<"Loan"> | string
    monthlyPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFilter<"Loan"> | Date | string
    status?: StringFilter<"Loan"> | string
    paidInstallments?: IntFilter<"Loan"> | number
    totalInterest?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Loan"> | string
    createdAt?: DateTimeFilter<"Loan"> | Date | string
    updatedAt?: DateTimeFilter<"Loan"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    fees?: LoanFeeListRelationFilter
    payments?: LoanPaymentListRelationFilter
    extraPayments?: LoanExtraPaymentListRelationFilter
  }

  export type LoanOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    simulationId?: SortOrderInput | SortOrder
    title?: SortOrder
    type?: SortOrder
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    formula?: SortOrder
    monthlyPayment?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    fees?: LoanFeeOrderByRelationAggregateInput
    payments?: LoanPaymentOrderByRelationAggregateInput
    extraPayments?: LoanExtraPaymentOrderByRelationAggregateInput
  }

  export type LoanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanWhereInput | LoanWhereInput[]
    OR?: LoanWhereInput[]
    NOT?: LoanWhereInput | LoanWhereInput[]
    userId?: StringFilter<"Loan"> | string
    simulationId?: StringNullableFilter<"Loan"> | string | null
    title?: StringFilter<"Loan"> | string
    type?: StringFilter<"Loan"> | string
    principal?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    termMonths?: IntFilter<"Loan"> | number
    formula?: StringFilter<"Loan"> | string
    monthlyPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFilter<"Loan"> | Date | string
    status?: StringFilter<"Loan"> | string
    paidInstallments?: IntFilter<"Loan"> | number
    totalInterest?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Loan"> | string
    createdAt?: DateTimeFilter<"Loan"> | Date | string
    updatedAt?: DateTimeFilter<"Loan"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    fees?: LoanFeeListRelationFilter
    payments?: LoanPaymentListRelationFilter
    extraPayments?: LoanExtraPaymentListRelationFilter
  }, "id">

  export type LoanOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    simulationId?: SortOrderInput | SortOrder
    title?: SortOrder
    type?: SortOrder
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    formula?: SortOrder
    monthlyPayment?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoanCountOrderByAggregateInput
    _avg?: LoanAvgOrderByAggregateInput
    _max?: LoanMaxOrderByAggregateInput
    _min?: LoanMinOrderByAggregateInput
    _sum?: LoanSumOrderByAggregateInput
  }

  export type LoanScalarWhereWithAggregatesInput = {
    AND?: LoanScalarWhereWithAggregatesInput | LoanScalarWhereWithAggregatesInput[]
    OR?: LoanScalarWhereWithAggregatesInput[]
    NOT?: LoanScalarWhereWithAggregatesInput | LoanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Loan"> | string
    userId?: StringWithAggregatesFilter<"Loan"> | string
    simulationId?: StringNullableWithAggregatesFilter<"Loan"> | string | null
    title?: StringWithAggregatesFilter<"Loan"> | string
    type?: StringWithAggregatesFilter<"Loan"> | string
    principal?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    termMonths?: IntWithAggregatesFilter<"Loan"> | number
    formula?: StringWithAggregatesFilter<"Loan"> | string
    monthlyPayment?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeWithAggregatesFilter<"Loan"> | Date | string
    status?: StringWithAggregatesFilter<"Loan"> | string
    paidInstallments?: IntWithAggregatesFilter<"Loan"> | number
    totalInterest?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalWithAggregatesFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Loan"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Loan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Loan"> | Date | string
  }

  export type LoanPaymentWhereInput = {
    AND?: LoanPaymentWhereInput | LoanPaymentWhereInput[]
    OR?: LoanPaymentWhereInput[]
    NOT?: LoanPaymentWhereInput | LoanPaymentWhereInput[]
    id?: StringFilter<"LoanPayment"> | string
    loanId?: StringFilter<"LoanPayment"> | string
    amount?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFilter<"LoanPayment"> | Date | string
    createdAt?: DateTimeFilter<"LoanPayment"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }

  export type LoanPaymentOrderByWithRelationInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
    paidDate?: SortOrder
    createdAt?: SortOrder
    loan?: LoanOrderByWithRelationInput
  }

  export type LoanPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanPaymentWhereInput | LoanPaymentWhereInput[]
    OR?: LoanPaymentWhereInput[]
    NOT?: LoanPaymentWhereInput | LoanPaymentWhereInput[]
    loanId?: StringFilter<"LoanPayment"> | string
    amount?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFilter<"LoanPayment"> | Date | string
    createdAt?: DateTimeFilter<"LoanPayment"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }, "id">

  export type LoanPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
    paidDate?: SortOrder
    createdAt?: SortOrder
    _count?: LoanPaymentCountOrderByAggregateInput
    _avg?: LoanPaymentAvgOrderByAggregateInput
    _max?: LoanPaymentMaxOrderByAggregateInput
    _min?: LoanPaymentMinOrderByAggregateInput
    _sum?: LoanPaymentSumOrderByAggregateInput
  }

  export type LoanPaymentScalarWhereWithAggregatesInput = {
    AND?: LoanPaymentScalarWhereWithAggregatesInput | LoanPaymentScalarWhereWithAggregatesInput[]
    OR?: LoanPaymentScalarWhereWithAggregatesInput[]
    NOT?: LoanPaymentScalarWhereWithAggregatesInput | LoanPaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoanPayment"> | string
    loanId?: StringWithAggregatesFilter<"LoanPayment"> | string
    amount?: DecimalWithAggregatesFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalWithAggregatesFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalWithAggregatesFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeWithAggregatesFilter<"LoanPayment"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LoanPayment"> | Date | string
  }

  export type LoanExtraPaymentWhereInput = {
    AND?: LoanExtraPaymentWhereInput | LoanExtraPaymentWhereInput[]
    OR?: LoanExtraPaymentWhereInput[]
    NOT?: LoanExtraPaymentWhereInput | LoanExtraPaymentWhereInput[]
    id?: StringFilter<"LoanExtraPayment"> | string
    loanId?: StringFilter<"LoanExtraPayment"> | string
    amount?: DecimalFilter<"LoanExtraPayment"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"LoanExtraPayment"> | Date | string
    note?: StringNullableFilter<"LoanExtraPayment"> | string | null
    recalculationMode?: StringNullableFilter<"LoanExtraPayment"> | string | null
    newTermMonths?: IntNullableFilter<"LoanExtraPayment"> | number | null
    createdAt?: DateTimeFilter<"LoanExtraPayment"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }

  export type LoanExtraPaymentOrderByWithRelationInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    note?: SortOrderInput | SortOrder
    recalculationMode?: SortOrderInput | SortOrder
    newTermMonths?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    loan?: LoanOrderByWithRelationInput
  }

  export type LoanExtraPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanExtraPaymentWhereInput | LoanExtraPaymentWhereInput[]
    OR?: LoanExtraPaymentWhereInput[]
    NOT?: LoanExtraPaymentWhereInput | LoanExtraPaymentWhereInput[]
    loanId?: StringFilter<"LoanExtraPayment"> | string
    amount?: DecimalFilter<"LoanExtraPayment"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"LoanExtraPayment"> | Date | string
    note?: StringNullableFilter<"LoanExtraPayment"> | string | null
    recalculationMode?: StringNullableFilter<"LoanExtraPayment"> | string | null
    newTermMonths?: IntNullableFilter<"LoanExtraPayment"> | number | null
    createdAt?: DateTimeFilter<"LoanExtraPayment"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }, "id">

  export type LoanExtraPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    note?: SortOrderInput | SortOrder
    recalculationMode?: SortOrderInput | SortOrder
    newTermMonths?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LoanExtraPaymentCountOrderByAggregateInput
    _avg?: LoanExtraPaymentAvgOrderByAggregateInput
    _max?: LoanExtraPaymentMaxOrderByAggregateInput
    _min?: LoanExtraPaymentMinOrderByAggregateInput
    _sum?: LoanExtraPaymentSumOrderByAggregateInput
  }

  export type LoanExtraPaymentScalarWhereWithAggregatesInput = {
    AND?: LoanExtraPaymentScalarWhereWithAggregatesInput | LoanExtraPaymentScalarWhereWithAggregatesInput[]
    OR?: LoanExtraPaymentScalarWhereWithAggregatesInput[]
    NOT?: LoanExtraPaymentScalarWhereWithAggregatesInput | LoanExtraPaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoanExtraPayment"> | string
    loanId?: StringWithAggregatesFilter<"LoanExtraPayment"> | string
    amount?: DecimalWithAggregatesFilter<"LoanExtraPayment"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeWithAggregatesFilter<"LoanExtraPayment"> | Date | string
    note?: StringNullableWithAggregatesFilter<"LoanExtraPayment"> | string | null
    recalculationMode?: StringNullableWithAggregatesFilter<"LoanExtraPayment"> | string | null
    newTermMonths?: IntNullableWithAggregatesFilter<"LoanExtraPayment"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"LoanExtraPayment"> | Date | string
  }

  export type LoanFeeWhereInput = {
    AND?: LoanFeeWhereInput | LoanFeeWhereInput[]
    OR?: LoanFeeWhereInput[]
    NOT?: LoanFeeWhereInput | LoanFeeWhereInput[]
    id?: StringFilter<"LoanFee"> | string
    loanId?: StringFilter<"LoanFee"> | string
    name?: StringFilter<"LoanFee"> | string
    amount?: DecimalFilter<"LoanFee"> | Decimal | DecimalJsLike | number | string
    type?: StringFilter<"LoanFee"> | string
    createdAt?: DateTimeFilter<"LoanFee"> | Date | string
    updatedAt?: DateTimeFilter<"LoanFee"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }

  export type LoanFeeOrderByWithRelationInput = {
    id?: SortOrder
    loanId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    loan?: LoanOrderByWithRelationInput
  }

  export type LoanFeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanFeeWhereInput | LoanFeeWhereInput[]
    OR?: LoanFeeWhereInput[]
    NOT?: LoanFeeWhereInput | LoanFeeWhereInput[]
    loanId?: StringFilter<"LoanFee"> | string
    name?: StringFilter<"LoanFee"> | string
    amount?: DecimalFilter<"LoanFee"> | Decimal | DecimalJsLike | number | string
    type?: StringFilter<"LoanFee"> | string
    createdAt?: DateTimeFilter<"LoanFee"> | Date | string
    updatedAt?: DateTimeFilter<"LoanFee"> | Date | string
    loan?: XOR<LoanScalarRelationFilter, LoanWhereInput>
  }, "id">

  export type LoanFeeOrderByWithAggregationInput = {
    id?: SortOrder
    loanId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoanFeeCountOrderByAggregateInput
    _avg?: LoanFeeAvgOrderByAggregateInput
    _max?: LoanFeeMaxOrderByAggregateInput
    _min?: LoanFeeMinOrderByAggregateInput
    _sum?: LoanFeeSumOrderByAggregateInput
  }

  export type LoanFeeScalarWhereWithAggregatesInput = {
    AND?: LoanFeeScalarWhereWithAggregatesInput | LoanFeeScalarWhereWithAggregatesInput[]
    OR?: LoanFeeScalarWhereWithAggregatesInput[]
    NOT?: LoanFeeScalarWhereWithAggregatesInput | LoanFeeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoanFee"> | string
    loanId?: StringWithAggregatesFilter<"LoanFee"> | string
    name?: StringWithAggregatesFilter<"LoanFee"> | string
    amount?: DecimalWithAggregatesFilter<"LoanFee"> | Decimal | DecimalJsLike | number | string
    type?: StringWithAggregatesFilter<"LoanFee"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LoanFee"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LoanFee"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetCreateNestedManyWithoutUserInput
    simulations?: SimulationCreateNestedManyWithoutUserInput
    loans?: LoanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput
    simulations?: SimulationUncheckedCreateNestedManyWithoutUserInput
    loans?: LoanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUpdateManyWithoutUserNestedInput
    simulations?: SimulationUpdateManyWithoutUserNestedInput
    loans?: LoanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput
    simulations?: SimulationUncheckedUpdateManyWithoutUserNestedInput
    loans?: LoanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetCreateInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBudgetsInput
    categories?: CategoryCreateNestedManyWithoutBudgetInput
    snapshots?: MonthlySnapshotCreateNestedManyWithoutBudgetInput
  }

  export type BudgetUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: CategoryUncheckedCreateNestedManyWithoutBudgetInput
    snapshots?: MonthlySnapshotUncheckedCreateNestedManyWithoutBudgetInput
  }

  export type BudgetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBudgetsNestedInput
    categories?: CategoryUpdateManyWithoutBudgetNestedInput
    snapshots?: MonthlySnapshotUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: CategoryUncheckedUpdateManyWithoutBudgetNestedInput
    snapshots?: MonthlySnapshotUncheckedUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetCreateManyInput = {
    id?: string
    userId: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BudgetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    type: string
    color: string
    budget: BudgetCreateNestedOneWithoutCategoriesInput
    transactions?: TransactionCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    budgetId: string
    name: string
    type: string
    color: string
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    budget?: BudgetUpdateOneRequiredWithoutCategoriesNestedInput
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    budgetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    budgetId: string
    name: string
    type: string
    color: string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    budgetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    categoryId: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    categoryId: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationCreateInput = {
    id?: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSimulationsInput
  }

  export type SimulationUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SimulationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSimulationsNestedInput
  }

  export type SimulationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationCreateManyInput = {
    id?: string
    userId: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SimulationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlySnapshotCreateInput = {
    id?: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    budget: BudgetCreateNestedOneWithoutSnapshotsInput
  }

  export type MonthlySnapshotUncheckedCreateInput = {
    id?: string
    budgetId: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MonthlySnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budget?: BudgetUpdateOneRequiredWithoutSnapshotsNestedInput
  }

  export type MonthlySnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    budgetId?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlySnapshotCreateManyInput = {
    id?: string
    budgetId: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MonthlySnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlySnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    budgetId?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanCreateInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLoansInput
    fees?: LoanFeeCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentCreateNestedManyWithoutLoanInput
  }

  export type LoanUncheckedCreateInput = {
    id?: string
    userId: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fees?: LoanFeeUncheckedCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentUncheckedCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentUncheckedCreateNestedManyWithoutLoanInput
  }

  export type LoanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoansNestedInput
    fees?: LoanFeeUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fees?: LoanFeeUncheckedUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUncheckedUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUncheckedUpdateManyWithoutLoanNestedInput
  }

  export type LoanCreateManyInput = {
    id?: string
    userId: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
    loan: LoanCreateNestedOneWithoutPaymentsInput
  }

  export type LoanPaymentUncheckedCreateInput = {
    id?: string
    loanId: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
  }

  export type LoanPaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loan?: LoanUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type LoanPaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentCreateManyInput = {
    id?: string
    loanId: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
  }

  export type LoanPaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
    loan: LoanCreateNestedOneWithoutExtraPaymentsInput
  }

  export type LoanExtraPaymentUncheckedCreateInput = {
    id?: string
    loanId: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
  }

  export type LoanExtraPaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loan?: LoanUpdateOneRequiredWithoutExtraPaymentsNestedInput
  }

  export type LoanExtraPaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentCreateManyInput = {
    id?: string
    loanId: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
  }

  export type LoanExtraPaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeCreateInput = {
    id?: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
    loan: LoanCreateNestedOneWithoutFeesInput
  }

  export type LoanFeeUncheckedCreateInput = {
    id?: string
    loanId: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanFeeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loan?: LoanUpdateOneRequiredWithoutFeesNestedInput
  }

  export type LoanFeeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeCreateManyInput = {
    id?: string
    loanId: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanFeeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BudgetListRelationFilter = {
    every?: BudgetWhereInput
    some?: BudgetWhereInput
    none?: BudgetWhereInput
  }

  export type SimulationListRelationFilter = {
    every?: SimulationWhereInput
    some?: SimulationWhereInput
    none?: SimulationWhereInput
  }

  export type LoanListRelationFilter = {
    every?: LoanWhereInput
    some?: LoanWhereInput
    none?: LoanWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BudgetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SimulationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type MonthlySnapshotListRelationFilter = {
    every?: MonthlySnapshotWhereInput
    some?: MonthlySnapshotWhereInput
    none?: MonthlySnapshotWhereInput
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MonthlySnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BudgetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    income?: SortOrder
    currency?: SortOrder
    rule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetAvgOrderByAggregateInput = {
    income?: SortOrder
  }

  export type BudgetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    income?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    income?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BudgetSumOrderByAggregateInput = {
    income?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BudgetScalarRelationFilter = {
    is?: BudgetWhereInput
    isNot?: BudgetWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    color?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    color?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    color?: SortOrder
  }

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    date?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    date?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    date?: SortOrder
    recurrence?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SimulationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    inputs?: SortOrder
    result?: SortOrder
    aiAnalysis?: SortOrder
    aiAnalysisGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SimulationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    aiAnalysis?: SortOrder
    aiAnalysisGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SimulationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    aiAnalysis?: SortOrder
    aiAnalysisGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type MonthlySnapshotBudgetIdMonthYearCompoundUniqueInput = {
    budgetId: string
    month: number
    year: number
  }

  export type MonthlySnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
    categoryBreakdown?: SortOrder
    createdAt?: SortOrder
  }

  export type MonthlySnapshotAvgOrderByAggregateInput = {
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
  }

  export type MonthlySnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
    createdAt?: SortOrder
  }

  export type MonthlySnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    budgetId?: SortOrder
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
    createdAt?: SortOrder
  }

  export type MonthlySnapshotSumOrderByAggregateInput = {
    month?: SortOrder
    year?: SortOrder
    income?: SortOrder
    totalExpenses?: SortOrder
    totalSavings?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type LoanFeeListRelationFilter = {
    every?: LoanFeeWhereInput
    some?: LoanFeeWhereInput
    none?: LoanFeeWhereInput
  }

  export type LoanPaymentListRelationFilter = {
    every?: LoanPaymentWhereInput
    some?: LoanPaymentWhereInput
    none?: LoanPaymentWhereInput
  }

  export type LoanExtraPaymentListRelationFilter = {
    every?: LoanExtraPaymentWhereInput
    some?: LoanExtraPaymentWhereInput
    none?: LoanExtraPaymentWhereInput
  }

  export type LoanFeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoanPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoanExtraPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoanCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    simulationId?: SortOrder
    title?: SortOrder
    type?: SortOrder
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    formula?: SortOrder
    monthlyPayment?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanAvgOrderByAggregateInput = {
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    monthlyPayment?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
  }

  export type LoanMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    simulationId?: SortOrder
    title?: SortOrder
    type?: SortOrder
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    formula?: SortOrder
    monthlyPayment?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    simulationId?: SortOrder
    title?: SortOrder
    type?: SortOrder
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    formula?: SortOrder
    monthlyPayment?: SortOrder
    startDate?: SortOrder
    status?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanSumOrderByAggregateInput = {
    principal?: SortOrder
    downPayment?: SortOrder
    annualRate?: SortOrder
    termMonths?: SortOrder
    monthlyPayment?: SortOrder
    paidInstallments?: SortOrder
    totalInterest?: SortOrder
    totalCost?: SortOrder
  }

  export type LoanScalarRelationFilter = {
    is?: LoanWhereInput
    isNot?: LoanWhereInput
  }

  export type LoanPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
    paidDate?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanPaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
  }

  export type LoanPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
    paidDate?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
    paidDate?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanPaymentSumOrderByAggregateInput = {
    amount?: SortOrder
    principalPaid?: SortOrder
    interestPaid?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LoanExtraPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    note?: SortOrder
    recalculationMode?: SortOrder
    newTermMonths?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanExtraPaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
    newTermMonths?: SortOrder
  }

  export type LoanExtraPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    note?: SortOrder
    recalculationMode?: SortOrder
    newTermMonths?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanExtraPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    date?: SortOrder
    note?: SortOrder
    recalculationMode?: SortOrder
    newTermMonths?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanExtraPaymentSumOrderByAggregateInput = {
    amount?: SortOrder
    newTermMonths?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LoanFeeCountOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanFeeAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LoanFeeMaxOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanFeeMinOrderByAggregateInput = {
    id?: SortOrder
    loanId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanFeeSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BudgetCreateNestedManyWithoutUserInput = {
    create?: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput> | BudgetCreateWithoutUserInput[] | BudgetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUserInput | BudgetCreateOrConnectWithoutUserInput[]
    createMany?: BudgetCreateManyUserInputEnvelope
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
  }

  export type SimulationCreateNestedManyWithoutUserInput = {
    create?: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput> | SimulationCreateWithoutUserInput[] | SimulationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SimulationCreateOrConnectWithoutUserInput | SimulationCreateOrConnectWithoutUserInput[]
    createMany?: SimulationCreateManyUserInputEnvelope
    connect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
  }

  export type LoanCreateNestedManyWithoutUserInput = {
    create?: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput> | LoanCreateWithoutUserInput[] | LoanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoanCreateOrConnectWithoutUserInput | LoanCreateOrConnectWithoutUserInput[]
    createMany?: LoanCreateManyUserInputEnvelope
    connect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
  }

  export type BudgetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput> | BudgetCreateWithoutUserInput[] | BudgetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUserInput | BudgetCreateOrConnectWithoutUserInput[]
    createMany?: BudgetCreateManyUserInputEnvelope
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
  }

  export type SimulationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput> | SimulationCreateWithoutUserInput[] | SimulationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SimulationCreateOrConnectWithoutUserInput | SimulationCreateOrConnectWithoutUserInput[]
    createMany?: SimulationCreateManyUserInputEnvelope
    connect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
  }

  export type LoanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput> | LoanCreateWithoutUserInput[] | LoanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoanCreateOrConnectWithoutUserInput | LoanCreateOrConnectWithoutUserInput[]
    createMany?: LoanCreateManyUserInputEnvelope
    connect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BudgetUpdateManyWithoutUserNestedInput = {
    create?: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput> | BudgetCreateWithoutUserInput[] | BudgetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUserInput | BudgetCreateOrConnectWithoutUserInput[]
    upsert?: BudgetUpsertWithWhereUniqueWithoutUserInput | BudgetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BudgetCreateManyUserInputEnvelope
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    update?: BudgetUpdateWithWhereUniqueWithoutUserInput | BudgetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BudgetUpdateManyWithWhereWithoutUserInput | BudgetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
  }

  export type SimulationUpdateManyWithoutUserNestedInput = {
    create?: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput> | SimulationCreateWithoutUserInput[] | SimulationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SimulationCreateOrConnectWithoutUserInput | SimulationCreateOrConnectWithoutUserInput[]
    upsert?: SimulationUpsertWithWhereUniqueWithoutUserInput | SimulationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SimulationCreateManyUserInputEnvelope
    set?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    disconnect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    delete?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    connect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    update?: SimulationUpdateWithWhereUniqueWithoutUserInput | SimulationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SimulationUpdateManyWithWhereWithoutUserInput | SimulationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SimulationScalarWhereInput | SimulationScalarWhereInput[]
  }

  export type LoanUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput> | LoanCreateWithoutUserInput[] | LoanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoanCreateOrConnectWithoutUserInput | LoanCreateOrConnectWithoutUserInput[]
    upsert?: LoanUpsertWithWhereUniqueWithoutUserInput | LoanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoanCreateManyUserInputEnvelope
    set?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    disconnect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    delete?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    connect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    update?: LoanUpdateWithWhereUniqueWithoutUserInput | LoanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoanUpdateManyWithWhereWithoutUserInput | LoanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoanScalarWhereInput | LoanScalarWhereInput[]
  }

  export type BudgetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput> | BudgetCreateWithoutUserInput[] | BudgetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BudgetCreateOrConnectWithoutUserInput | BudgetCreateOrConnectWithoutUserInput[]
    upsert?: BudgetUpsertWithWhereUniqueWithoutUserInput | BudgetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BudgetCreateManyUserInputEnvelope
    set?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    disconnect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    delete?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    connect?: BudgetWhereUniqueInput | BudgetWhereUniqueInput[]
    update?: BudgetUpdateWithWhereUniqueWithoutUserInput | BudgetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BudgetUpdateManyWithWhereWithoutUserInput | BudgetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
  }

  export type SimulationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput> | SimulationCreateWithoutUserInput[] | SimulationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SimulationCreateOrConnectWithoutUserInput | SimulationCreateOrConnectWithoutUserInput[]
    upsert?: SimulationUpsertWithWhereUniqueWithoutUserInput | SimulationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SimulationCreateManyUserInputEnvelope
    set?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    disconnect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    delete?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    connect?: SimulationWhereUniqueInput | SimulationWhereUniqueInput[]
    update?: SimulationUpdateWithWhereUniqueWithoutUserInput | SimulationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SimulationUpdateManyWithWhereWithoutUserInput | SimulationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SimulationScalarWhereInput | SimulationScalarWhereInput[]
  }

  export type LoanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput> | LoanCreateWithoutUserInput[] | LoanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoanCreateOrConnectWithoutUserInput | LoanCreateOrConnectWithoutUserInput[]
    upsert?: LoanUpsertWithWhereUniqueWithoutUserInput | LoanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoanCreateManyUserInputEnvelope
    set?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    disconnect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    delete?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    connect?: LoanWhereUniqueInput | LoanWhereUniqueInput[]
    update?: LoanUpdateWithWhereUniqueWithoutUserInput | LoanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoanUpdateManyWithWhereWithoutUserInput | LoanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoanScalarWhereInput | LoanScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBudgetsInput = {
    create?: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBudgetsInput
    connect?: UserWhereUniqueInput
  }

  export type CategoryCreateNestedManyWithoutBudgetInput = {
    create?: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput> | CategoryCreateWithoutBudgetInput[] | CategoryUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutBudgetInput | CategoryCreateOrConnectWithoutBudgetInput[]
    createMany?: CategoryCreateManyBudgetInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type MonthlySnapshotCreateNestedManyWithoutBudgetInput = {
    create?: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput> | MonthlySnapshotCreateWithoutBudgetInput[] | MonthlySnapshotUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: MonthlySnapshotCreateOrConnectWithoutBudgetInput | MonthlySnapshotCreateOrConnectWithoutBudgetInput[]
    createMany?: MonthlySnapshotCreateManyBudgetInputEnvelope
    connect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutBudgetInput = {
    create?: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput> | CategoryCreateWithoutBudgetInput[] | CategoryUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutBudgetInput | CategoryCreateOrConnectWithoutBudgetInput[]
    createMany?: CategoryCreateManyBudgetInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type MonthlySnapshotUncheckedCreateNestedManyWithoutBudgetInput = {
    create?: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput> | MonthlySnapshotCreateWithoutBudgetInput[] | MonthlySnapshotUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: MonthlySnapshotCreateOrConnectWithoutBudgetInput | MonthlySnapshotCreateOrConnectWithoutBudgetInput[]
    createMany?: MonthlySnapshotCreateManyBudgetInputEnvelope
    connect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutBudgetsNestedInput = {
    create?: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBudgetsInput
    upsert?: UserUpsertWithoutBudgetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBudgetsInput, UserUpdateWithoutBudgetsInput>, UserUncheckedUpdateWithoutBudgetsInput>
  }

  export type CategoryUpdateManyWithoutBudgetNestedInput = {
    create?: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput> | CategoryCreateWithoutBudgetInput[] | CategoryUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutBudgetInput | CategoryCreateOrConnectWithoutBudgetInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutBudgetInput | CategoryUpsertWithWhereUniqueWithoutBudgetInput[]
    createMany?: CategoryCreateManyBudgetInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutBudgetInput | CategoryUpdateWithWhereUniqueWithoutBudgetInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutBudgetInput | CategoryUpdateManyWithWhereWithoutBudgetInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type MonthlySnapshotUpdateManyWithoutBudgetNestedInput = {
    create?: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput> | MonthlySnapshotCreateWithoutBudgetInput[] | MonthlySnapshotUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: MonthlySnapshotCreateOrConnectWithoutBudgetInput | MonthlySnapshotCreateOrConnectWithoutBudgetInput[]
    upsert?: MonthlySnapshotUpsertWithWhereUniqueWithoutBudgetInput | MonthlySnapshotUpsertWithWhereUniqueWithoutBudgetInput[]
    createMany?: MonthlySnapshotCreateManyBudgetInputEnvelope
    set?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    disconnect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    delete?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    connect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    update?: MonthlySnapshotUpdateWithWhereUniqueWithoutBudgetInput | MonthlySnapshotUpdateWithWhereUniqueWithoutBudgetInput[]
    updateMany?: MonthlySnapshotUpdateManyWithWhereWithoutBudgetInput | MonthlySnapshotUpdateManyWithWhereWithoutBudgetInput[]
    deleteMany?: MonthlySnapshotScalarWhereInput | MonthlySnapshotScalarWhereInput[]
  }

  export type CategoryUncheckedUpdateManyWithoutBudgetNestedInput = {
    create?: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput> | CategoryCreateWithoutBudgetInput[] | CategoryUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutBudgetInput | CategoryCreateOrConnectWithoutBudgetInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutBudgetInput | CategoryUpsertWithWhereUniqueWithoutBudgetInput[]
    createMany?: CategoryCreateManyBudgetInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutBudgetInput | CategoryUpdateWithWhereUniqueWithoutBudgetInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutBudgetInput | CategoryUpdateManyWithWhereWithoutBudgetInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type MonthlySnapshotUncheckedUpdateManyWithoutBudgetNestedInput = {
    create?: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput> | MonthlySnapshotCreateWithoutBudgetInput[] | MonthlySnapshotUncheckedCreateWithoutBudgetInput[]
    connectOrCreate?: MonthlySnapshotCreateOrConnectWithoutBudgetInput | MonthlySnapshotCreateOrConnectWithoutBudgetInput[]
    upsert?: MonthlySnapshotUpsertWithWhereUniqueWithoutBudgetInput | MonthlySnapshotUpsertWithWhereUniqueWithoutBudgetInput[]
    createMany?: MonthlySnapshotCreateManyBudgetInputEnvelope
    set?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    disconnect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    delete?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    connect?: MonthlySnapshotWhereUniqueInput | MonthlySnapshotWhereUniqueInput[]
    update?: MonthlySnapshotUpdateWithWhereUniqueWithoutBudgetInput | MonthlySnapshotUpdateWithWhereUniqueWithoutBudgetInput[]
    updateMany?: MonthlySnapshotUpdateManyWithWhereWithoutBudgetInput | MonthlySnapshotUpdateManyWithWhereWithoutBudgetInput[]
    deleteMany?: MonthlySnapshotScalarWhereInput | MonthlySnapshotScalarWhereInput[]
  }

  export type BudgetCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: BudgetCreateOrConnectWithoutCategoriesInput
    connect?: BudgetWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutCategoryInput = {
    create?: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput> | TransactionCreateWithoutCategoryInput[] | TransactionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCategoryInput | TransactionCreateOrConnectWithoutCategoryInput[]
    createMany?: TransactionCreateManyCategoryInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput> | TransactionCreateWithoutCategoryInput[] | TransactionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCategoryInput | TransactionCreateOrConnectWithoutCategoryInput[]
    createMany?: TransactionCreateManyCategoryInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type BudgetUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: BudgetCreateOrConnectWithoutCategoriesInput
    upsert?: BudgetUpsertWithoutCategoriesInput
    connect?: BudgetWhereUniqueInput
    update?: XOR<XOR<BudgetUpdateToOneWithWhereWithoutCategoriesInput, BudgetUpdateWithoutCategoriesInput>, BudgetUncheckedUpdateWithoutCategoriesInput>
  }

  export type TransactionUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput> | TransactionCreateWithoutCategoryInput[] | TransactionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCategoryInput | TransactionCreateOrConnectWithoutCategoryInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCategoryInput | TransactionUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: TransactionCreateManyCategoryInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCategoryInput | TransactionUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCategoryInput | TransactionUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput> | TransactionCreateWithoutCategoryInput[] | TransactionUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCategoryInput | TransactionCreateOrConnectWithoutCategoryInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCategoryInput | TransactionUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: TransactionCreateManyCategoryInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCategoryInput | TransactionUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCategoryInput | TransactionUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<CategoryCreateWithoutTransactionsInput, CategoryUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutTransactionsInput
    connect?: CategoryWhereUniqueInput
  }

  export type CategoryUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<CategoryCreateWithoutTransactionsInput, CategoryUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutTransactionsInput
    upsert?: CategoryUpsertWithoutTransactionsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutTransactionsInput, CategoryUpdateWithoutTransactionsInput>, CategoryUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserCreateNestedOneWithoutSimulationsInput = {
    create?: XOR<UserCreateWithoutSimulationsInput, UserUncheckedCreateWithoutSimulationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSimulationsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSimulationsNestedInput = {
    create?: XOR<UserCreateWithoutSimulationsInput, UserUncheckedCreateWithoutSimulationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSimulationsInput
    upsert?: UserUpsertWithoutSimulationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSimulationsInput, UserUpdateWithoutSimulationsInput>, UserUncheckedUpdateWithoutSimulationsInput>
  }

  export type BudgetCreateNestedOneWithoutSnapshotsInput = {
    create?: XOR<BudgetCreateWithoutSnapshotsInput, BudgetUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: BudgetCreateOrConnectWithoutSnapshotsInput
    connect?: BudgetWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BudgetUpdateOneRequiredWithoutSnapshotsNestedInput = {
    create?: XOR<BudgetCreateWithoutSnapshotsInput, BudgetUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: BudgetCreateOrConnectWithoutSnapshotsInput
    upsert?: BudgetUpsertWithoutSnapshotsInput
    connect?: BudgetWhereUniqueInput
    update?: XOR<XOR<BudgetUpdateToOneWithWhereWithoutSnapshotsInput, BudgetUpdateWithoutSnapshotsInput>, BudgetUncheckedUpdateWithoutSnapshotsInput>
  }

  export type UserCreateNestedOneWithoutLoansInput = {
    create?: XOR<UserCreateWithoutLoansInput, UserUncheckedCreateWithoutLoansInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoansInput
    connect?: UserWhereUniqueInput
  }

  export type LoanFeeCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput> | LoanFeeCreateWithoutLoanInput[] | LoanFeeUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanFeeCreateOrConnectWithoutLoanInput | LoanFeeCreateOrConnectWithoutLoanInput[]
    createMany?: LoanFeeCreateManyLoanInputEnvelope
    connect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
  }

  export type LoanPaymentCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput> | LoanPaymentCreateWithoutLoanInput[] | LoanPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanPaymentCreateOrConnectWithoutLoanInput | LoanPaymentCreateOrConnectWithoutLoanInput[]
    createMany?: LoanPaymentCreateManyLoanInputEnvelope
    connect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
  }

  export type LoanExtraPaymentCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput> | LoanExtraPaymentCreateWithoutLoanInput[] | LoanExtraPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanExtraPaymentCreateOrConnectWithoutLoanInput | LoanExtraPaymentCreateOrConnectWithoutLoanInput[]
    createMany?: LoanExtraPaymentCreateManyLoanInputEnvelope
    connect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
  }

  export type LoanFeeUncheckedCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput> | LoanFeeCreateWithoutLoanInput[] | LoanFeeUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanFeeCreateOrConnectWithoutLoanInput | LoanFeeCreateOrConnectWithoutLoanInput[]
    createMany?: LoanFeeCreateManyLoanInputEnvelope
    connect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
  }

  export type LoanPaymentUncheckedCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput> | LoanPaymentCreateWithoutLoanInput[] | LoanPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanPaymentCreateOrConnectWithoutLoanInput | LoanPaymentCreateOrConnectWithoutLoanInput[]
    createMany?: LoanPaymentCreateManyLoanInputEnvelope
    connect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
  }

  export type LoanExtraPaymentUncheckedCreateNestedManyWithoutLoanInput = {
    create?: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput> | LoanExtraPaymentCreateWithoutLoanInput[] | LoanExtraPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanExtraPaymentCreateOrConnectWithoutLoanInput | LoanExtraPaymentCreateOrConnectWithoutLoanInput[]
    createMany?: LoanExtraPaymentCreateManyLoanInputEnvelope
    connect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutLoansNestedInput = {
    create?: XOR<UserCreateWithoutLoansInput, UserUncheckedCreateWithoutLoansInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoansInput
    upsert?: UserUpsertWithoutLoansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLoansInput, UserUpdateWithoutLoansInput>, UserUncheckedUpdateWithoutLoansInput>
  }

  export type LoanFeeUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput> | LoanFeeCreateWithoutLoanInput[] | LoanFeeUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanFeeCreateOrConnectWithoutLoanInput | LoanFeeCreateOrConnectWithoutLoanInput[]
    upsert?: LoanFeeUpsertWithWhereUniqueWithoutLoanInput | LoanFeeUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanFeeCreateManyLoanInputEnvelope
    set?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    disconnect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    delete?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    connect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    update?: LoanFeeUpdateWithWhereUniqueWithoutLoanInput | LoanFeeUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanFeeUpdateManyWithWhereWithoutLoanInput | LoanFeeUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanFeeScalarWhereInput | LoanFeeScalarWhereInput[]
  }

  export type LoanPaymentUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput> | LoanPaymentCreateWithoutLoanInput[] | LoanPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanPaymentCreateOrConnectWithoutLoanInput | LoanPaymentCreateOrConnectWithoutLoanInput[]
    upsert?: LoanPaymentUpsertWithWhereUniqueWithoutLoanInput | LoanPaymentUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanPaymentCreateManyLoanInputEnvelope
    set?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    disconnect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    delete?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    connect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    update?: LoanPaymentUpdateWithWhereUniqueWithoutLoanInput | LoanPaymentUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanPaymentUpdateManyWithWhereWithoutLoanInput | LoanPaymentUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanPaymentScalarWhereInput | LoanPaymentScalarWhereInput[]
  }

  export type LoanExtraPaymentUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput> | LoanExtraPaymentCreateWithoutLoanInput[] | LoanExtraPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanExtraPaymentCreateOrConnectWithoutLoanInput | LoanExtraPaymentCreateOrConnectWithoutLoanInput[]
    upsert?: LoanExtraPaymentUpsertWithWhereUniqueWithoutLoanInput | LoanExtraPaymentUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanExtraPaymentCreateManyLoanInputEnvelope
    set?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    disconnect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    delete?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    connect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    update?: LoanExtraPaymentUpdateWithWhereUniqueWithoutLoanInput | LoanExtraPaymentUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanExtraPaymentUpdateManyWithWhereWithoutLoanInput | LoanExtraPaymentUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanExtraPaymentScalarWhereInput | LoanExtraPaymentScalarWhereInput[]
  }

  export type LoanFeeUncheckedUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput> | LoanFeeCreateWithoutLoanInput[] | LoanFeeUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanFeeCreateOrConnectWithoutLoanInput | LoanFeeCreateOrConnectWithoutLoanInput[]
    upsert?: LoanFeeUpsertWithWhereUniqueWithoutLoanInput | LoanFeeUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanFeeCreateManyLoanInputEnvelope
    set?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    disconnect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    delete?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    connect?: LoanFeeWhereUniqueInput | LoanFeeWhereUniqueInput[]
    update?: LoanFeeUpdateWithWhereUniqueWithoutLoanInput | LoanFeeUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanFeeUpdateManyWithWhereWithoutLoanInput | LoanFeeUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanFeeScalarWhereInput | LoanFeeScalarWhereInput[]
  }

  export type LoanPaymentUncheckedUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput> | LoanPaymentCreateWithoutLoanInput[] | LoanPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanPaymentCreateOrConnectWithoutLoanInput | LoanPaymentCreateOrConnectWithoutLoanInput[]
    upsert?: LoanPaymentUpsertWithWhereUniqueWithoutLoanInput | LoanPaymentUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanPaymentCreateManyLoanInputEnvelope
    set?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    disconnect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    delete?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    connect?: LoanPaymentWhereUniqueInput | LoanPaymentWhereUniqueInput[]
    update?: LoanPaymentUpdateWithWhereUniqueWithoutLoanInput | LoanPaymentUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanPaymentUpdateManyWithWhereWithoutLoanInput | LoanPaymentUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanPaymentScalarWhereInput | LoanPaymentScalarWhereInput[]
  }

  export type LoanExtraPaymentUncheckedUpdateManyWithoutLoanNestedInput = {
    create?: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput> | LoanExtraPaymentCreateWithoutLoanInput[] | LoanExtraPaymentUncheckedCreateWithoutLoanInput[]
    connectOrCreate?: LoanExtraPaymentCreateOrConnectWithoutLoanInput | LoanExtraPaymentCreateOrConnectWithoutLoanInput[]
    upsert?: LoanExtraPaymentUpsertWithWhereUniqueWithoutLoanInput | LoanExtraPaymentUpsertWithWhereUniqueWithoutLoanInput[]
    createMany?: LoanExtraPaymentCreateManyLoanInputEnvelope
    set?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    disconnect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    delete?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    connect?: LoanExtraPaymentWhereUniqueInput | LoanExtraPaymentWhereUniqueInput[]
    update?: LoanExtraPaymentUpdateWithWhereUniqueWithoutLoanInput | LoanExtraPaymentUpdateWithWhereUniqueWithoutLoanInput[]
    updateMany?: LoanExtraPaymentUpdateManyWithWhereWithoutLoanInput | LoanExtraPaymentUpdateManyWithWhereWithoutLoanInput[]
    deleteMany?: LoanExtraPaymentScalarWhereInput | LoanExtraPaymentScalarWhereInput[]
  }

  export type LoanCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<LoanCreateWithoutPaymentsInput, LoanUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: LoanCreateOrConnectWithoutPaymentsInput
    connect?: LoanWhereUniqueInput
  }

  export type LoanUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<LoanCreateWithoutPaymentsInput, LoanUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: LoanCreateOrConnectWithoutPaymentsInput
    upsert?: LoanUpsertWithoutPaymentsInput
    connect?: LoanWhereUniqueInput
    update?: XOR<XOR<LoanUpdateToOneWithWhereWithoutPaymentsInput, LoanUpdateWithoutPaymentsInput>, LoanUncheckedUpdateWithoutPaymentsInput>
  }

  export type LoanCreateNestedOneWithoutExtraPaymentsInput = {
    create?: XOR<LoanCreateWithoutExtraPaymentsInput, LoanUncheckedCreateWithoutExtraPaymentsInput>
    connectOrCreate?: LoanCreateOrConnectWithoutExtraPaymentsInput
    connect?: LoanWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LoanUpdateOneRequiredWithoutExtraPaymentsNestedInput = {
    create?: XOR<LoanCreateWithoutExtraPaymentsInput, LoanUncheckedCreateWithoutExtraPaymentsInput>
    connectOrCreate?: LoanCreateOrConnectWithoutExtraPaymentsInput
    upsert?: LoanUpsertWithoutExtraPaymentsInput
    connect?: LoanWhereUniqueInput
    update?: XOR<XOR<LoanUpdateToOneWithWhereWithoutExtraPaymentsInput, LoanUpdateWithoutExtraPaymentsInput>, LoanUncheckedUpdateWithoutExtraPaymentsInput>
  }

  export type LoanCreateNestedOneWithoutFeesInput = {
    create?: XOR<LoanCreateWithoutFeesInput, LoanUncheckedCreateWithoutFeesInput>
    connectOrCreate?: LoanCreateOrConnectWithoutFeesInput
    connect?: LoanWhereUniqueInput
  }

  export type LoanUpdateOneRequiredWithoutFeesNestedInput = {
    create?: XOR<LoanCreateWithoutFeesInput, LoanUncheckedCreateWithoutFeesInput>
    connectOrCreate?: LoanCreateOrConnectWithoutFeesInput
    upsert?: LoanUpsertWithoutFeesInput
    connect?: LoanWhereUniqueInput
    update?: XOR<XOR<LoanUpdateToOneWithWhereWithoutFeesInput, LoanUpdateWithoutFeesInput>, LoanUncheckedUpdateWithoutFeesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BudgetCreateWithoutUserInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: CategoryCreateNestedManyWithoutBudgetInput
    snapshots?: MonthlySnapshotCreateNestedManyWithoutBudgetInput
  }

  export type BudgetUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: CategoryUncheckedCreateNestedManyWithoutBudgetInput
    snapshots?: MonthlySnapshotUncheckedCreateNestedManyWithoutBudgetInput
  }

  export type BudgetCreateOrConnectWithoutUserInput = {
    where: BudgetWhereUniqueInput
    create: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
  }

  export type BudgetCreateManyUserInputEnvelope = {
    data: BudgetCreateManyUserInput | BudgetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SimulationCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SimulationUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SimulationCreateOrConnectWithoutUserInput = {
    where: SimulationWhereUniqueInput
    create: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput>
  }

  export type SimulationCreateManyUserInputEnvelope = {
    data: SimulationCreateManyUserInput | SimulationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LoanCreateWithoutUserInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fees?: LoanFeeCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentCreateNestedManyWithoutLoanInput
  }

  export type LoanUncheckedCreateWithoutUserInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fees?: LoanFeeUncheckedCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentUncheckedCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentUncheckedCreateNestedManyWithoutLoanInput
  }

  export type LoanCreateOrConnectWithoutUserInput = {
    where: LoanWhereUniqueInput
    create: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput>
  }

  export type LoanCreateManyUserInputEnvelope = {
    data: LoanCreateManyUserInput | LoanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BudgetUpsertWithWhereUniqueWithoutUserInput = {
    where: BudgetWhereUniqueInput
    update: XOR<BudgetUpdateWithoutUserInput, BudgetUncheckedUpdateWithoutUserInput>
    create: XOR<BudgetCreateWithoutUserInput, BudgetUncheckedCreateWithoutUserInput>
  }

  export type BudgetUpdateWithWhereUniqueWithoutUserInput = {
    where: BudgetWhereUniqueInput
    data: XOR<BudgetUpdateWithoutUserInput, BudgetUncheckedUpdateWithoutUserInput>
  }

  export type BudgetUpdateManyWithWhereWithoutUserInput = {
    where: BudgetScalarWhereInput
    data: XOR<BudgetUpdateManyMutationInput, BudgetUncheckedUpdateManyWithoutUserInput>
  }

  export type BudgetScalarWhereInput = {
    AND?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
    OR?: BudgetScalarWhereInput[]
    NOT?: BudgetScalarWhereInput | BudgetScalarWhereInput[]
    id?: StringFilter<"Budget"> | string
    userId?: StringFilter<"Budget"> | string
    name?: StringFilter<"Budget"> | string
    income?: DecimalFilter<"Budget"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Budget"> | string
    rule?: JsonFilter<"Budget">
    createdAt?: DateTimeFilter<"Budget"> | Date | string
    updatedAt?: DateTimeFilter<"Budget"> | Date | string
  }

  export type SimulationUpsertWithWhereUniqueWithoutUserInput = {
    where: SimulationWhereUniqueInput
    update: XOR<SimulationUpdateWithoutUserInput, SimulationUncheckedUpdateWithoutUserInput>
    create: XOR<SimulationCreateWithoutUserInput, SimulationUncheckedCreateWithoutUserInput>
  }

  export type SimulationUpdateWithWhereUniqueWithoutUserInput = {
    where: SimulationWhereUniqueInput
    data: XOR<SimulationUpdateWithoutUserInput, SimulationUncheckedUpdateWithoutUserInput>
  }

  export type SimulationUpdateManyWithWhereWithoutUserInput = {
    where: SimulationScalarWhereInput
    data: XOR<SimulationUpdateManyMutationInput, SimulationUncheckedUpdateManyWithoutUserInput>
  }

  export type SimulationScalarWhereInput = {
    AND?: SimulationScalarWhereInput | SimulationScalarWhereInput[]
    OR?: SimulationScalarWhereInput[]
    NOT?: SimulationScalarWhereInput | SimulationScalarWhereInput[]
    id?: StringFilter<"Simulation"> | string
    userId?: StringFilter<"Simulation"> | string
    type?: StringFilter<"Simulation"> | string
    title?: StringFilter<"Simulation"> | string
    inputs?: JsonFilter<"Simulation">
    result?: JsonFilter<"Simulation">
    aiAnalysis?: StringNullableFilter<"Simulation"> | string | null
    aiAnalysisGeneratedAt?: DateTimeNullableFilter<"Simulation"> | Date | string | null
    createdAt?: DateTimeFilter<"Simulation"> | Date | string
  }

  export type LoanUpsertWithWhereUniqueWithoutUserInput = {
    where: LoanWhereUniqueInput
    update: XOR<LoanUpdateWithoutUserInput, LoanUncheckedUpdateWithoutUserInput>
    create: XOR<LoanCreateWithoutUserInput, LoanUncheckedCreateWithoutUserInput>
  }

  export type LoanUpdateWithWhereUniqueWithoutUserInput = {
    where: LoanWhereUniqueInput
    data: XOR<LoanUpdateWithoutUserInput, LoanUncheckedUpdateWithoutUserInput>
  }

  export type LoanUpdateManyWithWhereWithoutUserInput = {
    where: LoanScalarWhereInput
    data: XOR<LoanUpdateManyMutationInput, LoanUncheckedUpdateManyWithoutUserInput>
  }

  export type LoanScalarWhereInput = {
    AND?: LoanScalarWhereInput | LoanScalarWhereInput[]
    OR?: LoanScalarWhereInput[]
    NOT?: LoanScalarWhereInput | LoanScalarWhereInput[]
    id?: StringFilter<"Loan"> | string
    userId?: StringFilter<"Loan"> | string
    simulationId?: StringNullableFilter<"Loan"> | string | null
    title?: StringFilter<"Loan"> | string
    type?: StringFilter<"Loan"> | string
    principal?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    termMonths?: IntFilter<"Loan"> | number
    formula?: StringFilter<"Loan"> | string
    monthlyPayment?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFilter<"Loan"> | Date | string
    status?: StringFilter<"Loan"> | string
    paidInstallments?: IntFilter<"Loan"> | number
    totalInterest?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"Loan"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Loan"> | string
    createdAt?: DateTimeFilter<"Loan"> | Date | string
    updatedAt?: DateTimeFilter<"Loan"> | Date | string
  }

  export type UserCreateWithoutBudgetsInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    simulations?: SimulationCreateNestedManyWithoutUserInput
    loans?: LoanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBudgetsInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    simulations?: SimulationUncheckedCreateNestedManyWithoutUserInput
    loans?: LoanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBudgetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>
  }

  export type CategoryCreateWithoutBudgetInput = {
    id?: string
    name: string
    type: string
    color: string
    transactions?: TransactionCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutBudgetInput = {
    id?: string
    name: string
    type: string
    color: string
    transactions?: TransactionUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutBudgetInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput>
  }

  export type CategoryCreateManyBudgetInputEnvelope = {
    data: CategoryCreateManyBudgetInput | CategoryCreateManyBudgetInput[]
    skipDuplicates?: boolean
  }

  export type MonthlySnapshotCreateWithoutBudgetInput = {
    id?: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MonthlySnapshotUncheckedCreateWithoutBudgetInput = {
    id?: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MonthlySnapshotCreateOrConnectWithoutBudgetInput = {
    where: MonthlySnapshotWhereUniqueInput
    create: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput>
  }

  export type MonthlySnapshotCreateManyBudgetInputEnvelope = {
    data: MonthlySnapshotCreateManyBudgetInput | MonthlySnapshotCreateManyBudgetInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBudgetsInput = {
    update: XOR<UserUpdateWithoutBudgetsInput, UserUncheckedUpdateWithoutBudgetsInput>
    create: XOR<UserCreateWithoutBudgetsInput, UserUncheckedCreateWithoutBudgetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBudgetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBudgetsInput, UserUncheckedUpdateWithoutBudgetsInput>
  }

  export type UserUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    simulations?: SimulationUpdateManyWithoutUserNestedInput
    loans?: LoanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBudgetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    simulations?: SimulationUncheckedUpdateManyWithoutUserNestedInput
    loans?: LoanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CategoryUpsertWithWhereUniqueWithoutBudgetInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutBudgetInput, CategoryUncheckedUpdateWithoutBudgetInput>
    create: XOR<CategoryCreateWithoutBudgetInput, CategoryUncheckedCreateWithoutBudgetInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutBudgetInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutBudgetInput, CategoryUncheckedUpdateWithoutBudgetInput>
  }

  export type CategoryUpdateManyWithWhereWithoutBudgetInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutBudgetInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: StringFilter<"Category"> | string
    budgetId?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    type?: StringFilter<"Category"> | string
    color?: StringFilter<"Category"> | string
  }

  export type MonthlySnapshotUpsertWithWhereUniqueWithoutBudgetInput = {
    where: MonthlySnapshotWhereUniqueInput
    update: XOR<MonthlySnapshotUpdateWithoutBudgetInput, MonthlySnapshotUncheckedUpdateWithoutBudgetInput>
    create: XOR<MonthlySnapshotCreateWithoutBudgetInput, MonthlySnapshotUncheckedCreateWithoutBudgetInput>
  }

  export type MonthlySnapshotUpdateWithWhereUniqueWithoutBudgetInput = {
    where: MonthlySnapshotWhereUniqueInput
    data: XOR<MonthlySnapshotUpdateWithoutBudgetInput, MonthlySnapshotUncheckedUpdateWithoutBudgetInput>
  }

  export type MonthlySnapshotUpdateManyWithWhereWithoutBudgetInput = {
    where: MonthlySnapshotScalarWhereInput
    data: XOR<MonthlySnapshotUpdateManyMutationInput, MonthlySnapshotUncheckedUpdateManyWithoutBudgetInput>
  }

  export type MonthlySnapshotScalarWhereInput = {
    AND?: MonthlySnapshotScalarWhereInput | MonthlySnapshotScalarWhereInput[]
    OR?: MonthlySnapshotScalarWhereInput[]
    NOT?: MonthlySnapshotScalarWhereInput | MonthlySnapshotScalarWhereInput[]
    id?: StringFilter<"MonthlySnapshot"> | string
    budgetId?: StringFilter<"MonthlySnapshot"> | string
    month?: IntFilter<"MonthlySnapshot"> | number
    year?: IntFilter<"MonthlySnapshot"> | number
    income?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFilter<"MonthlySnapshot"> | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonFilter<"MonthlySnapshot">
    createdAt?: DateTimeFilter<"MonthlySnapshot"> | Date | string
  }

  export type BudgetCreateWithoutCategoriesInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBudgetsInput
    snapshots?: MonthlySnapshotCreateNestedManyWithoutBudgetInput
  }

  export type BudgetUncheckedCreateWithoutCategoriesInput = {
    id?: string
    userId: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshots?: MonthlySnapshotUncheckedCreateNestedManyWithoutBudgetInput
  }

  export type BudgetCreateOrConnectWithoutCategoriesInput = {
    where: BudgetWhereUniqueInput
    create: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>
  }

  export type TransactionCreateWithoutCategoryInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutCategoryInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutCategoryInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
  }

  export type TransactionCreateManyCategoryInputEnvelope = {
    data: TransactionCreateManyCategoryInput | TransactionCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type BudgetUpsertWithoutCategoriesInput = {
    update: XOR<BudgetUpdateWithoutCategoriesInput, BudgetUncheckedUpdateWithoutCategoriesInput>
    create: XOR<BudgetCreateWithoutCategoriesInput, BudgetUncheckedCreateWithoutCategoriesInput>
    where?: BudgetWhereInput
  }

  export type BudgetUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: BudgetWhereInput
    data: XOR<BudgetUpdateWithoutCategoriesInput, BudgetUncheckedUpdateWithoutCategoriesInput>
  }

  export type BudgetUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBudgetsNestedInput
    snapshots?: MonthlySnapshotUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshots?: MonthlySnapshotUncheckedUpdateManyWithoutBudgetNestedInput
  }

  export type TransactionUpsertWithWhereUniqueWithoutCategoryInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCategoryInput, TransactionUncheckedUpdateWithoutCategoryInput>
    create: XOR<TransactionCreateWithoutCategoryInput, TransactionUncheckedCreateWithoutCategoryInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCategoryInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCategoryInput, TransactionUncheckedUpdateWithoutCategoryInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCategoryInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCategoryInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    categoryId?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    date?: DateTimeFilter<"Transaction"> | Date | string
    recurrence?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type CategoryCreateWithoutTransactionsInput = {
    id?: string
    name: string
    type: string
    color: string
    budget: BudgetCreateNestedOneWithoutCategoriesInput
  }

  export type CategoryUncheckedCreateWithoutTransactionsInput = {
    id?: string
    budgetId: string
    name: string
    type: string
    color: string
  }

  export type CategoryCreateOrConnectWithoutTransactionsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutTransactionsInput, CategoryUncheckedCreateWithoutTransactionsInput>
  }

  export type CategoryUpsertWithoutTransactionsInput = {
    update: XOR<CategoryUpdateWithoutTransactionsInput, CategoryUncheckedUpdateWithoutTransactionsInput>
    create: XOR<CategoryCreateWithoutTransactionsInput, CategoryUncheckedCreateWithoutTransactionsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutTransactionsInput, CategoryUncheckedUpdateWithoutTransactionsInput>
  }

  export type CategoryUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    budget?: BudgetUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type CategoryUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    budgetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateWithoutSimulationsInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetCreateNestedManyWithoutUserInput
    loans?: LoanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSimulationsInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput
    loans?: LoanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSimulationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSimulationsInput, UserUncheckedCreateWithoutSimulationsInput>
  }

  export type UserUpsertWithoutSimulationsInput = {
    update: XOR<UserUpdateWithoutSimulationsInput, UserUncheckedUpdateWithoutSimulationsInput>
    create: XOR<UserCreateWithoutSimulationsInput, UserUncheckedCreateWithoutSimulationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSimulationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSimulationsInput, UserUncheckedUpdateWithoutSimulationsInput>
  }

  export type UserUpdateWithoutSimulationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUpdateManyWithoutUserNestedInput
    loans?: LoanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSimulationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput
    loans?: LoanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BudgetCreateWithoutSnapshotsInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBudgetsInput
    categories?: CategoryCreateNestedManyWithoutBudgetInput
  }

  export type BudgetUncheckedCreateWithoutSnapshotsInput = {
    id?: string
    userId: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    categories?: CategoryUncheckedCreateNestedManyWithoutBudgetInput
  }

  export type BudgetCreateOrConnectWithoutSnapshotsInput = {
    where: BudgetWhereUniqueInput
    create: XOR<BudgetCreateWithoutSnapshotsInput, BudgetUncheckedCreateWithoutSnapshotsInput>
  }

  export type BudgetUpsertWithoutSnapshotsInput = {
    update: XOR<BudgetUpdateWithoutSnapshotsInput, BudgetUncheckedUpdateWithoutSnapshotsInput>
    create: XOR<BudgetCreateWithoutSnapshotsInput, BudgetUncheckedCreateWithoutSnapshotsInput>
    where?: BudgetWhereInput
  }

  export type BudgetUpdateToOneWithWhereWithoutSnapshotsInput = {
    where?: BudgetWhereInput
    data: XOR<BudgetUpdateWithoutSnapshotsInput, BudgetUncheckedUpdateWithoutSnapshotsInput>
  }

  export type BudgetUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBudgetsNestedInput
    categories?: CategoryUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetUncheckedUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: CategoryUncheckedUpdateManyWithoutBudgetNestedInput
  }

  export type UserCreateWithoutLoansInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetCreateNestedManyWithoutUserInput
    simulations?: SimulationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLoansInput = {
    id?: string
    email: string
    name?: string | null
    password?: string | null
    createdAt?: Date | string
    budgets?: BudgetUncheckedCreateNestedManyWithoutUserInput
    simulations?: SimulationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLoansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLoansInput, UserUncheckedCreateWithoutLoansInput>
  }

  export type LoanFeeCreateWithoutLoanInput = {
    id?: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanFeeUncheckedCreateWithoutLoanInput = {
    id?: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanFeeCreateOrConnectWithoutLoanInput = {
    where: LoanFeeWhereUniqueInput
    create: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput>
  }

  export type LoanFeeCreateManyLoanInputEnvelope = {
    data: LoanFeeCreateManyLoanInput | LoanFeeCreateManyLoanInput[]
    skipDuplicates?: boolean
  }

  export type LoanPaymentCreateWithoutLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
  }

  export type LoanPaymentUncheckedCreateWithoutLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
  }

  export type LoanPaymentCreateOrConnectWithoutLoanInput = {
    where: LoanPaymentWhereUniqueInput
    create: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput>
  }

  export type LoanPaymentCreateManyLoanInputEnvelope = {
    data: LoanPaymentCreateManyLoanInput | LoanPaymentCreateManyLoanInput[]
    skipDuplicates?: boolean
  }

  export type LoanExtraPaymentCreateWithoutLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
  }

  export type LoanExtraPaymentUncheckedCreateWithoutLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
  }

  export type LoanExtraPaymentCreateOrConnectWithoutLoanInput = {
    where: LoanExtraPaymentWhereUniqueInput
    create: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput>
  }

  export type LoanExtraPaymentCreateManyLoanInputEnvelope = {
    data: LoanExtraPaymentCreateManyLoanInput | LoanExtraPaymentCreateManyLoanInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutLoansInput = {
    update: XOR<UserUpdateWithoutLoansInput, UserUncheckedUpdateWithoutLoansInput>
    create: XOR<UserCreateWithoutLoansInput, UserUncheckedCreateWithoutLoansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLoansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLoansInput, UserUncheckedUpdateWithoutLoansInput>
  }

  export type UserUpdateWithoutLoansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUpdateManyWithoutUserNestedInput
    simulations?: SimulationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLoansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    budgets?: BudgetUncheckedUpdateManyWithoutUserNestedInput
    simulations?: SimulationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LoanFeeUpsertWithWhereUniqueWithoutLoanInput = {
    where: LoanFeeWhereUniqueInput
    update: XOR<LoanFeeUpdateWithoutLoanInput, LoanFeeUncheckedUpdateWithoutLoanInput>
    create: XOR<LoanFeeCreateWithoutLoanInput, LoanFeeUncheckedCreateWithoutLoanInput>
  }

  export type LoanFeeUpdateWithWhereUniqueWithoutLoanInput = {
    where: LoanFeeWhereUniqueInput
    data: XOR<LoanFeeUpdateWithoutLoanInput, LoanFeeUncheckedUpdateWithoutLoanInput>
  }

  export type LoanFeeUpdateManyWithWhereWithoutLoanInput = {
    where: LoanFeeScalarWhereInput
    data: XOR<LoanFeeUpdateManyMutationInput, LoanFeeUncheckedUpdateManyWithoutLoanInput>
  }

  export type LoanFeeScalarWhereInput = {
    AND?: LoanFeeScalarWhereInput | LoanFeeScalarWhereInput[]
    OR?: LoanFeeScalarWhereInput[]
    NOT?: LoanFeeScalarWhereInput | LoanFeeScalarWhereInput[]
    id?: StringFilter<"LoanFee"> | string
    loanId?: StringFilter<"LoanFee"> | string
    name?: StringFilter<"LoanFee"> | string
    amount?: DecimalFilter<"LoanFee"> | Decimal | DecimalJsLike | number | string
    type?: StringFilter<"LoanFee"> | string
    createdAt?: DateTimeFilter<"LoanFee"> | Date | string
    updatedAt?: DateTimeFilter<"LoanFee"> | Date | string
  }

  export type LoanPaymentUpsertWithWhereUniqueWithoutLoanInput = {
    where: LoanPaymentWhereUniqueInput
    update: XOR<LoanPaymentUpdateWithoutLoanInput, LoanPaymentUncheckedUpdateWithoutLoanInput>
    create: XOR<LoanPaymentCreateWithoutLoanInput, LoanPaymentUncheckedCreateWithoutLoanInput>
  }

  export type LoanPaymentUpdateWithWhereUniqueWithoutLoanInput = {
    where: LoanPaymentWhereUniqueInput
    data: XOR<LoanPaymentUpdateWithoutLoanInput, LoanPaymentUncheckedUpdateWithoutLoanInput>
  }

  export type LoanPaymentUpdateManyWithWhereWithoutLoanInput = {
    where: LoanPaymentScalarWhereInput
    data: XOR<LoanPaymentUpdateManyMutationInput, LoanPaymentUncheckedUpdateManyWithoutLoanInput>
  }

  export type LoanPaymentScalarWhereInput = {
    AND?: LoanPaymentScalarWhereInput | LoanPaymentScalarWhereInput[]
    OR?: LoanPaymentScalarWhereInput[]
    NOT?: LoanPaymentScalarWhereInput | LoanPaymentScalarWhereInput[]
    id?: StringFilter<"LoanPayment"> | string
    loanId?: StringFilter<"LoanPayment"> | string
    amount?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFilter<"LoanPayment"> | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFilter<"LoanPayment"> | Date | string
    createdAt?: DateTimeFilter<"LoanPayment"> | Date | string
  }

  export type LoanExtraPaymentUpsertWithWhereUniqueWithoutLoanInput = {
    where: LoanExtraPaymentWhereUniqueInput
    update: XOR<LoanExtraPaymentUpdateWithoutLoanInput, LoanExtraPaymentUncheckedUpdateWithoutLoanInput>
    create: XOR<LoanExtraPaymentCreateWithoutLoanInput, LoanExtraPaymentUncheckedCreateWithoutLoanInput>
  }

  export type LoanExtraPaymentUpdateWithWhereUniqueWithoutLoanInput = {
    where: LoanExtraPaymentWhereUniqueInput
    data: XOR<LoanExtraPaymentUpdateWithoutLoanInput, LoanExtraPaymentUncheckedUpdateWithoutLoanInput>
  }

  export type LoanExtraPaymentUpdateManyWithWhereWithoutLoanInput = {
    where: LoanExtraPaymentScalarWhereInput
    data: XOR<LoanExtraPaymentUpdateManyMutationInput, LoanExtraPaymentUncheckedUpdateManyWithoutLoanInput>
  }

  export type LoanExtraPaymentScalarWhereInput = {
    AND?: LoanExtraPaymentScalarWhereInput | LoanExtraPaymentScalarWhereInput[]
    OR?: LoanExtraPaymentScalarWhereInput[]
    NOT?: LoanExtraPaymentScalarWhereInput | LoanExtraPaymentScalarWhereInput[]
    id?: StringFilter<"LoanExtraPayment"> | string
    loanId?: StringFilter<"LoanExtraPayment"> | string
    amount?: DecimalFilter<"LoanExtraPayment"> | Decimal | DecimalJsLike | number | string
    date?: DateTimeFilter<"LoanExtraPayment"> | Date | string
    note?: StringNullableFilter<"LoanExtraPayment"> | string | null
    recalculationMode?: StringNullableFilter<"LoanExtraPayment"> | string | null
    newTermMonths?: IntNullableFilter<"LoanExtraPayment"> | number | null
    createdAt?: DateTimeFilter<"LoanExtraPayment"> | Date | string
  }

  export type LoanCreateWithoutPaymentsInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLoansInput
    fees?: LoanFeeCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentCreateNestedManyWithoutLoanInput
  }

  export type LoanUncheckedCreateWithoutPaymentsInput = {
    id?: string
    userId: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fees?: LoanFeeUncheckedCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentUncheckedCreateNestedManyWithoutLoanInput
  }

  export type LoanCreateOrConnectWithoutPaymentsInput = {
    where: LoanWhereUniqueInput
    create: XOR<LoanCreateWithoutPaymentsInput, LoanUncheckedCreateWithoutPaymentsInput>
  }

  export type LoanUpsertWithoutPaymentsInput = {
    update: XOR<LoanUpdateWithoutPaymentsInput, LoanUncheckedUpdateWithoutPaymentsInput>
    create: XOR<LoanCreateWithoutPaymentsInput, LoanUncheckedCreateWithoutPaymentsInput>
    where?: LoanWhereInput
  }

  export type LoanUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: LoanWhereInput
    data: XOR<LoanUpdateWithoutPaymentsInput, LoanUncheckedUpdateWithoutPaymentsInput>
  }

  export type LoanUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoansNestedInput
    fees?: LoanFeeUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fees?: LoanFeeUncheckedUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUncheckedUpdateManyWithoutLoanNestedInput
  }

  export type LoanCreateWithoutExtraPaymentsInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLoansInput
    fees?: LoanFeeCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentCreateNestedManyWithoutLoanInput
  }

  export type LoanUncheckedCreateWithoutExtraPaymentsInput = {
    id?: string
    userId: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fees?: LoanFeeUncheckedCreateNestedManyWithoutLoanInput
    payments?: LoanPaymentUncheckedCreateNestedManyWithoutLoanInput
  }

  export type LoanCreateOrConnectWithoutExtraPaymentsInput = {
    where: LoanWhereUniqueInput
    create: XOR<LoanCreateWithoutExtraPaymentsInput, LoanUncheckedCreateWithoutExtraPaymentsInput>
  }

  export type LoanUpsertWithoutExtraPaymentsInput = {
    update: XOR<LoanUpdateWithoutExtraPaymentsInput, LoanUncheckedUpdateWithoutExtraPaymentsInput>
    create: XOR<LoanCreateWithoutExtraPaymentsInput, LoanUncheckedCreateWithoutExtraPaymentsInput>
    where?: LoanWhereInput
  }

  export type LoanUpdateToOneWithWhereWithoutExtraPaymentsInput = {
    where?: LoanWhereInput
    data: XOR<LoanUpdateWithoutExtraPaymentsInput, LoanUncheckedUpdateWithoutExtraPaymentsInput>
  }

  export type LoanUpdateWithoutExtraPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoansNestedInput
    fees?: LoanFeeUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateWithoutExtraPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fees?: LoanFeeUncheckedUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUncheckedUpdateManyWithoutLoanNestedInput
  }

  export type LoanCreateWithoutFeesInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLoansInput
    payments?: LoanPaymentCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentCreateNestedManyWithoutLoanInput
  }

  export type LoanUncheckedCreateWithoutFeesInput = {
    id?: string
    userId: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: LoanPaymentUncheckedCreateNestedManyWithoutLoanInput
    extraPayments?: LoanExtraPaymentUncheckedCreateNestedManyWithoutLoanInput
  }

  export type LoanCreateOrConnectWithoutFeesInput = {
    where: LoanWhereUniqueInput
    create: XOR<LoanCreateWithoutFeesInput, LoanUncheckedCreateWithoutFeesInput>
  }

  export type LoanUpsertWithoutFeesInput = {
    update: XOR<LoanUpdateWithoutFeesInput, LoanUncheckedUpdateWithoutFeesInput>
    create: XOR<LoanCreateWithoutFeesInput, LoanUncheckedCreateWithoutFeesInput>
    where?: LoanWhereInput
  }

  export type LoanUpdateToOneWithWhereWithoutFeesInput = {
    where?: LoanWhereInput
    data: XOR<LoanUpdateWithoutFeesInput, LoanUncheckedUpdateWithoutFeesInput>
  }

  export type LoanUpdateWithoutFeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoansNestedInput
    payments?: LoanPaymentUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateWithoutFeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: LoanPaymentUncheckedUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUncheckedUpdateManyWithoutLoanNestedInput
  }

  export type BudgetCreateManyUserInput = {
    id?: string
    name: string
    income: Decimal | DecimalJsLike | number | string
    currency?: string
    rule: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SimulationCreateManyUserInput = {
    id?: string
    type: string
    title: string
    inputs: JsonNullValueInput | InputJsonValue
    result: JsonNullValueInput | InputJsonValue
    aiAnalysis?: string | null
    aiAnalysisGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoanCreateManyUserInput = {
    id?: string
    simulationId?: string | null
    title: string
    type: string
    principal: Decimal | DecimalJsLike | number | string
    downPayment?: Decimal | DecimalJsLike | number | string
    annualRate: Decimal | DecimalJsLike | number | string
    termMonths: number
    formula: string
    monthlyPayment: Decimal | DecimalJsLike | number | string
    startDate?: Date | string
    status?: string
    paidInstallments?: number
    totalInterest: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BudgetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: CategoryUpdateManyWithoutBudgetNestedInput
    snapshots?: MonthlySnapshotUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categories?: CategoryUncheckedUpdateManyWithoutBudgetNestedInput
    snapshots?: MonthlySnapshotUncheckedUpdateManyWithoutBudgetNestedInput
  }

  export type BudgetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    rule?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SimulationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    result?: JsonNullValueInput | InputJsonValue
    aiAnalysis?: NullableStringFieldUpdateOperationsInput | string | null
    aiAnalysisGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fees?: LoanFeeUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fees?: LoanFeeUncheckedUpdateManyWithoutLoanNestedInput
    payments?: LoanPaymentUncheckedUpdateManyWithoutLoanNestedInput
    extraPayments?: LoanExtraPaymentUncheckedUpdateManyWithoutLoanNestedInput
  }

  export type LoanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    simulationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    principal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    downPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    annualRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    termMonths?: IntFieldUpdateOperationsInput | number
    formula?: StringFieldUpdateOperationsInput | string
    monthlyPayment?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paidInstallments?: IntFieldUpdateOperationsInput | number
    totalInterest?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateManyBudgetInput = {
    id?: string
    name: string
    type: string
    color: string
  }

  export type MonthlySnapshotCreateManyBudgetInput = {
    id?: string
    month: number
    year: number
    income: Decimal | DecimalJsLike | number | string
    totalExpenses: Decimal | DecimalJsLike | number | string
    totalSavings: Decimal | DecimalJsLike | number | string
    categoryBreakdown: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CategoryUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateManyWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
  }

  export type MonthlySnapshotUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlySnapshotUncheckedUpdateWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonthlySnapshotUncheckedUpdateManyWithoutBudgetInput = {
    id?: StringFieldUpdateOperationsInput | string
    month?: IntFieldUpdateOperationsInput | number
    year?: IntFieldUpdateOperationsInput | number
    income?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalExpenses?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalSavings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    categoryBreakdown?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyCategoryInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    date?: Date | string
    recurrence?: string
    createdAt?: Date | string
  }

  export type TransactionUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recurrence?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeCreateManyLoanInput = {
    id?: string
    name: string
    amount: Decimal | DecimalJsLike | number | string
    type: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanPaymentCreateManyLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    principalPaid: Decimal | DecimalJsLike | number | string
    interestPaid: Decimal | DecimalJsLike | number | string
    paidDate: Date | string
    createdAt?: Date | string
  }

  export type LoanExtraPaymentCreateManyLoanInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    date: Date | string
    note?: string | null
    recalculationMode?: string | null
    newTermMonths?: number | null
    createdAt?: Date | string
  }

  export type LoanFeeUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeUncheckedUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFeeUncheckedUpdateManyWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentUncheckedUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanPaymentUncheckedUpdateManyWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    principalPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    interestPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentUncheckedUpdateWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanExtraPaymentUncheckedUpdateManyWithoutLoanInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    recalculationMode?: NullableStringFieldUpdateOperationsInput | string | null
    newTermMonths?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}