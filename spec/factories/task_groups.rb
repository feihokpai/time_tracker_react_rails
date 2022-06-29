FactoryBot.define do
  factory :task_group do
    name { "MyString" }
    association :user
  end
end
