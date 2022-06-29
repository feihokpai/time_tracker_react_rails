FactoryBot.define do
  factory :user do
    email { "doido@gmailll.com" }
    name { "Pedro Santos" }
    password { "123456" }
    admin { false }

    factory :user_admin do
      admin { true }
    end
  end
end
