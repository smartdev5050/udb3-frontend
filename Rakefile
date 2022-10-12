require 'rubygems'
require 'rake/clean'

ROOT_DIR = File.expand_path("..", __FILE__)

CLEAN.include("")
CLOBBER.include("")

FileList["#{ROOT_DIR}/lib/tasks/**/*.rake"].each { |fn| load fn }

desc "Default task prints the available targets."
task :default do
    system("rake -T")
end
