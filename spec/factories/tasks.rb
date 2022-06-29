FactoryBot.define do
  factory :task do
    name { "No name" }
    description { "any description" }
    association :task_group
  end
end
