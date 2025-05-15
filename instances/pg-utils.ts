import { RequestError } from "zoltra";
import { Pg } from "../types/utils";
import { getColumnPlaceholder } from "../utils/pg-utils";
import { throwIfInvalid } from "../utils/global";

class PostgresClient {
  private query: Pg.QueryFn;

  constructor(query: Pg.QueryFn) {
    this.query = query;
  }

  public async insertOne<D = unknown>({
    columns,
    table,
    returning,
    values,
  }: Pg.InsertOne) {
    try {
      const selectors = columns.join(", ");
      const valuesPlaceholder = getColumnPlaceholder(columns);
      let queryString = `INSERT INTO ${table}(${selectors}) VALUES(${valuesPlaceholder})`;

      if (returning && returning.length >= 1) {
        queryString += ` RETURNING ${returning.join(", ")}`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndDelete<D = unknown>({
    shouldReturnData,
    values,
    table,
    objectId = "id",
    $and,
  }: Pg.FindByIdAndDelete) {
    try {
      let queryString = `SELECT ${objectId} FROM ${table} WHERE ${objectId} = $1`;

      const result = await this.query(queryString, [values[0]]);

      if (result?.rowCount === 0) {
        const error = new RequestError("No data found", "404_ERR", 404);
        throw error;
      }

      queryString = `DELETE FROM ${table} WHERE ${objectId} = $1`;

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if (shouldReturnData) {
        queryString += ` RETURNING *`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndUpdate<D = unknown>({
    fieldToUpdate,
    values,
    table,
    objectId = "id",
    $and,
    returning_fields,
    columns = ["*"],
  }: Pg.FindByIdAndUpdate) {
    try {
      const hasLists = columns.length > 1;
      const selector = hasLists ? columns.join(", ") : columns[0];

      let queryString = `SELECT ${selector} FROM ${table} WHERE ${objectId} = $1`;

      const result = await this.query(queryString, [values[0]]);

      if (result?.rowCount === 0) {
        const error = new RequestError("No data found", "404_ERR", 404);
        throw error;
      }

      queryString = `UPDATE ${table} SET ${fieldToUpdate} = $2 WHERE ${objectId} = $1`;

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if (returning_fields && returning_fields.length > 0) {
        const fieldsToReturn = returning_fields.join(", ");
        queryString += ` RETURNING ${fieldsToReturn}`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async findOne<D = unknown>({
    table,
    columns = ["*"],
    $where,
    $and,
    $or,
    values,
  }: Pg.FindOne) {
    const hasLists = columns.length > 1;
    const selector = hasLists ? columns.join(", ") : columns[0];

    try {
      let queryString = `SELECT ${selector} FROM ${table} WHERE ${$where}`;

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if ($or) {
        queryString += ` OR ${$or}`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async findById<D = unknown>({
    table,
    columns = ["*"],
    objectId = "id",
    id_value,
  }: Pg.FindById) {
    const hasLists = columns.length > 1;
    const selector = hasLists ? columns.join(", ") : columns[0];

    try {
      let queryString = `SELECT ${selector} FROM ${table} WHERE ${objectId} = $1`;
      const data = await this.query(queryString, [id_value]);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async findMany<D = unknown>({
    table,
    columns = ["*"],
    values: queryValues = [],
    $and,
    $where,
    $limit,
  }: Pg.FindMany) {
    const hasLists = columns.length > 1;
    const selector = hasLists ? columns.join(", ") : columns[0];

    let page: number;
    let limit: number;
    let order: string | any;
    let sortBy: string | any;

    const values: any[] = [...queryValues];

    try {
      let queryString = `SELECT ${selector} FROM ${table}`;

      if ($where) {
        queryString += ` WHERE ${$where}`;
      }

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if ($limit) {
        page = Number($limit.page) || 1;
        limit = Number($limit.limit) || 10;

        const offset = (page - 1) * limit;

        throwIfInvalid(
          page < 1 || limit < 1,
          "Page and Limit must be greater than 0.",
          "PAGINATION_ERR",
          500
        );

        sortBy = $limit.sortBy ? $limit.sortBy : "";
        order =
          $limit.order &&
          ["asc", "desc"].includes(String($limit.order).toLowerCase())
            ? $limit.order
            : "desc";

        if (sortBy && order) {
          queryString += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
        }

        if (page && limit) {
          queryString += ` LIMIT $${queryValues?.length + 1} OFFSET $${
            queryValues.length + 2
          }`;
        }

        values.push(limit, offset);
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows as D };
    } catch (error) {
      throw error;
    }
  }

  public async deleteOne<D = unknown>({
    table,
    values,
    $where,
    $and,
    $or,
    shouldReturnData,
  }: Pg.DeleteOne) {
    try {
      let queryString = `DELETE FROM ${table} WHERE ${$where}`;

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if ($or) {
        queryString += ` OR ${$or}`;
      }

      if (shouldReturnData) {
        queryString += ` RETURNING *`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }

  public async deleteById<D = unknown>({
    shouldReturnData,
    values,
    table,
    objectId = "id",
    $and,
  }: Pg.DeleteById) {
    try {
      let queryString = `DELETE FROM ${table} WHERE ${objectId} = $1`;

      if ($and) {
        queryString += ` AND ${$and}`;
      }

      if (shouldReturnData) {
        queryString += ` RETURNING *`;
      }

      const data = await this.query(queryString, values);

      if (data && data.rowCount === 0) {
        return { success: false };
      }

      return { success: true, data: data?.rows[0] as D };
    } catch (error) {
      throw error;
    }
  }
}

export default PostgresClient;
