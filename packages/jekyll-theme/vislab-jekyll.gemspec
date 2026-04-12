Gem::Specification.new do |spec|
  spec.name          = "vislab-jekyll"
  spec.version       = "0.1.0"
  spec.authors       = ["VisLab Team"]
  spec.summary       = "A Jekyll theme for embedding high-performance VisLab CS visualizations."
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.3"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.8"
end
