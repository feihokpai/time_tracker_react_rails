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
#
class Task < ApplicationRecord
  belongs_to :task_group
  delegate :user, to: :task_group
  has_many :time_registers

  def json_version
    json = as_json(only: [:id, :name, :description])
    json['start_time'] = start_time
    json['duration_today'] = duration_today_as_string
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
end
