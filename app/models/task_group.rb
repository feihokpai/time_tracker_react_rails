# == Schema Information
#
# Table name: task_groups
#
#  id         :bigint           not null, primary key
#  name       :string
#  user_id    :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  order      :integer          default(1)
#
class TaskGroup < ApplicationRecord
  belongs_to :user
  has_many :tasks

  def json_version
    adjust_tasks_order_if_has_duplicates
    main_hash = as_json(only: [:id, :name])
    main_hash["tasks"] = ordered_tasks.map(&:json_version)
    main_hash
  end

  def adjust_tasks_order_if_has_duplicates
    adjust_tasks_order if tasks.size != tasks.map(&:order).uniq.size
  end

  def adjust_tasks_order
    ordered_tasks.each_with_index do |task, index|
      task.update!(order: (index + 1))
    end
  end

  def add_one_to_task_orders(except: nil)
    target_tasks = tasks
    target_tasks = target_tasks.reject { |task| task.id == except.id } if except.present?
    tasks.each(&:increment_order)
  end

  def move_up_order(task)
    current_position = ordered_tasks.index(task)
    return if current_position.nil?
    return if current_position == 0

    previous_task = ordered_tasks[current_position - 1]
    previous_task_order = previous_task.order
    previous_task.update!(order: task.order)
    task.update!(order: previous_task_order)
  end

  def move_down_order(task)
    current_position = ordered_tasks.index(task)
    return if current_position.nil?
    last_index = tasks.size - 1
    return if current_position == last_index

    next_task = ordered_tasks[current_position + 1]
    next_task_order = next_task.order
    next_task.update!(order: task.order)
    task.update!(order: next_task_order)
  end

  def ordered_tasks
    tasks.order(:order)
  end
end
