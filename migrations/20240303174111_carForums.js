exports.up = function(knex) {
    return knex.schema.createTable('carForums', (table) => {
        table.increments();
        table.string('displayName', 255).notNullable().primary();
        table.text('carName').notNullable();
        table.text('carModel').notNullable();
        table.text('additionalDetails').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('carForums')
  
};
