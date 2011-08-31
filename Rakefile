desc "Run tests and generate documentation"
task :build, [:gh_pages] do |t, args|
  puts "Running tests..."
  puts `jasmine-node test`
  
  puts "Generating documentation..."
  puts `docco ./**/*.coffee`
  
  if args.gh_pages
    puts "Moving documentation files to physical location of gh-pages repository..."
    puts `cp docs/* #{args.gh_pages}`
  end
end

desc "git commit"
task :git_commit, [:gh_pages, :message] => [:build] do |t, args|
  puts "Committing to default location..."
  puts `git commit -am "#{args.message}"`
  
  if args.gh_pages
    puts "Committing gh-pages..."
    puts `cd #{args.gh_pages}; git commit -am "#{args.message}"`
  end
end