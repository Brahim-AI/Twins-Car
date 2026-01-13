/**
 * Car Rental Pro - Database Operations
 * D1 Database helper functions
 */

export const handleDatabase = {
    /**
     * Execute a query and return all results
     */
    async query(db, sql, params = []) {
        try {
            const stmt = db.prepare(sql);
            const result = params.length > 0
                ? await stmt.bind(...params).all()
                : await stmt.all();
            return result.results || [];
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },

    /**
     * Execute a query and return first result
     */
    async queryOne(db, sql, params = []) {
        try {
            const stmt = db.prepare(sql);
            const result = params.length > 0
                ? await stmt.bind(...params).first()
                : await stmt.first();
            return result;
        } catch (error) {
            console.error('Database queryOne error:', error);
            throw error;
        }
    },

    /**
     * Execute an INSERT/UPDATE/DELETE and return meta info
     */
    async run(db, sql, params = []) {
        try {
            const stmt = db.prepare(sql);
            const result = params.length > 0
                ? await stmt.bind(...params).run()
                : await stmt.run();
            return {
                success: result.success,
                lastRowId: result.meta?.last_row_id,
                changes: result.meta?.changes
            };
        } catch (error) {
            console.error('Database run error:', error);
            throw error;
        }
    },

    /**
     * Execute multiple statements in a batch
     */
    async batch(db, statements) {
        try {
            const prepared = statements.map(({ sql, params }) => {
                const stmt = db.prepare(sql);
                return params ? stmt.bind(...params) : stmt;
            });
            return await db.batch(prepared);
        } catch (error) {
            console.error('Database batch error:', error);
            throw error;
        }
    }
};
