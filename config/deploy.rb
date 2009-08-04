default_run_options[:pty] = true
ssh_options[:forward_agent] = true

set :application, "H2O"
set :domain, "marco.calit2.uci.edu"
set :deploy_to, "/var/www/#{application}"
set :use_sudo, false

set :user, "marco"

set :scm, :git
set :repository,  "git@github.com:hparra/H2O.git"
set :branch, "master"
set :deploy_via, :remote_cache

set :git_enable_submodules, 1

role :app, domain
role :web, domain
role :db, domain

namespace :deploy do
  
  desc "Restart Application does nothing"
  task :restart, :roles => :app do
    # does nothing
  end
  
end