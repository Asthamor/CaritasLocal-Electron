/* jshint indent: 2 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cap_noticias_tbl', {
        idNoticias: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Titulo: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        Descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Imagen: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        Estatus: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: '1'
        },
        fkUsuario: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'cap_noticias_tbl'
    });
};