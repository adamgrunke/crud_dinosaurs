'use strict';
module.exports = (sequelize, DataTypes) => {
  const dinosaur = sequelize.define('dinosaur', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  dinosaur.associate = function(models) {
    // associations can be defined here
  };
  return dinosaur;
};