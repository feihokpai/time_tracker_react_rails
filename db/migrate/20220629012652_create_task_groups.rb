class CreateTaskGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :task_groups do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true

      t.timestamps default: -> { 'CURRENT_TIMESTAMP' }, null: false
    end
  end
end
