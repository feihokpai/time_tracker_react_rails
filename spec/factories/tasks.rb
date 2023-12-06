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
FactoryBot.define do
  factory :task do
    association :task_group
    
    name { "No name" }
    description { FFaker::Book.description }    
  end
end
