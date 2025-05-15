export interface FieldDef {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

export interface QueryResult<R extends QueryResultRow = any>
  extends QueryResultBase {
  rows: R[];
}

export interface QueryResultRow {
  [column: string]: any;
}

export interface QueryResultBase {
  command: string;
  rowCount: number | null;
  oid: number;
  fields: FieldDef[];
}

export namespace Pg {
  export type QueryFn = (
    action: string,
    values?: unknown[]
  ) => Promise<QueryResult<QueryResultRow> | undefined>;
  export interface FindByIdAndDelete extends DeleteById {}

  export interface FindByIdAndUpdate {
    returning_fields?: string[];
    fieldToUpdate: string;
    table: string;
    objectId?: string;
    values: any[];
    $and?: string;
    columns?: string[];
  }

  export interface FindById {
    table: string;
    columns?: string[];
    objectId?: string;
    id_value: string | number | any;
  }

  export interface FindOne {
    table: string;
    columns?: string[];
    values: any[];
    $where: string;
    $and?: string;
    $or?: string;
  }

  export interface DeleteById {
    table: string;
    objectId?: string;
    values: any[];
    $and?: string;
    shouldReturnData?: boolean;
  }

  export interface DeleteOne {
    table: string;
    values: any[];
    $where: string;
    $and?: string;
    $or?: string;
    shouldReturnData?: boolean;
  }

  export interface FindMany {
    table: string;
    $where?: string;
    $and?: string;
    $or?: string;
    values?: any[];
    columns?: string[];
    $limit?: {
      page: string | string | string[] | undefined;
      limit: string | string | string[] | undefined;
      sortBy?: string | string | string[] | undefined;
      order?: string | string | string[] | undefined;
    };
  }

  export interface InsertOne {
    table: string;
    values: any[];
    columns: string[];
    returning?: string[];
  }
}
