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
end
