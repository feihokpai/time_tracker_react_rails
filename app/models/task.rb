class Task < ApplicationRecord
  belongs_to :task_group
  delegate :user, to: :task_group
  has_many :time_registers
end
