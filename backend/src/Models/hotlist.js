const { Pool } = require('pg');

class Hotlist {
  constructor(pool) {
    this.pool = pool;
  }

  async insertCellIdFromDetail() {
    const query = `
        INSERT INTO hotlist (cell_id)
        SELECT DISTINCT cell_id
        FROM t_msc_cdr
        WHERE cell_id IS NOT NULL
        RETURNING *;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = Hotlist;
