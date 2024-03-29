require 'time_utilities'

# == Schema Information
#
# Table name: tasks
#
#  id            :bigint           not null, primary key
#  name          :string           not null
#  description   :string
#  task_group_id :bigint           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  order         :integer          default(1)
#
class Task < ApplicationRecord
  belongs_to :task_group
  delegate :user, to: :task_group
  has_many :time_registers

  before_create :update_orders_in_same_task_group
  after_update :updates_changing_task_group

  def json_version
    json = as_json(only: [:id, :name, :description])
    json['start_time'] = start_time
    json['order'] = order
    json['duration_today'] = duration_today_as_string
    json['active_timer_id'] = active_timer&.id
    json['task_group_id'] = task_group_id
    json
  end

  def start_time
    active_timer&.start_time
  end

  def stop
    active_timer&.update!(finish_time: Time.current)
  end

  def active_timer
    time_registers.unfinished.last
  end

  def duration_today_as_string
    duration = duration_today_in_seconds
    duration.zero? ? nil : TimeUtilities.duration_as_string(duration)
  end

  def duration_today_in_seconds
    duration_in_day(Time.current)
  end

  def duration_in_day(timestamp)
    registers = time_registers.finished.where("Date(finish_time) = ?", timestamp.to_date)
    registers.sum(&:duration_in_seconds)
  end

  def increment_order
    update!(order: (order + 1))
  end

  private

    def update_orders_in_same_task_group
      task_group.add_one_to_task_orders
    end

    def updates_changing_task_group
      previous_changes.each do |attribute, values|
        if attribute == "task_group_id"
          new_task_group_id = values[1]
          new_task_group = TaskGroup.find(new_task_group_id)
          new_task_group.add_one_to_task_orders(except: self)
          update!(order: 1)
        end
      end
    end
end
