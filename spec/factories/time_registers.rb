FactoryBot.define do
  factory :time_register do
    association :task
    
    start_time { "2022-06-29 12:00:42" }
    finish_time { "2022-06-29 13:00:42" }
  end
end
