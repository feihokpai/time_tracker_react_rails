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
FactoryBot.define do
  factory :time_register do
    association :task
    
    start_time { "2022-06-29 12:00:42" }
    finish_time { "2022-06-29 13:00:42" }

    # trait :with_registers do
    #   transient do
    #     number { 2 }
    #   end

    #   build_list(:time_register, number)
    # end
  end
end
