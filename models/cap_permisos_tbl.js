/* jshint indent: 2 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cap_permisos_tbl', {
        idPermiso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        fk_menu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fk_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'cap_permisos_tbl'
    });
};