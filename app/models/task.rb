class Task < ApplicationRecord
  belongs_to :task_group
  delegate :user, to: :task_group
end
