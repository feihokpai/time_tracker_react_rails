# == Schema Information
#
# Table name: time_registers
#
#  id          :bigint           not null, primary key
#  task_id     :bigint           not null
#  start_time  :datetime         not null
#  finish_time :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class TimeRegister < ApplicationRecord
  belongs_to :task

  scope :finished, -> { where.not(finish_time: nil) }
  scope :unfinished, -> { where(finish_time: nil) }  

  def duration_in_seconds
    finish_time - start_time
  end
end
