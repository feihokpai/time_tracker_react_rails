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
    json
  end

  def start_time
    time_registers.where(finish_time: nil).last&.start_time
  end
end
