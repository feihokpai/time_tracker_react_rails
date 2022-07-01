# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
user = User.create!(email: 'fabiano@gmail.com', name: 'Fabiano Amorim', password: '123456', admin: true)
puts "User created."

TaskGroup.create!(name: "default", user: user)
puts "Default task group created."
