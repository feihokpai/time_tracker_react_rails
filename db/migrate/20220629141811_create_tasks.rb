class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.string :description
      t.references :task_group, null: false, foreign_key: true

      t.timestamps default: -> { 'CURRENT_TIMESTAMP' }, null: false
    end
  end
end
