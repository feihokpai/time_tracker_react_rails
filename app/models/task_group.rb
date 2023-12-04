# == Schema Information
#
# Table name: task_groups
#
#  id         :bigint           not null, primary key
#  name       :string
#  user_id    :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class TaskGroup < ApplicationRecord
  belongs_to :user
  has_many :tasks

  def json_version
    main_hash = as_json(only: [:id, :name])
    main_hash["tasks"] = ordered_tasks.map(&:json_version)
    main_hash
  end

  def add_one_to_task_orders
    tasks.each(:increment_order)
  end

  def ordered_tasks
    tasks.order(:order)
  end
end
