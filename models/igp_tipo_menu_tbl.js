/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('igp_tipo_menu_tbl', {
        idTipoMenu: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        TipoMenu: {
            type: DataTypes.CHAR(35),
            allowNull: true
        }
    }, {
        tableName: 'igp_tipo_menu_tbl'
    });
};