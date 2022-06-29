class CreateTimeRegisters < ActiveRecord::Migration[7.0]
  def change
    create_table :time_registers do |t|
      t.references :task, null: false, foreign_key: true
      t.timestamp :start_time,  default: -> { 'CURRENT_TIMESTAMP' }, null: false
      t.timestamp :finish_time

      t.timestamps default: -> { 'CURRENT_TIMESTAMP' }, null: false
    end
  end
end
