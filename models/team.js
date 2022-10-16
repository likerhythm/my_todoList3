const { TINYINT} = require('sequelize');
const Sequelize = require('sequelize');

module.exports = class Team extends Sequelize.Model {
	static init(sequelize) {
		return super.init({
			name: {
				type: Sequelize.STRING(20),
				allowNull: false,
			},
			topic: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			progressRate: {
				type: TINYINT,
				allowNull: true,
				defaultValue: 0,
			},
		}, {
			sequelize,
			timestamps: true,
			underscored: false,
			modelName: 'Team',
			tableName: 'teams',
			charset: 'utf8',
			collate: 'utf8_general_ci',
		});
	}

	static associate(db) {
		db.Team.belongsTo(db.User);
	}
}