declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => Database
  }

  export interface Database {
    exec(sql: string): { columns: string[]; values: any[][] }[]
    close(): void
  }

  interface InitSqlJsOptions {
    locateFile?: (file: string) => string
  }

  export default function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>
}
