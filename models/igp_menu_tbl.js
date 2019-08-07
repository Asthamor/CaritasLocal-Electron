/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('igp_menu_tbl', {
        idMenu: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        NombreMenu: {
            type: DataTypes.CHAR(60),
            allowNull: true
        },
        DescripcionMenu: {
            type: DataTypes.STRING(120),
            allowNull: true
        },
        Icono: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        Imagen: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        Estatus: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fkMenu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Url: {
            type: DataTypes.STRING(120),
            allowNull: true
        },
        fkTipoMenu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Orden: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'igp_menu_tbl'
    });
};