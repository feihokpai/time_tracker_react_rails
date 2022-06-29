FactoryBot.define do
  factory :task do
    association :task_group
    
    name { "No name" }
    description { "any description" }    
  end
end
