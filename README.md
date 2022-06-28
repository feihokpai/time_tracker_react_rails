# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

Install the packages below:

- sudo apt install libpq-dev 
libpq-dev is necessary to install the gem 'pg' from PostgreSQL.
Obs: If an error occurs on trying to install libpq-dev, it's possible it is related to version conflicts with the package libpq5. If that happens, that can be solved changing the version from libpq5 to the version shown in the error. Ex: I solved executing the command "sudo apt install libpq5=12.11-0ubuntu0.20.04.1".

* Configuration

* Database creation

- rails db:create db:migrate db:seed

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
