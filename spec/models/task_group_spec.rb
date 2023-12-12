# == Schema Information
#
# Table name: task_groups
#
#  id         :bigint           not null, primary key
#  name       :string
#  user_id    :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  order      :integer          default(1)
#
require "rails_helper"

RSpec.describe TaskGroup, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
