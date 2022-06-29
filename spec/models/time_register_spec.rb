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
require 'rails_helper'

RSpec.describe TimeRegister, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
