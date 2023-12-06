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
require "rails_helper"

RSpec.describe Task, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
