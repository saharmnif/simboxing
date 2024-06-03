class HotlistFraud {
  constructor(pool) {
    this.pool = pool;
  }

  async insererCellIdDeTRegionDansTHotlist() {
    try {
        const query = `
            INSERT INTO t_hotlist (cell_id, region)
            SELECT DISTINCT cgi, region
            FROM t_region
            WHERE cgi IS NOT NULL
            RETURNING *;
        `;
        const { rows } = await this.pool.query(query);

        if (rows.length === 0) {
            throw new Error('Aucune donnée insérée dans t_hotlist.');
        }

        return 'Données insérées avec succès dans t_hotlist.';
    } catch (error) {
        throw new Error(`Erreur lors de l'insertion des données dans t_hotlist : ${error.message}`);
    }
}
}
module.exports = HotlistFraud;
