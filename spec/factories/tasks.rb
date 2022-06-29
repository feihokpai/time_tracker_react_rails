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
FactoryBot.define do
  factory :task do
    association :task_group
    
    name { "No name" }
    description { "any description" }    
  end
end
