import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * Adds pagination to a query builder.
 *
 * @template T - The type of the query builder.
 * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to add pagination to.
 * @param {number} [limit=10] - The maximum number of records to retrieve.
 * @param {number} [skip=0] - The number of records to skip.
 * @returns {SelectQueryBuilder<T>} - The modified query builder with pagination.
 */
export function addPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    limit: number = 20,
    skip: number = 0,
): SelectQueryBuilder<T> {
    if (limit == -1 || skip == -1) {
        return queryBuilder;
    }
    queryBuilder.take(limit).skip(skip);
    return queryBuilder;
}

/**
 * Adds ordering to a query builder.
 *
 * @template T - The type of the query builder.
 * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to add ordering to.
 * @param {string} [orderBy] - The column to order by.
 * @param {'ASC' | 'DESC'} [order='ASC'] - The order direction.
 * @returns {SelectQueryBuilder<T>} The modified query builder.
 */
export function addOrdering<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    orderBy?: string,
    order: 'ASC' | 'DESC' = 'ASC',
): SelectQueryBuilder<T> {
    if (orderBy) {
        if (orderBy.includes('.')) {
            const [alias, column] = orderBy.split('.');
            queryBuilder.orderBy(`${alias}.${column}`, order);
        } else {
            const alias = queryBuilder.alias;
            queryBuilder.orderBy(`${alias}.${orderBy}`, order);
        }
    }
    return queryBuilder;
}
